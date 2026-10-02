export function notificarGuardado() {
  window.dispatchEvent(new CustomEvent('rsi-notificacion', { detail: 'Cambios guardados correctamente.' }))
}
