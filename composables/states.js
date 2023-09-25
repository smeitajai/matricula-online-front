export const useAluno = () =>
  useState("aluno", () => {
    return {};
  });

export const useEtapa = () =>
  useState("etapa", () => {
    return {};
  });

export const useTurno = () =>
  useState("turno", () => {
    return {};
  });

export const useClearState = () => {
  return clearNuxtState(["aluno", "etapa", "turno"]);
};
