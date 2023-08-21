export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.baseURL}/unidades-ensino`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" },
  });
  
  const data = await response.json();
  return data;
});
