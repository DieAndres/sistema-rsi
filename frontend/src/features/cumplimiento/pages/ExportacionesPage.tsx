import { EvaluacionCobitPanel } from "./EvaluacionCobitPanel";
import { EvaluacionBcuPanel } from "./EvaluacionBcuPanel";
import { EvaluacionMcuPanel } from "./EvaluacionMcuPanel";
import { EvaluacionSoaPanel } from "./EvaluacionSoaPage";
import { DatosPanel } from "./DatosPanel";
import { UrcdpPanel } from "./UrcdpPanel";
import { obtenerUsuarioActual } from "../../../shared/api/apiGet";
import { PageHeader } from "../../../shared/PageHeader";
import { Icono } from "../../../shared/Icono";
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
import "../exportaciones.css";
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
  const [documento, setDocumento] = useState("");
  const perfilMcu = orgs.find((o) => o.id === orgId)?.perfilMcu ?? "Avanzado";
  const puedeUrcdp = ['ADMINISTRADOR', 'RSI'].includes(obtenerUsuarioActual()?.rol ?? '');
  const [tipoUrcdp, setTipoUrcdp] = useState<'registro' | 'medidas' | 'brecha' | null>(null);
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
    setDocumento(nombre.replace(/^el |^la |^los /, ""));
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
    <div className="aplicacion exportaciones-pagina">
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
                setDocumento("");
                setTipoUrcdp(null);
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
        {error && (
          <p className="mensaje mensaje-error" role="alert">
            {error}
          </p>
        )}
        <section className="exportaciones-catalogo" aria-labelledby="catalogo-titulo">
          <div className="exportaciones-seccion-titulo">
            <div><span className="exportaciones-etiqueta">BIBLIOTECA DE INFORMES</span><h2 id="catalogo-titulo">Documentos y evaluaciones</h2><p>Elegí un documento para consultar su contenido y preparar la descarga.</p></div>
            <span className="exportaciones-contador">{puedeUrcdp ? 9 : 6} documentos disponibles</span>
          </div>
          <div className="exportaciones-documentos">
            {[
              { marco: "ISO 27001", titulo: "Inventario de activos", descripcion: "Activos registrados y su clasificación dentro de la organización.", icono: "activos", nombre: "el inventario de activos", accion: () => exportarInventario(orgId) },
              { marco: "ISO 27001", titulo: "Política de seguridad", descripcion: "Contenido registrado, responsable, versión y fecha de revisión.", icono: "politicas", nombre: "la política de seguridad", accion: () => exportarPolitica(orgId) },
              { marco: "ISO 27001 · SoA", titulo: "Declaración de aplicabilidad", descripcion: "Controles, justificaciones, evidencias y planes de tratamiento.", icono: "soa", nombre: "los controles SoA", accion: () => exportarControlesSoa(orgId), vista: "controles" as const, evaluacion: true },
              { marco: "MCU 5.0", titulo: "Reporte por funciones", descripcion: `Perfil ${perfilMcu}. Controles de la línea base oficial de AGESIC.`, icono: "mfa", nombre: "el reporte MCU por funciones", accion: () => exportarReporteMcu(orgId), mcu: true, evaluacion: true },
              { marco: "BCU · GSI", titulo: "Requerimientos mínimos", descripcion: "Evaluación de los 18 requerimientos de la síntesis del curso.", icono: "auditoria", nombre: "el informe BCU", accion: () => exportarBcu(orgId), bcu: true, evaluacion: true },
              { marco: "COBIT 2019", titulo: "Alineación de procesos", descripcion: "Objetivos, evaluaciones e indicadores de los procesos registrados.", icono: "procesos", nombre: "el informe COBIT", accion: () => exportarCobit(orgId), cobit: true, evaluacion: true },
            ].map((item) => (
              <button className="exportaciones-documento" key={item.titulo} type="button"
                disabled={cargando || !orgId} aria-pressed={documento === item.nombre.replace(/^el |^la |^los /, "")}
                onClick={() => { setTipoUrcdp(null); void ejecutar(item.nombre, item.accion, item.vista ?? null, item.mcu, item.bcu, item.cobit); }}>
                <span className="exportaciones-documento-top"><span className="exportaciones-icono"><Icono nombre={item.icono} /></span><span className="exportaciones-etiqueta">{item.marco}</span></span>
                <strong>{item.titulo}</strong><span className="exportaciones-documento-descripcion">{item.descripcion}</span>
                <span className="exportaciones-documento-pie"><span>{item.evaluacion ? "Informe y evaluación" : "Documento"}</span><span>Consultar <span aria-hidden="true">↗</span></span></span>
              </button>
            ))}
          </div>
          {puedeUrcdp && <>
            <div className="exportaciones-seccion-titulo urcdp-catalogo-titulo"><div><span className="exportaciones-etiqueta">URCDP · LEY 18.331</span><h2>Protección de datos personales</h2><p>Elegí qué necesitás documentar. El registro y las medidas de seguridad comparten los datos de la misma base.</p></div></div>
            <div className="exportaciones-documentos">{([
              { tipo: 'registro', titulo: 'Registrar una base de datos', descripcion: 'Documentá qué datos guardás, de quiénes y para qué. Por ejemplo: clientes o empleados.', icono: 'organizaciones' },
              { tipo: 'medidas', titulo: 'Documentar la seguridad', descripcion: 'Describí cómo protegés una base: accesos, respaldos y otras medidas.', icono: 'mfa' },
              { tipo: 'brecha', titulo: 'Informar una brecha', descripcion: 'Prepará la comunicación de un incidente que afectó datos personales y su informe de cierre.', icono: 'incidentes' },
            ] as const).map((item) => <button key={item.tipo} type="button" className="exportaciones-documento" disabled={cargando || !orgId} aria-pressed={tipoUrcdp === item.tipo} onClick={() => { setTipoUrcdp(item.tipo); setResultado(''); setDocumento(''); setVistaSoa(null); setEvaluando(false); setReporteMcu(false); setReporteBcu(false); setReporteCobit(false); setError(''); }}><span className="exportaciones-documento-top"><span className="exportaciones-icono"><Icono nombre={item.icono} /></span><span className="exportaciones-etiqueta">URCDP</span></span><strong>{item.titulo}</strong><span className="exportaciones-documento-descripcion">{item.descripcion}</span><span className="exportaciones-documento-pie"><span>Ficha y documento</span><span>Preparar ↗</span></span></button>)}</div>
          </>}
          {!orgId && !error && <p className="mensaje" role="status">No hay organizaciones disponibles. Registrá una organización para consultar sus documentos.</p>}
        </section>
        {tipoUrcdp && puedeUrcdp && <UrcdpPanel key={`urcdp-${orgId}`} organizacionId={orgId} tipo={tipoUrcdp} ocupado={cargando} alCambiar={() => { setResultado(''); setDocumento(''); }} alExportar={(nombre, accion) => void ejecutar(nombre, accion)} />}
        <section
          className="panel-estructura exportaciones-preview"
          aria-label="Vista previa del informe"
        >
          <div className="exportaciones-seccion-titulo">
            <div><span className="exportaciones-etiqueta">VISTA PREVIA</span><h2>{documento ? documento.charAt(0).toUpperCase() + documento.slice(1) : "Tu próximo informe empieza aquí"}</h2><p>{documento ? orgs.find((o) => o.id === orgId)?.nombre : "Seleccioná un documento del catálogo para revisar el informe antes de exportarlo."}</p></div>
            {resultado && <span className="exportaciones-estado">Consulta generada</span>}
          </div>
          {!documento && <div className="exportaciones-vacio"><span className="exportaciones-icono"><Icono nombre="exportaciones" /></span><strong>Consultá, evaluá y descargá</strong><p>Revisá el contenido, completá las evaluaciones disponibles y elegí el formato de salida.</p><span>Markdown · PDF · CSV</span></div>}
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
              <div className="acciones-exportacion exportaciones-toolbar">
                <button
                  type="button" className="boton-principal"
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
                <button type="button" disabled={!resultado.split("\n").some((linea) => linea.startsWith("|"))} onClick={descargarCsv}>
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
                  <EvaluacionMcuPanel perfilMcu={perfilMcu}
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
        <DatosPanel key={`datos-${orgId}`} organizacionId={orgId} />
      </main>
    </div>
  );
}
