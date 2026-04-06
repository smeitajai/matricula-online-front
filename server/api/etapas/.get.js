export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const url = new URL(`${config.public.baseURL}/etapas`);

  if (query.curso) {
    url.searchParams.append("curso", String(query.curso));
  }

  const response = await fetch(url);
  const data = await response.json();
  return data;
});
