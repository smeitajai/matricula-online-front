export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();
  const params = '?' + new URLSearchParams(query).toString();

  const response = await fetch(`${config.public.baseURL}/alunos${params}`);
  const data = await response.json();
  return data;
});