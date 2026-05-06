import axios from 'axios'
import Levenshtein from 'fast-levenshtein'
import { logger } from '../lib/logger'

// Urdu romanization equivalents for common Pakistani name prefixes
const URDU_NAME_MAP: Record<string, string[]> = {
  muhammad: ['mohammad', 'muhammed', 'muhamad', 'mohammed', 'mohamad', 'mohammd'],
  ali: ['aly'],
  khan: ['kahn'],
  ahmed: ['ahmad', 'ahamed'],
  hussain: ['hussein', 'hossain', 'husain'],
  malik: ['malick', 'malek'],
}

export interface OcrResult {
  senderName?: string
  recipientName?: string
  amount?: number
  timestamp?: string
  referenceId?: string
  confidence: number
  rawText: string
}

export async function extractPaymentScreenshot(imageUrl: string, paymentMethod: string): Promise<OcrResult> {
  try {
    // Try Google Cloud Vision first
    if (process.env.GOOGLE_CLOUD_PROJECT_ID) {
      return await runGoogleVision(imageUrl)
    }
    // Fallback to PaddleOCR
    return await runPaddleOcr(imageUrl)
  } catch (err) {
    logger.error({ err, imageUrl }, 'OCR extraction failed')
    return { confidence: 0, rawText: '', }
  }
}

async function runGoogleVision(imageUrl: string): Promise<OcrResult> {
  // @ts-ignore — optional peer dep; runtime no-op if not installed
  const { ImageAnnotatorClient } = await import('@google-cloud/vision').catch(() => ({ ImageAnnotatorClient: null }))
  if (!ImageAnnotatorClient) throw new Error('Google Vision not available')

  const client = new (ImageAnnotatorClient as any)()
  const [result] = await client.documentTextDetection(imageUrl)
  const text = result.fullTextAnnotation?.text ?? ''
  return parsePaymentText(text)
}

async function runPaddleOcr(imageUrl: string): Promise<OcrResult> {
  const url = process.env.PADDLEOCR_SERVICE_URL ?? 'http://localhost:8866'
  const { data } = await axios.post(`${url}/predict/ocr_system`, { url: imageUrl }, { timeout: 30000 })
  const text = (data.results ?? []).map((r: any) => r[1][0]).join('\n')
  return parsePaymentText(text)
}

function parsePaymentText(text: string): OcrResult {
  const amountMatch = text.match(/(?:Rs\.?|PKR|Amount)\s*([\d,]+(?:\.\d{1,2})?)/i)
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : undefined

  const refMatch = text.match(/(?:TxID|Ref|Reference|Transaction ID)[:\s#]+([A-Z0-9]{6,20})/i)
  const referenceId = refMatch?.[1]

  const dateMatch = text.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/)
  const timestamp = dateMatch?.[0]

  // Extract names (lines that are capitalized)
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  const nameLines = lines.filter((l) => /^[A-Z][a-z]+ [A-Z]/.test(l))

  return {
    amount,
    referenceId,
    timestamp,
    senderName: nameLines[0],
    recipientName: nameLines[1],
    confidence: amount ? 0.75 : 0.3,
    rawText: text,
  }
}

/**
 * Name matching with Levenshtein distance + Urdu romanization normalization.
 * Returns true if names are considered the same person.
 */
export function namesMatch(name1: string, name2: string): boolean {
  if (!name1 || !name2) return false
  const normalize = (n: string) => n.toLowerCase().replace(/[^a-z ]/g, '').trim()
  const n1 = normalize(name1)
  const n2 = normalize(name2)

  if (n1 === n2) return true

  // Check Levenshtein distance
  const distance = Levenshtein.get(n1, n2)
  const maxLen = Math.max(n1.length, n2.length)
  if (distance / maxLen <= 0.2) return true

  // Check Urdu romanization equivalents
  const words1 = n1.split(' ')
  const words2 = n2.split(' ')
  let matchCount = 0
  for (const w1 of words1) {
    for (const w2 of words2) {
      if (w1 === w2) { matchCount++; break }
      const equivalents = URDU_NAME_MAP[w1] ?? []
      if (equivalents.includes(w2)) { matchCount++; break }
      const equivalents2 = URDU_NAME_MAP[w2] ?? []
      if (equivalents2.includes(w1)) { matchCount++; break }
    }
  }
  return matchCount >= Math.min(words1.length, words2.length)
}

export async function callDeepFace(selfieUrl: string, cnicPhotoUrl: string): Promise<{ match: boolean; score: number }> {
  const url = process.env.DEEPFACE_SERVICE_URL ?? 'http://localhost:5000'
  try {
    const { data } = await axios.post(`${url}/verify`, {
      img1_path: selfieUrl,
      img2_path: cnicPhotoUrl,
      model_name: 'ArcFace',
      detector_backend: 'retinaface',
    }, { timeout: 60000 })
    return { match: data.verified, score: parseFloat(data.distance ?? '1') }
  } catch (err) {
    logger.error({ err }, 'DeepFace call failed')
    return { match: false, score: 1 }
  }
}
