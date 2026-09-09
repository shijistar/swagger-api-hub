export function getGlobalValueFromUrl(name: string): string {
  if (typeof window === 'undefined') return '';
  const search = window.location.search;
  if (!search) return '';
  const params = new URLSearchParams(search.slice(1));
  const globals = params.get('globals');
  if (!globals) return '';
  for (const g of globals.split(';')) {
    if (g.startsWith(`${name}:`)) {
      return g.slice(name.length + 1);
    }
  }
  return '';
}
