import { useEffect, useState } from "react"
import { defaultReportData } from "./defaults"
import { defaultDocumentBlocks } from "./documentBlocks"
import { EV3_HUMAN_BLOCK_IDS } from "./ev3InformeHumano"
import { normalizeFinance } from "./financeDefaults"
import type { DocumentBlock, ReportData } from "./types"

const STORAGE_KEY = "gpy1101-sigpi-report-v15"

function mergeBlocks(saved: Partial<ReportData>, base: DocumentBlock[]): DocumentBlock[] {
  if (!saved.documentBlocks?.length) return base
  const byId = new Map(saved.documentBlocks.map((b) => [b.id, b]))
  return base.map((b) => {
    const s = byId.get(b.id)
    if (!s) return b
    // Actualizar bloques EV3/EDT si el borrador guardado es más corto que la plantilla nueva
    if (EV3_HUMAN_BLOCK_IDS.has(b.id) && s.content.length < b.content.length * 0.65) {
      return b
    }
    return { ...b, content: s.content }
  })
}

function loadData(): ReportData {
  const base = defaultReportData()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return base
    const saved = JSON.parse(raw) as Partial<ReportData>
    return {
      ...base,
      ...saved,
      documentBlocks: mergeBlocks(saved, base.documentBlocks),
      proposito: { ...base.proposito, ...saved.proposito },
      contexto: { ...base.contexto, ...saved.contexto },
      caso: { ...base.caso, ...saved.caso },
      factibilidad: { ...base.factibilidad, ...saved.factibilidad },
      edtRoot: saved.edtRoot ?? base.edtRoot,
      ganttUnitLabel: "Semana",
      ganttWeeks: saved.ganttWeeks && saved.ganttWeeks > 0 ? saved.ganttWeeks : base.ganttWeeks,
      ganttTasks: saved.ganttTasks?.length ? saved.ganttTasks : base.ganttTasks,
      kpiStats: saved.kpiStats?.length ? saved.kpiStats : base.kpiStats,
      sigpiModules: saved.sigpiModules?.length ? saved.sigpiModules : base.sigpiModules,
      ficha: saved.ficha?.length ? saved.ficha : base.ficha,
      decisionAlts: saved.decisionAlts?.length ? saved.decisionAlts : base.decisionAlts,
      decisionCriteria: saved.decisionCriteria?.length ? saved.decisionCriteria : base.decisionCriteria,
      finance: normalizeFinance(saved.finance),
      pertRows:
        saved.pertRows?.length && saved.pertRows.every((r) => r.actividad?.trim())
          ? saved.pertRows
          : base.pertRows,
    }
  } catch {
    return base
  }
}

export function useReportData() {
  const [data, setData] = useState<ReportData>(loadData)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* ignore */
    }
  }, [data])

  const patch = (p: Partial<ReportData>) => setData((d) => ({ ...d, ...p }))

  const patchBlock = (id: string, content: string) => {
    setData((d) => ({
      ...d,
      documentBlocks: d.documentBlocks.map((b) => (b.id === id ? { ...b, content } : b)),
    }))
  }

  const resetDocumentBlocks = () => {
    patch({ documentBlocks: defaultDocumentBlocks() })
  }

  return { data, setData, patch, patchBlock, resetDocumentBlocks }
}
