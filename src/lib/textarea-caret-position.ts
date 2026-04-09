function px(n: string | number | null | undefined): number {
  if (n == null || n === '') return 0
  const v = typeof n === 'number' ? n : parseInt(String(n), 10)
  return Number.isFinite(v) ? v : 0
}

function lineHeightPx(computed: CSSStyleDeclaration): number {
  const lh = computed.lineHeight
  if (lh === 'normal') {
    const fs = px(computed.fontSize)
    return Math.round(fs * 1.2)
  }
  const parsed = px(lh)
  return parsed || Math.round(px(computed.fontSize) * 1.2) || 20
}

const PROPERTIES = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'MozTabSize',
] as const

function getCaretCoordinatesRelative(
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const s = div.style
  const computed = window.getComputedStyle(element)

  s.whiteSpace = 'pre-wrap'
  s.wordWrap = 'break-word'
  s.position = 'absolute'
  s.visibility = 'hidden'

  for (const prop of PROPERTIES) {
    const key = prop as string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(s as any)[key] = (computed as any)[key]
  }

  const isFirefox =
    typeof window !== 'undefined' &&
    'mozInnerScreenX' in window &&
    (window as Window & { mozInnerScreenX?: number }).mozInnerScreenX != null
  if (isFirefox) {
    if (element.scrollHeight > px(computed.height)) {
      s.overflowY = 'scroll'
    }
  } else {
    s.overflow = 'hidden'
  }

  div.textContent = element.value.substring(0, position)
  const span = document.createElement('span')
  span.textContent = element.value.substring(position) || '.'
  div.appendChild(span)

  const height = lineHeightPx(computed)
  const coordinates = {
    top: span.offsetTop + px(computed.borderTopWidth),
    left: span.offsetLeft + px(computed.borderLeftWidth),
    height,
  }

  document.body.removeChild(div)
  return coordinates
}

export function getTextareaCaretViewportPosition(
  element: HTMLTextAreaElement,
  position: number,
): { top: number; left: number; height: number } {
  const c = getCaretCoordinatesRelative(element, position)
  const rect = element.getBoundingClientRect()
  return {
    top: rect.top + c.top - element.scrollTop,
    left: rect.left + c.left - element.scrollLeft,
    height: c.height,
  }
}
