export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.baseURL}/erudio/alunos/sincronizar`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });

  let data = {};
  const text = await response.text();

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
