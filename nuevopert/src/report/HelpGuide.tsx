import { useState } from "react"
import { colors, card, sectionLead, sectionTitle } from "./theme"

type Props = { onClose?: () => void; compact?: boolean }

function ScreenshotPlaceholder({ img, alt }: { img: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div
      style={{
        border: `1px dashed ${colors.border}`,
        borderRadius: 8,
        overflow: "hidden",
        background: colors.surface,
        minHeight: 100,
      }}
    >
      {!failed && (
        <img
          src={img}
          alt={alt}
          style={{ width: "100%", display: "block" }}
          onError={() => setFailed(true)}
        />
      )}
      {failed && (
        <p style={{ margin: 0, padding: 24, textAlign: "center", fontSize: 12, color: colors.muted }}>
          <strong>Captura:</strong> {alt}
          <br />
          <span style={{ fontSize: 10 }}>Coloque {img} en public/tutorial/</span>
        </p>
      )}
    </div>
  )
}

const STEPS = [
  {
    title: "1. Documento central",
    body: "Scroll vertical único. Cada bloque tiene título y guía fijos (gris azulado) y un área editable (caja blanca). Complete el texto del caso SIGPI / Valle del Sol, incluida la EV3 (5W1H, redes, recursos).",
    shot: "Vista del informe por pasos del proceso de evaluación",
    img: "/tutorial/01-informe.png",
  },
  {
    title: "2. EDT",
    body: "Diagrama tipo WBS: proyecto arriba, tres entregas (módulos) y paquetes en lista vertical. Todos los recuadros son editables; los cambios se guardan solos.",
    shot: "Diagrama con SIGPI → Entrega 1/2/3 → ítems C.1, A.1…",
    img: "/tutorial/02-edt.png",
  },
  {
    title: "3. PERT / CPM",
    body: "Tabla con a, m, b → Te y σ². Pulse ACTUALIZAR para refrescar el diagrama AoA. Abajo: Gantt en semanas (ES/EF del CPM) y tabla Z.",
    shot: "Tabla de actividades + botón ACTUALIZAR + panel Z",
    img: "/tutorial/03-pert.png",
  },
  {
    title: "4. Flujo de caja",
    body: "Plantilla reutilizable: «Nuevo proyecto (vacío)» o SIGPI. Todas las celdas del estado de flujos son editables; «Recalcular» aplica fórmulas 2.5.4/2.5.5. VAN/TIR desde la fila Flujo de caja.",
    shot: "Tabla de flujos + indicadores VAN / TIR / FCA",
    img: "/tutorial/04-financiero.png",
  },
  {
    title: "5. Matriz de decisión",
    body: "Ponderaciones y puntajes 1–5 por alternativa. Los totales se calculan solos; la fila ganadora se resalta.",
    shot: "Matriz Alt.1 / Alt.2 / Alt.3 con totales 345 / 355 / 265",
    img: "/tutorial/05-matriz.png",
  },
  {
    title: "6. Glosario e índice (esta pestaña)",
    body: "Índice con dos entradas: Mapa del curso (apuntes Excalidraw) y Glosario didáctico (términos A–G). El botón ? de la barra abre la guía aquí abajo.",
    shot: "Índice + mapa + glosario unificados",
    img: "/tutorial/06-glosario.png",
  },
  {
    title: "7. Guardado y plantilla",
    body: "El borrador se guarda en el navegador (localStorage). «Restaurar plantilla SIGPI» al pie de la página revierte al contenido inicial.",
    shot: "Botón Restaurar plantilla SIGPI",
    img: "/tutorial/08-restaurar.png",
  },
] as const

export function HelpGuideContent({ compact }: { compact?: boolean }) {
  return (
    <div style={{ maxWidth: compact ? undefined : 720 }}>
      <h3 style={{ ...sectionTitle, fontSize: compact ? 16 : 22, marginBottom: compact ? 6 : 12 }}>
        Guía de uso — SIGPI Informe
      </h3>
      {!compact && (
        <p style={{ fontSize: 14, color: colors.muted, lineHeight: 1.55, marginBottom: 24 }}>
          Tutorial rápido. El informe concentra el texto; las pestañas EDT, PERT, Flujo de caja y Matriz son herramientas de
          evaluación.
        </p>
      )}
      {compact && (
        <p style={{ ...sectionLead, marginBottom: 16 }}>
          Pasos para usar la plataforma. Más abajo está el glosario de términos del ramo.
        </p>
      )}

      {STEPS.map((step, i) => (
        <section key={i} style={{ ...card, marginBottom: 16 }}>
          <h4 style={{ margin: "0 0 8px", fontSize: compact ? 14 : 15, color: colors.navy }}>{step.title}</h4>
          <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.5, color: colors.text }}>{step.body}</p>
          <ScreenshotPlaceholder img={step.img} alt={step.shot} />
        </section>
      ))}

      <section style={{ ...card, background: colors.orangeLight, borderColor: "#fed7aa" }}>
        <h4 style={{ margin: "0 0 8px", fontSize: 14, color: colors.orange }}>Atajos</h4>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
          <li>
            <strong>?</strong> en la barra superior abre esta guía (pestaña Glosario e índice).
          </li>
          <li>
            PERT: plantillas <strong>E1–E4</strong> y SIGPI completo cargan redes por entregable.
          </li>
          <li>
            Z = (x − μ) / σ; la tabla resalta la fila al calcular en el panel.
          </li>
        </ul>
      </section>
    </div>
  )
}

/** @deprecated Use HelpGuideContent dentro de TabReferenciaSection */
export function HelpGuide({ onClose }: Props) {
  return (
    <div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            marginBottom: 16,
            border: `1px solid ${colors.border}`,
            background: colors.white,
            padding: "8px 14px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ← Volver al informe
        </button>
      )}
      <HelpGuideContent />
    </div>
  )
}
