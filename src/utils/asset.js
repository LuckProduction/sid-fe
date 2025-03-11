const baseUrl = import.meta.env.VITE_BASE_URL;
const tenant = import.meta.env.VITE_TENANTS;
// const [protocol, host] = baseUrl.split('://');
export const BASE_URL = `https://${tenant}.${baseUrl}/storage/`;

export default function asset(url) {
  return BASE_URL + url;
}

