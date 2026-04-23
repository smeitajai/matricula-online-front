const fromBrasilApiCepV2 = (body) => {
  return {
    cep: body.cep?.replace(/\D/g, "") ?? "",
    logradouro: body.street?.trim() ?? "",
    complemento: "",
    bairro: body.neighborhood?.trim() ?? "",
    localidade: body.city?.toUpperCase() ?? "",
    uf: body.state?.toUpperCase() ?? "",
  };
};

async function buscarViaCep(cep) {
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  if (!res.ok) return null;

  const data = await res.json();

  if (!data || data.erro) return null;

  return data;
}

async function buscarBrasilApi(cep) {
  const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);

  if (!res.ok) return null;

  const data = await res.json();
  return fromBrasilApiCepV2(data);
}

export default defineEventHandler(async (event) => {
  const cep = getRouterParam(event, "cep");

  if (!cep || cep.length !== 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "CEP inválido.",
    });
  }

  try {
    const viaCep = await buscarViaCep(cep);
    if (viaCep) return viaCep;
  } catch {}

  try {
    const brasilApi = await buscarBrasilApi(cep);
    if (brasilApi) return brasilApi;
  } catch {}

  throw createError({
    statusCode: 404,
    statusMessage: "CEP não encontrado.",
  });
});