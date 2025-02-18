import { HttpError } from 'classes/HttpError'

export async function simpleFetch (url, options) {
  const result = await fetch(url, options);
  if (!result.ok) {
    throw new HttpError(result);
  }
  // Add support to html template files
  if (result.url.endsWith('.html')) {
    return (await result.text());
  }
  return (await result.json());
}