import twilio from 'twilio'

const hasTwilio = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER)
const client = hasTwilio
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null

export async function sendSms(to: string, body: string): Promise<void> {
  if (process.env.NODE_ENV === 'development' || !client) {
    console.log(`[SMS] To: ${to} | Body: ${body}`)
    return
  }
  await client.messages.create({
    from: process.env.TWILIO_FROM_NUMBER,
    to,
    body,
  })
}
