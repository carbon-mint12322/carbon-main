import { isImageUrl } from './isImageUrl';

export function getAllImageUrlsInObject(obj: any): string[] {
  let urls: string[] = [];

  function traverse(obj: any) {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        traverse(obj[key]); // Recursive call to handle nested objects
      } else if (typeof obj[key] === 'string' && isImageUrl(obj[key])) {
        urls.push(obj[key]);
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any) => {
          if (typeof item === 'string' && isImageUrl(item)) {
            urls.push(item);
          }
        });
      }
    }
  }

  traverse(obj);
  return urls;
}
