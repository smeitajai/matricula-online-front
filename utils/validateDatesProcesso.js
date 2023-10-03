export default function validateDatesProcesso(etapaProcesso) {
  if (etapaProcesso.faseInicialDataInicio > etapaProcesso.faseInicialDataFim)
    return false;

  if (etapaProcesso.faseInicialDataFim > etapaProcesso.faseFinalDataInicio)
    return false;

  if (etapaProcesso.faseFinalDataInicio > etapaProcesso.faseFinalDataFim)
    return false;

  return true;
}
