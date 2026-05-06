// Mock API responses — used when backend is not running
export const MOCK_MODE = true

export const mockResponse = (data: any) =>
  Promise.resolve({ data: { success: true, data } })

export const mockWallets = [
  { id: '1', coin: 'USDT', balance: '1250.00', lockedBalance: '0', depositAddress: 'TXxxxMockAddressUSDT123456789' },
  { id: '2', coin: 'BTC', balance: '0.05420000', lockedBalance: '0', depositAddress: 'bc1qmockaddressbtc123456' },
  { id: '3', coin: 'ETH', balance: '1.23400000', lockedBalance: '0', depositAddress: '0xMockAddressETH123456789abcdef' },
]

export const mockTrades = [
  { id: 'tr1', orderRef: 'PS-ABCD1234', coin: 'USDT', fiatAmount: '28050', coinAmount: '100', status: 'completed', buyerId: 'mock-user', createdAt: new Date().toISOString(), seller: { fullName: 'Ali Hassan', username: 'alihassan' }, buyer: { fullName: 'Demo User', username: 'demouser' } },
  { id: 'tr2', orderRef: 'PS-EFGH5678', coin: 'USDT', fiatAmount: '14025', coinAmount: '50', status: 'escrow_locked', buyerId: 'mock-user', createdAt: new Date().toISOString(), seller: { fullName: 'Sara Khan', username: 'sarakhan' }, buyer: { fullName: 'Demo User', username: 'demouser' } },
]

export const mockAds = [
  { id: 'ad1', coin: 'USDT', side: 'sell', fixedPrice: '280.50', minOrderFiat: '1000', maxOrderFiat: '50000', availableAmount: '500', paymentMethods: ['jazzcash', 'easypaisa'], status: 'active', user: { fullName: 'Ali Hassan', username: 'alihassan', tradeStats: { completedTrades: 142, avgRating: 4.9, isMerchant: true } } },
  { id: 'ad2', coin: 'USDT', side: 'sell', fixedPrice: '279.00', minOrderFiat: '5000', maxOrderFiat: '200000', availableAmount: '2000', paymentMethods: ['bank_transfer'], status: 'active', user: { fullName: 'Bilal Ahmed', username: 'bilalahmed', tradeStats: { completedTrades: 67, avgRating: 4.7, isMerchant: false } } },
  { id: 'ad3', coin: 'USDT', side: 'sell', fixedPrice: '281.00', minOrderFiat: '500', maxOrderFiat: '25000', availableAmount: '350', paymentMethods: ['jazzcash'], status: 'active', user: { fullName: 'Fatima Malik', username: 'fatimamalik', tradeStats: { completedTrades: 28, avgRating: 4.5, isMerchant: false } } },
  { id: 'ad4', coin: 'BTC', side: 'sell', fixedPrice: '8750000', minOrderFiat: '10000', maxOrderFiat: '500000', availableAmount: '0.1', paymentMethods: ['bank_transfer', 'jazzcash'], status: 'active', user: { fullName: 'Usman Tariq', username: 'usmantariq', tradeStats: { completedTrades: 215, avgRating: 5.0, isMerchant: true } } },
]

export const mockNotifications = [
  { id: 'n1', title: 'Trade Completed', body: 'Your trade PS-ABCD1234 has been completed successfully.', readAt: new Date().toISOString() },
  { id: 'n2', title: 'Welcome to PakSwap!', body: 'Your account is ready. Start trading by browsing the marketplace.', readAt: null },
]

export const mockRate = 280.50
