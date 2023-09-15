export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  delete body.id;
  const config = useRuntimeConfig();
  
  const response = await fetch(`${config.public.baseURL}/enderecos/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" },
  });
  
  const data = await response.json();
  return data;
  

});
