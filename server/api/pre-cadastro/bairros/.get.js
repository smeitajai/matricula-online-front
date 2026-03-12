export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const response = await fetch(
    `${config.public.erudioBaseURL}/integracoes/pre-cadastro/public/bairros`,
  );

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
