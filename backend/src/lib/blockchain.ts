import { ethers } from 'ethers'
import { logger } from './logger'

// HD derivation paths per BIP-44 / SLIP-0044
// EVM chains all share m/44'/60'/0'/0/{index}; we segregate networks by index space
// to avoid sharing addresses across chains' deposit pools.
const COIN_TYPE: Record<string, number> = {
  ETH: 60,
  BNB: 60,
  USDT_ERC20: 60,
  USDT_BEP20: 60,
  USDC_ERC20: 60,
  TRX: 195,
  USDT_TRC20: 195,
  BTC: 0,
}

function hdNode() {
  const mnemonic = process.env.WALLET_MNEMONIC
  if (!mnemonic) {
    throw new Error('WALLET_MNEMONIC env var is required for deposit address derivation')
  }
  return ethers.HDNodeWallet.fromPhrase(mnemonic)
}

/**
 * Derive a deterministic deposit address for a user.
 * Returns a real EVM address for ETH/BNB/ERC20/BEP20.
 * For TRC20/BTC, falls back to env-configured pool until native HD wiring is added.
 */
export async function deriveDepositAddress(coin: string, network: string, index: number): Promise<string> {
  const key = `${coin}_${network}`.toUpperCase()
  const evmKeys = ['ETH_ERC20', 'USDT_ERC20', 'USDC_ERC20', 'BNB_BEP20', 'USDT_BEP20']

  if (evmKeys.includes(key)) {
    try {
      const root = hdNode()
      // Account index space separation: ETH=0, BSC=1
      const account = key.endsWith('_BEP20') ? 1 : 0
      const path = `m/44'/60'/${account}'/0/${index}`
      const child = root.derivePath(path)
      return child.address
    } catch (err) {
      logger.error({ err }, 'EVM HD derivation failed; falling back to pool')
    }
  }

  // TRC20/BTC: pool-based fallback (configure DEPOSIT_POOL_<COIN>_<NETWORK>=addr1,addr2,…)
  const poolEnv = process.env[`DEPOSIT_POOL_${coin}_${network}`.toUpperCase()]
  if (poolEnv) {
    const pool = poolEnv.split(',').map((s) => s.trim()).filter(Boolean)
    if (pool.length) return pool[index % pool.length]
  }

  // Last resort placeholder — caller should treat this as a configuration error in prod
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`No deposit address available for ${coin}/${network}. Set WALLET_MNEMONIC or DEPOSIT_POOL_${coin}_${network}.`)
  }
  return `dev_${coin}_${network}_${index}`
}

/**
 * Network fee lookup. Tries env override first, then a coin/network default.
 * Set NETWORK_FEE_<COIN>_<NETWORK>=<amount-in-coin> to override.
 */
const FEE_DEFAULTS: Record<string, number> = {
  USDT_TRC20: 1,
  USDT_ERC20: 8,
  USDT_BEP20: 0.5,
  USDC_ERC20: 8,
  ETH_ERC20: 0.001,
  BNB_BEP20: 0.0005,
  BTC_BTC: 0.00015,
}

export async function getNetworkFee(coin: string, network: string): Promise<number> {
  const key = `${coin}_${network}`.toUpperCase()
  const envFee = process.env[`NETWORK_FEE_${key}`]
  if (envFee) {
    const n = parseFloat(envFee)
    if (Number.isFinite(n) && n >= 0) return n
  }
  return FEE_DEFAULTS[key] ?? 0
}
