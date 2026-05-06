# PakSwap — Instant Buy + Crypto-to-Crypto Auto Verification Blueprint

**Project:** PakSwap P2P Crypto Exchange (Pakistan)
**Module:** Instant Buy v2 — Crypto-to-Crypto Auto Verification
**Document:** `09_CRYPTO_TO_CRYPTO_BLUEPRINT.md`
**Date:** 2026-05-05
**Status:** Developer-Ready Specification

---

## Table of Contents

1. [Analysis — How This Fits PakSwap](#section-1-analysis--how-this-fits-pakswap)
2. [Token / Network Data Structure](#section-2-token--network-data-structure)
3. [UX Flow — 3-Step Selector](#section-3-ux-flow--3-step-selector)
4. [Backend Database Models](#section-4-backend-database-models)
5. [API Endpoints](#section-5-api-endpoints)
6. [Blockchain Monitor Architecture](#section-6-blockchain-monitor-architecture)
7. [Payout Engine](#section-7-payout-engine)
8. [Admin Controls](#section-8-admin-controls)
9. [MVP Recommendation](#section-9-mvp-recommendation)
10. [Security & Fraud Risks](#section-10-security--fraud-risks)
11. [Step-by-Step Implementation Plan](#section-11-step-by-step-implementation-plan)

---

## Section 1: Analysis — How This Fits PakSwap

### Overview

PakSwap's Instant Buy module currently operates on a single payment mode: users pay in PKR via JazzCash or bank transfer, upload a screenshot, and a human admin verifies the payment before releasing crypto. This works but introduces friction — review delays, screenshot fraud risk, and manual overhead.

Adding Crypto-to-Crypto Auto Verification introduces a second payment mode that is **blockchain-native**: no screenshots, no human review for the payment verification step, and near-instant settlement.

### Two Payment Modes

| Attribute | Mode A: PKR Payment | Mode B: Crypto Payment |
|---|---|---|
| User pays with | PKR (JazzCash / Bank Transfer) | USDT, BNB, ETH, SOL, etc. |
| Payment proof | Screenshot upload | On-chain transaction |
| Verification layer 1 | AI screenshot scan | Blockchain node (auto) |
| Verification layer 2 | Human admin review — mandatory | Human admin review — mandatory |
| Release speed | 5–30 minutes (admin SLA) | 2–35 minutes (chain + admin SLA) |
| Fraud surface | Screenshot forgery, fake transfers | Wrong token, underpayment, duplicate TX |
| Source of truth | Bank API (if available) or screenshot | Blockchain (immutable) |
| Manual review required | Always — no exceptions | Always — no exceptions |

### Why Mode B is Faster and Lower Risk

- **Blockchain is the authoritative source of truth.** A confirmed on-chain transaction cannot be faked or reversed (after sufficient confirmations).
- **No image processing overhead.** Mode A requires AI OCR scanning plus human spot-check. Mode B requires only RPC polling or event subscription.
- **Deterministic.** Amount, token contract, recipient address — all verifiable programmatically. There is no ambiguity as there is with bank screenshots.
- **Audit trail.** Every deposit event is logged with `tx_hash`, `block_number`, `from_address`, and `confirmations`. This is cryptographically verifiable.

### How the Two Modes Coexist

The existing `ib_orders` table and payment flow are extended, not replaced. When a user creates an order:

- If `pay_mode = PKR`: the existing screenshot upload + two-layer human review flow is used, unchanged.
- If `pay_mode = CRYPTO`: a fresh deposit address is generated, the blockchain monitor watches it, and the order enters the admin payout queue once blockchain confirmation is reached.

**Two-layer policy is fully enforced for both modes:**
- Mode A Layer 1 = AI screenshot scan. Mode B Layer 1 = blockchain auto-verification.
- Layer 2 = human admin review and manual approval — mandatory for ALL orders in BOTH modes with no exceptions and no threshold.
- No token ever leaves the platform without an admin explicitly executing the payout action.

### System Architecture Context

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PakSwap Instant Buy v2                       │
├───────────────────────────┬─────────────────────────────────────────┤
│     Mode A: PKR           │     Mode B: Crypto                      │
│  ─────────────────────    │  ─────────────────────────────          │
│  User uploads screenshot  │  User sends on-chain TX                 │
│       ↓                   │       ↓                                 │
│  Layer 1: AI OCR Scan     │  Blockchain Monitor detects TX          │
│       ↓                   │       ↓                                 │
│  Layer 2: Admin Review    │  Auto-verify: amount, token, addr       │
│       ↓                   │       ↓                                 │
│  Admin approves           │  Auto-payout (or admin if >500 USDT)   │
│       ↓                   │       ↓                                 │
│  Crypto released          │  Crypto released                        │
└───────────────────────────┴─────────────────────────────────────────┘
```

---

## Section 2: Token / Network Data Structure

### Complete Asset & Network Configuration (JSON)

```json
{
  "assets": [
    {
      "symbol": "USDT",
      "name": "Tether USD",
      "coingecko_id": "tether",
      "decimals_default": 6,
      "networks": [
        {
          "network_id": "trc20",
          "name": "TRON (TRC-20)",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 20,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
          "address_format": "T + 33 base58 chars (starts with T)",
          "rpc_hint": "TronGrid API or own TRON full node"
        },
        {
          "network_id": "bep20",
          "name": "BNB Smart Chain (BEP-20)",
          "chain_id": 56,
          "is_evm": true,
          "required_confirmations": 15,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": "0x55d398326f99059fF775485246999027B3197955",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "rpc_hint": "https://bsc-dataseed.binance.org/"
        },
        {
          "network_id": "erc20",
          "name": "Ethereum (ERC-20)",
          "chain_id": 1,
          "is_evm": true,
          "required_confirmations": 12,
          "avg_block_time_seconds": 12,
          "estimated_wait_minutes": 3,
          "speed_badge": "Medium",
          "token_decimals": 6,
          "contract_address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "rpc_hint": "Infura / Alchemy ETH mainnet"
        },
        {
          "network_id": "arbitrum",
          "name": "Arbitrum One",
          "chain_id": 42161,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 0.25,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "rpc_hint": "Arbitrum One RPC or Alchemy Arbitrum"
        },
        {
          "network_id": "polygon",
          "name": "Polygon (MATIC)",
          "chain_id": 137,
          "is_evm": true,
          "required_confirmations": 100,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 4,
          "speed_badge": "Medium",
          "token_decimals": 6,
          "contract_address": "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "rpc_hint": "https://polygon-rpc.com/"
        },
        {
          "network_id": "solana",
          "name": "Solana (SPL)",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 32,
          "avg_block_time_seconds": 0.4,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
          "address_format": "base58 32-byte public key (~44 chars)",
          "rpc_hint": "Helius RPC or Solana mainnet-beta"
        },
        {
          "network_id": "optimism",
          "name": "Optimism",
          "chain_id": 10,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "rpc_hint": "https://mainnet.optimism.io"
        }
      ]
    },
    {
      "symbol": "USDC",
      "name": "USD Coin",
      "coingecko_id": "usd-coin",
      "decimals_default": 6,
      "networks": [
        {
          "network_id": "bep20",
          "name": "BNB Smart Chain (BEP-20)",
          "chain_id": 56,
          "is_evm": true,
          "required_confirmations": 15,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
          "address_format": "0x + 40 hex chars (EVM standard)"
        },
        {
          "network_id": "erc20",
          "name": "Ethereum (ERC-20)",
          "chain_id": 1,
          "is_evm": true,
          "required_confirmations": 12,
          "avg_block_time_seconds": 12,
          "estimated_wait_minutes": 3,
          "speed_badge": "Medium",
          "token_decimals": 6,
          "contract_address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          "address_format": "0x + 40 hex chars (EVM standard)"
        },
        {
          "network_id": "arbitrum",
          "name": "Arbitrum One",
          "chain_id": 42161,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 0.25,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
          "address_format": "0x + 40 hex chars (EVM standard)"
        },
        {
          "network_id": "polygon",
          "name": "Polygon (MATIC)",
          "chain_id": 137,
          "is_evm": true,
          "required_confirmations": 100,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 4,
          "speed_badge": "Medium",
          "token_decimals": 6,
          "contract_address": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          "address_format": "0x + 40 hex chars (EVM standard)"
        },
        {
          "network_id": "solana",
          "name": "Solana (SPL)",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 32,
          "avg_block_time_seconds": 0.4,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "address_format": "base58 32-byte public key (~44 chars)"
        },
        {
          "network_id": "optimism",
          "name": "Optimism",
          "chain_id": 10,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85",
          "address_format": "0x + 40 hex chars (EVM standard)"
        }
      ]
    },
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "coingecko_id": "ethereum",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "erc20",
          "name": "Ethereum Mainnet",
          "chain_id": 1,
          "is_evm": true,
          "required_confirmations": 12,
          "avg_block_time_seconds": 12,
          "estimated_wait_minutes": 3,
          "speed_badge": "Medium",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "Native ETH — no contract address"
        },
        {
          "network_id": "base",
          "name": "Base",
          "chain_id": 8453,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "Native ETH on Base L2"
        },
        {
          "network_id": "arbitrum",
          "name": "Arbitrum One",
          "chain_id": 42161,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 0.25,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)"
        },
        {
          "network_id": "polygon",
          "name": "Polygon (Wrapped ETH)",
          "chain_id": 137,
          "is_evm": true,
          "required_confirmations": 100,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 4,
          "speed_badge": "Medium",
          "token_decimals": 18,
          "contract_address": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "WETH on Polygon"
        },
        {
          "network_id": "optimism",
          "name": "Optimism",
          "chain_id": 10,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "Native ETH on Optimism L2"
        }
      ]
    },
    {
      "symbol": "BNB",
      "name": "BNB",
      "coingecko_id": "binancecoin",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "bep20",
          "name": "BNB Smart Chain (Native)",
          "chain_id": 56,
          "is_evm": true,
          "required_confirmations": 15,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "Native BNB — no contract address"
        }
      ]
    },
    {
      "symbol": "SOL",
      "name": "Solana",
      "coingecko_id": "solana",
      "decimals_default": 9,
      "networks": [
        {
          "network_id": "solana",
          "name": "Solana Mainnet",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 32,
          "avg_block_time_seconds": 0.4,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 9,
          "contract_address": null,
          "address_format": "base58 32-byte public key (~44 chars)",
          "notes": "Native SOL"
        }
      ]
    },
    {
      "symbol": "TRX",
      "name": "TRON",
      "coingecko_id": "tron",
      "decimals_default": 6,
      "networks": [
        {
          "network_id": "trc20",
          "name": "TRON Network (Native)",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 20,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 6,
          "contract_address": null,
          "address_format": "T + 33 base58 chars",
          "notes": "Native TRX"
        }
      ]
    },
    {
      "symbol": "AVAX",
      "name": "Avalanche",
      "coingecko_id": "avalanche-2",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "avalanche",
          "name": "Avalanche C-Chain",
          "chain_id": 43114,
          "is_evm": true,
          "required_confirmations": 12,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "Native AVAX on C-Chain"
        }
      ]
    },
    {
      "symbol": "APT",
      "name": "Aptos",
      "coingecko_id": "aptos",
      "decimals_default": 8,
      "networks": [
        {
          "network_id": "aptos",
          "name": "Aptos Mainnet",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 1,
          "avg_block_time_seconds": 0.5,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 8,
          "contract_address": null,
          "address_format": "0x + 64 hex chars (32-byte address)",
          "notes": "BFT finality — 1 confirmation sufficient"
        }
      ]
    },
    {
      "symbol": "NEAR",
      "name": "NEAR Protocol",
      "coingecko_id": "near",
      "decimals_default": 24,
      "networks": [
        {
          "network_id": "near",
          "name": "NEAR Protocol Mainnet",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 1,
          "avg_block_time_seconds": 1,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 24,
          "contract_address": null,
          "address_format": "human-readable account ID (e.g. alice.near) or 64-char hex implicit account",
          "notes": "Nightshade sharding — fast finality"
        }
      ]
    },
    {
      "symbol": "OP",
      "name": "Optimism",
      "coingecko_id": "optimism",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "optimism",
          "name": "Optimism Mainnet",
          "chain_id": 10,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 2,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": "0x4200000000000000000000000000000000000042",
          "address_format": "0x + 40 hex chars (EVM standard)"
        }
      ]
    },
    {
      "symbol": "ARB",
      "name": "Arbitrum",
      "coingecko_id": "arbitrum",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "arbitrum",
          "name": "Arbitrum One",
          "chain_id": 42161,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 0.25,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": "0x912CE59144191C1204E64559FE8253a0e49E6548",
          "address_format": "0x + 40 hex chars (EVM standard)"
        }
      ]
    },
    {
      "symbol": "SUI",
      "name": "Sui",
      "coingecko_id": "sui",
      "decimals_default": 9,
      "networks": [
        {
          "network_id": "sui",
          "name": "Sui Network",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 1,
          "avg_block_time_seconds": 0.5,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 9,
          "contract_address": null,
          "address_format": "0x + 64 hex chars (32-byte address)",
          "notes": "Mysticeti consensus — near-instant finality"
        }
      ]
    },
    {
      "symbol": "RON",
      "name": "Ronin",
      "coingecko_id": "ronin",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "ronin",
          "name": "Ronin Network",
          "chain_id": 2020,
          "is_evm": true,
          "required_confirmations": 5,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "ronin: prefix + 40 hex chars (EVM-compatible)",
          "notes": "Ronin addresses use 'ronin:' prefix, not '0x'"
        }
      ]
    },
    {
      "symbol": "BTC",
      "name": "Bitcoin",
      "coingecko_id": "bitcoin",
      "decimals_default": 8,
      "networks": [
        {
          "network_id": "bitcoin",
          "name": "Bitcoin Mainnet",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 3,
          "avg_block_time_seconds": 600,
          "estimated_wait_minutes": 30,
          "speed_badge": "Slow",
          "token_decimals": 8,
          "contract_address": null,
          "address_format": "P2PKH (1...), P2SH (3...), or Bech32 (bc1...)",
          "notes": "Native BTC. 3 confirmations = ~30 min wait."
        },
        {
          "network_id": "bep20_btcb",
          "name": "BNB Smart Chain (BTCB)",
          "chain_id": 56,
          "is_evm": true,
          "required_confirmations": 15,
          "avg_block_time_seconds": 3,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "Binance-pegged BTCB on BSC"
        }
      ]
    },
    {
      "symbol": "TON",
      "name": "Toncoin",
      "coingecko_id": "the-open-network",
      "decimals_default": 9,
      "networks": [
        {
          "network_id": "ton",
          "name": "TON Network",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 1,
          "avg_block_time_seconds": 5,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 9,
          "contract_address": null,
          "address_format": "user-friendly (EQ... or UQ...) or raw workchain:hash",
          "notes": "TON has workchain 0 (basechain). Memo/comment field required for exchange deposits."
        }
      ]
    },
    {
      "symbol": "OPBNB",
      "name": "opBNB",
      "coingecko_id": "opbnb",
      "decimals_default": 18,
      "networks": [
        {
          "network_id": "opbnb",
          "name": "opBNB Network",
          "chain_id": 204,
          "is_evm": true,
          "required_confirmations": 10,
          "avg_block_time_seconds": 1,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 18,
          "contract_address": null,
          "address_format": "0x + 40 hex chars (EVM standard)",
          "notes": "BNB L2 — native BNB on opBNB"
        }
      ]
    },
    {
      "symbol": "PI",
      "name": "Pi Network",
      "coingecko_id": "pi-network",
      "decimals_default": 7,
      "networks": [
        {
          "network_id": "pi",
          "name": "Pi Network Mainnet",
          "chain_id": null,
          "is_evm": false,
          "required_confirmations": 5,
          "avg_block_time_seconds": 5,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "token_decimals": 7,
          "contract_address": null,
          "address_format": "Pi wallet address (Base58-like, starts with G)",
          "notes": "Pi uses Stellar-derived ledger. API availability is limited — verify before adding to MVP."
        }
      ]
    }
  ]
}
```

### Confirmation Requirements Summary Table

| Network | Chain ID | EVM | Required Confs | Avg Block Time | Est. Wait | Speed |
|---|---|---|---|---|---|---|
| Ethereum (ERC-20) | 1 | Yes | 12 | 12s | ~3 min | Medium |
| BSC (BEP-20) | 56 | Yes | 15 | 3s | ~45s | Fast |
| Polygon | 137 | Yes | 100 | 2s | ~3 min | Medium |
| Arbitrum One | 42161 | Yes | 10 | 0.25s | ~1 min | Fast |
| Optimism | 10 | Yes | 10 | 2s | ~1 min | Fast |
| Base | 8453 | Yes | 10 | 2s | ~1 min | Fast |
| Avalanche C-Chain | 43114 | Yes | 12 | 2s | ~1 min | Fast |
| opBNB | 204 | Yes | 10 | 1s | ~1 min | Fast |
| Ronin | 2020 | Yes | 5 | 3s | ~15s | Fast |
| TRON (TRC-20) | — | No | 20 | 3s | ~1 min | Fast |
| Solana (SPL) | — | No | 32 | 0.4s | ~15s | Fast |
| Bitcoin | — | No | 3 | 600s | ~30 min | Slow |
| TON | — | No | 1 | 5s | ~5s | Fast |
| Aptos | — | No | 1 | 0.5s | ~1s | Fast |
| NEAR | — | No | 1 | 1s | ~1s | Fast |
| Sui | — | No | 1 | 0.5s | ~1s | Fast |
| Pi Network | — | No | 5 | 5s | ~25s | Fast |

---

## Section 3: UX Flow — 3-Step Selector

### Flow Overview

```
Step 1: Pay With
    ↓
