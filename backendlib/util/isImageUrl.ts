export function isImageUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  return imageExtensions.some((extension) => url.toLowerCase().endsWith(extension));
}
