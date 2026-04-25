// Meta Pixel helper for Next.js (App Router)
// Base pixel script is loaded in src/app/layout.tsx
// This module provides typed helpers to fire standard events anywhere on the client.

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
  }
}

type FbEventParams = Record<string, any>

function track(event: string, params?: FbEventParams) {
  if (typeof window === 'undefined') return
  if (typeof window.fbq !== 'function') return
  try {
    if (params) {
      window.fbq('track', event, params)
    } else {
      window.fbq('track', event)
    }
  } catch {
    // swallow – pixel must never break the app
  }
}

export const fbPixel = {
  pageView: () => track('PageView'),
  viewContent: (params?: { content_ids?: string[]; content_name?: string; content_type?: string; value?: number; currency?: string }) =>
    track('ViewContent', params),
  addToCart: (params?: { content_ids?: string[]; content_name?: string; content_type?: string; value?: number; currency?: string }) =>
    track('AddToCart', params),
  initiateCheckout: (params?: { content_ids?: string[]; num_items?: number; value?: number; currency?: string }) =>
    track('InitiateCheckout', params),
  purchase: (params: { value: number; currency: string; content_ids?: string[]; content_name?: string; num_items?: number }) =>
    track('Purchase', params),
  search: (searchString: string) => track('Search', { search_string: searchString }),
  lead: (params?: FbEventParams) => track('Lead', params),
  completeRegistration: (params?: FbEventParams) => track('CompleteRegistration', params),
}
