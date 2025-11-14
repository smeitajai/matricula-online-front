export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  const response = await fetch(`${config.public.baseURL}/inscricoes/anexos`, {
    method: "POST",
    body: event.node.req,
    headers: event.node.req.headers,
    duplex: "half",
  });

  return await response.json();
});