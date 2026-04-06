export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  const notAuthPages = [
    "index",
    "login",
    "cadastro",
    "cadastro-solicitacao-efetivada",
    "cadastro-vagas",
    "protocolo",
    "ajuda",
    "consulta",
  ];
  const isAllowedPage = notAuthPages.includes(to.name as string);

  if (!isAllowedPage && !user.value)
    return abortNavigation(
      "Acesso Negado! Você precisa estar logado para acessar este recurso.",
    );
});
