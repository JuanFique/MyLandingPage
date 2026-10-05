'use client';

import { useState } from 'react';

// Muestra el correo como texto y un botón para copiarlo.
// Existe porque un enlace "mailto:" solo funciona si el dispositivo tiene una app de correo
// configurada por defecto; en muchos computadores no la hay y el clic no hace nada.
// Con el correo visible y copiable, nadie se queda sin poder escribirte.
export default function CopyEmail({ email }) {
  // '' = sin mensaje | 'copied' = copiado | 'error' = el navegador no dejó copiar
  const [status, setStatus] = useState('');

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('copied');
    } catch {
      // Si falla (permisos, navegador antiguo), el correo sigue visible para copiarlo a mano.
      setStatus('error');
    }
    setTimeout(() => setStatus(''), 3000);
  }

  return (
    <div className="contact-email">
      <span>{email}</span>
      <button type="button" className="copy-button" onClick={copyEmail}>
        Copiar correo
      </button>
      {/* role="status": los lectores de pantalla anuncian el mensaje cuando aparece */}
      <span role="status" className="copy-feedback">
        {status === 'copied' && 'Copiado'}
        {status === 'error' && 'No se pudo copiar; selecciónalo a mano'}
      </span>
    </div>
  );
}
