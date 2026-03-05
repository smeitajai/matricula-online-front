export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();
  const queryString = new URLSearchParams(query).toString();
  const params = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${config.public.baseURL}/public/pre-cadastro/aluno${params}`,
  );

  let data = {};
  const string = await response.text();

  if (string.length) {
    data = JSON.parse(string);
  }

  return data;
});
