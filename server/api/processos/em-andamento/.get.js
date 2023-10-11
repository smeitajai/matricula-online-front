export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.baseURL}/processos/em-andamento`);
  
  let data = {};
  const string = await response.text();

  if (string.length) {
     data = JSON.parse(string)
  } 
  
  return data;
});
