/**
 * Build a cross-calculator link with pre-filled URL params.
 * Example: buildCalculatorLink('project-price', { rate: 75 }) => "/project-price?rate=75"
 */
export function buildCalculatorLink(
  slug: string,
  params: Record<string, string | number>
): string {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    search.set(k, String(v));
  }
  return `/${slug}?${search.toString()}`;
}
