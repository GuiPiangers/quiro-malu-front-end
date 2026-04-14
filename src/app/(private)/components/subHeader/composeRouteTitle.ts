export type RouteTitleEntry = {
  name: string
  path: string
  previousPath?: string
  previousLabel?: string
}

function normalizePathname(p: string): string {
  if (!p || p === '/') return '/'
  const withSlash = p.startsWith('/') ? p : `/${p}`
  const trimmed = withSlash.replace(/\/+$/, '')
  return trimmed || '/'
}

function pathSegments(pathname: string): string[] {
  const n = normalizePathname(pathname)
  if (n === '/') return []
  return n.slice(1).split('/')
}

export function matchesRoutePattern(
  pattern: string,
  pathname: string,
): boolean {
  const pat = normalizePathname(pattern)
  const path = normalizePathname(pathname)

  if (pat === '/') {
    return path === '/'
  }

  const patternParts = pat.slice(1).split('/')
  const pathParts = pathSegments(path)

  const lastIdx = patternParts.length - 1
  if (lastIdx >= 0 && patternParts[lastIdx] === '**') {
    const prefix = patternParts.slice(0, -1)
    if (prefix.length === 0) {
      return true
    }
    if (pathParts.length < prefix.length) {
      return false
    }
    for (let i = 0; i < prefix.length; i++) {
      const seg = prefix[i]
      if (seg === '*') continue
      if (seg !== pathParts[i]) return false
    }
    return true
  }

  if (patternParts.length !== pathParts.length) {
    return false
  }

  for (let i = 0; i < patternParts.length; i++) {
    const seg = patternParts[i]
    if (seg === '*') continue
    if (seg === '**') {
      return false
    }
    if (seg !== pathParts[i]) return false
  }

  return true
}

function extractWildcardValues(
  pattern: string,
  pathname: string,
): string[] | null {
  const pat = normalizePathname(pattern)
  const path = normalizePathname(pathname)
  const patternParts = pat.slice(1).split('/')
  const pathParts = pathSegments(path)

  const lastIdx = patternParts.length - 1
  if (lastIdx >= 0 && patternParts[lastIdx] === '**') {
    const prefix = patternParts.slice(0, -1)
    if (pathParts.length < prefix.length) {
      return null
    }
    const values: string[] = []
    for (let i = 0; i < prefix.length; i++) {
      const seg = prefix[i]
      if (seg === '*') {
        values.push(pathParts[i])
      } else if (seg !== pathParts[i]) {
        return null
      }
    }
    return values
  }

  if (patternParts.length !== pathParts.length) {
    return null
  }

  const values: string[] = []
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] === '*') {
      values.push(pathParts[i])
    } else if (patternParts[i] !== pathParts[i]) {
      return null
    }
  }
  return values
}

function substitutePreviousPath(
  template: string,
  wildcardValues: string[],
): string | null {
  const t = normalizePathname(template)
  if (t === '/') {
    return '/'
  }
  const parts = t.slice(1).split('/')
  const starCount = parts.filter((s) => s === '*').length
  let vi = 0
  const out: string[] = []
  for (const p of parts) {
    if (p === '*') {
      const v = wildcardValues[vi++]
      if (v === undefined || v === '') {
        return null
      }
      out.push(v)
    } else {
      out.push(p)
    }
  }
  if (vi !== starCount) {
    return null
  }
  return normalizePathname(`/${out.join('/')}`)
}

function findMatchingRoute(
  pathname: string,
  routes: RouteTitleEntry[],
): RouteTitleEntry | undefined {
  return routes.find((route) => matchesRoutePattern(route.path, pathname))
}

export function composePreviousHref(
  pathname: string,
  routes: RouteTitleEntry[],
): string | undefined {
  const route = findMatchingRoute(pathname, routes)
  if (!route?.previousPath) {
    return undefined
  }
  const values = extractWildcardValues(route.path, pathname)
  if (values === null) {
    return undefined
  }
  const hasStars = route.previousPath.split('/').includes('*')
  if (!hasStars) {
    return normalizePathname(route.previousPath)
  }
  return substitutePreviousPath(route.previousPath, values) ?? undefined
}

export function composePreviousLabel(
  pathname: string,
  routes: RouteTitleEntry[],
): string | undefined {
  const label = findMatchingRoute(pathname, routes)?.previousLabel?.trim()
  return label || undefined
}

export function composeRouteTitle(
  pathname: string,
  routes: RouteTitleEntry[],
): string | undefined {
  return findMatchingRoute(pathname, routes)?.name
}
