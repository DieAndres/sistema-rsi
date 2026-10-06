import { useEffect, useState } from "react";
import { apiRequest } from "../../organizacion/api/organizacionApi";
import { notificarGuardado } from "../../../shared/notificar";

type Evaluacion = {
  procesoId: string;
  controlId: string;
  evaluacion: string | null;
  evidencia: string | null;
  indicador: string | null;
};
type Datos = {
  procesos: { id: string; nombre: string }[];
  evaluaciones: Evaluacion[];
};

export function EvaluacionCobitPanel({
  organizacionId,
  alGuardar,
}: {
  organizacionId: string;
  alGuardar: () => void;
}) {
  const [datos, setDatos] = useState<Datos | null>(null);
  const [procesoId, setProcesoId] = useState("");
  const [controlId, setControlId] = useState("");
  const [evaluacion, setEvaluacion] = useState("");
  const [evidencia, setEvidencia] = useState("");
  const [indicador, setIndicador] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const ruta = `/api/v1/exportaciones/organizaciones/${organizacionId}/cobit-procesos`;
  useEffect(() => {
    const abortador = new AbortController();
    void apiRequest<Datos>(ruta, { method: "GET", signal: abortador.signal })
      .then(setDatos)
      .catch(() => {
        if (!abortador.signal.aborted)
          setError("No se pudieron cargar los procesos COBIT.");
      });
    return () => abortador.abort();
  }, [ruta]);
  useEffect(() => {
    const anterior = datos?.evaluaciones.find(
      (e) => e.procesoId === procesoId && e.controlId === controlId,
    );
    setEvaluacion(anterior?.evaluacion ?? "");
    setEvidencia(anterior?.evidencia ?? "");
    setIndicador(anterior?.indicador ?? "");
  }, [datos, procesoId, controlId]);
  async function guardar(evento: React.FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    setError("");
    try {
      await apiRequest(`${ruta}/${controlId}`, {
        method: "PUT",
        body: JSON.stringify({ procesoId, evaluacion, evidencia, indicador }),
      });
      notificarGuardado();
      alGuardar();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo confirmar el guardado. Consultá el informe antes de reintentar.",
      );
    } finally {
      setGuardando(false);
    }
  }
  return (
    <section className="panel-estructura" aria-label="Evaluación COBIT">
      <h3>Vincular y evaluar procesos COBIT</h3>
      <p>
        Seleccioná el proceso y el área COBIT. Si la relación ya existe, se
        cargarán sus datos para editarla. Un proceso puede tener varias áreas.
      </p>
      {error && (
        <p className="mensaje mensaje-error" role="alert">
          {error}
        </p>
      )}
      {!datos ? (
        <p>Cargando datos…</p>
      ) : !datos.procesos.length ? (
        <p>
          Primero registrá un proceso para esta organización en el módulo
          Procesos.
        </p>
      ) : (
        <form className="formulario-cumplimiento" onSubmit={guardar}>
          <label>
            Proceso
            <select
              required
              disabled={guardando}
              value={procesoId}
              onChange={(e) => setProcesoId(e.target.value)}
            >
              <option value="">Seleccionar proceso</option>
              {datos.procesos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Área COBIT
            <select
              required
              disabled={guardando}
              value={controlId}
              onChange={(e) => setControlId(e.target.value)}
            >
              <option value="">Seleccionar área</option>
              {["EDM", "APO", "BAI", "DSS", "MEA"].map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </label>
          <label className="campo-ancho">
            Evaluación y justificación
            <textarea
              disabled={guardando}
              maxLength={10000}
              value={evaluacion}
              onChange={(e) => setEvaluacion(e.target.value)}
            />
          </label>
          <label className="campo-ancho">
            Evidencia de la organización
            <textarea
              disabled={guardando}
              maxLength={10000}
              value={evidencia}
              onChange={(e) => setEvidencia(e.target.value)}
            />
          </label>
          <label className="campo-ancho">
            Indicador y resultado observado
            <textarea
              disabled={guardando}
              maxLength={10000}
              value={indicador}
              onChange={(e) => setIndicador(e.target.value)}
              placeholder="Ejemplo: tiempo de resolución; resultado del período y fuente."
            />
          </label>
          <p className="campo-ancho">
            Los campos vacíos aparecerán como pendientes. El sistema no calcula
            automáticamente madurez ni cumplimiento.
          </p>
          <button
            type="submit"
            disabled={guardando || !procesoId || !controlId}
          >
            {guardando ? "Guardando…" : "Guardar evaluación COBIT"}
          </button>
        </form>
      )}
    </section>
  );
}
