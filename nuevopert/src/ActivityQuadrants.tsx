import type { CpmResult } from "./cpmEngine"
import { formatSem } from "./formatSem"

type Props = {
  result: CpmResult
}

/** Cuadros 2×2 por actividad (ES|EF / LS|LF) + holgura en semanas */
export function ActivityQuadrants({ result }: Props) {
  return (
    <section style={{ marginTop: 44, paddingBottom: 16 }}>
      <h2 style={{ fontSize: 15, margin: "0 0 8px", fontWeight: 600 }}>Tiempos por actividad (semanas)</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-start" }}>
        {result.order.map((code) => {
          const a = result.activities.find((x) => x.code === code)
          const ES = result.es[code] ?? 0
          const EF = result.ef[code] ?? 0
          const LS = result.ls[code] ?? 0
          const LF = result.lf[code] ?? 0
          const slack = result.slack[code] ?? 0
          const crit = Math.abs(slack) < 1e-6
          return (
            <div
              key={code}
              style={{
                border: "1px solid #111",
                width: 118,
                background: "#fff",
                fontSize: 11,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 700,
                  borderBottom: "1px solid #ccc",
                  padding: "4px 2px",
                  fontSize: 12,
                }}
              >
                {code}
                {a?.name ? (
                  <div style={{ fontWeight: 400, fontSize: 9, color: "#555", marginTop: 2, lineHeight: 1.2 }}>
                    {a.name}
                  </div>
                ) : null}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr" }}>
                <Q label="ES" v={ES} />
                <Q label="EF" v={EF} />
                <Q label="LS" v={LS} />
                <Q label="LF" v={LF} />
              </div>
              <div
                style={{
                  textAlign: "center",
                  borderTop: "1px solid #ccc",
                  padding: "4px 2px",
                  fontSize: 10,
                  fontWeight: 600,
                  color: crit ? "#b91c1c" : "#444",
                }}
              >
                Holgura {formatSem(slack)} sem
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Q({ label, v }: { label: string; v: number }) {
  return (
    <div style={{ borderRight: "1px solid #ddd", borderBottom: "1px solid #ddd", padding: "6px 4px", textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "#666" }}>{label}</div>
      <div style={{ fontFamily: "ui-monospace, monospace", fontWeight: 600 }}>{Number.isFinite(v) ? formatSem(v) : "—"}</div>
    </div>
  )
}
