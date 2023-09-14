export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  const notAuthPages = ['index', 'login', 'cadastro', 'cadastro-vagas','protocolo', 'ajuda'];
  const isAllowedPage = notAuthPages.includes(to.name as string);

  if (!isAllowedPage && !user.value)
    return abortNavigation("Acesso Negado! Você precisa estar logado para acessar este recurso.");
});