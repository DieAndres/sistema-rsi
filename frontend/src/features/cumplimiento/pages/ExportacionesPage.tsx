import { EvaluacionCobitPanel } from "./EvaluacionCobitPanel";
import { EvaluacionBcuPanel } from "./EvaluacionBcuPanel";
import { EvaluacionMcuPanel } from "./EvaluacionMcuPanel";
import { EvaluacionSoaPanel } from "./EvaluacionSoaPage";
import { DatosPanel } from "./DatosPanel";
import { PageHeader } from "../../../shared/PageHeader";
import { useEffect, useState } from "react";
import { listarOrganizaciones } from "../../organizacion/api/organizacionApi";
import type { Organizacion } from "../../organizacion/types/organizacion";
import {
  exportarControlesSoa,
  exportarInventario,
  exportarPolitica,
  exportarReporteMcu,
  exportarBcu,
  exportarCobit,
  exportarSoa,
} from "../api/exportacionesApi";
import "../cumplimiento.css";
function descargar(nombre: string, contenido: string, tipo: string) {
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(enlace.href);
}

function vistaPrevia(contenido: string) {
  const lineas = contenido.split("\n");
  const elementos = [];
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    if (linea.startsWith("|") && !linea.startsWith("|---")) {
      const filas = [];
      while (i < lineas.length && lineas[i].startsWith("|")) {
        if (!lineas[i].startsWith("|---"))
          filas.push(
            lineas[i]
              .split("|")
              .filter(Boolean)
              .map((celda) => celda.trim()),
          );
        i++;
      }
      i--;
      elementos.push(
        <div className="tabla-exportacion" key={i}>
          <table>
            <thead>
              <tr>
                {filas[0]?.map((celda, j) => (
                  <th key={j}>{celda}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.slice(1).map((fila, j) => (
                <tr key={j}>
                  {fila.map((celda, k) => (
                    <td key={k}>{celda}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
    } else if (linea.startsWith("# "))
      elementos.push(<h2 key={i}>{linea.slice(2)}</h2>);
    else if (linea.startsWith("## "))
      elementos.push(<h3 key={i}>{linea.slice(3)}</h3>);
    else if (linea.trim()) elementos.push(<p key={i}>{linea}</p>);
  }
  return elementos;
}

export function ExportacionesPage() {
  const [orgs, setOrgs] = useState<Organizacion[]>([]);
  const [orgId, setOrgId] = useState("");
  const [resultado, setResultado] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [vistaSoa, setVistaSoa] = useState<"controles" | "informe" | null>(
    null,
  );
  const [reporteCobit, setReporteCobit] = useState(false);
  const [reporteBcu, setReporteBcu] = useState(false);
  const [reporteMcu, setReporteMcu] = useState(false);
  const [evaluando, setEvaluando] = useState(false);
  useEffect(() => {
    void listarOrganizaciones(new AbortController().signal)
      .then((o) => {
        setOrgs(o);
        setOrgId(o[0]?.id ?? "");
      })
      .catch(() => setError("No se pudieron cargar las organizaciones."));
  }, []);
  async function ejecutar(
    nombre: string,
    accion: () => Promise<{ contenido: string }>,
    vista: "controles" | "informe" | null = null,
    esMcu = false,
    esBcu = false,
    esCobit = false,
  ) {
    setReporteCobit(esCobit);
    setReporteBcu(esBcu);
    setReporteMcu(esMcu);
    setCargando(true);
    setError("");
    setEvaluando(false);
    setVistaSoa(vista);
    setResultado("");
    try {
      setResultado((await accion()).contenido);
      setVistaSoa(vista);
    } catch (error) {
      const detalle =
        error instanceof Error && error.name === "TimeoutError"
          ? "El servidor tardó demasiado en responder."
          : error instanceof TypeError
            ? "No se pudo conectar con el backend."
            : error instanceof Error
              ? error.message
              : "Error desconocido.";
      setError(`No se pudo generar ${nombre}. ${detalle}`);
    } finally {
      setCargando(false);
    }
  }
  const descargarCsv = () => {
    const filas = resultado
      .split("\n")
      .filter((linea) => linea.startsWith("|") && !linea.startsWith("|---"))
      .map((linea) =>
        linea
          .split("|")
          .filter(Boolean)
          .map((celda) => `"${celda.trim().replaceAll('"', '""')}"`)
          .join(","),
      );
    if (filas.length)
      descargar(
        vistaSoa ? "soa.csv" : "informe-rsi.csv",
        filas.join("\n"),
        "text/csv;charset=utf-8",
      );
  };
  return (
    <div className="aplicacion">
      <main className="contenido">
        <PageHeader
          categoria="CUMPLIMIENTO"
          titulo="Exportaciones"
          descripcion="Consultá y descargá los informes de la organización seleccionada."
        >
          <label className="selector-organizacion">
            <span>Organización</span>
            <select
              disabled={cargando}
              value={orgId}
              onChange={(e) => {
                setReporteCobit(false);
                setReporteBcu(false);
                setReporteMcu(false);
                setOrgId(e.target.value);
                setResultado("");
                setError("");
                setVistaSoa(null);
                setEvaluando(false);
              }}
            >
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre}
                </option>
              ))}
            </select>
          </label>
        </PageHeader>
        <DatosPanel organizacionId={orgId} />
        {error && (
          <p className="mensaje mensaje-error" role="alert">
            {error}
          </p>
        )}
        <section
          className="panel-estructura"
          aria-labelledby="exportaciones-iso"
        >
          <h2 id="exportaciones-iso">ISO 27001</h2>
          <p>
            Inventario y declaración de aplicabilidad de los controles de la
            organización.
          </p>
          <div className="exportaciones-grid documentos-iso">
            <button
              type="button"
              disabled={cargando || !orgId}
              onClick={() =>
                void ejecutar("el inventario de activos", () =>
                  exportarInventario(orgId),
                )
              }
            >
              Inventario de activos
            </button>
            <button
              type="button"
              disabled={cargando || !orgId}
              onClick={() =>
                void ejecutar("la política de seguridad", () =>
                  exportarPolitica(orgId),
                )
              }
            >
              <span>Política de seguridad</span>
              <small>
                Contenido registrado, responsable, versión y revisión
              </small>
            </button>
            <button
              type="button"
              disabled={cargando || !orgId}
              onClick={() =>
                void ejecutar(
                  "los controles SoA",
                  () => exportarControlesSoa(orgId),
                  "controles",
                )
              }
            >
              <span>Declaración de aplicabilidad (SoA)</span>
              <small>Evaluar controles y consultar el informe completo</small>
            </button>
          </div>
        </section>
        <section
          className="panel-estructura"
          aria-labelledby="exportaciones-mcu"
        >
          <h2 id="exportaciones-mcu">MCU 5.0</h2>
          <p>
            Evaluación de controles y evidencias por función para el perfil
            Avanzado.
          </p>
          <div className="exportaciones-grid documentos-iso">
            <button
              type="button"
              disabled={cargando || !orgId}
              onClick={() =>
                void ejecutar(
                  "el reporte MCU por funciones",
                  () => exportarReporteMcu(orgId),
                  null,
                  true,
                )
              }
            >
              Reporte por funciones — perfil Avanzado
            </button>
          </div>
        </section>
        <section
          className="panel-estructura"
          aria-labelledby="exportaciones-bcu"
        >
          <h2 id="exportaciones-bcu">BCU (GSI)</h2>
          <p>Evaluación de los 18 requerimientos de la síntesis del curso.</p>
          <div className="exportaciones-grid documentos-iso">
            <button
              type="button"
              disabled={cargando || !orgId}
              onClick={() =>
                void ejecutar(
                  "el informe BCU",
                  () => exportarBcu(orgId),
                  null,
                  false,
                  true,
                )
              }
            >
              Informe de requerimientos mínimos
            </button>
          </div>
        </section>
        <section
          className="panel-estructura"
          aria-labelledby="exportaciones-cobit"
        >
          <h2 id="exportaciones-cobit">COBIT 2019</h2>
          <p>
            Alineación de procesos con objetivos COBIT, evaluaciones e
            indicadores registrados.
          </p>
          <div className="exportaciones-grid documentos-iso">
            <button
              type="button"
              disabled={cargando || !orgId}
              onClick={() =>
                void ejecutar(
                  "el informe COBIT",
                  () => exportarCobit(orgId),
                  null,
                  false,
                  false,
                  true,
                )
              }
            >
              Alineación y evaluación de procesos
            </button>
          </div>
        </section>
        <section
          className="panel-estructura"
          aria-labelledby="exportaciones-urcdp"
        >
          <h2 id="exportaciones-urcdp">URCDP (Ley 18.331)</h2>
          <div className="exportaciones-grid documentos-iso">
            <button type="button" disabled>
              Notificación de brechas
            </button>
          </div>
        </section>
        <section
          className="panel-estructura"
          aria-label="Vista previa del informe"
        >
          {vistaSoa && (
            <div className="soa-encabezado">
              <div>
                <span className="soa-marco">ISO 27001 · SoA</span>
                <h2>Declaración de aplicabilidad</h2>
                <p>
                  Un mismo conjunto de evaluaciones, dos formas de consultarlo.
                </p>
              </div>
              <span className="soa-organizacion">
                {orgs.find((o) => o.id === orgId)?.nombre}
              </span>
            </div>
          )}
          {vistaSoa && (
            <div
              className="soa-vistas"
              role="group"
              aria-label="Vista de la declaración de aplicabilidad"
            >
              <button
                type="button"
                aria-pressed={vistaSoa === "controles"}
                disabled={cargando}
                onClick={() =>
                  void ejecutar(
                    "los controles SoA",
                    () => exportarControlesSoa(orgId),
                    "controles",
                  )
                }
              >
                <strong>Listado de controles</strong>
                <span>Aplicabilidad y estado de cada control</span>
              </button>
              <button
                type="button"
                aria-pressed={vistaSoa === "informe"}
                disabled={cargando}
                onClick={() =>
                  void ejecutar(
                    "la declaración SoA",
                    () => exportarSoa(orgId),
                    "informe",
                  )
                }
              >
                <strong>Informe completo</strong>
                <span>Alcance, justificaciones, evidencias y planes</span>
              </button>
            </div>
          )}
          {cargando && (
            <p className="mensaje" role="status">
              Generando consulta…
            </p>
          )}
          {resultado && (
            <>
              <div className="acciones-exportacion">
                <button
                  type="button"
                  onClick={() =>
                    descargar(
                      vistaSoa ? "soa.md" : "informe-rsi.md",
                      resultado,
                      "text/markdown;charset=utf-8",
                    )
                  }
                >
                  Descargar Markdown
                </button>
                <button type="button" onClick={() => window.print()}>
                  Guardar como PDF
                </button>
                <button type="button" onClick={descargarCsv}>
                  Descargar CSV
                </button>
                {(vistaSoa || reporteMcu || reporteBcu || reporteCobit) && (
                  <button
                    type="button"
                    aria-expanded={evaluando}
                    aria-controls="evaluacion-soa"
                    onClick={() => setEvaluando(!evaluando)}
                  >
                    {evaluando
                      ? "Cerrar evaluación"
                      : reporteCobit
                        ? "Completar evaluación COBIT"
                        : reporteBcu
                          ? "Completar evaluación BCU"
                          : reporteMcu
                            ? "Completar evaluación MCU"
                            : "Completar evaluación SoA"}
                  </button>
                )}
              </div>
              {reporteCobit && evaluando && (
                <div id="evaluacion-soa">
                  <EvaluacionCobitPanel
                    key={orgId}
                    organizacionId={orgId}
                    alGuardar={() =>
                      void ejecutar(
                        "el informe COBIT",
                        () => exportarCobit(orgId),
                        null,
                        false,
                        false,
                        true,
                      )
                    }
                  />
                </div>
              )}
              {reporteBcu && evaluando && (
                <div id="evaluacion-soa">
                  <EvaluacionBcuPanel
                    key={orgId}
                    organizacionId={orgId}
                    alGuardar={() =>
                      void ejecutar(
                        "el informe BCU",
                        () => exportarBcu(orgId),
                        null,
                        false,
                        true,
                      )
                    }
                  />
                </div>
              )}
              {reporteMcu && evaluando && (
                <div id="evaluacion-soa">
                  <EvaluacionMcuPanel
                    key={orgId}
                    organizacionId={orgId}
                    alGuardar={() =>
                      void ejecutar(
                        "el reporte MCU por funciones",
                        () => exportarReporteMcu(orgId),
                        null,
                        true,
                      )
                    }
                  />
                </div>
              )}
              {vistaSoa && evaluando && (
                <div id="evaluacion-soa">
                  <EvaluacionSoaPanel
                    key={orgId}
                    organizacionId={orgId}
                    alGuardar={() =>
                      void ejecutar(
                        "la evaluación SoA",
                        () =>
                          vistaSoa === "informe"
                            ? exportarSoa(orgId)
                            : exportarControlesSoa(orgId),
                        vistaSoa,
                      )
                    }
                  />
                </div>
              )}
              <article className="vista-previa-exportacion">
                {vistaPrevia(resultado)}
              </article>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
