export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  console.log("BATEU AQUI!");

  const response = await fetch(`${config.public.baseURL}/inscricoes/transferencias`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" },
  });
  
  const data = await response.json();
  return data;
});
