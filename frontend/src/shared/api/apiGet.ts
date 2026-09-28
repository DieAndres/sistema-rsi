export async function apiGet<T>(ruta: string, signal: AbortSignal): Promise<T> {
  const respuesta = await fetch(ruta, { signal })

  if (!respuesta.ok) {
    throw new Error(`La API respondió con el estado ${respuesta.status}.`)
  }

  return respuesta.json() as Promise<T>
}