Step 2: Select Token to Receive
    ↓
Step 3: Select Network (inline, after token)
    ↓
Step 4: Enter Amount
    ↓
Step 5: Enter Wallet Address
    ↓
Step 6: Quote Preview
    ↓
Step 7: Confirm → Payment Page
```

---

### Step 1: Pay With

Display a horizontal pill/tab selector:

| Option | Label | Icon | Notes |
|---|---|---|---|
| PKR | Pakistani Rupee | 🏦 | JazzCash / Bank Transfer |
| USDT | Tether USD | Coin | Most popular |
| USDC | USD Coin | Coin | Stablecoin |
| BNB | BNB | Coin | BSC native |
| ETH | Ethereum | Coin | |
| SOL | Solana | Coin | |
| Other | Other Crypto | ⋯ | Opens full asset dropdown |

**UI Rules:**
- Default selection: PKR (existing flow)
- Selecting any crypto option transitions to Mode B flow
- "Other Crypto" opens a searchable modal of all supported assets

---

### Step 2: Select Token to Receive

Display category tabs: **Popular | Stablecoins | Gas Tokens | All**

| Tab | Tokens Shown |
|---|---|
| Popular | USDT, BNB, ETH, SOL, BTC, TRX |
| Stablecoins | USDT, USDC |
| Gas Tokens | ETH, BNB, SOL, TRX, AVAX, OP, ARB, NEAR, APT, SUI, RON, TON |
| All | All active assets, alphabetically sorted |

**UI Rules:**
- Network selector is HIDDEN until token is selected
- Token cards show: symbol, name, logo, current PKR price
- If `pay_asset == receive_asset` (e.g. USDT → USDT), network swap mode is shown instead

---

### Step 3: Select Network (Inline)

Appears immediately below the token selector after token is chosen. Rendered as inline option cards, not a dropdown.

Each network card shows:
- Network name + logo
- Estimated wait time (e.g. "~1 min")
- Speed badge: `Fast` (green) | `Medium` (yellow) | `Slow` (red)
- Required confirmations (e.g. "15 confirmations")
- Typical network fee in USD

**Warning Banner (always visible when network selector is shown):**

```
⚠️  WARNING: Sending on the wrong network will result in permanent loss of funds.
    Only send [TOKEN] on the [SELECTED NETWORK] network to the deposit address shown.
