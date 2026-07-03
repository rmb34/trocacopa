// Client-side sharing helpers. Mobile-first: prefer the native share sheet
// (which is how WhatsApp actually gets reached on a phone), fall back to the
// clipboard, and never fail silently.

export type ShareResult = 'shared' | 'copied' | 'dismissed' | 'failed'

export async function shareContent(data: {
  title?: string
  text?: string
  url?: string
}): Promise<ShareResult> {
  if (typeof navigator === 'undefined') return 'failed'

  if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
    try {
      await navigator.share(data)
      return 'shared'
    } catch (err) {
      // User closed the share sheet — not an error, and nothing to copy.
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'dismissed'
      }
      // Anything else (e.g. lost user activation): fall through to clipboard.
    }
  }

  return copyText([data.text, data.url].filter(Boolean).join('\n'))
}

export async function copyText(text: string): Promise<ShareResult> {
  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    return 'failed'
  }
}

// Opens WhatsApp with a prefilled message, letting the user pick the chat.
export function whatsappShareUrl(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

// Direct chat with a Brazilian number stored as digits only (DDD + number).
// Prepends the country code when it's not already there.
export function whatsappChatUrl(digits: string, text?: string) {
  const full = digits.length > 11 ? digits : `55${digits}`
  return `https://wa.me/${full}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
