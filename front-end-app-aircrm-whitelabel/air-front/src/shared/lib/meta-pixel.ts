/**
 * Meta Pixel (fbq) helpers.
 *
 * Usage:
 *   injectPixel('1234567890')  – injects the <script> tag once and fires PageView
 *   removePixel()              – removes injected tags and clears fbq from window
 *   trackPageView()            – fires a PageView event if pixel is already loaded
 */

const SCRIPT_ID = 'meta-pixel-script'
const NOSCRIPT_ID = 'meta-pixel-noscript'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const win = (): any => window as any

export function injectPixel(pixelId: string): void {
  if (!pixelId) return

  // Already injected with the same pixel — nothing to do
  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null
  if (existing?.dataset.pixelId === pixelId) return

  // Remove stale script if pixel id changed
  removePixel()

  // Inject <script> using the official inline snippet
  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.dataset.pixelId = pixelId
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

  // Inject <noscript>
  const noscript = document.createElement('noscript')
  noscript.id = NOSCRIPT_ID
  const img = document.createElement('img')
  img.height = 1
  img.width = 1
  img.style.display = 'none'
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`
  noscript.appendChild(img)
  document.head.appendChild(noscript)
}

export function removePixel(): void {
  document.getElementById(SCRIPT_ID)?.remove()
  document.getElementById(NOSCRIPT_ID)?.remove()
  delete win().fbq
  delete win()._fbq
}

export function trackPageView(): void {
  win().fbq?.('track', 'PageView')
}


