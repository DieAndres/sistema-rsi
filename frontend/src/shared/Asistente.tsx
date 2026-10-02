import { Children, isValidElement, cloneElement, useEffect, useId, useRef, useState, type ReactNode, type SubmitEvent, type ReactElement, type FormHTMLAttributes } from 'react'
import { obtenerUsuarioActual } from './api/apiGet'

type Props = { abierto: boolean; titulo: string; error?: string; alCerrar: () => void; children: ReactElement<FormHTMLAttributes<HTMLFormElement>> }

function camposEtiquetados(nodo: ReactNode): ReactNode {
  return Children.map(nodo, hijo => {
    if (!isValidElement<{ children?: ReactNode; required?: boolean }>(hijo)) return hijo
    const contenido = Children.toArray(hijo.props.children)
    if (hijo.type === 'label') {
      const indice = contenido.findIndex(c => isValidElement(c) && ['input', 'select', 'textarea'].includes(String(c.type)))
      if (indice > 0) {
        return cloneElement(hijo, {}, <><span className="campo-etiqueta">{contenido.slice(0, indice)}</span>{contenido.slice(indice)}</>)
      }
    }
    return contenido.length ? cloneElement(hijo, {}, camposEtiquetados(hijo.props.children)) : hijo
  })
}

function campos(form: HTMLFormElement) {
  const lista = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')).filter(c => c.type !== 'hidden').map(c => {
    const label = c.closest('label')
    const nombre = c.getAttribute('aria-label') || (label ? Array.from(label.childNodes).filter(n => n.nodeType === Node.TEXT_NODE || (n instanceof HTMLElement && n.tagName === 'SPAN')).map(n => n.textContent).join(' ').trim() : '') || c.getAttribute('placeholder') || 'Campo'
    const valor = c instanceof HTMLSelectElement ? Array.from(c.selectedOptions).map(o => o.textContent).join(', ') : c instanceof HTMLInputElement && c.type === 'checkbox' ? c.checked ? 'Sí' : 'No' : c.type === 'password' ? c.value ? '••••••••' : '' : c.value
    return { nombre, valor: valor || 'Sin completar' }
  })
  const procesos = form.querySelector('.selector-procesos-lista:last-child')
  if (procesos) lista.push({ nombre: 'Procesos relacionados', valor: Array.from(procesos.querySelectorAll('button')).map(b => b.textContent).join(', ') || 'Sin procesos asociados' })
  return lista
}

function firma(form: HTMLFormElement) {
  return JSON.stringify([Array.from(form.querySelectorAll<HTMLInputElement>('input, select, textarea')).map(c => [c.value, c.checked]), campos(form)])
}

export function Asistente(props: Props) {
  if (obtenerUsuarioActual()?.rol === 'LECTOR') return null
  return props.abierto ? <AsistenteAbierto {...props} /> : null
}

function AsistenteAbierto({ titulo, error, alCerrar, children }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const formulario = useRef<HTMLFormElement>(null)
  const inicial = useRef('')
  const id = useId()
  const [paso, setPaso] = useState(0)
  const [resumen, setResumen] = useState<ReturnType<typeof campos>>([])
  const [ocupado, setOcupado] = useState(false)
  const [fallo, setFallo] = useState('')
  useEffect(() => {
    const dialog = dialogo.current!
    const anterior = document.body.style.overflow
    const focoAnterior = document.activeElement
    inicial.current = firma(formulario.current!)
    dialog.showModal()
    formulario.current?.querySelector<HTMLElement>('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')?.focus()
    document.body.style.overflow = 'hidden'
    return () => { dialog.close(); document.body.style.overflow = anterior; if (focoAnterior instanceof HTMLElement) focoAnterior.focus() }
  }, [])
  useEffect(() => {
    if (paso === 1) dialogo.current?.querySelector<HTMLElement>('.asistente-cuerpo section h3')?.focus()
  }, [paso])

  function cerrar() {
    if (ocupado) return
    if (firma(formulario.current!) !== inicial.current && !window.confirm('¿Descartar los cambios sin guardar?')) return
    alCerrar()
  }

  async function enviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (ocupado) return
    if (!paso) { setResumen(campos(evento.currentTarget)); setPaso(1); return }
    setOcupado(true)
    setFallo('')
    try { await children.props.onSubmit?.(evento) }
    catch { setFallo('No se pudo guardar. Revisá los datos e intentá nuevamente.') }
    finally { setOcupado(false) }
  }

  return <dialog ref={dialogo} className="asistente-dialogo" aria-labelledby={`${id}-titulo`} onCancel={e => { e.preventDefault(); cerrar() }}>
    <header className="asistente-encabezado"><div><p className="sobretitulo">ASISTENTE DE GESTIÓN</p><h2 id={`${id}-titulo`}>{titulo}</h2></div><button type="button" aria-label="Cerrar asistente" disabled={ocupado} onClick={cerrar}>✕</button></header>
    <ol className="asistente-pasos"><li aria-current={!paso ? 'step' : undefined}>1. Completar datos</li><li aria-current={paso ? 'step' : undefined}>2. Revisar y guardar</li></ol>
    <div className="asistente-cuerpo">
      {(error || fallo) && <p role="alert" className="mensaje mensaje-error">{error || fallo}</p>}
      <fieldset className="asistente-campos" disabled={ocupado} hidden={paso === 1}><p className="formulario-convencion"><span className="campo-requerido" aria-hidden="true">*</span> Campos requeridos</p>{cloneElement(children, { id, ref: formulario, onSubmit: enviar } as FormHTMLAttributes<HTMLFormElement>, camposEtiquetados(children.props.children))} </fieldset>
      {paso === 1 && <section aria-label="Revisión de datos"><h3 tabIndex={-1}>Revisá la información antes de guardar</h3><dl className="asistente-resumen">{resumen.map((campo, i) => <div key={i}><dt>{campo.nombre}</dt><dd>{campo.valor}</dd></div>)}</dl><p className="introduccion">Podés volver para corregir los datos.</p></section>}
    </div>
    <footer className="asistente-pie"><button type="button" disabled={ocupado} onClick={cerrar}>Cancelar</button>{paso === 1 && <button type="button" disabled={ocupado} onClick={() => setPaso(0)}>Volver a los datos</button>}<button type="submit" form={id} disabled={ocupado}>{ocupado ? 'Guardando…' : paso ? 'Guardar' : 'Revisar datos'}</button></footer>
  </dialog>
}
