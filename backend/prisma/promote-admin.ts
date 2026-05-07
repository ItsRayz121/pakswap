/**
 * One-shot script: promotes fazalelahi5577@gmail.com to super_admin.
 * Run via Railway shell:  npx tsx prisma/promote-admin.ts
 * Safe to run multiple times (idempotent).
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const TARGET_EMAIL = 'fazalelahi5577@gmail.com'

async function main() {
  const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } })

  if (!user) {
    console.error(`❌ User ${TARGET_EMAIL} not found in database.`)
    console.error('   → Register on the platform first, then re-run this script.')
    process.exit(1)
  }

  await prisma.user.update({
    where: { email: TARGET_EMAIL },
    data: { role: 'super_admin', kycLevel: 'full', kycStatus: 'approved' },
  })

  // Verify
  const updated = await prisma.user.findUnique({
    where: { email: TARGET_EMAIL },
    select: { email: true, role: true, kycLevel: true },
  })

  console.log('✅ Done!')
  console.log(`   email : ${updated?.email}`)
  console.log(`   role  : ${updated?.role}`)
  console.log(`   kyc   : ${updated?.kycLevel}`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
