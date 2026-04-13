export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  
  if (body.sincronizacaoErudio) {
    const syncResponse = await fetch(
      `${config.public.baseURL}/erudio/alunos/sincronizar`,
      {
        method: "POST",
        body: JSON.stringify(body.sincronizacaoErudio),
        headers: { "Content-type": "application/json" },
      },
    );

    const syncData = await syncResponse.json();

    if (!syncResponse.ok || syncData?.statusCode || syncData?.error) {
      return syncData;
    }

    delete body.sincronizacaoErudio;
  }

  const payload = {
    nome: body.nome,
    cpf: body.cpf.replace(/\D/g, ""),
    dataNascimento: body.dataNascimento.slice(0, 10),
    responsavelNome: body.responsavelNome,
    naoFrequentando: body.naoFrequentando,
    email: body.email||undefined,
    telefone1: body.telefone1,
    telefone2: body.telefone2,
  };

  const response = await fetch(`${config.public.baseURL}/alunos`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  return data;
});
