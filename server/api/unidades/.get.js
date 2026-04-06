export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const queryString = new URLSearchParams(query).toString();
  const params = queryString ? `?${queryString}` : "";
  const response = await fetch(`${config.public.baseURL}/unidades-ensino${params}`);
  const data = await response.json();
  return data;
});
