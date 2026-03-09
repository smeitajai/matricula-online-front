export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const config = useRuntimeConfig();
  const queryString = new URLSearchParams(query).toString();
  const params = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${config.public.erudioBaseURL}/integracoes/pre-cadastro/public/aluno${params}`,
  );

  let data = {};
  const string = await response.text();

  if (string.length) {
    try {
      data = JSON.parse(string);
    } catch {
      data = {
        error: string,
        message: string,
        statusCode: response.status,
      };
    }
  }

  if (!response.ok) {
    setResponseStatus(event, response.status, response.statusText);
  }

  return data;
});
