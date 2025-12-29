/**
 * Search Query Parser
 *
 * Parses search queries to detect scoped searches in two formats:
 * - R standard: package::function (e.g., stats::lm)
 * - UI display: function(package) (e.g., lm(stats))
 *
 * This allows users to search for specific functions within specific packages.
 */

export type ParsedSearchQuery = {
  /** The function name if a scoped search was detected */
  functionName: string | null;
  /** Whether this is a scoped search (function + package) */
  isScoped: boolean;
  /** The package name if a scoped search was detected */
  packageName: string | null;
  /** The original query string */
  rawQuery: string;
};

/**
 * Parse a search query to detect scoped search patterns.
 *
 * @example
 * parseSearchQuery('lm(stats)')
 * // => { functionName: 'lm', packageName: 'stats', rawQuery: 'lm(stats)', isScoped: true }
 *
 * @example
 * parseSearchQuery('stats::lm')
 * // => { functionName: 'lm', packageName: 'stats', rawQuery: 'stats::lm', isScoped: true }
 *
 * @example
 * parseSearchQuery('ggplot2')
 * // => { functionName: null, packageName: null, rawQuery: 'ggplot2', isScoped: false }
 */
export function parseSearchQuery(query: string | string[]): ParsedSearchQuery {
  const rawQuery = Array.isArray(query) ? query[0] : query || '';
  const trimmedQuery = rawQuery.trim();

  if (!trimmedQuery) {
    return {
      functionName: null,
      isScoped: false,
      packageName: null,
      rawQuery: '',
    };
  }

  const colonPattern = /^([a-zA-Z][a-zA-Z0-9._]*)::([a-zA-Z][a-zA-Z0-9._]*)$/;
  const colonMatch = trimmedQuery.match(colonPattern);
  if (colonMatch) {
    return {
      functionName: colonMatch[2],
      isScoped: true,
      packageName: colonMatch[1],
      rawQuery: trimmedQuery,
    };
  }

  const parenPattern = /^([a-zA-Z][a-zA-Z0-9._]*)\(([a-zA-Z][a-zA-Z0-9.]*)\)$/;
  const parenMatch = trimmedQuery.match(parenPattern);
  if (parenMatch) {
    return {
      functionName: parenMatch[1],
      isScoped: true,
      packageName: parenMatch[2],
      rawQuery: trimmedQuery,
    };
  }

  return {
    functionName: null,
    isScoped: false,
    packageName: null,
    rawQuery: trimmedQuery,
  };
}

/**
 * Build API endpoint URLs based on parsed query.
 * Returns the appropriate endpoints for packages and functions searches.
 */
export function buildSearchEndpoints(
  baseUrl: string,
  parsed: ParsedSearchQuery,
  page = 1,
): { functionsEndpoint: string; packagesEndpoint: string } {
  if (parsed.isScoped && parsed.functionName && parsed.packageName) {
    return {
      functionsEndpoint: `${baseUrl}/search_functions?q=${encodeURIComponent(
        parsed.functionName,
      )}&package=${encodeURIComponent(parsed.packageName)}&page=${page}`,
      packagesEndpoint: `${baseUrl}/search_packages?q=${encodeURIComponent(
        parsed.packageName,
      )}&page=${page}`,
    };
  }

  return {
    functionsEndpoint: `${baseUrl}/search_functions?q=${encodeURIComponent(
      parsed.rawQuery,
    )}&page=${page}`,
    packagesEndpoint: `${baseUrl}/search_packages?q=${encodeURIComponent(
      parsed.rawQuery,
    )}&page=${page}`,
  };
}

/**
 * Format the search result heading based on parsed query.
 */
export function formatSearchHeading(
  parsed: ParsedSearchQuery,
  pageNumber: number,
): string {
  if (parsed.isScoped && parsed.functionName && parsed.packageName) {
    return `Page ${pageNumber} of results for '${parsed.functionName}' in package '${parsed.packageName}':`;
  }
  return `Page ${pageNumber} of results for '${parsed.rawQuery}':`;
}
