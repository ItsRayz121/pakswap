import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { NETWORK_FEE_DEFAULTS } from '../lib/blockchain'
import axios from 'axios'

const CMS_DEFAULTS: Record<string, any> = {
  team: [
    { init: 'A', bg: 'linear-gradient(135deg,#2563eb,#7c3aed)', name: 'Ahmed Raza', role: 'Co-Founder & CEO', desc: 'Former fintech product lead. 8 years in Pakistani payments infrastructure. IBA Karachi alum.' },
    { init: 'S', bg: 'linear-gradient(135deg,#059669,#0d9488)', name: 'Sara Malik', role: 'Co-Founder & CTO', desc: 'Blockchain engineer and AWS certified architect. Previously at a Karachi-based neobank. LUMS CS graduate.' },
    { init: 'U', bg: 'linear-gradient(135deg,#d97706,#dc2626)', name: 'Usman Khan', role: 'Head of Compliance', desc: '10 years in AML/KYC for Pakistani banks. ACCA qualified. Former SBP banking sector consultant.' },
    { init: 'F', bg: 'linear-gradient(135deg,#7c3aed,#db2777)', name: 'Fatima Shah', role: 'Head of Operations', desc: 'P2P dispute resolution and merchant relations. Built PakSwap admin workflow from the ground up.' },
    { init: 'Z', bg: 'linear-gradient(135deg,#0ea5e9,#2563eb)', name: 'Zain Ahmed', role: 'Lead Engineer', desc: 'Node.js and PostgreSQL specialist. Built the escrow engine and real-time trade notification system.' },
    { init: 'N', bg: 'linear-gradient(135deg,#10b981,#2563eb)', name: 'Nadia Hussain', role: 'Customer Experience', desc: 'Leads our 9am–9pm support team. 5 years in Pakistani fintech user support. Urdu and English fluent.' },
  ],
  values: [
    { icon: '🔐', title: 'Security First', desc: "Every trade is protected by escrow. Crypto doesn't move until payment is confirmed by a human admin — not an automated script. We use AWS KMS for key signing and never hold private keys on-disk." },
    { icon: '🤝', title: 'Trader Protection', desc: 'Our two-layer payment verification means screenshots are OCR-checked AND human-reviewed before any release. Fraud attempts trigger an immediate freeze and investigation.' },
    { icon: '🇵🇰', title: 'Pakistan-Native', desc: 'JazzCash, Easypaisa, Sadapay, HBL, UBL, MCB, Meezan — all supported. CNIC KYC with Urdu-friendly flows. PKR denomination throughout.' },
    { icon: '⚖️', title: 'Compliance-Ready', desc: 'KYC, AML transaction monitoring, and full audit trails built in from day one.' },
    { icon: '📊', title: 'Transparency', desc: 'Our fee schedule is public. Spreads are shown before you trade. No surprise deductions.' },
    { icon: '🚀', title: 'Merchant Ecosystem', desc: 'We invest in our merchant partners — verified badge, high daily limits, priority dispute SLA, and a dedicated merchant dashboard.' },
  ],
  about_faqs: [],
  fees_faqs: [
    { q: 'When exactly is the P2P taker fee deducted?', a: 'The taker fee is deducted from the crypto amount at the moment the trade is marked complete and crypto is released from escrow. You will see the exact fee amount on the trade receipt before you confirm the trade.' },
    { q: 'Can I see the fee before I submit a trade?', a: 'Yes. The order confirmation screen always displays the fee breakdown: trade amount, fee amount, and the net crypto you receive — before you commit.' },
    { q: 'Is there a fee for depositing crypto into PakSwap?', a: 'No. Crypto deposits are always free on the PakSwap side. You only pay the blockchain network fee charged by miners/validators to send from your external wallet.' },
    { q: 'Are Instant Buy fees negotiable for high-volume buyers?', a: 'Merchant accounts trading above 20M PKR/month may apply for custom spread rates through our merchant support team. Contact us via the merchant dashboard.' },
    { q: 'What happens to fees on a cancelled or disputed trade?', a: "No fee is charged on cancelled trades. If a dispute is resolved in the buyer's favour, any deducted fee is refunded. If resolved in the seller's favour, the fee is not refunded." },
  ],
  home_faqs: [
    { q: 'How does the escrow work?', a: "When you initiate a buy trade, the seller's cryptocurrency is immediately locked in PakSwap's escrow. Crypto cannot move until you confirm payment and admin verifies it." },
    { q: 'Is P2P crypto trading legal in Pakistan?', a: 'P2P trading operates in a regulatory grey area in Pakistan. PakSwap maintains full KYC/AML compliance and is structured to align with the emerging VASP framework.' },
    { q: "What if the seller doesn't release my crypto?", a: 'If you have paid and the seller does not release within the trade window, you can open a dispute. Our dispute agents review your payment proof and release crypto from escrow if your payment is confirmed.' },
    { q: 'How long does KYC verification take?', a: "KYC is typically approved within 15 minutes to 2 hours during business hours (9am–9pm PKT). You'll receive an SMS and email notification once your documents are reviewed." },
    { q: "What are PakSwap's trading fees?", a: 'See the Fees page for the live fee schedule. We publish all fees in real-time and never charge hidden fees.' },
  ],
  provider_benefits: [
    { icon: '⭐', title: 'Verified Merchant Badge', desc: 'A trust signal that drives 3× more trades than unbadged users.' },
    { icon: '💰', title: 'Reduced Taker Fees', desc: 'Merchants pay 0.30% taker — 40% lower than the standard rate.' },
    { icon: '🚀', title: 'Higher Daily Limits', desc: 'Up to 5M PKR/day after approval, with custom caps available.' },
    { icon: '⚡', title: 'Priority Dispute SLA', desc: 'Disputes from merchant ads are reviewed within 1 hour during business hours.' },
    { icon: '🛠️', title: 'Merchant Dashboard', desc: 'Inventory, multi-coin pricing, custom spreads, and analytics in one place.' },
  ],
}

