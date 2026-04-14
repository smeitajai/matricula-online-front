export default defineEventHandler(async (event) => {
  const cep = (getRouterParam(event, "cep") || "").replace(/\D/g, "");

  if (cep.length !== 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "CEP inválido.",
    });
  }

  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = await response.json();

  if (!response.ok || data?.erro) {
    throw createError({
      statusCode: 404,
      statusMessage: "CEP não encontrado.",
    });
  }

  return data
});
