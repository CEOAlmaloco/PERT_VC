import { useEffect, useMemo, useState } from "react"
import type { CSSProperties } from "react"
import type { CpmResult } from "./cpmEngine"
import { pertProbability } from "./cpmEngine"
import { HelpButton } from "./report/ContextHelp"

type Props = {
  result: CpmResult
  onZComputed?: (z: number | null) => void
}

const box: CSSProperties = {
  marginTop: 16,
  padding: 12,
  background: "#fafafa",
  border: "1px solid #ddd",
  fontSize: 13,
}

const inp: CSSProperties = {
  width: 88,
  border: "1px solid #999",
  padding: "6px 8px",
  fontSize: 13,
  fontFamily: "ui-monospace, monospace",
}

/** Etapa 5 PERT: σ² proyecto, σ, Z = (x−μ)/σ */
export function PertStatsPanel({ result, onZComputed }: Props) {
  const [xRaw, setXRaw] = useState("")

  const mu = result.projectEnd
  const sigma = result.projectStdDev
  const x = Number(xRaw.replace(",", "."))

  const prob = useMemo(() => {
    if (!Number.isFinite(x) || xRaw.trim() === "") return null
    return pertProbability(x, mu, sigma)
  }, [x, xRaw, mu, sigma])

  const critLabel = result.criticalPath.length ? result.criticalPath.join(" → ") : "—"

  useEffect(() => {
    onZComputed?.(prob?.z ?? null)
  }, [prob, onZComputed])

  return (
    <section style={box}>
      <p style={{ margin: "0 0 10px", fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
        PERT — varianza y probabilidad (semanas)
        <HelpButton topicId="pert-z-tabla" />
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "8px 16px",
          marginBottom: 12,
        }}
      >
        <Stat label="μ (duración proyecto, CPM sobre Te)" value={mu.toFixed(2)} />
        <Stat label="σ² proyecto (solo ruta crítica)" value={result.projectVariance.toFixed(2)} />
        <Stat label="σ (desv. estándar)" value={sigma.toFixed(3)} />
        <Stat label="Ruta crítica" value={critLabel} helpId="pert-ruta-critica" />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <span>
            <strong>x</strong> — tiempo a iterar (sem)
          </span>
          <input
            type="text"
            inputMode="decimal"
            style={inp}
            value={xRaw}
            onChange={(e) => setXRaw(e.target.value)}
            placeholder="ej. 40"
            aria-label="Tiempo a iterar"
          />
        </label>
        {prob && (
          <span style={{ fontSize: 12, fontFamily: "ui-monospace, monospace" }}>
            Z = ({x.toFixed(1)} − {mu.toFixed(1)}) / {sigma.toFixed(3)} = <strong>{prob.z.toFixed(2)}</strong>
            {" · "}
            P(T ≤ x) ≈ <strong>{(prob.probability * 100).toFixed(1)}%</strong>
          </span>
        )}
        {xRaw.trim() !== "" && !prob && sigma <= 1e-9 && (
          <span style={{ fontSize: 12, color: "#92400e" }}>σ ≈ 0: no aplica probabilidad.</span>
        )}
      </div>

      <p style={{ margin: "10px 0 0", fontSize: 11, color: "#666", maxWidth: 720 }}>
        Te = (a + 4m + b) / 6 · σ² = ((b − a) / 6)² · La red usa Te (material GPY5101).
      </p>
    </section>
  )
}

function Stat({ label, value, helpId }: { label: string; value: string; helpId?: string }) {
  return (
    <div>
      <span style={{ color: "#555", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        {helpId ? <HelpButton topicId={helpId} /> : null}
      </span>
      <div style={{ fontFamily: "monospace", fontWeight: 600, marginTop: 2 }}>{value}</div>
    </div>
  )
}
