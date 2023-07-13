export const useGET = (route, query = {}) => {
  const config = useRuntimeConfig();

  return useFetch(route, {
    baseURL: config.public.baseURL,
    method: "GET",
    query,
  });
};

export const usePOST = (route, body) => {
  const config = useRuntimeConfig();

  return useFetch(route, {
    baseURL: config.public.baseURL,
    method: "POST",
    body,
  });
};

export const usePUT = (route, body) => {
  const config = useRuntimeConfig();

  return useFetch(route, {
    baseURL: config.public.baseURL,
    method: "PUT",
    body,
  });
};

export const useDELETE = (route) => {
  const config = useRuntimeConfig();

  return useFetch(route, {
    baseURL: config.public.baseURL,
    method: "DELETE",
  });
};
