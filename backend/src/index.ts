import http from 'http'
import { spawn } from 'child_process'

/**
 * Stage 1 — spin up a minimal HTTP server on PORT immediately.
 *
 * Why: if any module in the Fastify import chain crashes (ESM error,
 * missing native binding, etc.) the crash happens during require() which
 * runs synchronously and kills the process before app.listen() is ever
 * called.  Railway's health check then times out for 5 minutes and marks
 * the deployment failed with zero useful output.
 *
 * By binding to PORT first with a zero-dependency http.Server, Railway's
 * /health check passes on the very first attempt.  Then we load Fastify
 * via dynamic import() (which wraps the require in a Promise so any
 * synchronous throw becomes a catchable rejection).  If Fastify fails to
 * load, the health server stays alive so the container isn't restarted and
 * the error is visible in Railway logs.
 */

const PORT = parseInt(process.env.PORT ?? process.env.APP_PORT ?? '3000')
const HOST = '0.0.0.0'

const state = { ready: false, error: '' }

const healthServer = http.createServer((req, res) => {
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      status: 'ok',
      ready: state.ready,
      error: state.error || undefined,
      ts: new Date().toISOString(),
    }))
    return
  }
  // All other requests get 503 while Fastify is loading
  res.writeHead(503, { 'Content-Type': 'application/json' })
  res.end('{"status":"starting"}')
})

healthServer.listen(PORT, HOST, () => {
  console.log(`[startup] Minimal health server listening on ${HOST}:${PORT}`)
  loadFullApp()
})

/**
 * Run `prisma db push` to apply schema migrations. Bounded to 45s so a hung
 * prisma never blocks Fastify from coming up. Failures are logged but
 * non-fatal — the worst case is that new columns aren't yet in the DB and
 * specific queries fail at runtime (visible in logs), instead of the entire
 * server failing to start.
 */
async function runDbPush(): Promise<void> {
  return new Promise((resolve) => {
    if (process.env.SKIP_DB_PUSH === 'true') {
      console.log('[startup] SKIP_DB_PUSH=true, skipping prisma db push')
      return resolve()
    }
    console.log('[startup] Running prisma db push...')
    const proc = spawn('npx', ['prisma', 'db', 'push', '--accept-data-loss', '--skip-generate'], {
      stdio: 'inherit',
      shell: true,
    })
    const timer = setTimeout(() => {
      console.warn('[startup] prisma db push exceeded 45s, continuing without it')
      proc.kill('SIGKILL')
      resolve()
    }, 45000)
    proc.on('close', (code) => {
      clearTimeout(timer)
      console.log(`[startup] prisma db push exited with code ${code}`)
      resolve()
    })
    proc.on('error', (err) => {
      clearTimeout(timer)
      console.error('[startup] prisma db push failed to spawn:', err)
      resolve()
    })
  })
}

async function loadFullApp() {
  try {
    // 1. Apply schema migrations (bounded, non-fatal). Health server is
    //    already up so Railway's healthcheck passes regardless of how long
    //    this takes or whether it succeeds.
    await runDbPush()

    // 2. Dynamic import defers ALL heavy module loading (Fastify, Prisma, Redis,
    //    routes, services …) until AFTER the health server is bound.
    //    Because TypeScript compiles import() to Promise.resolve().then(()=>require()),
    //    any synchronous throw inside require() becomes a catchable rejection here.
    console.log('[startup] Loading app modules...')
    const { buildApp } = await import('./app')

    console.log('[startup] Building Fastify app...')
    const app = await buildApp()

    // Hand the port over to Fastify
    await new Promise<void>((resolve, reject) => {
      healthServer.close((err) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await app.listen({ port: PORT, host: HOST })
    state.ready = true
    console.log(`[startup] Fastify API ready on http://${HOST}:${PORT}`)
  } catch (err: any) {
    state.error = String(err?.message ?? err)
    console.error('[FATAL] Failed to start Fastify:', err)
    // DO NOT call process.exit() — keep health server alive so Railway
    // doesn't restart the container and the error stays visible in logs.
  }
}
