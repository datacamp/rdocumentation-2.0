/**
 * Version helpers for search results.
 *
 * R package versions are dot/dash separated numeric segments, for example
 * "1.0.10", "1.2-3" or "0.0.0.9000". They are not semver, so they are compared
 * segment by segment numerically, falling back to a string comparison whenever
 * a segment is not numeric.
 */

/**
 * Compare two R package version strings.
 *
 * @returns a negative number when `a` is older than `b`, a positive number
 * when `a` is newer than `b`, and 0 when they are equivalent.
 *
 * @example
 * compareRVersions('1.0.10', '1.0.9') // => positive, 1.0.10 is newer
 */
export function compareRVersions(a: string, b: string): number {
  const partsA = String(a ?? '').split(/[.-]/);
  const partsB = String(b ?? '').split(/[.-]/);
  const segmentCount = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < segmentCount; i += 1) {
    const rawA = partsA[i] ?? '';
    const rawB = partsB[i] ?? '';
    // A strict test, rather than Number.parseInt, so that a segment such as
    // "1a" genuinely falls through to the string comparison instead of
    // silently parsing as 1. CRAN versions are always numeric, so this is
    // defensive rather than load-bearing.
    const isNumericA = /^\d+$/.test(rawA);
    const isNumericB = /^\d+$/.test(rawB);

    if (!isNumericA || !isNumericB) {
      const difference = rawA.localeCompare(rawB);
      if (difference !== 0) return difference;
    } else if (Number(rawA) !== Number(rawB)) {
      return Number(rawA) - Number(rawB);
    }
  }

  return 0;
}

/**
 * Collapse results that share a key down to a single entry, keeping the newest
 * version rather than whichever entry the API happened to return first.
 *
 * Relevance order is preserved: each key keeps the position of its first
 * occurrence in the original list.
 */
export function keepNewestVersionPerKey<T>(
  items: T[],
  getKey: (item: T) => string | null | undefined,
  getVersion: (item: T) => string | null | undefined,
): T[] {
  const newestByKey = new Map<string, T>();
  const keyOrder: string[] = [];

  items.forEach((item) => {
    const key = getKey(item);
    if (!key) return;

    const existing = newestByKey.get(key);
    if (!existing) {
      newestByKey.set(key, item);
      keyOrder.push(key);
      return;
    }

    const isNewer =
      compareRVersions(getVersion(item) ?? '', getVersion(existing) ?? '') > 0;
    if (isNewer) newestByKey.set(key, item);
  });

  return keyOrder.map((key) => newestByKey.get(key) as T);
}
