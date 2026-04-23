export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  const config = useRuntimeConfig();

  const payload = {
    nome: body.nome,
    cpf: body.cpfCnpj.replace(/\D/g, ""),
    dataNascimento: body.dataNascimento.slice(0, 10),
    responsavelNome: body.responsavelNome,
    naoFrequentando: body.naoFrequentando,
    email: body.email,
    telefone1: body.telefone1,
    telefone2: body.telefone2,
  };

  const response = await fetch(`${config.public.baseURL}/alunos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  return data;
});
