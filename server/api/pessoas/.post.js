export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();

  console.log("body", body);

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

  const response = await fetch(`${config.public.baseURL}/alunos`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  return data;
});
