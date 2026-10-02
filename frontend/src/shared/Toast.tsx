import { useEffect, useState } from 'react'

export function Toast() {
  const [mensaje, setMensaje] = useState('')
  useEffect(() => {
    let temporizador: ReturnType<typeof setTimeout>
    const recibir = (evento: Event) => {
      setMensaje((evento as CustomEvent<string>).detail)
      clearTimeout(temporizador)
      temporizador = setTimeout(() => setMensaje(''), 6000)
    }
    window.addEventListener('rsi-notificacion', recibir)
    return () => { window.removeEventListener('rsi-notificacion', recibir); clearTimeout(temporizador) }
  }, [])
  return <div className={mensaje ? 'toast' : 'solo-lectores'} role="status" aria-live="polite" aria-atomic="true">{mensaje && <><p>{mensaje}</p><button type="button" aria-label="Cerrar notificación" onClick={() => setMensaje('')}>✕</button></>}</div>
}
