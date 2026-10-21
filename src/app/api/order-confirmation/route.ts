import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'

export const runtime = 'nodejs'

type OrderItemPayload = {
  productName: string
  quantity: number
  price: number
}

type OrderEmailPayload = {
  orderId?: string
  customerName?: string
  customerSurname?: string
  customerEmail?: string
  customerPhone?: string
  customerAddress?: string
  customerCity?: string
  items?: OrderItemPayload[]
  addons?: { name: string; price: number; quantity?: number }[]
  promoCode?: string
  discountAmount?: number
  totalPrice?: number
  confirmationEmailSentAt?: number
}

const DATABASE_URL =
  process.env.FIREBASE_DATABASE_URL || 'https://easygo-a9fd0-default-rtdb.firebaseio.com'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

const money = (value: number) => `${Number(value || 0).toFixed(2)} KM`

const buildHtml = (data: OrderEmailPayload) => {
  const customer = `${data.customerName || ''} ${data.customerSurname || ''}`.trim() || 'kupac'
  const shortId = (data.orderId || '').slice(-8).toUpperCase() || '—'
  const items = data.items || []
  const addons = data.addons || []
  const itemsTotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0)
  const addonsTotal = addons.reduce((sum, addon) => sum + Number(addon.price || 0) * Number(addon.quantity || 1), 0)
  const discount = Number(data.discountAmount || 0)
  const total = Number(data.totalPrice ?? Math.max(itemsTotal + addonsTotal - discount, 0))

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #eef1f6;color:#0f172a;font-size:14px;">
            ${escapeHtml(item.productName || '')}<br />
            <span style="color:#64748b;font-size:12px;">Količina: ${Number(item.quantity || 1)}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #eef1f6;color:#0f172a;font-size:14px;text-align:right;white-space:nowrap;">
            ${money(Number(item.price || 0) * Number(item.quantity || 1))}
          </td>
        </tr>`
    )
    .join('')

  const addonRows = addons
    .map(
      (addon) => `
        <tr>
          <td style="padding:6px 0;color:#475569;font-size:13px;">+ ${escapeHtml(addon.name || '')}</td>
          <td style="padding:6px 0;color:#475569;font-size:13px;text-align:right;">${money(Number(addon.price || 0) * Number(addon.quantity || 1))}</td>
        </tr>`
    )
    .join('')

  return `<!doctype html>
<html lang="bs">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Inter,Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f1f5f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="background:#0A192F;padding:24px 28px;">
                <span style="font-size:22px;font-weight:800;letter-spacing:1px;color:#ffffff;">ELESONIC</span>
                <p style="margin:6px 0 0;color:#94a3b8;font-size:12px;">Potvrda o zaprimljenoj narudžbi</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 8px;font-size:20px;color:#0f172a;">Hvala na kupovini, ${escapeHtml(customer)}!</h1>
                <p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">
                  Vaša narudžba <strong>#${escapeHtml(shortId)}</strong> je uspješno zaprimljena.
                  Javit ćemo vam se u najkraćem roku radi potvrde i slanja paketa.
                </p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #e2e8f0;">
                  ${itemRows}
                  ${addonRows}
                </table>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                  ${discount > 0 ? `<tr><td style="padding:4px 0;color:#475569;font-size:13px;">Popust${data.promoCode ? ` (${escapeHtml(data.promoCode)})` : ''}</td><td style="padding:4px 0;color:#16a34a;font-size:13px;text-align:right;">-${money(discount)}</td></tr>` : ''}
                  <tr>
                    <td style="padding:12px 0 0;border-top:1px solid #e2e8f0;color:#0f172a;font-size:15px;font-weight:700;">Ukupno</td>
                    <td style="padding:12px 0 0;border-top:1px solid #e2e8f0;color:#ea580c;font-size:18px;font-weight:800;text-align:right;">${money(total)}</td>
                  </tr>
                </table>

                <div style="margin-top:24px;padding:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                  <p style="margin:0 0 6px;color:#0f172a;font-size:13px;font-weight:700;">Podaci za dostavu</p>
                  <p style="margin:0;color:#475569;font-size:13px;line-height:1.7;">
                    ${escapeHtml(customer)}<br />
                    ${escapeHtml(data.customerAddress || '')}<br />
                    ${escapeHtml(data.customerCity || '')}<br />
                    ${escapeHtml(data.customerPhone || '')}
                  </p>
                </div>

                <p style="margin:24px 0 0;color:#475569;font-size:13px;line-height:1.7;">
                  Za sva pitanja dostupni smo na <a href="mailto:contact@elesonic.ba" style="color:#ea580c;">contact@elesonic.ba</a>
                  ili putem Vibera na <strong>+387 67 123 5247</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:18px 28px;color:#94a3b8;font-size:11px;line-height:1.6;">
                Elesonic Elektronika d.o.o. · Džemala Bijedića 147, 71000 Sarajevo · JIB: 4203695310008<br />
                Ovo je automatska potvrda narudžbe. Molimo ne odgovarajte direktno na ovaj email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