```

**Speed Badge Thresholds:**

| Badge | Condition |
|---|---|
| Fast | Estimated wait ≤ 2 minutes |
| Medium | Estimated wait 3–10 minutes |
| Slow | Estimated wait > 10 minutes |

---

### Step 4: Enter Amount

- Input field: user enters either PKR amount or crypto amount
- Toggle: "Pay in PKR" / "Pay in [ASSET]"
- Live rate display: `1 USDT = 278.50 PKR` (refreshed every 10 seconds)
- Show: spread markup % and platform fee below the input
- Show: estimated receive amount, updating in real time
- Minimum and maximum order size displayed

---

### Step 5: Enter Wallet Address

- Input field: "Your [TOKEN] wallet address on [NETWORK]"
- Per-network validation rules applied client-side:

| Network | Validation Rule |
|---|---|
| EVM chains | Must match `/^0x[a-fA-F0-9]{40}$/` |
| TRON | Must match `/^T[a-zA-Z0-9]{33}$/` |
| Solana | Must be 32–44 base58 chars |
| Bitcoin | Must match P2PKH, P2SH, or Bech32 regex |
| TON | Must match `EQ...` or `UQ...` (48 chars) or raw format |
| Aptos | Must match `/^0x[a-fA-F0-9]{64}$/` |
| NEAR | Must match account ID format (2–64 chars, alphanumeric + `.` + `-` + `_`) |
| Sui | Must match `/^0x[a-fA-F0-9]{64}$/` |
| Ronin | Must match `/^ronin:[a-fA-F0-9]{40}$/` |
| Pi Network | Must be valid Stellar-format key (starts with G, 56 chars) |

- **TON Special:** If network is TON, show a MEMO/Comment field (required for correct crediting on some wallets)
- Show a QR code scanner icon for mobile users
- Warn if address appears to be a contract address (for native token sends)

---

### Step 6: Quote Preview

A summary card shown before confirmation:

```
┌─────────────────────────────────────────────┐
│  QUOTE PREVIEW                              │
├─────────────────────────────────────────────┤
│  You Pay:          100 USDT (TRC-20)        │
│  Market Rate:      1 USDT = 278.50 PKR      │
│  Platform Fee:     0.5% = 0.50 USDT         │
│  Network Fee:      ~1 TRX (est.)            │
│  Spread Markup:    0.3%                     │
├─────────────────────────────────────────────┤
│  You Receive:      ??? PKR / ??? Token       │
│  To Wallet:        0x1234...abcd            │
│  Network:          TRON (TRC-20)            │
│  Est. Time:        ~1 minute                │
├─────────────────────────────────────────────┤
│  Quote valid for:  02:55 (countdown)        │
└─────────────────────────────────────────────┘
```

- Quote is locked for 3 minutes. After expiry, user must refresh.
- Show rate lock countdown timer prominently
- "Confirm & Pay" button triggers order creation

---

### Step 7: Confirm → Payment Page

**For Mode B (Crypto payment):**

```
┌─────────────────────────────────────────────────────────────┐
│  SEND PAYMENT                                               │
├─────────────────────────────────────────────────────────────┤
│  Send EXACTLY:   100.00 USDT                                │
│  Network:        TRON (TRC-20)                              │
│  To Address:     TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx           │
│                  [Copy] [QR Code]                           │
│                                                             │
│  ⚠️ Send EXACTLY this amount. Over/underpayment             │
│     may cause delays or require manual review.              │
│                                                             │
│  Order expires in: 14:32                                    │
│                                                             │
│  STATUS: Waiting for deposit...                             │
│  [████░░░░░░] 0/20 confirmations                           │
└─────────────────────────────────────────────────────────────┘
```

- Deposit address shown with copy button and QR code
- Real-time confirmation progress bar (via SSE or polling)
- Order timer: 15-minute expiry window
- Status states: `waiting` → `detected` → `confirming (X/Y)` → `confirmed` → `payout_sent` → `completed`

---

## Section 4: Backend Database Models

### PostgreSQL Schema

```sql
-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE pay_mode_enum AS ENUM ('PKR', 'CRYPTO');
CREATE TYPE order_status_enum AS ENUM (
  'pending',          -- order created, waiting for payment
  'deposit_detected', -- TX seen in mempool
  'deposit_confirming', -- TX has some but not enough confirmations
  'deposit_confirmed', -- required confirmations reached
  'payout_pending',   -- in payout queue
  'payout_sent',      -- outbound TX broadcast
  'completed',        -- outbound TX confirmed
  'expired',          -- order expired, no payment received
  'cancelled',        -- cancelled by user or admin
  'manual_review',    -- flagged for human review
  'refunding',        -- refund in progress
  'refunded'          -- refund completed
);
CREATE TYPE deposit_event_type_enum AS ENUM (
  'detected',
  'confirming',
  'confirmed',
  'wrong_amount',
  'wrong_token',
  'duplicate',
  'underpaid',
  'overpaid',
  'expired'
);
CREATE TYPE payout_queue_reason_enum AS ENUM (
  'auto_failed',
  'low_balance',
  'manual_review',
  'high_value',
  'admin_override'
);
CREATE TYPE payout_queue_status_enum AS ENUM (
  'pending',
  'assigned',
  'completed',
  'cancelled'
);
CREATE TYPE fee_type_enum AS ENUM (
  'fixed',
  'percentage',
  'spread'
);


-- ============================================================
-- TABLE 1: ib_assets
-- Asset registry — one row per supported coin
-- ============================================================

