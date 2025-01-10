export const BASE_URL = import.meta.env.VITE_BASE_URL + '/storage/';

export default function asset(url) {
  return BASE_URL + url;
}
