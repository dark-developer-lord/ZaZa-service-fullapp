import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { useProfile } from '@shared/auth'

const PIXEL_KEY = 'meta_pixel_id'
const PIXEL_EVENT = 'meta-pixel-changed'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

const injectPixelScript = (pixelId: string) => {
  if (document.getElementById('meta-pixel-script')) return

  const script = document.createElement('script')
  script.id = 'meta-pixel-script'
  script.innerHTML = `
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window,document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  `
  document.head.appendChild(script)
}

const removePixelScript = () => {
  const el = document.getElementById('meta-pixel-script')
  if (el) el.remove()
}

/**
 * Injects the Meta Pixel script.
 * - On first mount it fetches the Pixel ID from the backend (if localStorage
 *   is empty) so the pixel loads even on fresh sessions.
 * - Tracks `PageView` on every route change.
 * - Reacts to `meta-pixel-changed` events so settings-page changes take
 *   effect immediately without a page reload.
 */
export const useMetaPixel = () => {
  const location = useLocation()
  const { profile } = useProfile()

  // On mount: if localStorage has no pixel, fetch from backend and seed it.
  useEffect(() => {
    if (!profile?.id) return
    const cached = localStorage.getItem(PIXEL_KEY)
    if (cached) return // already seeded

    axios
      .get<{ pixel_id: string | null }>(
        `${import.meta.env.VITE_APP_API_URL}/v3/messengers/pixel?store_id=${profile.id}`,
      )
      .then(({ data }) => {
        if (data.pixel_id) {
          localStorage.setItem(PIXEL_KEY, data.pixel_id)
          window.dispatchEvent(new CustomEvent(PIXEL_EVENT))
        }
      })
      .catch(() => {
        // silently ignore – pixel is optional
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  // Track page views on navigation
  useEffect(() => {
    const pixelId = localStorage.getItem(PIXEL_KEY)
    if (!pixelId) return

    injectPixelScript(pixelId)
    window.fbq?.('track', 'PageView')
  }, [location.pathname])

  // React to settings changes (pixel ID added / removed)
  useEffect(() => {
    const handler = () => {
      const pixelId = localStorage.getItem(PIXEL_KEY)
      if (pixelId) {
        injectPixelScript(pixelId)
        window.fbq?.('track', 'PageView')
      } else {
        removePixelScript()
      }
    }

    window.addEventListener(PIXEL_EVENT, handler)
    return () => window.removeEventListener(PIXEL_EVENT, handler)
  }, [])
}