export default async function marketplaceRoutes(app: FastifyInstance) {
  // GET /api/marketplace/ads
  app.get('/ads', async (req) => {
    const query = z.object({
      coin: z.string().optional(),
      side: z.enum(['buy', 'sell']).optional(),
      paymentMethod: z.string().optional(),
      amount: z.coerce.number().optional(),
      page: z.coerce.number().default(1),
      limit: z.coerce.number().max(50).default(20),
    }).parse(req.query)

    const where: any = { status: 'active' }
    if (query.coin) where.coin = query.coin.toUpperCase()
    if (query.side) where.side = query.side
    if (query.paymentMethod) where.paymentMethods = { has: query.paymentMethod }
    if (query.amount) {
      where.minOrderFiat = { lte: query.amount }
      where.maxOrderFiat = { gte: query.amount }
    }

    const skip = (query.page - 1) * query.limit
    const [ads, total] = await Promise.all([
      prisma.p2pAd.findMany({
        where,
        orderBy: [{ fixedPrice: 'asc' }, { createdAt: 'desc' }],
        skip,
        take: query.limit,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              fullName: true,
              tradeStats: true,
            },
          },
        },
      }),
      prisma.p2pAd.count({ where }),
    ])

    return {
      success: true,
      data: ads,
      meta: { total, page: query.page, limit: query.limit, hasMore: skip + ads.length < total },
    }
  })

  // GET /api/marketplace/ads/:id
  app.get('/ads/:id', async (req) => {
    const { id } = req.params as { id: string }
    const ad = await prisma.p2pAd.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            kycLevel: true,
            tradeStats: true,
            createdAt: true,
          },
        },
      },
    })
    return { success: true, data: ad }
  })

  // GET /api/marketplace/stats — public platform stats (for landing/about pages)
  app.get('/stats', async () => {
    const since24h = new Date(Date.now() - 86400000)
    const [
      totalUsers,
      verifiedUsers,
      completedTrades,
      completedTrades24h,
      totalTradesAll,
      volumeAgg,
      avgRatingAgg,
      ratingsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { kycLevel: { in: ['basic', 'full'] } } }),
      prisma.trade.count({ where: { status: 'completed' } }),
      prisma.trade.count({ where: { status: 'completed', completedAt: { gte: since24h } } }),
      prisma.trade.count({ where: { status: { in: ['completed', 'cancelled', 'disputed'] } } }),
      prisma.trade.aggregate({ where: { status: 'completed' }, _sum: { fiatAmount: true } }),
      prisma.tradeRating.aggregate({ _avg: { rating: true } }).catch(() => ({ _avg: { rating: null } })),
      prisma.tradeRating.count().catch(() => 0),
    ])

    const completionRate = totalTradesAll > 0
      ? Number(((completedTrades / totalTradesAll) * 100).toFixed(1))
      : 0
    const totalVolumePkr = Number(volumeAgg._sum.fiatAmount ?? 0)

    return {
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        completedTrades,
        completedTrades24h,
        completionRate,
        totalVolumePkr,
        avgRating: avgRatingAgg._avg.rating ? Number(Number(avgRatingAgg._avg.rating).toFixed(1)) : null,
        ratingsCount,
      },
    }
  })

  // GET /api/marketplace/top-ads — best featured ads for landing page
  app.get('/top-ads', async (req) => {
    const { side, coin, limit } = z.object({
      side: z.enum(['buy', 'sell']).default('sell'),
      coin: z.string().default('USDT'),
      limit: z.coerce.number().max(10).default(3),
    }).parse(req.query)

    const ads = await prisma.p2pAd.findMany({
      where: { status: 'active', side, coin: coin.toUpperCase() },
      orderBy: side === 'sell' ? [{ fixedPrice: 'asc' }] : [{ fixedPrice: 'desc' }],
      take: limit,
      include: {
        user: { select: { id: true, username: true, fullName: true, kycLevel: true, tradeStats: true } },
      },
    })
    return { success: true, data: ads }
  })

  // GET /api/marketplace/config — public platform config (fees, limits)
  app.get('/config', async () => {
    const configs = await prisma.platformConfig.findMany()
    const map = new Map<string, string>(configs.map(c => [c.key, c.value]))
    const num = (k: string, def: number) => {
      const v = map.get(k)
      const n = v != null ? parseFloat(v) : NaN
      return Number.isFinite(n) ? n : def
    }

    const networkFees: Record<string, number> = {}
    for (const key of Object.keys(NETWORK_FEE_DEFAULTS)) {
      networkFees[key] = num(`network_fee_${key}`, NETWORK_FEE_DEFAULTS[key])
    }
    // Honor any extra keys set in db
    for (const c of configs) {
      if (c.key.startsWith('network_fee_')) {
        const k = c.key.replace('network_fee_', '').toUpperCase()
        if (!(k in networkFees)) networkFees[k] = parseFloat(c.value)
      }
    }

    return {
      success: true,
      data: {
        fees: {
          p2pTakerBps: num('p2p_taker_bps', 50),         // 0.50%
          p2pMakerBps: num('p2p_maker_bps', 0),
          merchantTakerBps: num('merchant_taker_bps', 30), // 0.30%
          instantBuySpreadBps: {
            USDT_TRC20: num('spread_USDT_TRC20_bps', 150),
            USDT_ERC20: num('spread_USDT_ERC20_bps', 180),
            BTC: num('spread_BTC_bps', 120),
            ETH: num('spread_ETH_bps', 150),
            USDC: num('spread_USDC_bps', 150),
          },
        },
        networkFees,
        kycLimits: {
          none:     { dailyPkr: num('limit_none_daily', 0),         monthlyPkr: num('limit_none_monthly', 0) },
          basic:    { dailyPkr: num('limit_basic_daily', 50000),    monthlyPkr: num('limit_basic_monthly', 500000) },
          standard: { dailyPkr: num('limit_standard_daily', 200000),monthlyPkr: num('limit_standard_monthly', 2000000) },
          full:     { dailyPkr: num('limit_full_daily', 500000),    monthlyPkr: num('limit_full_monthly', 5000000) },
          merchant: { dailyPkr: num('limit_merchant_daily', 5000000), monthlyPkr: num('limit_merchant_monthly', 0) /* 0 = unlimited */ },
        },
        minWithdrawal: {
          USDT: num('min_withdraw_USDT', 10),
          USDC: num('min_withdraw_USDC', 20),
          BTC:  num('min_withdraw_BTC', 0.001),
          ETH:  num('min_withdraw_ETH', 0.01),
        },
      },
    }
  })

  // GET /api/marketplace/cms/:key — public editable content (team, values, faqs, benefits)
  app.get('/cms/:key', async (req) => {
    const { key } = req.params as { key: string }
    const allowed = ['team', 'values', 'about_faqs', 'fees_faqs', 'home_faqs', 'provider_benefits']
    if (!allowed.includes(key)) {
      return { success: false, error: 'UNKNOWN_KEY' }
    }
    const cfg = await prisma.platformConfig.findUnique({ where: { key: `cms_${key}` } })
    if (cfg) {
      try {
        return { success: true, data: JSON.parse(cfg.value), source: 'db' }
      } catch {
        // fall through to defaults
      }
    }
    return { success: true, data: CMS_DEFAULTS[key] ?? [], source: 'default' }
  })

  // GET /api/marketplace/rate/:coin — fetch live market rate
  app.get('/rate/:coin', async (req) => {
    const { coin } = req.params as { coin: string }
    try {
      const ids: Record<string, string> = {
        USDT: 'tether', BTC: 'bitcoin', ETH: 'ethereum', USDC: 'usd-coin',
      }
      const coinId = ids[coin.toUpperCase()] ?? 'tether'
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=pkr`,
        { timeout: 5000 },
      )
      const rate = data[coinId]?.pkr ?? 0
      return { success: true, data: { coin: coin.toUpperCase(), rate, currency: 'PKR' } }
    } catch {
      return { success: false, error: 'RATE_FETCH_FAILED', message: 'Could not fetch live rate' }
    }
  })
}
