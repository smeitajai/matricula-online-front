export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.baseURL}/processos`);
  const data = await response.json();
  return data;
});
