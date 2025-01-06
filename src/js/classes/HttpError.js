export class HttpError extends Error {
  constructor(response) {
    super(`HTTP error ${response.status}`);
  }
}