const buildText = (data: OrderEmailPayload) => {
  const items = data.items || []
  const total = Number(data.totalPrice || 0)
  return [
    'ELESONIC — potvrda narudžbe',
    `Narudžba: #${(data.orderId || '').slice(-8).toUpperCase()}`,
    `Kupac: ${data.customerName || ''} ${data.customerSurname || ''}`.trim(),
    '',
    ...items.map((item) => `${item.quantity}× ${item.productName} — ${money(Number(item.price || 0) * Number(item.quantity || 1))}`),
    '',
    `Ukupno: ${money(total)}`,
    '',
    'Kontakt: contact@elesonic.ba · +387 67 123 5247',
  ].join('\n')
}

export async function POST(req: Request) {
  let body: { orderId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const orderId = (body.orderId || '').trim()
  if (!orderId || !/^[A-Za-z0-9_-]{4,64}$/.test(orderId)) {
    return NextResponse.json({ ok: false, error: 'Invalid order ID' }, { status: 400 })
  }

  const orderUrl = `${DATABASE_URL}/orders/${encodeURIComponent(orderId)}.json`

  let order: OrderEmailPayload | null = null
  try {
    const res = await fetch(orderUrl, { cache: 'no-store' })
    if (!res.ok) throw new Error(`Firebase responded ${res.status}`)
    order = (await res.json()) as OrderEmailPayload | null
  } catch (error) {
    console.error('[order-confirmation] Ne mogu učitati narudžbu:', error)
    return NextResponse.json({ ok: false, error: 'Order lookup failed' }, { status: 502 })
  }

  if (!order) {
    return NextResponse.json({ ok: false, error: 'Order not found' }, { status: 404 })
  }

  if (order.confirmationEmailSentAt) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'already-sent' })
  }

  const data: OrderEmailPayload = { ...order, orderId }
  const rawCustomerEmail = (data.customerEmail || '').trim()
  const customerEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawCustomerEmail) ? rawCustomerEmail : ''
  const notifyEmail = (process.env.ORDER_NOTIFY_EMAIL || 'contact@elesonic.ba').trim()
  const fromEmail = (process.env.ORDER_EMAIL_FROM || 'contact@elesonic.ba').trim()

  const to = customerEmail || notifyEmail
  const bcc = customerEmail && notifyEmail && customerEmail.toLowerCase() !== notifyEmail.toLowerCase() ? notifyEmail : undefined
  const subject = customerEmail
    ? `Potvrda narudžbe #${orderId.slice(-8).toUpperCase()} — ELESONIC`
    : `Nova narudžba #${orderId.slice(-8).toUpperCase()} — ELESONIC`

  try {
    const smtpHost = process.env.SMTP_HOST
    const sendmailPath = process.env.SENDMAIL_PATH || '/usr/sbin/sendmail'
    const sendmailAvailable =
      process.env.SMTP_SENDMAIL === 'true' ||
      (process.env.SMTP_SENDMAIL !== 'false' && process.platform !== 'win32' && fs.existsSync(sendmailPath))

    let transporter
    if (smtpHost) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 465),
        secure: (process.env.SMTP_SECURE || 'true') === 'true',
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || '' }
          : undefined,
      })
    } else if (sendmailAvailable) {
      transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: sendmailPath,
      })
    } else {
      console.warn('[order-confirmation] Email nije poslan: SMTP nije konfigurisan (SMTP_HOST/SMTP_USER/SMTP_PASS).')
      return NextResponse.json({ ok: true, skipped: true })
    }

    await transporter.sendMail({
      from: `ELESONIC <${fromEmail}>`,
      to,
      bcc,
      replyTo: 'contact@elesonic.ba',
      subject,
      text: buildText(data),
      html: buildHtml(data),
    })

    try {
      await fetch(orderUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmationEmailSentAt: Date.now() }),
      })
    } catch (error) {
      console.error('[order-confirmation] Email poslan, ali status nije sačuvan:', error)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[order-confirmation] Greška pri slanju emaila:', error)
    return NextResponse.json({ ok: false, error: 'Email send failed' }, { status: 500 })
  }
}
