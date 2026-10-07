import { apiFetch } from "../../../shared/api/apiGet";

async function apiText(ruta: string) {
  const respuesta = await apiFetch(ruta, {
    signal: AbortSignal.timeout(20000),
    headers: { },
  });
  if (!respuesta.ok) {
    if (respuesta.status === 401)
      throw new Error(
        "La sesión venció o no es válida. Volvé a iniciar sesión.",
      );
    if (respuesta.status === 403)
      throw new Error("No tenés permiso para exportar esta organización.");
    throw new Error(`El servidor respondió con el estado ${respuesta.status}.`);
  }
  return { contenido: await respuesta.text() };
}
async function apiControlesMarkdown(ruta: string) {
  const respuesta = await apiFetch(ruta, {
    headers: { },
  });
  if (!respuesta.ok) throw new Error(`Error ${respuesta.status}`);
  const controles = (await respuesta.json()) as Array<{
    controlId: string;
    tema: string;
    evaluacion?: { aplica?: boolean | null; estado?: string };
  }>;
  const filas = controles
    .map(
      (control) =>
        `| ${control.controlId} | ${control.tema} | ${control.evaluacion?.aplica == null ? "Pendiente" : control.evaluacion.aplica ? "Sí" : "No"} | ${control.evaluacion?.estado ?? "Sin evaluación"} |`,
    )
    .join("\n");
  return {
    contenido: `# Controles SOA\n\n| Control | Tema | Aplica | Estado |\n|---|---|---|---|\n${filas}`,
  };
}
export function exportarInventario(id: string) {
  return apiText(
    `/api/v1/exportaciones/organizaciones/${id}/inventario-activos`,
  );
}
export function exportarPolitica(id: string) {
  return apiText(
    `/api/v1/exportaciones/organizaciones/${id}/politica-seguridad`,
  );
}
export function exportarControlesSoa(id: string) {
  return apiControlesMarkdown(
    `/api/v1/exportaciones/organizaciones/${id}/soa/controles`,
  );
}
export function exportarSoa(id: string) {
  return apiText(`/api/v1/exportaciones/organizaciones/${id}/soa`);
}
export function exportarBrechas(id: string) {
  return apiText(`/api/v1/exportaciones/organizaciones/${id}/mcu`);
}

export function exportarReporteMcu(id: string) {
  return apiText(`/api/v1/exportaciones/organizaciones/${id}/mcu-funciones`);
}

export function exportarBcu(id: string) {
  return apiText(`/api/v1/exportaciones/organizaciones/${id}/bcu-gsi`);
}

export function exportarCobit(id: string) {
  return apiText(`/api/v1/exportaciones/organizaciones/${id}/cobit`);
}
