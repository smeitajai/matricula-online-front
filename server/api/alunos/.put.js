export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;

  if (body.sincronizacaoErudio) {
    const alunoDTO = {
      nome: body.nome,
      cpf: body.cpf,
      email: body.email,
      dataNascimento: body.dataNascimento,
      telefone1: body.telefone1,
      telefone2: body.telefone2,
      responsavelNome: body.responsavelNome,
    };

    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.baseURL}/alunos/${id}`, {
      method: "PUT",
      body: JSON.stringify(alunoDTO),
      headers: { "Content-type": "application/json" },
    });

    const data = await response.json();
    return data;
  }

  delete body.id;
  const config = useRuntimeConfig();
  
  const response = await fetch(`${config.public.baseURL}/alunos/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  return data;
});
