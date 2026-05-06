import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding PakSwap database...')

  // Admin user
  const adminHash = await bcrypt.hash('Admin@123456', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pakswap.com' },
    update: {},
    create: {
      email: 'admin@pakswap.com',
      phone: '+923001234567',
      fullName: 'Platform Admin',
      username: 'admin',
      passwordHash: adminHash,
      role: 'admin',
      kycLevel: 'full',
      kycStatus: 'approved',
      phoneVerified: true,
      emailVerified: true,
      tradingLimits: { create: { dailyBuyLimit: 5000000, dailySellLimit: 5000000 } },
      tradeStats: { create: {} },
    },
  })

  // Test seller (KYC approved, has USDT balance)
  const sellerHash = await bcrypt.hash('Seller@123456', 12)
  const seller = await prisma.user.upsert({
    where: { email: 'seller@test.com' },
    update: {},
    create: {
      email: 'seller@test.com',
      phone: '+923011234567',
      fullName: 'Ahmed Khan',
      username: 'ahmed_seller',
      passwordHash: sellerHash,
      kycLevel: 'full',
      kycStatus: 'approved',
      phoneVerified: true,
      emailVerified: true,
      referralCode: 'SELL001',
      tradingLimits: { create: { dailyBuyLimit: 500000, dailySellLimit: 500000, monthlyLimit: 10000000 } },
      tradeStats: { create: { completedTrades: 47, totalTrades: 50, avgRating: 4.8, totalRatings: 40 } },
    },
  })

  // Give seller USDT wallet with balance
  await prisma.wallet.upsert({
    where: { userId_coin_network: { userId: seller.id, coin: 'USDT', network: 'TRC20' } },
    update: {},
    create: {
      userId: seller.id,
      coin: 'USDT',
      network: 'TRC20',
      balance: 10000,
      depositAddress: 'TTestSellerDepositAddress123456789',
    },
  })

  // Test buyer
  const buyerHash = await bcrypt.hash('Buyer@123456', 12)
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@test.com' },
    update: {},
    create: {
      email: 'buyer@test.com',
      phone: '+923021234567',
      fullName: 'Muhammad Ali',
      username: 'mali_buyer',
      passwordHash: buyerHash,
      kycLevel: 'basic',
      kycStatus: 'approved',
      phoneVerified: true,
      emailVerified: true,
      referralCode: 'BUY001',
      tradingLimits: { create: {} },
      tradeStats: { create: { completedTrades: 5, totalTrades: 5, avgRating: 4.5, totalRatings: 4 } },
    },
  })

  // KYC reviewer
  const reviewerHash = await bcrypt.hash('Reviewer@123456', 12)
  await prisma.user.upsert({
    where: { email: 'kyc@pakswap.com' },
    update: {},
    create: {
      email: 'kyc@pakswap.com',
      phone: '+923031234567',
      fullName: 'KYC Reviewer',
      username: 'kyc_reviewer',
      passwordHash: reviewerHash,
      role: 'kyc_reviewer',
      kycLevel: 'full',
      kycStatus: 'approved',
      phoneVerified: true,
      tradingLimits: { create: {} },
      tradeStats: { create: {} },
    },
  })

  // Sample P2P sell ad
  const existingAd = await prisma.p2pAd.findFirst({ where: { userId: seller.id } })
  if (!existingAd) {
    await prisma.p2pAd.create({
      data: {
        userId: seller.id,
        side: 'sell',
        coin: 'USDT',
        priceType: 'fixed',
        fixedPrice: 280.50,
        totalAmount: 1000,
        availableAmount: 1000,
        minOrderFiat: 5000,
        maxOrderFiat: 200000,
        paymentMethods: ['jazzcash', 'easypaisa', 'bank_transfer'],
        tradeWindow: 30,
        terms: 'Please send exact amount. JazzCash preferred. Account name must match KYC name.',
        requireKycLevel: 'basic',
      },
    })
  }

  // Platform config defaults
  const configs = [
    { key: 'p2p_taker_fee', value: '0.005' },
    { key: 'merchant_fee', value: '0.003' },
    { key: 'withdrawal_fee_usdt_trc20', value: '1' },
    { key: 'trade_payment_window_seconds', value: '900' },
    { key: 'kyc_max_attempts', value: '5' },
    { key: 'maintenance_mode', value: 'false' },
    { key: 'promo_fee_enabled', value: 'true' },
  ]

  for (const config of configs) {
    await prisma.platformConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }

  console.log('✅ Seed complete!')
  console.log('   Admin:    admin@pakswap.com / Admin@123456')
  console.log('   Seller:   seller@test.com / Seller@123456')
  console.log('   Buyer:    buyer@test.com / Buyer@123456')
  console.log('   KYC:      kyc@pakswap.com / Reviewer@123456')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
