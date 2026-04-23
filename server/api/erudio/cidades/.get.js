export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const queryString = new URLSearchParams(query).toString();
  const params = queryString ? `?${queryString}` : "";

  const response = await fetch(
    `${config.public.baseURL}/erudio/cidades${params}`,
  );
  const text = await response.text();
  let data = {};

  if (text.length) {
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        error: text,
        message: text,
        statusCode: response.status,
      };
    }
  }

  if (!response.ok) {
    setResponseStatus(event, response.status, response.statusText);
  }

  return data;
});
