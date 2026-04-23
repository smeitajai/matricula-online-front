export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  const payload = {
    nome: body.nome,
    cpf: body.cpf.replace(/\D/g, ""),
    dataNascimento: body.dataNascimento.slice(0, 10),
    responsavelNome: body.responsavelNome,
    naoFrequentando: body.naoFrequentando,
    email: body.email || undefined,
    telefone1: body.telefone1,
    telefone2: body.telefone2,
  };

  if (body.enderecoId != null) {
    payload.endereco = { id: body.enderecoId };
  }

  const response = await fetch(`${config.public.baseURL}/alunos`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw createError({
      statusCode: response.status,
      statusMessage: data?.message || "Erro ao salvar pessoa",
      data,
    });
  }

  return data;
});