CREATE TABLE ib_assets (
  asset_id          SERIAL PRIMARY KEY,
  symbol            VARCHAR(20)  NOT NULL UNIQUE,
  name              VARCHAR(100) NOT NULL,
  coingecko_id      VARCHAR(100),
  decimals          SMALLINT     NOT NULL DEFAULT 18,
  logo_url          TEXT,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  is_receive_only   BOOLEAN      NOT NULL DEFAULT FALSE, -- can only be received, not paid with
  sort_order        SMALLINT     NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ib_assets_active ON ib_assets(is_active);
CREATE INDEX idx_ib_assets_symbol ON ib_assets(symbol);


-- ============================================================
-- TABLE 2: ib_networks
-- Network / chain registry
-- ============================================================

CREATE TABLE ib_networks (
  network_id          VARCHAR(30)  PRIMARY KEY,  -- e.g. 'bep20', 'trc20', 'erc20', 'solana'
  name                VARCHAR(100) NOT NULL,
  chain_id            INTEGER,                    -- NULL for non-EVM chains
  is_evm              BOOLEAN      NOT NULL DEFAULT FALSE,
  node_rpc            TEXT,                       -- primary RPC endpoint (store encrypted if sensitive)
  node_rpc_fallback   TEXT,                       -- secondary RPC endpoint
  required_confs      SMALLINT     NOT NULL DEFAULT 12,
  avg_block_time_ms   INTEGER      NOT NULL DEFAULT 3000,
  is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
  contract_addresses  JSONB        NOT NULL DEFAULT '{}'::JSONB,
  -- ^ stores token contract addresses keyed by symbol: {"USDT": "0x...", "USDC": "0x..."}
  native_symbol       VARCHAR(20),                -- native gas token symbol (e.g. 'BNB', 'ETH', 'TRX')
  explorer_url        TEXT,                       -- block explorer base URL
  monitor_type        VARCHAR(30)  NOT NULL,      -- 'evm', 'tron', 'solana', 'bitcoin', 'ton', etc.
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ib_networks_active    ON ib_networks(is_active);
CREATE INDEX idx_ib_networks_chain_id  ON ib_networks(chain_id) WHERE chain_id IS NOT NULL;
CREATE INDEX idx_ib_networks_evm       ON ib_networks(is_evm);


-- ============================================================
-- TABLE 3: ib_asset_networks
-- Junction table: which assets are available on which networks,
-- with per-pair fee and limit configuration
-- ============================================================

CREATE TABLE ib_asset_networks (
  id                SERIAL PRIMARY KEY,
  asset_id          INTEGER      NOT NULL REFERENCES ib_assets(asset_id) ON DELETE CASCADE,
  network_id        VARCHAR(30)  NOT NULL REFERENCES ib_networks(network_id) ON DELETE CASCADE,
  is_active         BOOLEAN      NOT NULL DEFAULT TRUE,
  min_deposit       NUMERIC(36,18) NOT NULL DEFAULT 0,
  max_deposit       NUMERIC(36,18),                 -- NULL = no limit
  fee_type          fee_type_enum NOT NULL DEFAULT 'percentage',
  fee_value         NUMERIC(10,6) NOT NULL DEFAULT 0.5, -- % if percentage, absolute if fixed
  spread_pct        NUMERIC(6,4)  NOT NULL DEFAULT 0.3,
  network_fee_est   NUMERIC(36,18),                 -- estimated network fee in the asset unit
  is_auto_payout    BOOLEAN      NOT NULL DEFAULT TRUE,
  manual_review_threshold_usd NUMERIC(12,2) DEFAULT 500.00,
  -- ^ orders above this USD equivalent go to manual payout queue
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (asset_id, network_id)
);

CREATE INDEX idx_ib_asset_networks_asset    ON ib_asset_networks(asset_id);
CREATE INDEX idx_ib_asset_networks_network  ON ib_asset_networks(network_id);
CREATE INDEX idx_ib_asset_networks_active   ON ib_asset_networks(is_active);


-- ============================================================
-- TABLE 4: ib_deposit_addresses
-- Per-order deposit address records
-- Each order gets a unique fresh address (never reused)
-- ============================================================

CREATE TABLE ib_deposit_addresses (
  id                  SERIAL PRIMARY KEY,
  order_id            UUID         NOT NULL,  -- references ib_orders_v2.order_id
  asset_network_id    INTEGER      NOT NULL REFERENCES ib_asset_networks(id),
  address             TEXT         NOT NULL,
  memo                TEXT,                    -- for TON, Stellar-based chains
  private_key_enc     TEXT,                    -- AES-256 encrypted; NULL if using HD wallet derivation
  hd_derivation_path  TEXT,                    -- BIP44 path if using HD wallet
  is_used             BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ  NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes')
);

CREATE UNIQUE INDEX idx_ib_deposit_addr_order ON ib_deposit_addresses(order_id);
CREATE        INDEX idx_ib_deposit_addr_addr  ON ib_deposit_addresses(address);
CREATE        INDEX idx_ib_deposit_addr_exp   ON ib_deposit_addresses(expires_at) WHERE is_used = FALSE;


-- ============================================================
-- TABLE 5: ib_orders_v2
-- Main order table — covers both PKR and Crypto pay modes
-- ============================================================

CREATE TABLE ib_orders_v2 (
  order_id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               INTEGER       NOT NULL,   -- FK to users table
  pay_mode              pay_mode_enum NOT NULL,
  -- Payment side
  pay_asset             VARCHAR(20)   NOT NULL,   -- 'PKR', 'USDT', 'BNB', etc.
  pay_network           VARCHAR(30),              -- NULL for PKR
  pay_amount            NUMERIC(36,18) NOT NULL,
  -- Receive side
  receive_asset         VARCHAR(20)   NOT NULL,
  receive_network       VARCHAR(30)   NOT NULL,
  receive_amount        NUMERIC(36,18) NOT NULL,  -- amount user will receive
  receive_address       TEXT          NOT NULL,   -- user's destination wallet
  receive_memo          TEXT,                     -- TON/Stellar memo if required
  -- Rate at time of order lock
  rate_at_lock          NUMERIC(20,8) NOT NULL,   -- pay_asset per receive_asset
  fee_pct               NUMERIC(6,4)  NOT NULL,
  fee_amount            NUMERIC(36,18) NOT NULL,
  spread_pct            NUMERIC(6,4)  NOT NULL,
  network_fee_est       NUMERIC(36,18),
  -- PKR payment proof (Mode A only)
  payment_method        VARCHAR(50),              -- 'jazzcash', 'bank_transfer', etc.
  payment_screenshot_url TEXT,
  payment_screenshot_ai_result JSONB,
  -- Crypto deposit tracking (Mode B only)
  deposit_address       TEXT,
  deposit_asset         VARCHAR(20),
  deposit_network       VARCHAR(30),
  deposit_expected_amount NUMERIC(36,18),
  deposit_tx_hash       TEXT,
  deposit_block_number  BIGINT,
  deposit_from_address  TEXT,
  deposit_amount_received NUMERIC(36,18),
  deposit_confirmations SMALLINT      DEFAULT 0,
  deposit_required_confs SMALLINT,
  deposit_detected_at   TIMESTAMPTZ,
  deposit_confirmed_at  TIMESTAMPTZ,
  -- Payout tracking
  payout_tx_hash        TEXT,
  payout_block_number   BIGINT,
  payout_confirmed_at   TIMESTAMPTZ,
  payout_fee_paid       NUMERIC(36,18),
  -- Status
  status                order_status_enum NOT NULL DEFAULT 'pending',
  -- Admin
  admin_id              INTEGER,                  -- admin who last touched this order
  notes                 TEXT,
  ip_address            INET,
  user_agent            TEXT,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  expires_at            TIMESTAMPTZ   NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes')
);

CREATE INDEX idx_ib_orders_v2_user       ON ib_orders_v2(user_id);
CREATE INDEX idx_ib_orders_v2_status     ON ib_orders_v2(status);
CREATE INDEX idx_ib_orders_v2_pay_mode   ON ib_orders_v2(pay_mode);
CREATE INDEX idx_ib_orders_v2_created    ON ib_orders_v2(created_at DESC);
CREATE INDEX idx_ib_orders_v2_deposit_tx ON ib_orders_v2(deposit_tx_hash) WHERE deposit_tx_hash IS NOT NULL;
CREATE INDEX idx_ib_orders_v2_dep_addr   ON ib_orders_v2(deposit_address) WHERE deposit_address IS NOT NULL;
CREATE INDEX idx_ib_orders_v2_expires    ON ib_orders_v2(expires_at) WHERE status = 'pending';


-- ============================================================
-- TABLE 6: ib_deposit_events
-- Raw blockchain event log — append-only audit trail
-- ============================================================

CREATE TABLE ib_deposit_events (
  event_id          BIGSERIAL    PRIMARY KEY,
  order_id          UUID         REFERENCES ib_orders_v2(order_id) ON DELETE SET NULL,
  tx_hash           TEXT         NOT NULL,
  block_number      BIGINT,
  block_hash        TEXT,
  from_address      TEXT,
  to_address        TEXT         NOT NULL,
  amount_raw        NUMERIC(78,0),               -- raw integer amount (wei / lamports / etc.)
  amount_decimal    NUMERIC(36,18),              -- human-readable decimal amount
  token_contract    TEXT,                        -- NULL for native transfers
  network_id        VARCHAR(30)  NOT NULL REFERENCES ib_networks(network_id),
  confirmations     SMALLINT     NOT NULL DEFAULT 0,
  event_type        deposit_event_type_enum NOT NULL,
  memo              TEXT,                        -- for TON/Stellar
  raw_data          JSONB,                       -- full raw event data for debugging
  logged_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE        INDEX idx_ib_deposit_events_order   ON ib_deposit_events(order_id);
CREATE        INDEX idx_ib_deposit_events_tx      ON ib_deposit_events(tx_hash);
CREATE        INDEX idx_ib_deposit_events_network ON ib_deposit_events(network_id);
CREATE        INDEX idx_ib_deposit_events_logged  ON ib_deposit_events(logged_at DESC);
CREATE UNIQUE INDEX idx_ib_deposit_events_dedup   ON ib_deposit_events(tx_hash, network_id, event_type)
  WHERE event_type = 'confirmed';
-- ^ prevents duplicate "confirmed" events for the same TX


-- ============================================================
-- TABLE 7: ib_payout_queue
-- Manual payout queue — items that could not be auto-paid out
-- ============================================================

CREATE TABLE ib_payout_queue (
  queue_id          SERIAL       PRIMARY KEY,
  order_id          UUID         NOT NULL REFERENCES ib_orders_v2(order_id),
  reason            payout_queue_reason_enum NOT NULL,
  assigned_admin_id INTEGER,
  status            payout_queue_status_enum NOT NULL DEFAULT 'pending',
  notes             TEXT,
  payout_tx_hash    TEXT,                        -- filled when admin completes payout
  payout_amount     NUMERIC(36,18),
  payout_asset      VARCHAR(20),
  payout_network    VARCHAR(30),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  assigned_at       TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ
);

CREATE INDEX idx_ib_payout_queue_status  ON ib_payout_queue(status);
CREATE INDEX idx_ib_payout_queue_order   ON ib_payout_queue(order_id);
CREATE INDEX idx_ib_payout_queue_admin   ON ib_payout_queue(assigned_admin_id) WHERE assigned_admin_id IS NOT NULL;
CREATE INDEX idx_ib_payout_queue_created ON ib_payout_queue(created_at DESC);


-- ============================================================
-- TABLE 8: ib_hot_wallets
-- Hot wallet registry for payout operations
-- ============================================================

CREATE TABLE ib_hot_wallets (
  wallet_id             SERIAL       PRIMARY KEY,
  network_id            VARCHAR(30)  NOT NULL REFERENCES ib_networks(network_id),
  address               TEXT         NOT NULL,
  asset                 VARCHAR(20)  NOT NULL,   -- which asset this wallet holds
  balance_decimal       NUMERIC(36,18) NOT NULL DEFAULT 0,
  balance_updated_at    TIMESTAMPTZ,
  alert_threshold       NUMERIC(36,18) NOT NULL DEFAULT 0,
  -- ^ trigger alert when balance drops below this
  is_active             BOOLEAN      NOT NULL DEFAULT TRUE,
  is_primary            BOOLEAN      NOT NULL DEFAULT FALSE,
  -- ^ flag for the primary payout wallet per asset/network pair
  label                 VARCHAR(100),            -- human-readable label (e.g. "BSC USDT Primary")
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (network_id, address, asset)
);

CREATE INDEX idx_ib_hot_wallets_network  ON ib_hot_wallets(network_id);
CREATE INDEX idx_ib_hot_wallets_active   ON ib_hot_wallets(is_active);
CREATE INDEX idx_ib_hot_wallets_asset    ON ib_hot_wallets(asset);
```

---

## Section 5: API Endpoints

### Base URL: `/api/v1`

---

### `GET /api/v1/ib/assets`

**Description:** List all active assets and their available networks, for populating the UX selector.

**Auth:** None required (public)

**Response:**
```json
{
  "assets": [
    {
      "symbol": "USDT",
      "name": "Tether USD",
      "logo_url": "https://cdn.pakswap.com/assets/usdt.png",
      "networks": [
        {
          "network_id": "bep20",
          "name": "BNB Smart Chain (BEP-20)",
          "required_confirmations": 15,
          "estimated_wait_minutes": 1,
          "speed_badge": "Fast",
          "min_deposit": "10.00",
          "max_deposit": "50000.00",
          "fee_type": "percentage",
          "fee_value": "0.5",
          "spread_pct": "0.3",
          "is_active": true
        }
      ]
    }
  ]
}
```

---

### `GET /api/v1/ib/quote`

**Description:** Get a live quote for a proposed order. Rate is calculated fresh each call.

**Auth:** Optional (authenticated users may get better rates)

**Query Parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `pay_mode` | string | Yes | `PKR` or `CRYPTO` |
| `pay_asset` | string | Yes | e.g. `USDT`, `PKR` |
| `pay_network` | string | Cond. | Required if pay_mode=CRYPTO |
| `receive_asset` | string | Yes | e.g. `BNB`, `ETH` |
| `receive_network` | string | Yes | e.g. `bep20`, `erc20` |
| `pay_amount` | number | Yes | Amount user wants to pay |

**Response:**
```json
{
  "pay_amount": "100.00",
  "pay_asset": "USDT",
  "pay_network": "bep20",
  "receive_amount": "0.3124",
  "receive_asset": "BNB",
  "receive_network": "bep20",
  "market_rate": "321.45",
  "effective_rate": "320.48",
  "fee_pct": "0.5",
  "fee_amount_usd": "0.50",
  "spread_pct": "0.3",
  "network_fee_est": "0.0003",
  "quote_valid_until": "2026-05-05T10:15:00Z",
  "quote_token": "qt_abc123xyz789"
}
```

**Notes:**
- `quote_token` is a short-lived signed JWT (3 min TTL) that locks the rate for order creation
- Rate refreshes happen server-side using CoinGecko or a configured price oracle

---

### `POST /api/v1/ib/orders`

**Description:** Create a new instant buy order. Returns deposit address and payment instructions.

**Auth:** Required (JWT)

**Request Body:**
```json
{
  "quote_token": "qt_abc123xyz789",
  "pay_mode": "CRYPTO",
  "pay_asset": "USDT",
  "pay_network": "bep20",
  "receive_asset": "BNB",
  "receive_network": "bep20",
  "pay_amount": "100.00",
  "receive_address": "0xUserWalletAddress1234",
  "user_agreed_to_terms": true
}
```

**Response:**
```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "deposit_address": "0xGeneratedDepositAddress5678",
  "deposit_asset": "USDT",
  "deposit_network": "bep20",
  "deposit_expected_amount": "100.00",
  "deposit_memo": null,
  "expires_at": "2026-05-05T10:30:00Z",
  "required_confirmations": 15,
  "instructions": "Send EXACTLY 100.00 USDT on BNB Smart Chain (BEP-20) to the deposit address above."
}
```

**Error Cases:**

| Code | Reason |
|---|---|
| 400 | quote_token expired or invalid |
| 400 | receive_address fails network validation |
| 400 | pay_amount below min_deposit |
| 400 | pay_amount above max_deposit |
| 429 | Rate limit: too many orders from this user |
| 503 | Asset/network temporarily disabled |

---

### `GET /api/v1/ib/orders/:id`

**Description:** Get current status and details of a specific order.

**Auth:** Required (JWT) — must own the order

**Response:**
```json
{
  "order_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "deposit_confirming",
  "pay_mode": "CRYPTO",
  "pay_asset": "USDT",
  "pay_network": "bep20",
  "receive_asset": "BNB",
  "receive_network": "bep20",
  "pay_amount": "100.00",
  "receive_amount": "0.3124",
  "deposit_address": "0xGeneratedDepositAddress5678",
  "deposit_tx_hash": "0xTxHashAbcDef123",
  "deposit_confirmations": 7,
  "deposit_required_confs": 15,
  "deposit_amount_received": "100.00",
  "expires_at": "2026-05-05T10:30:00Z",
  "created_at": "2026-05-05T10:15:00Z"
}
```

---

### `POST /api/v1/ib/orders/:id/pkr-payment`

**Description:** Submit PKR payment screenshot. Only valid for orders with `pay_mode = PKR`.

**Auth:** Required (JWT) — must own the order

**Request:** `multipart/form-data`

| Field | Type | Description |
|---|---|---|
| `screenshot` | file | Payment screenshot (JPEG/PNG, max 5MB) |
| `payment_method` | string | `jazzcash` or `bank_transfer` |
| `sender_account` | string | Sender's JazzCash number or IBAN |
| `amount_claimed` | number | Amount claimed on screenshot |

**Response:**
```json
{
  "order_id": "...",
  "status": "manual_review",
  "message": "Payment submitted. Your order is being reviewed by our team.",
  "estimated_review_time": "5-15 minutes"
}
```

---

### `GET /api/v1/ib/orders/:id/deposit-status`

**Description:** Server-Sent Events (SSE) stream for real-time deposit tracking.

**Auth:** Required (JWT)

**Content-Type:** `text/event-stream`

**Events emitted:**

```
event: status_update
data: {"status": "deposit_detected", "tx_hash": "0xabc...", "confirmations": 1, "required": 15}

event: confirmation_update
data: {"confirmations": 8, "required": 15, "pct_complete": 53}

event: deposit_confirmed
data: {"confirmations": 15, "deposit_amount": "100.00", "payout_initiated": true}

event: payout_sent
data: {"payout_tx_hash": "0xdef...", "estimated_completion": "1-2 minutes"}

event: order_complete
data: {"status": "completed", "receive_amount": "0.3124", "receive_asset": "BNB"}

event: order_expired
data: {"status": "expired", "message": "Order expired. No payment detected."}
```

---

### `GET /api/v1/admin/ib/deposit-monitor`

**Description:** Admin endpoint — list all pending crypto deposit orders with real-time status.

**Auth:** Required (Admin JWT)

**Query Parameters:** `status`, `network_id`, `page`, `limit`, `from_date`, `to_date`

**Response:**
```json
{
  "orders": [
    {
      "order_id": "...",
      "user_id": 1234,
      "status": "deposit_confirming",
      "pay_asset": "USDT",
      "pay_network": "bep20",
      "deposit_address": "0x...",
      "deposit_tx_hash": "0x...",
      "deposit_confirmations": 7,
      "deposit_required_confs": 15,
      "deposit_amount_received": "100.00",
      "created_at": "...",
      "expires_at": "..."
    }
  ],
  "total": 42,
  "page": 1
}
```

---

### `GET /api/v1/admin/ib/payout-queue`

**Description:** Admin endpoint — list items in manual payout queue.

**Auth:** Required (Admin JWT)

**Query Parameters:** `status`, `reason`, `page`, `limit`

---

### `POST /api/v1/admin/ib/payout-queue/:id/execute`

**Description:** Admin marks a manual payout as completed, entering the outbound TX hash.

**Auth:** Required (Admin JWT)

**Request Body:**
```json
{
  "payout_tx_hash": "0xOutboundTxHashHere",
  "payout_amount": "0.3124",
  "notes": "Manually executed at 10:45 UTC"
}
```

**Response:**
```json
{
  "queue_id": 101,
  "order_id": "...",
  "status": "completed",
  "payout_tx_hash": "0xOutboundTxHashHere"
}
```

---

### `PUT /api/v1/admin/ib/assets/:id`

**Description:** Update asset configuration (toggle active, update metadata, etc.).

**Auth:** Required (Admin JWT)

**Request Body:** Partial `ib_assets` fields (symbol, name, is_active, etc.)

---

### `PUT /api/v1/admin/ib/hot-wallets/:id`

**Description:** Update hot wallet record (refresh balance, toggle active, update alert threshold).

**Auth:** Required (Admin JWT)

**Request Body:**
```json
{
  "balance_decimal": "4850.23",
  "alert_threshold": "500.00",
  "is_active": true
}
```

---

## Section 6: Blockchain Monitor Architecture

### Overview

The blockchain monitor is a set of long-running background processes, one per chain family. They run independently of the web API server and communicate via a shared database and Redis.

### Redis Data Structures Used

```
SET     ib:deposit_addrs:{network_id}       — Set of all active deposit addresses for O(1) lookup
HASH    ib:order:{order_id}                 — Cached order metadata for fast access
STREAM  ib:deposit_events                   — Event bus for confirmed deposits
ZSET    ib:expiry_queue                     — Addresses sorted by expiry time
```

---

### EVM Monitor (BSC, ETH, Polygon, Arbitrum, Optimism, Base, Avalanche, opBNB, Ronin)

**Technology:** Node.js with `ethers.js` v6

**Architecture:**

```
┌───────────────────────────────────────────────────────┐
│                  EVM Monitor Service                  │
│                                                       │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Chain Worker (one per EVM chain)               │  │
│  │                                                 │  │
│  │  1. Subscribe to new blocks (eth_subscribe)     │  │
│  │  2. For each new block:                         │  │
│  │     a. Get Transfer events from ERC-20s         │  │
│  │     b. Get native ETH/BNB transfers             │  │
│  │     c. Filter by Redis SET (deposit addrs)      │  │
│  │     d. On match → write ib_deposit_events       │  │
│  │     e. Push to BullMQ queue "deposit-detected"  │  │
│  │                                                 │  │
│  │  3. Reorg handler:                              │  │
│  │     a. Track last N block hashes               │  │
│  │     b. If chain reorgs, re-process affected     │  │
│  │        blocks and update confirmation counts    │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────┘
```

**Key Implementation Details:**

```javascript
// Listen for ERC-20 Transfer events
const transferFilter = {
  address: TOKEN_CONTRACT_ADDRESSES,   // whitelisted contracts only
  topics: [
    ethers.id("Transfer(address,address,uint256)"),
    null,
    depositAddressTopics  // pre-computed topic array from Redis SET
  ]
};

provider.on(transferFilter, async (log) => {
  const iface = new ethers.Interface(ERC20_ABI);
  const parsed = iface.parseLog(log);
  const toAddress = parsed.args[1].toLowerCase();

  // O(1) Redis lookup
  const isOurAddress = await redis.sismember(
    `ib:deposit_addrs:${networkId}`, toAddress
  );
  if (!isOurAddress) return;

  await writeDepositEvent(log, parsed, networkId);
  await bullmq.add('deposit-detected', { txHash: log.transactionHash, networkId });
});
```

**Confirmation Tracking:**

```javascript
// On each new block, re-check transactions in "confirming" state
async function recheckConfirmations(networkId, currentBlockNumber) {
  const confirmingOrders = await db.query(
    `SELECT order_id, deposit_tx_hash, deposit_required_confs, deposit_block_number
     FROM ib_orders_v2
     WHERE status = 'deposit_confirming' AND deposit_network = $1`,
    [networkId]
  );

  for (const order of confirmingOrders.rows) {
    const confs = currentBlockNumber - order.deposit_block_number;
    if (confs >= order.deposit_required_confs) {
      await markDepositConfirmed(order.order_id, confs);
    } else {
      await updateConfirmationCount(order.order_id, confs);
    }
  }
}
```

**RPC Redundancy:** Use at minimum 2 RPC endpoints per chain. Primary: Infura/Alchemy. Fallback: public RPC or own node. If primary fails, auto-switch to fallback. Cross-check critical confirmations across both providers.

---

### TRON Monitor

**Technology:** Node.js with `tronweb`

**Approach:** Polling (TRON does not support reliable websocket subscriptions for all clients)

```
┌─────────────────────────────────────────────────────┐
│                 TRON Monitor Service                │
│                                                     │
│  Poll every 3 seconds:                              │
│  GET /v1/accounts/{address}/transactions/trc20      │
│  (per deposit address)                              │
│                                                     │
│  Batch optimization:                               │
│  - Group addresses into batches                     │
│  - Use TronGrid dedicated API key                   │
│  - Cache last seen TX fingerprint per address       │
│  - On new TX: match, write event, queue payout      │
└─────────────────────────────────────────────────────┘
```

**Key difference from EVM:** TRON uses `solid` blocks (irreversible) after 20 confirmations. Monitor checks `isInBlock` and `blockNumber` fields in TronGrid response.

---

### Solana Monitor

**Technology:** Node.js with `@solana/web3.js` + Helius RPC

**Approach:** WebSocket account subscriptions (preferred) + polling fallback

```javascript
// Subscribe to account notifications via websocket
connection.onAccountChange(
  new PublicKey(depositAddress),
  async (accountInfo, context) => {
    // For SPL tokens: check Associated Token Account (ATA)
    // Parse token amount from account data
    const tokenBalance = parseTokenBalance(accountInfo.data);
    if (tokenBalance > 0) {
      await processSOLDeposit(depositAddress, tokenBalance, context.slot);
    }
  },
  'confirmed'
);
```

**SPL Token Handling:** Each SPL deposit address is an Associated Token Account (ATA) derived from the user deposit keypair + token mint. The monitor watches the ATA, not the base account.

---

### Bitcoin Monitor

**Technology:** BlockCypher API (primary) + Electrum server (fallback)

**Approach:** Webhook registration for watched addresses + polling fallback

```
1. On order creation: register BTC deposit address with BlockCypher webhook
   POST https://api.blockcypher.com/v1/btc/main/hooks
   { "event": "tx-confirmation", "address": "...", "confirmations": 3,
     "url": "https://api.pakswap.com/internal/btc-webhook" }

2. BlockCypher calls our webhook when TX reaches 3 confirmations

3. Fallback: poll /addrs/{address}/full every 2 minutes for addresses
   without webhook confirmation within expected window
```

---

### Event Processing Pipeline

```
Blockchain Monitor
      │
      │ (on TX detected)
      ▼
BullMQ Queue: "deposit-detected"
      │
      ▼
Deposit Worker:
  1. Validate: tx_hash not duplicate (check ib_deposit_events UNIQUE index)
  2. Validate: token contract matches whitelist for this network
  3. Validate: amount within ±0.1% of expected_amount
  4. Update order status: deposit_detected → deposit_confirming
  5. Write ib_deposit_events row
  6. Notify user via SSE (update confirmation count)
      │
      │ (on required confirmations reached)
      ▼
BullMQ Queue: "deposit-confirmed"
      │
      ▼
Confirmation Worker:
  1. Final re-validate (reorg check)
  2. Update order: deposit_confirmed_at, status → deposit_confirmed
  3. Write confirmed event to ib_deposit_events
  4. Trigger payout engine
```

---

### Underpayment / Overpayment Handling

| Scenario | Tolerance | Action |
|---|---|---|
| Exact payment | ±0.1% | Auto-process normally |
| Underpaid | < -0.1% | Flag `underpaid`, wait 15 min for top-up TX, then push to manual queue |
| Overpaid | > +0.1% | Fulfill order for expected amount, credit excess to user platform balance or initiate refund |
| Wrong token sent | N/A | Flag `wrong_token`, push to manual review, do NOT credit any amount |
| Wrong network | N/A | Monitor only watches addresses on the correct chain — TX simply never detected |

---

## Section 7: Payout Engine

> **Platform Policy:** No token is ever released without explicit human admin approval. The payout engine does not auto-release. All confirmed deposits enter the admin payout queue. An admin reviews, then manually triggers the signing service to execute the payout.

---

### Payout Flow

```
deposit-confirmed event received (Layer 1 complete)
          │
          ▼
1. Load order from ib_orders_v2
2. Update status → 'payment_verified'
3. Check hot wallet balance for (receive_asset, receive_network)
          │
          ├─ Balance OK ──────────────────────────────────────────►
          │                                                         │
          └─ Balance LOW ──────────────────────────────────────────┤
                          (flag reason = 'low_balance')            │
                          Alert admin SMS + dashboard              │
                                                                   ▼
                                              INSERT INTO ib_payout_queue
                                              (order_id, status='pending',
                                               reason, hot_wallet_ok)
                                                                   │
                                                                   ▼
                                              Notify admin dashboard (Layer 2 queue)
                                              SLA timer starts: 30 minutes

          ─ ─ ─ ─ ─ ─ ─ ADMIN ACTION REQUIRED ─ ─ ─ ─ ─ ─ ─ ─

                                              Admin opens payout queue
                                              Admin reviews:
                                                - Deposit TX on block explorer
                                                - Correct token + amount
                                                - Destination wallet address
                                              Admin clicks "Execute Payout"
                                                   │
                                                   ▼
                                         Signing Service invoked
                                         (admin-triggered, not automated)
                                                   │
                                                   ▼
                                         Transaction broadcast to network
                                                   │
                                                   ▼
                                         payout_tx_hash recorded
                                         status → 'payout_sent'
                                                   │
                                                   ▼
                                         Monitor outbound TX confirmations
                                                   │
                                                   ▼
                                         On confirmed → status = 'completed'
                                         User notified: SMS + in-app
```

---

### Payout Queue States

| Status | Meaning |
|--------|---------|
| `pending` | Deposit confirmed, awaiting admin assignment |
| `assigned` | Admin has opened the item (SLA clock running) |
| `executed` | Admin has triggered signing, TX broadcast |
| `completed` | Outbound TX confirmed on-chain |
| `failed` | TX broadcast failed after retry — requires re-execution |
| `cancelled` | Admin rejected payout (refund flow triggered instead) |

---

### Transaction Signing Service

The signing service is a completely separate process. It is **only invoked by an explicit authenticated admin action** — never called automatically by any background worker or scheduler.

```
Admin clicks "Execute Payout" in dashboard
     │
     │  POST /internal/signing/execute (authenticated admin JWT)
     ▼
Signing Service (isolated process, no external network access)
     │  1. Validate request is from authenticated admin session
     │  2. Decrypt hot wallet key from encrypted store (AES-256-GCM)
     │  3. Build transaction (ethers.js / tronweb / solana/web3.js)
     │  4. Sign transaction
     │  5. Wipe decrypted key from memory immediately
     ▼
     │  signed_tx_hex returned
     ▼
Payout Engine broadcasts via RPC node
Records tx_hash, updates queue item status → 'executed'
```

**Key storage:** Private keys stored AES-256-GCM encrypted in `ib_hot_wallets.private_key_enc`. AES master key held in environment variable only — never in database. Production: use AWS KMS or HashiCorp Vault.

**Audit log:** Every signing invocation writes to `admin_audit_log` with: `admin_id`, `order_id`, `action = 'payout_executed'`, `tx_hash`, `timestamp`.

---

### Payout SLA & Escalation

| SLA Breached | Action |
|---|---|
| Queue item pending > 30 min | Escalate: SMS + email to admin supervisor |
| Queue item pending > 60 min | Critical alert: all admins notified |
| TX broadcast fails | Mark status = 'failed', re-queue for admin retry |
| TX stuck (gas too low) | Admin re-submits via "Retry with gas bump" button (10% increase) |
| 3 broadcast failures | Flag for manual wallet inspection before retry |

---

### Hot Wallet Balance — Low Balance Protocol

When deposit is confirmed but hot wallet balance < receive_amount + 10% buffer:

1. Queue item created with `reason = 'low_balance'`
2. Admin alerted immediately with exact shortfall amount
3. Admin tops up hot wallet from warm/cold wallet
4. Admin updates balance in dashboard
5. Admin executes payout normally once balance is sufficient

**No order is ever cancelled due to low balance** — it waits in queue until balance is restored.

**Retry logic pseudocode:**

```javascript
async function attemptPayout(orderId, attempt = 1) {
  try {
    const txHash = await signAndBroadcast(orderId);
    await db.updateOrder(orderId, { payout_tx_hash: txHash, status: 'payout_sent' });
  } catch (err) {
    if (attempt < 3) {
      const backoff = attempt * 30000;  // 30s, 60s
      setTimeout(() => attemptPayout(orderId, attempt + 1), backoff);
    } else {
      await db.insertPayoutQueue(orderId, 'auto_failed');
      await alertAdmin(orderId, `Payout failed after 3 attempts: ${err.message}`);
    }
  }
}
```

---

## Section 8: Admin Controls

### Per Token/Network Admin Settings

| Setting | Type | Description |
|---|---|---|
| Token active/inactive | Toggle | Emergency pause for a specific asset globally |
| Network active/inactive per token | Toggle | Disable USDT on ERC-20 without affecting USDT on BEP-20 |
| Fee type | Enum: fixed / percentage / spread | How platform fee is calculated |
| Fee value | Number | % or absolute amount depending on fee_type |
| Network fee (shown to user) | Number | Estimated network fee passed through to user in quote |
| Required confirmations | Number | Override chain default (can set higher for security) |
| Min deposit size | Number | Orders below this amount rejected |
| Max deposit size | Number | Orders above this amount rejected |
| Auto-payout toggle | Toggle | Disable auto-payout for a specific asset/network pair |
| Manual review threshold (USD) | Number | Orders above this always go to manual payout queue |
| Hot wallet alert threshold | Number | Trigger alert when hot wallet balance drops below this |

### Global Admin Controls

| Control | Description |
|---|---|
| Kill switch — pause all instant buy | Immediately halt all new order creation across Mode A and Mode B |
| Kill switch — pause crypto payments only | Halt Mode B orders, keep Mode A (PKR) running |
| Kill switch per network | Disable a specific network (e.g. disable ETH during gas spike) |
| Force-expire pending orders | Batch expire all orders older than X minutes |
| Bulk-update confirmation requirements | Increase confirmations globally during suspected attack |
| Hot wallet balance view | Real-time dashboard of all hot wallet balances across all chains |
| Deposit monitor dashboard | Live feed of all incoming crypto deposits with confirmation status |
| Manual payout queue | Assign, action, and log manual payouts with TX hash audit trail |
| User order history | Search orders by user, TX hash, deposit address, date range |
| Audit log | Immutable append-only log of all admin actions |

### Admin Dashboard Panels

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN: Instant Buy Monitor                                     │
├─────────────────────┬───────────────────────────────────────────┤
│  Hot Wallets        │  Network      Asset   Balance    Alert    │
│  ─────────────────  │  BSC          USDT    4,850 USDT  ✅      │
│  All balances live  │  BSC          BNB     12.4 BNB    ✅      │
│                     │  TRON         USDT    2,100 USDT  ✅      │
│                     │  Solana       SOL     45.2 SOL    ⚠️ LOW  │
├─────────────────────┼───────────────────────────────────────────┤
│  Pending Deposits   │  12 orders waiting / 3 confirming         │
│  Payout Queue       │  2 items pending manual action            │
│  Completed Today    │  67 orders / 18,450 USDT equivalent       │
└─────────────────────┴───────────────────────────────────────────┘
```

---

## Section 9: MVP Recommendation

### Start With These 5 Networks

| Priority | Asset | Network | Reason |
|---|---|---|---|
| 1 | USDT | BEP-20 (BSC) | Most popular stablecoin in Pakistan; BSC has lowest fees among EVM chains; 15 sec confirmation time; easiest to monitor |
| 2 | USDT | TRC-20 (TRON) | Most widely used USDT network globally and in Pakistan; extremely low fees (1-2 TRX); 1 min settlement; huge user familiarity |
| 3 | USDC | BEP-20 (BSC) | Stablecoin alternative; shares BSC monitoring infrastructure with USDT BEP-20 at near-zero extra cost |
| 4 | BNB | BEP-20 (BSC) | Native BSC token; no ERC-20 contract to track (native transfer); zero network fees; BSC monitor already running |
| 5 | SOL | Solana | Fast, cheap, growing user base in Pakistan; Helius RPC makes monitoring straightforward |

### Why These 5 Cover Most of Pakistan's Volume

- **BSC + TRON cover ~70% of Pakistan crypto transfer volume.** Both chains have fees below $0.01 per transaction, which is critical for a market where cost sensitivity is high.
- **USDT is the dominant instrument** — Pakistanis use USDT as a USD proxy for savings and transfers. Supporting it on the two most popular networks immediately satisfies the majority use case.
- **BNB shares infrastructure** with USDT BEP-20 — no additional monitoring code needed for Phase 1.
- **SOL** provides a premium fast option with a growing younger demographic.

### Phased Rollout

| Phase | Timeline | Assets/Networks Added |
|---|---|---|
| MVP (Phase 1) | Week 1-4 | USDT BEP-20, USDT TRC-20, USDC BEP-20, BNB BEP-20, SOL |
| Phase 2 | Week 5-8 | USDT ERC-20, ETH (ERC-20), AVAX (Avalanche C-Chain), ARB (Arbitrum), OP (Optimism) |
| Phase 3 | Week 9-12 | APT (Aptos), NEAR, SUI, TON, RON (Ronin), OPBNB |
| Phase 4 | Week 13+ | Pi Network (if public API stable), BTCB (BSC), native BTC |

**Note on Bitcoin native:** Native BTC (3 confirmations = ~30 min) creates a poor UX. Consider supporting it as BTCB on BSC (fast) before adding native BTC. If adding native BTC, set user expectation clearly that it takes up to 30 minutes.

**Note on Pi Network:** Pi Network's mainnet API is still maturing as of mid-2026. Verify API stability and availability before committing to Phase 4.

---

## Section 10: Security & Fraud Risks

### Risk Register

| # | Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|---|
| 1 | Duplicate TX replay | High | Medium | Unique constraint on `(tx_hash, network_id)` in `ib_deposit_events` prevents crediting same TX twice |
| 2 | Wrong token contract | High | Medium | Validate `token_contract` address against hardcoded whitelist in `ib_networks.contract_addresses`; reject unknown contracts |
| 3 | Wrong network deposit | Medium | Medium | Deposit address is network-specific; monitor only watches the assigned chain; cross-chain monitors ignore each other's addresses |
| 4 | Underpayment | Medium | High | Require exact amount ±0.1% tolerance; underpaid orders flagged and held, not credited |
| 5 | Overpayment | Low | Low | Fulfill order for expected amount; excess credited to user balance (not silently kept); logged in full |
| 6 | Flash loan / MEV attack | Low | Very Low | Not applicable — PakSwap is a centralized exchange receiving payments, not a DeFi protocol |
| 7 | Hot wallet drain | Critical | Low | Keep max 20% of daily volume in hot wallet; rest in cold storage; hot wallet alert thresholds; multisig where possible |
| 8 | RPC node manipulation | High | Low | Use 2-3 independent RPC providers; cross-check tx receipt and block hash for confirmations above 6 |
| 9 | Order expiry race condition | Medium | Medium | 15-minute hard expiry; expired orders cannot be credited even if TX detected late; use database-level lock on order status update |
| 10 | Address reuse | High | N/A | Fresh deposit address generated per order; addresses never shared between orders |
| 11 | Private key exposure | Critical | Low | Keys never stored in plain text; AES-256-GCM encryption at rest; signing in isolated process; no private keys in API layer or logs |
| 12 | Fake confirmation count | High | Low | Derive confirmation count from current_block - tx_block using our own RPC; do not trust confirmation count returned by third-party APIs |
| 13 | Social engineering / fake orders | Medium | Medium | Rate limiting: max 3 active orders per user at a time; max 10 orders per day; IP-based rate limiting |
| 14 | Blockchain reorganization (reorg) | Medium | Low | Re-check all "confirming" orders on every new block; only mark confirmed after required_confs since current chain tip |
| 15 | TON memo spoofing | High | Medium | For TON deposits, require unique memo per order; match BOTH address AND memo before crediting |

### Additional Security Practices

- **Audit logging:** Every order state transition, admin action, and payout is logged with timestamp, actor, and reason. Audit log is append-only (no UPDATE/DELETE on audit rows).
- **Secrets management:** RPC API keys, AES encryption key, and hot wallet keys are loaded from environment variables or Vault — never hardcoded or committed to source.
- **API authentication:** All order creation and status endpoints require valid JWT. Admin endpoints require a separate admin JWT with elevated scope.
- **Input validation:** All `receive_address` values are validated server-side with the same regex used client-side. All amount values are clamped to `[min_deposit, max_deposit]`.
- **Slippage control:** Quote is locked for 3 minutes. Orders submitted with an expired `quote_token` are rejected. Rate lock prevents users from exploiting price movement between quote and execution.

---

## Section 11: Step-by-Step Implementation Plan

### Phase 0 — Foundation (Week 1–2)

**Goal:** Database schema, admin config UI, quote API — no real orders yet.

- [ ] Run SQL migrations for all 8 tables (`ib_assets`, `ib_networks`, `ib_asset_networks`, `ib_deposit_addresses`, `ib_orders_v2`, `ib_deposit_events`, `ib_payout_queue`, `ib_hot_wallets`)
- [ ] Seed `ib_assets` and `ib_networks` tables with MVP data (BSC, TRON, Solana)
- [ ] Build admin UI panel: Token & Network Config (enable/disable, set fees, set limits)
- [ ] Implement `GET /api/v1/ib/assets` endpoint
- [ ] Implement `GET /api/v1/ib/quote` endpoint with live CoinGecko pricing
- [ ] Implement quote token generation (signed JWT, 3 min TTL)
- [ ] Set up BullMQ worker infrastructure (Redis, queue definitions)
- [ ] Set up EVM monitor framework for BSC (no deposit matching yet — just block subscription test)
- [ ] Internal testing: quote API returns correct rates, fees, and spread

**Deliverable:** Working quote API. Admin can configure tokens and networks. No user-facing orders yet.

---

### Phase 1 — BSC + TRON MVP (Week 3–4)

**Goal:** First working crypto-to-crypto orders on two networks.

- [ ] Implement `POST /api/v1/ib/orders` — order creation for CRYPTO pay mode
- [ ] Implement deposit address generation for BEP-20 (generate fresh Ethereum-compatible keypair per order, store encrypted private key)
- [ ] Implement deposit address generation for TRC-20 (TRON address generation)
- [ ] Load active deposit addresses into Redis SET on startup and on new order
- [ ] Complete EVM monitor for BSC: subscribe to USDT BEP-20 Transfer events, match against Redis SET
- [ ] Complete TRON monitor: poll TronGrid every 3s for USDT TRC-20 transfers to active addresses
- [ ] Implement `ib_deposit_events` writer
- [ ] Implement confirmation tracking worker (recheck every block)
- [ ] Implement payout engine for BNB and USDT BEP-20 (auto-payout)
- [ ] Implement signing service (isolated process, AES-256 key decryption, ethers.js signing)
- [ ] Implement `GET /api/v1/ib/orders/:id` status endpoint
- [ ] Implement `GET /api/v1/ib/orders/:id/deposit-status` SSE stream
- [ ] Build basic admin hot wallet management UI (view balance, update threshold)
- [ ] End-to-end test: send 10 USDT BEP-20 to deposit address, confirm auto-payout

**Deliverable:** Working USDT BEP-20 and USDT TRC-20 deposit + auto-payout. Internally testable.

---

### Phase 2 — Full Frontend (Week 5–6)

**Goal:** User-facing UX with all 3 steps, live tracking, and notifications.

- [ ] Build new `instant-buy.html` with 3-step selector (Pay With → Token → Network)
- [ ] Implement client-side network-specific address validation
- [ ] Build quote preview card with countdown timer
- [ ] Build payment page: deposit address display, QR code, copy button
- [ ] Implement live deposit tracking UI (confirmation progress bar via SSE)
- [ ] Build order confirmation and completion screens
- [ ] Implement user SMS notification on deposit detected, deposit confirmed, payout sent, order complete
- [ ] Implement in-app notification toast messages
- [ ] Build order history page (user can see all their Mode A and Mode B orders)
- [ ] Mobile-responsive UI across all steps
- [ ] Add "Wrong network = lost funds" warning banners
- [ ] Add speed badges (Fast/Medium/Slow) to network selector
- [ ] QA: test across Chrome/Safari/Firefox/mobile

**Deliverable:** User-ready frontend. Users can complete full crypto-to-crypto order flow end-to-end.

---

### Phase 3 — Expand + Harden (Week 7–8)

**Goal:** Add more assets, add operational tools, harden edge cases.

- [ ] Add USDC BEP-20 (reuses BSC monitor — minor config addition)
- [ ] Add BNB BEP-20 native transfer monitoring (different from ERC-20 events)
- [ ] Add SOL Solana monitor (Helius websocket subscription)
- [ ] Build manual payout queue UI (admin assigns, executes, enters TX hash)
- [ ] Build admin deposit monitor dashboard (live view of all pending deposits)
- [ ] Implement underpayment handling (15 min wait for top-up, then escalate)
- [ ] Implement overpayment handling (fulfill + credit excess to user balance)
- [ ] Implement wrong token detection (validate contract address, flag and escalate)
- [ ] Implement order expiry cleanup job (cancel and release deposit addresses)
- [ ] Add hot wallet low balance alerts (SMS + email to admin)
- [ ] Add audit log for all admin actions
- [ ] Add rate limiting: max 3 active orders per user, 10 orders per day
- [ ] Load testing: simulate 50 concurrent orders across BSC and TRON
- [ ] Write runbook: how to handle common incidents (low balance, stuck TX, reorg)

**Deliverable:** Production-ready MVP with 5 networks, operational tooling, and edge case handling.

---

### Phase 4 — Scale (Week 9+)

**Goal:** Expand to ERC-20 chains and exotic networks; scale infrastructure.

- [ ] Add USDT ERC-20 and ETH Mainnet (extend EVM monitor to chain_id 1)
- [ ] Add USDT Arbitrum, USDT Optimism, USDT Base (extend EVM monitor per chain_id)
- [ ] Add AVAX (Avalanche C-Chain) — EVM, chain_id 43114
- [ ] Add ARB and OP governance tokens
- [ ] Evaluate and add Aptos, NEAR, SUI (each requires a separate monitor implementation)
- [ ] Add TON monitor (with memo matching requirement)
- [ ] Add Ronin Network (EVM, chain_id 2020)
- [ ] Add opBNB (EVM, chain_id 204)
- [ ] Implement rate limiting and abuse detection (repeated failed orders, address scanning)
- [ ] Performance optimization: indexed Redis lookups, connection pooling, monitor process health checks
- [ ] Add Pi Network (pending API stability verification)
- [ ] Consider HD wallet derivation (BIP44) to replace per-order keypair generation — better for operational key management
- [ ] Consider moving to HSM (Hardware Security Module) for hot wallet key signing in production

**Deliverable:** Full multi-chain instant buy platform supporting 15+ networks.

---

## Integration Note

This blueprint integrates with PakSwap's **mandatory two-layer verification system with no exceptions**.

**Mode A (PKR):**
- Layer 1: AI screenshot scan (OCR, manipulation detection, amount/name/timestamp checks)
- Layer 2: Human admin review — mandatory before token release

**Mode B (Crypto/Blockchain):**
- Layer 1: Blockchain auto-verification (deposit address match, correct token contract, correct amount ±0.1%, no duplicate TX, required confirmation count)
- Layer 2: Human admin review — **still mandatory before token release, even after full blockchain confirmation**

Blockchain confirmation completes Layer 1 only. No token is ever released without a human admin explicitly approving in Layer 2. The "auto-payout engine" concept does not exist — all releases go through the admin payout queue. The SLA for Layer 2 on crypto orders is 30 minutes from Layer 1 confirmation.

Any design, API, or worker that auto-releases tokens without admin sign-off violates platform policy.

---

*Document: `09_CRYPTO_TO_CRYPTO_BLUEPRINT.md` — PakSwap Internal Technical Specification*
*Generated: 2026-05-05 | Version: 1.0*
