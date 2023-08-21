export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.baseURL}/processos/${id}`);
  const data = await response.json();
  return data;
});
