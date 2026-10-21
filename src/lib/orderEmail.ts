export function sendOrderConfirmationEmail(orderId: string) {
  if (typeof window === 'undefined' || !orderId) return

  void fetch('/api/order-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({ orderId }),
  })
    .then((res) => {
      if (!res.ok) console.error('Order confirmation email failed:', res.status)
    })
    .catch((error) => console.error('Order confirmation email failed:', error))
}
