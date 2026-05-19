/** Contenido EDT detallado para el Documento Central (SIGPI Valle del Sol). */

export const EDT_OVERVIEW = `JERARQUÍA EDT (criterio: ENTREGABLE)

Nivel 0 — Producto del proyecto
└─ SIGPI — Sistema Integrado de Gestión y Prevención de Incendios

Nivel 1 — Entregables principales (4 paquetes)
├─ Paquete 1 — Gestión y administración
├─ Paquete 2 — Módulo C (Valle Alerta Ciudadana)
├─ Paquete 3 — Módulo A (Valle Situación)
└─ Paquete 4 — Módulo B (Valle Nexo)

Nivel 2 — Subpaquetes de trabajo (1.1 … 4.6) → ver tablas por paquete más abajo.

Relación con el cronograma (PERT):
• La EDT detalla QUÉ se entrega (subpaquetes + entregables).
• El PERT (pestaña PERT/CPM → E1, E2, E3, E4) programa CUÁNDO con actividades A, B, C… por subpaquete.
• Un subpaquete EDT = normalmente una actividad PERT; los entregables listados son criterios de aceptación, no filas sueltas del PERT salvo desglose explícito.

Fases del contrato:
• Fase 1: Paquetes 1 + 2 + 3 (antes del verano — piloto C+A)
• Fase 2: Paquete 4 (hub, API, histórico — Valle Nexo)`

export const EDT_PAQUETE_1 = `PAQUETE 1 — GESTIÓN Y ADMINISTRACIÓN

| Código | Subpaquete | Entregables principales | Dur. orient. | Responsable |
|--------|------------|-------------------------|--------------|-------------|
| 1.1 | Inicio y planificación | Acta de inicio; plan de proyecto; matriz de interesados; cronograma maestro | 2 sem | Jefe de proyecto |
| 1.2 | Gestión contractual y legal | Bases técnicas; evaluación ofertas; contrato/adjudicación; anexos SLA | 3 sem | Jefe de proyecto + Asesoría legal |
| 1.3 | Gestión de calidad | Plan de calidad; checklist QA; procedimiento de no conformidades | 2 sem | QA / Jefe de proyecto |
| 1.4 | Gestión de riesgos | Matriz de riesgos; plan de respuesta; registro de incidentes | 2 sem | Jefe de proyecto |
| 1.5 | Comunicaciones | Plan de comunicaciones; informes de avance quincenales | 1 sem | Jefe de proyecto |
| 1.6 | Capacitación y cambio | Plan de capacitación; talleres municipales; material de adopción | 2 sem | Capacitación / Change |

PERT entregable E1: actividades A–F (pestaña PERT → «E1 Gestión»).`

export const EDT_PAQUETE_2 = `PAQUETE 2 — MÓDULO C (VALLE ALERTA CIUDADANA)

| Código | Subpaquete | Entregables principales | Dur. orient. | Responsable |
|--------|------------|-------------------------|--------------|-------------|
| 2.1 | Análisis y diseño C | Documento de requisitos funcionales; wireframes; prototipo validado con municipalidad | 3 sem | Analista + UX |
| 2.2 | PWA / App ciudadana | Aplicación offline-first; geolocalización; cámara integrada; publicación en store/web | 6 sem | Dev Frontend |
| 2.3 | Backend reportes | API REST de reportes; validación de datos; cola asíncrona de procesamiento | 5 sem | Dev Backend |
| 2.4 | Motor de alertas | Integración SMS (Twilio); push (Firebase); alertas en panel web | 4 sem | Dev Backend |
| 2.5 | Panel moderación | Interfaz municipal para validar/rechazar reportes; trazabilidad de decisiones | 4 sem | Dev Frontend |
| 2.6 | Testing y despliegue C | Plan de pruebas; UAT con usuarios reales; despliegue en nube (piloto) | 3 sem | QA + DevOps |

PERT entregable E2: actividades A–F (pestaña PERT → «E2 Módulo C»). AoA con ficticias en paralelo (alertas / PWA / panel).`

export const EDT_PAQUETE_3 = `PAQUETE 3 — MÓDULO A (VALLE SITUACIÓN)

| Código | Subpaquete | Entregables principales | Dur. orient. | Responsable |
|--------|------------|-------------------------|--------------|-------------|
| 3.1 | Análisis y diseño A | Requisitos operativos; diseño de tablero; integración con fuentes GIS | 3 sem | Analista + Esp. GIS |
| 3.2 | Visor GIS y mapa | Mapa en tiempo real; capas CONAF/municipio; actualización en emergencia | 7 sem | Esp. GIS + Dev Frontend |
| 3.3 | Dashboard operativo | Tablero PMU; KPI en vivo; roles Dir. Riesgos / operaciones | 5 sem | Dev Frontend |
| 3.4 | App brigadas móvil | App campo (offline parcial); sincronización con central | 4 sem | Dev Mobile |
| 3.5 | Infra sala crisis | Hardware/software sala; VPN 4G brigadas; procedimiento de continuidad | 3 sem | DevOps / Infra |
| 3.6 | Testing y despliegue A | UAT operaciones; pruebas de carga mapa; go-live Fase 1 | 3 sem | QA + DevOps |

PERT entregable E3: actividades A–F (pestaña PERT → «E3 Módulo A»).`

