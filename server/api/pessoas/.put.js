export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body.id;
  const config = useRuntimeConfig();

  const normalizeString = (value) => {
    if (value === undefined || value === null) return undefined;
    const normalized = String(value).trim();
    return normalized.length ? normalized : undefined;
  };

  const payload = {
    nome: normalizeString(body.nome),
    cpf: normalizeString(body.cpfCnpj)?.replace(/\D/g, ""),
    dataNascimento: normalizeString(body.dataNascimento)?.slice(0, 10),
    responsavelNome: normalizeString(body.responsavelNome) || "",
  };

  const email = normalizeString(body.email)?.toLowerCase();
  const telefone1 = normalizeString(body.telefone1);
  const telefone2 = normalizeString(body.telefone2);

  if (email) payload.email = email;
  if (telefone1) payload.telefone1 = telefone1;
  if (telefone2) payload.telefone2 = telefone2;

  const response = await fetch(`${config.public.baseURL}/alunos/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
    headers: { "Content-type": "application/json" },
  });

  const data = await response.json();
  return data;
});
