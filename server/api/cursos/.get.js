export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(`${config.public.baseURL}/cursos`);
    const data = await response.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
});