export const EDT_PAQUETE_4 = `PAQUETE 4 — MÓDULO B (VALLE NEXO)

| Código | Subpaquete | Entregables principales | Dur. orient. | Responsable |
|--------|------------|-------------------------|--------------|-------------|
| 4.1 | Análisis y diseño B | Modelo de datos histórico; diseño API externa; acuerdos con organismos | 3 sem | Arquitecto + Analista |
| 4.2 | Hub datos e histórico | Data lake / warehouse; ETL desde C+A; consultas <2 s (histórico) | 8 sem | DBA + Dev Backend |
| 4.3 | API integración | API REST documentada; conectores BOMberos, CONAF, SENAPRED | 5 sem | Dev Backend |
| 4.4 | Analítica y reportes | Reportes históricos; exportación; tableros analíticos | 4 sem | Dev Backend + BI |
| 4.5 | Seguridad y cumplimiento | Auditoría seguridad; cifrado; cumplimiento Ley 21.364 / datos personales | 3 sem | Seguridad |
| 4.6 | Testing y despliegue B | UAT integración; cierre contractual; handover a municipalidad | 3 sem | QA + Jefe de proyecto |

PERT entregable E4: actividades A–F (pestaña PERT → «E4 Módulo B»). Inicia tras cierre Fase 1 (2.6 y 3.6).`

export const EDT_DICCIONARIO_COMPLETO = `DICCIONARIO DE LA EDT — SIGPI VALLE DEL SOL

| Código | Nombre | Responsable | Duración | Costo ref. | Criterio de aceptación |
|--------|--------|-------------|----------|------------|------------------------|
| 1.1 | Inicio y planificación | Jefe de proyecto | 2 sem | USD 3k | Acta de inicio firmada; plan aprobado |
| 1.2 | Gestión contractual | Jefe de proyecto | 3 sem | USD 5k | Contrato adjudicado y publicado |
| 1.3 | Gestión de calidad | QA | 2 sem | USD 2k | Plan de calidad aprobado |
| 1.4 | Gestión de riesgos | Jefe de proyecto | 2 sem | USD 2k | Matriz riesgos con respuestas |
| 1.5 | Comunicaciones | Jefe de proyecto | 1 sem | USD 1k | Informe avance quincenal |
| 1.6 | Capacitación y cambio | Capacitación | 2 sem | USD 3k | ≥1 taller por rol clave |
| 2.1 | Análisis y diseño C | Analista / UX | 3 sem | USD 4k | Prototipo validado municipalidad |
| 2.2 | PWA ciudadana | Dev Frontend | 6 sem | USD 8k | Reporte offline + geoloc OK |
| 2.3 | Backend reportes | Dev Backend | 5 sem | USD 7k | API <200 ms p95 |
| 2.4 | Motor alertas | Dev Backend | 4 sem | USD 5k | SMS <30 s desde validación |
| 2.5 | Panel moderación | Dev Frontend | 4 sem | USD 5k | Validación/rechazo trazable |
| 2.6 | Testing / despliegue C | QA / DevOps | 3 sem | USD 4k | UAT C aprobado; piloto en nube |
| 3.1 | Análisis y diseño A | Analista / GIS | 3 sem | USD 4k | Diseño tablero aprobado |
| 3.2 | Visor GIS | Esp. GIS | 7 sem | USD 10k | Mapa actualiza ≤30 s en emergencia |
| 3.3 | Dashboard operativo | Dev Frontend | 5 sem | USD 6k | UAT aprobado Dir. Riesgos |
| 3.4 | App brigadas | Dev Mobile | 4 sem | USD 5k | Sincronización campo OK |
| 3.5 | Infra sala crisis | DevOps | 3 sem | USD 6k | VPN 4G brigadas operativa |
| 3.6 | Testing / despliegue A | QA / DevOps | 3 sem | USD 4k | Go-live Fase 1 aprobado |
| 4.1 | Análisis y diseño B | Arquitecto | 3 sem | USD 4k | Modelo datos y API definidos |
| 4.2 | Hub datos | DBA | 8 sem | USD 12k | Consultas históricas <2 s |
| 4.3 | API integración | Dev Backend | 5 sem | USD 7k | Conectores externos probados |
| 4.4 | Analítica | Dev / BI | 4 sem | USD 5k | Reportes históricos exportables |
| 4.5 | Seguridad | Seguridad | 3 sem | USD 4k | Auditoría sin hallazgos críticos |
| 4.6 | Cierre Fase 2 | Jefe de proyecto | 3 sem | USD 4k | Acta de cierre y handover |

Total orientativo Fase 1+2: ver pestaña Flujo de caja. EDT editable en pestaña «EDT visual».`

export const EDT_CONCEPTO = `La EDT (Estructura de Desglose del Trabajo / WBS) organiza el proyecto por ENTREGABLES, no por fases sueltas.

Niveles SIGPI (referencia Duoc UC):
• Nivel 0 — Producto: SIGPI completo
• Nivel 1 — Entregable: Paquetes 1, 2, 3, 4
• Nivel 2 — Subpaquete / paquete de trabajo: 1.1, 2.1, 3.1… (asignable a equipo)
• Detalle — Entregables principales (viñetas en tablas): requisitos, wireframes, API… (criterios de aceptación)
• PERT — Actividades A, B, C… (cronograma por entregable en la app)

Regla: los entregables dentro de 2.1 NO son obligatoriamente filas PERT separadas; el cronograma usa letras A–F por subpaquete salvo que se desglose más por decisión del equipo.`
