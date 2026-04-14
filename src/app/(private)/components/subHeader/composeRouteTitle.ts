export type RouteTitleEntry = {
  name: string
  path: string
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

export function composeRouteTitle(
  pathname: string,
  routes: RouteTitleEntry[],
): string | undefined {
  return routes.find((route) => matchesRoutePattern(route.path, pathname))?.name
}
