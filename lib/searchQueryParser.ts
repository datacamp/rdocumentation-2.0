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
 *
 * Package search requests `latest=1` so Elasticsearch returns one document per
 * package instead of every historical version. Without it the API returns every
 * indexed version with an identical relevance score, and the tie is broken by
 * index insertion order, which surfaces the oldest release first.
 *
 * Function search deliberately does not request `latest=1`: topic documents are
 * missing for many packages' newest versions, so the filter drops those results
 * entirely. Function results are de-duplicated client side instead.
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
      )}&page=${page}&latest=1`,
    };
  }

  return {
    functionsEndpoint: `${baseUrl}/search_functions?q=${encodeURIComponent(
      parsed.rawQuery,
    )}&page=${page}`,
    packagesEndpoint: `${baseUrl}/search_packages?q=${encodeURIComponent(
      parsed.rawQuery,
    )}&page=${page}&latest=1`,
  };
}

/**
 * Return the query as a candidate package name, or null when it cannot be one.
 *
 * Used to decide whether an exact-name recovery request is worth making.
 */
export function packageNameCandidate(parsed: ParsedSearchQuery): string | null {
  const candidate = parsed.isScoped ? parsed.packageName : parsed.rawQuery;
  if (!candidate) return null;
  return /^[A-Za-z][A-Za-z0-9._]*$/.test(candidate) ? candidate : null;
}

/**
 * Unfiltered package search endpoint.
 *
 * A package whose latest_version flag is missing from the index is dropped by
 * latest=1 entirely, rather than shown with an older version, which would make
 * it undiscoverable. This endpoint recovers those packages. Roughly 1% of
 * packages are affected because their database row has a null
 * latest_version_id, so no document is flagged; see COMM-10361. Remove this
 * once the data is fixed.
 */
export function buildPackageFallbackEndpoint(
  baseUrl: string,
  parsed: ParsedSearchQuery,
  page = 1,
): string {
  const term =
    parsed.isScoped && parsed.packageName
      ? parsed.packageName
      : parsed.rawQuery;
  return `${baseUrl}/search_packages?q=${encodeURIComponent(term)}&page=${page}`;
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
