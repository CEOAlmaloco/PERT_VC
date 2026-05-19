import { useCallback, useState } from "react"
import { defaultReportData, TAB_LABELS } from "./defaults"
import { CentralDocument } from "./CentralDocument"
import { DecisionMatrix } from "./DecisionMatrix"
import { EdtWbsEditor } from "./EdtWbsEditor"
import { TabFinanceSection } from "./TabFinanceSection"
import { TabReferenciaSection, type ReferenciaView } from "./TabReferenciaSection"
import { TabEvaluationRoadmap } from "./TabEvaluationRoadmap"
import { TabPertSection } from "./TabPertSection"
import { useReportData } from "./useReportData"
import { colors, sectionLead, sectionTitle } from "./theme"
import type { ReportTabId } from "./types"

export function ReportShell() {
  const { data, patch, setData, patchBlock } = useReportData()
  const [tab, setTab] = useState<ReportTabId>("informe")
  const [scrollBlockId, setScrollBlockId] = useState<string | null>(null)
  const [refView, setRefView] = useState<ReferenciaView>("indice")

  const goHelp = () => {
    setRefView("glosario")
    setTab("glosario")
  }

  const openTab = useCallback((id: ReportTabId) => {
    setTab(id)
    if (id === "glosario") setRefView("indice")
  }, [])

  const navigateToBlock = useCallback((blockId: string) => {
    setTab("informe")
    setScrollBlockId(blockId)
  }, [])

  const clearScrollBlock = useCallback(() => setScrollBlockId(null), [])

  return (
    <div style={{ textAlign: "left", background: "#f1f5f9", minHeight: "100vh" }}>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          background: colors.white,
          borderBottom: `2px solid ${colors.navy}`,
          boxShadow: "0 2px 12px rgba(15, 39, 68, 0.08)",
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, ${colors.navy} 0%, ${colors.blue} 70%, #2563eb 100%)`,
            color: "#fff",
            padding: "12px 20px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, opacity: 0.85, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {data.courseCode} · {data.organization}
            </div>
            <input
              value={data.projectTitle}
              onChange={(e) => patch({ projectTitle: e.target.value })}
              style={{
                display: "block",
                width: "100%",
                marginTop: 4,
                border: "none",
                background: "transparent",
                color: "#fff",
                fontSize: 17,
                fontWeight: 700,
                fontFamily: "inherit",
              }}
            />
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{data.team}</div>
          </div>
          <button
            type="button"
            onClick={goHelp}
            title="Abrir guía de uso y tutorial"
            aria-label="Ayuda"
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "2px solid rgba(255,255,255,0.5)",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 20,
              fontWeight: 700,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ?
          </button>
        </div>

        <nav
          style={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            background: colors.surface,
          }}
          aria-label="Secciones"
        >
          {TAB_LABELS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => openTab(t.id)}
              style={{
                border: "none",
                borderBottom: tab === t.id ? `3px solid ${colors.orange}` : "3px solid transparent",
                background: tab === t.id ? colors.white : "transparent",
                padding: "11px 16px",
                fontSize: 12,
                fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? colors.navy : colors.muted,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: "24px 0 80px", maxWidth: tab === "informe" ? 980 : 1100, margin: "0 auto" }}>
        {tab === "informe" && (
          <CentralDocument
            data={data}
            onBlockChange={patchBlock}
            onMetaChange={(p) => patch(p)}
            scrollToBlockId={scrollBlockId}
            onScrollToBlockDone={clearScrollBlock}
          />
        )}

        {tab === "ruta" && (
          <TabEvaluationRoadmap onOpenTab={openTab} onScrollToBlock={navigateToBlock} />
        )}

        {tab === "edt" && (
          <section>
            <h2 style={sectionTitle}>EDT — Estructura de desglose del trabajo</h2>
            <p style={sectionLead}>
              Vista tipo organigrama (como plantilla WBS): proyecto arriba, tres entregas y paquetes en lista vertical.
              Edite los textos directamente en cada recuadro.
            </p>
            <EdtWbsEditor root={data.edtRoot} onChange={(edtRoot) => patch({ edtRoot })} />
          </section>
        )}

        {tab === "pert" && (
          <TabPertSection
            ganttWeeks={data.ganttWeeks}
            ganttTasks={data.ganttTasks}
            ganttUnitLabel={data.ganttUnitLabel}
            projectTitle={data.caso.nombre || data.projectTitle}
            initialRows={data.pertRows}
            onPersist={({ pertRows, ganttTasks, ganttWeeks }) =>
              patch(
                ganttTasks || ganttWeeks != null
                  ? { pertRows, ...(ganttTasks ? { ganttTasks } : {}), ...(ganttWeeks != null ? { ganttWeeks } : {}) }
                  : { pertRows },
              )
            }
          />
        )}

        {tab === "financiero" && (
          <TabFinanceSection
            finance={data.finance}
            onChange={(finance) => patch({ finance })}
            onOpenGlossary={() => {
              setRefView("glosario")
              setTab("glosario")
            }}
          />
        )}

        {tab === "glosario" && (
          <TabReferenciaSection view={refView} onViewChange={setRefView} onOpenTab={openTab} />
        )}

        {tab === "matriz" && (
          <section>
            <h2 style={sectionTitle}>Matriz de decisión</h2>
            <p style={sectionLead}>
              Detalle numérico del paso 10 (alternativas). El resumen narrativo va en el bloque «Matriz multicriterio» del documento central.
            </p>
            <DecisionMatrix
              title={data.decisionTitle}
              project={data.decisionProject}
              alts={data.decisionAlts}
              criteria={data.decisionCriteria}
              reading={data.decisionReading}
              recommendation={data.decisionRecommendation}
              interpretation={data.decisionInterpretation}
              onChange={(p) => {
                if (p.title != null) patch({ decisionTitle: p.title })
                if (p.project != null) patch({ decisionProject: p.project })
                if (p.reading != null) patch({ decisionReading: p.reading })
                if (p.recommendation != null) patch({ decisionRecommendation: p.recommendation })
                if (p.interpretation != null) patch({ decisionInterpretation: p.interpretation })
                if (p.criteria != null) patch({ decisionCriteria: p.criteria })
                if (p.alts != null) patch({ decisionAlts: p.alts })
              }}
            />
          </section>
        )}

      </main>

      <footer style={{ textAlign: "center", paddingBottom: 32 }}>
        <button
          type="button"
          onClick={() => {
            if (confirm("¿Restaurar plantilla SIGPI? Se borrará el borrador guardado.")) {
              setData(defaultReportData())
            }
          }}
          style={{
            border: `1px solid ${colors.border}`,
            background: colors.white,
            padding: "8px 16px",
            fontSize: 12,
            borderRadius: 8,
            cursor: "pointer",
            color: colors.muted,
          }}
        >
          Restaurar plantilla SIGPI
        </button>
      </footer>
    </div>
  )
}
