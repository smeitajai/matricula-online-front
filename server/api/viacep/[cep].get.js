const fromBrasilApiCepV2 = (body) => {
  return {
    cep: body.cep.replace(/\D/g, ""),
    logradouro: body.street.trim(),
    complemento: "",
    bairro: body.neighborhood.trim(),
    localidade: body.city.toUpperCase(),
    uf: body.state.toUpperCase(),
  };
};

export default defineEventHandler(async (event) => {
  const cep = getRouterParam(event, "cep");

  if (cep.length !== 8) {
    throw createError({
      statusCode: 400,
      statusMessage: "CEP inválido.",
    });
  }

  const viacepRes = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const viacepData = await viacepRes.json();

  if (viacepRes.ok && viacepData && !viacepData.erro) {
    return viacepData;
  }

  const brasilRes = await fetch(
    `https://brasilapi.com.br/api/cep/v2/${cep}`,
  );

  if (!brasilRes.ok) {
    throw createError({
      statusCode: 404,
      statusMessage: "CEP não encontrado.",
    });
  }

  const brasilData = await brasilRes.json();
  const mapped = fromBrasilApiCepV2(brasilData);

  if (!mapped) {
    throw createError({
      statusCode: 404,
      statusMessage: "CEP não encontrado.",
    });
  }

  return mapped;
});
