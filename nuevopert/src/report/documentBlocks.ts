import { EDT_DICCIONARIO_COMPLETO } from "./edtDocumentContent"
import {
  EV3_5W1H,
  EV3_CPM_PERT,
  EV3_EDT_INTRO_ARBOL,
  EV3_EDT_P1,
  EV3_EDT_P2,
  EV3_EDT_P3,
  EV3_EDT_P4,
  EV3_EDT_QUE_ES,
  EV3_FICHA,
  EV3_OUTSOURCING,
  EV3_PROBABILIDAD,
  EV3_RECURSOS,
  EV3_REDES,
  EV3_SECUENCIA,
} from "./ev3InformeHumano"
import type { DocumentBlock } from "./types"
import type { ProcessPhase } from "./processSteps"

type Part = ProcessPhase

function b(
  id: string,
  title: string,
  hint: string,
  content: string,
  part: Part,
): DocumentBlock {
  return { id, title, hint, content, part }
}

/** Plantilla Documento Central Integral SIGPI — títulos y guías fijos */
export function defaultDocumentBlocks(): DocumentBlock[] {
  return [
    b(
      "excalidraw-mapa",
      "Apuntes visuales (Excalidraw)",
      "Resumen del diagrama del curso: jerarquía proyecto, CPM/PERT AOA, ciclo de vida, plata, licitación. Ver pestaña «Mapa curso».",
      `Contenido extraído de excalidraw.md e integrado en la plataforma.

Temas principales:
• Jerarquía Sistema → Proceso → Actividades → Tareas → Productos
• Dependencias (obligatorias, discrecionales, externas, macro→micro)
• Diagrama AOA: hitos, flechas, holgura, forward/backward pass
• Ciclo de vida (12 etapas: idea → mantención)
• CPM vs PERT · Control y optimización (triángulo tiempo-costo-alcance)
• Pipeline económico: ingresos → utilidad → flujo de caja → inversión
• Rol proveedor en licitación pública (Valle del Sol)

Abra la pestaña «Mapa curso» para estudiar sección por sección con enlaces a EDT, PERT y Flujo de caja.`,
      "identificacion",
    ),
    b(
      "ev3-guia-recursos",
      "Guía EV3-2 — Recursos, costos y 5W1H",
      "Apuntes del ramo: estimación por paquete, recursos HH/físicos/intelectuales/económicos, arriendo vs compra, utilidad, costo Ce, capital de trabajo. Ver pestaña «EV3 Estimación».",
      `Contenido completo en la pestaña EV3 Estimación (archivo EV3-2-evaluacion-recursos-costos.md).

Resumen del orden:
1. QUÉ (alcance) → requisitos y módulos SIGPI
2. CÓMO → EDT (4 paquetes Gestión, C, A, B)
3. CUÁNDO → PERT/CPM + Gantt
4. DÓNDE → comuna, nube, PMU, terreno
5. CUÁNTO → flujo de caja, VAN/TIR

Requisito previo EV3: tener EDT y duración antes de presupuestar.`,
      "identificacion",
    ),
    b(
      "glosario-mapa-6",
      "Glosario didáctico — mapa de las 6 preguntas",
      "Resumen del evaluador GPY1101: qué es, cómo ordeno, factibilidad técnica, plata, legal, ¿vale la pena? Ver pestaña Glosario.",
      `1. ¿QUÉ ES? — ¿Es proyecto? ¿quién lo necesita?
2. ¿CÓMO LO ORDENO? — EDT, PERT/CPM, hitos
3. ¿SE PUEDE HACER? — Estudio técnico (arquitectura, infraestructura)
4. ¿HAY PLATA? — Ingresos, costos, inversión, flujo de caja (pestaña Flujo de caja)
5. ¿ES LEGAL? — Licitación Ley 19.886, Mercado Público
6. ¿VALE LA PENA? — VAN, TIR, PRI

Use la pestaña «Glosario» para definiciones con ejemplo cotidiano y aplicación a Valle del Sol.`,
      "identificacion",
    ),

    b(
      "meta-ficha",
      "Portada — EV3 Estudio técnico",
      "Municipalidad Valle del Sol · SIGPI · GPY1101 · equipo y versión EV3.",
      EV3_FICHA,
      "identificacion",
    ),
    b(
      "ev3-5w1h",
      "Marco general — Las 5W + 1H",
      "Tabla QUÉ, CÓMO, CUÁNDO, DÓNDE, CUÁNTO, QUIÉN y enlace a pestañas de la app.",
      EV3_5W1H,
      "identificacion",
    ),
    b(
      "meta-correccion-rol",
      "Rol del equipo en la licitación pública",
      "Aclarar que NO generan la licitación: son empresa privada que RESPONDE en ChileCompra/Mercado Público (Ley 19.886).",
      `Importante: no generamos la licitación. Somos una empresa privada que RESPONDE a la licitación publicada por la Municipalidad en ChileCompra/Mercado Público bajo Ley 19.886.`,
      "identificacion",
    ),

    b(
      "s1-ficha-organizacion",
      "Ficha de la organización cliente",
      "Tabla Atributo | Detalle: nombre, industria, área, funcionarios, ubicación, territorio, misión.",
      `Nombre: Municipalidad Valle del Sol
Industria: Administración pública local
Área: Subdirección de Gestión de Emergencias y Prevención de Desastres
Funcionarios: ~180
Ubicación: Región San Jorge, sur de Chile
Territorio: Rural-forestal; pino y eucalipto; viviendas en interfaz forestal
Misión: Referente en tecnología y participación ciudadana para prevención de incendios`,
      "contexto",
    ),
    b(
      "s1-problematica-resumen",
      "Problemática actual — resumen",
      "Párrafo sobre canales informales (WhatsApp, llamadas, radio) y consecuencias: detección tardía, información dispersa, coordinación deficiente.",
      `La municipalidad gestiona emergencias de incendios forestales mediante canales informales: WhatsApp, llamadas, radios y redes sociales. Esto genera detección tardía, información dispersa y coordinación deficiente.`,
      "diagnostico",
    ),
    b(
      "s1-indicadores",
      "Indicadores críticos del caso",
      "Tabla Indicador | Valor | Impacto (35 min, 22%, 65%, 73%, 81%, -15 min → 40%).",
      `Tiempo inicio → reporte: ~35 min — Superficie afectada crece exponencialmente
Reportes tempranos vecinos: 22% — 78% ya es incendio visible
Vecinos que no saben reportar: 65% — Canal ciudadano inexistente
Percepción alertas tardías: 73% — Confianza ciudadana baja
Funcionarios con info incompleta: 81% — Decisiones comprometidas
Reducción estimada con -15 min: hasta 40% de superficie afectada`,
      "diagnostico",
    ),
    b(
      "s1-investigacion-entrevistas",
      "Investigación y entrevistas de levantamiento",
      "Antes de requisitos y UML: investigación, entrevistas a cliente/usuarios/stakeholders y síntesis. Pegue actas o citas. Enlace con indicadores del caso.",
      `FASE: Investigación → Entrevistas → Análisis (ver pestaña «Ruta evaluación»).

1. INVESTIGACIÓN
Objetivo: entender el problema antes de planificar.
• Revisión de antecedentes (crisis 2023, estadísticas del caso)
• Benchmark de sistemas similares (CONAF, alertas municipales)
• Documentos internos de la municipalidad

2. ENTREVISTAS (plantilla por actor)
| Actor | Rol | Preguntas clave | Hallazgo principal |
| Alcalde | Sponsor | ¿Qué indicador debe mejorar primero? | Reducir minutos hasta reporte |
| Dir. Riesgos | Usuario clave | ¿Cómo coordinan hoy con bomberos? | WhatsApp + radio, sin mapa |
| Brigada | Operación | ¿Qué información falta en terreno? | Georreferencia y estado foco |
| Vecino / ciudadano | Usuario final | ¿Sabe cómo reportar? | 65% no conoce canal oficial |
| Dir. TI | Restricciones | ¿Infraestructura disponible? | Nube aprobada, sin equipo dev interno |

3. SÍNTESIS DEL ANÁLISIS
Transformar hallazgos en: necesidades, procesos AS-IS, requisitos preliminares (ver bloques «Proceso — Necesidad» y RN01–RN07).

[Adjunte actas, notas o enlaces a grabaciones si el curso lo permite]`,
      "contexto",
    ),

    b(
      "ec-proceso-problema",
      "Proceso — Problema",
      "Enunciado del problema detectado en la organización (plantilla evaluación de proyectos).",
      `Problema: detección tardía, dispersión de información y falta de coordinación en la gestión de incendios forestales.`,
      "diagnostico",
    ),
    b(
      "ec-proceso-necesidad",
      "Proceso — Necesidad",
      "Necesidad del cliente, criterios de evaluación y factores relevantes.",
      `Necesidad: implementar una plataforma tecnológica integrada para detección temprana, monitoreo geográfico y coordinación de emergencias forestales. Además, mejorar la participación ciudadana, automatizar alertas y centralizar la información histórica y operativa.

Criterios de evaluación:
• ¿Puede implementarse con la infraestructura tecnológica disponible en la municipalidad?
• Integración con geolocalización, mapas, notificaciones y organismos externos (bomberos, SENAPRED).
• Capacidad organizacional para mantener y operar la plataforma.
• Aspectos legales: protección de datos, geolocalización y trazabilidad.
• Interoperabilidad con instituciones públicas y sistemas de emergencia nacionales.

Factores relevantes:
• Reducción del tiempo de detección de incendios.
• Mejora en la coordinación entre brigadas y organismos de emergencia.
• Participación ciudadana en prevención y reportes.
• Visualización geográfica en tiempo real.
• Escalabilidad regional e integración futura con IoT.
• Factibilidad técnica y organizacional.
• Riesgo legal.
• Tiempo de implementación.`,
      "requisitos",
    ),
    b(
      "ec-proceso-solucion",
      "Proceso — Solución",
      "Descripción de la solución y al menos tres opciones de desarrollo (secuencias, prioridades, herramientas, plazos).",
      `Solución: Sistema Integrado de Gestión y Prevención de Incendios Forestales (SIGPI).

Descripción: plataforma centralizada para reportar incendios, monitorear focos activos y coordinar emergencias en tiempo real. Incluye portal web, aplicación móvil, mapas interactivos, notificaciones automáticas, paneles de monitoreo y base de datos histórica. Integración con bomberos, brigadas municipales y organismos regionales mediante APIs interoperables.

Opciones de desarrollo (mínimo 3):
1) Implementación gradual por módulos (Fase 1 web → Fase 2 app ciudadana → Fase 3 alertas/dashboards → Fase 4 analítica).
2) Proveedor externo SaaS / llave en mano con despliegue acelerado.
3) Desarrollo interno municipal con consultoría puntual en GIS y cloud.

Opción 1 — Valle Situación: mapa GIS y tablero operativo.
Opción 2 — Valle Nexo: hub de datos e interoperabilidad.
Opción 3 — Valle Alerta Ciudadana: reportes ciudadanos y alertas tempranas.`,
      "solucion",
    ),
    b(
      "ec-proceso-como",
      "Proceso — ¿Cómo? (fases e implementación)",
      "Infraestructura, conectividad, metodología y personal. Considerar recursos, complejidad e integración con sistemas existentes.",
      `Implementación gradual por módulos:
• Fase 1: plataforma web para registro y visualización de incendios.
• Fase 2: app móvil para reportes ciudadanos con geolocalización y fotografías.
• Fase 3: alertas automáticas, dashboards en tiempo real e integración con organismos externos.
• Fase 4: analítica avanzada, mapas de calor y análisis histórico para prevención.

Considerar disponibilidad de recursos, complejidad del desarrollo e integración con sistemas existentes.`,
      "solucion",
    ),
    b(
      "ec-proceso-infraestructura",
      "Proceso — Infraestructura y equipo técnico",
      "Hardware, software, red, metodologías y roles del equipo proveedor.",
      `Infraestructura de hardware:
• Servidores cloud escalables (AWS).
• Equipos móviles para brigadas y personal municipal.
• Centros de monitoreo con visualización en tiempo real.

Infraestructura de software:
• Plataforma web responsive (móvil y PC).
• App móvil Android/iOS.
• Backend modular o microservicios escalables.
• Base relacional + soporte geoespacial (PostGIS).
• GIS y mapas (Google Maps, Leaflet, Mapbox, etc.).
• APIs de integración con organismos externos.

Conectividad:
• Acceso seguro por internet y redes 4G/5G.
• Comunicación en tiempo real vía APIs cloud.
• Respaldo de conectividad en sectores rurales.

Metodología:
• Scrum, desarrollo incremental, Git/GitHub, CI/CD, monitoreo y observabilidad.

Personal técnico:
• Desarrolladores Full Stack.
• Especialistas GIS y geolocalización.
• Ingenieros DevOps y Cloud.
• Analistas de datos y ciberseguridad.
• Coordinadores municipales y personal de emergencias capacitado.`,
      "solucion",
    ),
    b(
      "ec-proceso-evaluacion",
      "Proceso — Evaluación (mejor opción)",
      "Conclusión de la alternativa recomendada y justificación.",
      `La mejor alternativa es la implementación gradual por módulos: entrega resultados tempranos, reduce riesgos y permite adaptar el sistema a las necesidades reales de la Municipalidad Valle del Sol. Facilita capacitación progresiva del personal y escala hacia analítica predictiva, integración regional e IoT para prevención de incendios forestales.`,
      "alternativas",
    ),

    b(
      "s1-rol-equipo",
      "Proceso de licitación y rol del equipo",
      "Explicar los 5 pasos: municipalidad elabora bases → ChileCompra → empresas ofertan → evaluación → adjudicación e implementación.",
      `SOMOS EMPRESA PRIVADA QUE RESPONDE A LICITACIÓN PÚBLICA. NO GENERAMOS LA LICITACIÓN.

1. Municipalidad detecta necesidad y elabora bases
2. Publica en ChileCompra (Mercado Público) — Ley 19.886
3. Empresas proveedoras estudiamos bases y elaboramos propuesta técnica + económica
4. Municipalidad evalúa con matriz técnica-económica y adjudica
5. Equipo adjudicado desarrolla e implementa`,
      "identificacion",
    ),

    b(
      "s2-requisitos-rn",
      "Requisitos de negocio (RN01–RN07)",
      "Tabla ID | Requisito | Fuente | Prioridad para los siete RN del caso.",
      `RN01 Reducir tiempo detección — Alcalde / estadísticas — CRÍTICA
RN02 Coordinación municipal con terceros — Dir. Riesgos / brigadas — ALTA
RN03 Participación ciudadana en reportes — Encuestas — ALTA
RN04 Monitoreo geográfico mapa operativo — Brigadas / TI — ALTA
RN05 Alertas automáticas y oportunas — Encuestas — ALTA
RN06 Centralizar información trazable — Dir. TI / gestión riesgos — MEDIA
RN07 Histórico para análisis y prevención — Dirección general — MEDIA`,
      "requisitos",
    ),
    b(
      "s2-solucion-sigpi",
      "Solución propuesta: SIGPI",
      "Definición del sistema integrado modular: reportes, GIS, alertas, histórico.",
      `SIGPI — Sistema Integrado de Gestión y Prevención de Incendios Forestales: plataforma centralizada para reportar incendios, monitorear focos activos y coordinar emergencias en tiempo real (portal web, app móvil, mapas, alertas, paneles y base histórica). Ver también bloques «Proceso — Solución» y «Infraestructura».`,
      "solucion",
    ),
    b(
      "s2-modulos",
      "Módulos funcionales (C, A y B)",
      "Tabla Código | Nombre | Función | RN que resuelve (C, A, B).",
      `C — Valle Alerta Ciudadana — Reporte multicanal + geolocalización + cola offline — RN01, RN03, RN05
A — Valle Situación — Tablero GIS + mapa operativo + brigadas + evacuación — RN02, RN04, RN06
B — Valle Nexo — Hub datos + API integración + histórico + analítica — RN06, RN07`,
      "solucion",
    ),
    b(
      "s2-flujo-asistobe",
      "Flujo AS-IS → TO-BE",
      "Dos líneas: flujo actual informal vs flujo objetivo con módulos C, A, B y PMU.",
      `AS-IS: Persona → llamada/WhatsApp → Municipio (informal) → ¿Bomberos? (sin mapa, sin trazabilidad, sin georreferencia)

TO-BE: Ciudadano/Brigada → Canal oficial C → Validación Gestión Riesgos → Tablero A → Derivación Bomberos/CONAF → Coordinación PMU → Logística local → Cierre + Histórico B`,
      "solucion",
    ),
    b(
      "s2-prototipo-ui",
      "Prototipo de interfaz (wireframes / mockups)",
      "Etapa 5 del flujo SIGPI: mockups antes del desarrollo. Describa pantallas y pegue capturas (Figma, Excalidraw, captura de pantalla).",
      `HERRAMIENTAS SUGERIDAS: Figma, Excalidraw, draw.io, balsamiq.

PANTALLAS PRIORITARIAS SIGPI (Fase 1):
1. PWA ciudadana — reporte con mapa + foto + modo offline
2. Panel moderación — cola de reportes pendientes
3. Tablero PMU — mapa operativo + alertas activas
4. App brigada — foco en mapa + estado de unidad

CÓMO ADJUNTAR IMÁGENES EN ESTE BLOQUE:
• Pegue la URL pública de la imagen en una línea, o
• Use Markdown: ![PWA reporte](https://ejemplo.com/captura-pwa.png)
• O describa cada pantalla si aún no tiene mockup

PROTOTIPO 1 — PWA «Reportar incendio»
[Descripción: formulario + mapa + botón enviar]
![Prototipo PWA — pegar captura aquí]

PROTOTIPO 2 — Tablero PMU
[Descripción: mapa central, sidebar alertas, KPIs]
![Prototipo PMU — pegar captura aquí]

VALIDACIÓN CON USUARIO:
¿El flujo TO-BE del bloque anterior se refleja en las pantallas? ¿Qué cambió tras feedback del cliente?`,
      "solucion",
    ),
    b(
      "s2-bpmn-proceso",
      "BPMN / diagrama de proceso (AS-IS y TO-BE)",
      "Modelo de negocio del flujo operativo. Pegue diagrama BPMN o referencie el bloque AS-IS/TO-BE.",
      `AS-IS (resumen): evento detectado → canal informal → municipio sin trazabilidad → derivación tardía.

TO-BE (swimlanes sugeridas):
• Ciudadano | Gestión Riesgos | PMU | Bomberos/CONAF | Sistema SIGPI

[Inserte diagrama BPMN exportado desde Bizagi, Camunda Modeler o Excalidraw]
![BPMN TO-BE — pegar imagen o enlace]

Nota: si no usa BPMN formal, el bloque «Flujo AS-IS → TO-BE» cumple el mismo rol narrativo.`,
      "solucion",
    ),

    b(
      "s3-edt-concepto",
      "PARTE I — 1. ¿Qué es la EDT?",
      "Explicación en lenguaje claro: 4 paquetes, 14 entregables y relación con cronograma por actividades.",
      EV3_EDT_QUE_ES,
      "edt",
    ),
    b(
      "s3-edt-desglose",
      "1.3 EDT SIGPI — Vista general",
      "Los cuatro paquetes, los 14 entregables y las fases del proyecto.",
      EV3_EDT_INTRO_ARBOL,
      "edt",
    ),
    b(
      "s3-edt-paquete-1",
      "Paquete 1 — Gestión y administración",
      "Entregables 1.1–1.3 con actividades y salida esperada.",
      EV3_EDT_P1,
      "edt",
    ),
    b(
      "s3-edt-paquete-2",
      "Paquete 2 — Módulo C (Valle Alerta Ciudadana)",
      "Entregables 2.1–2.4: prototipo, app ciudadana, backend/alertas y despliegue.",
      EV3_EDT_P2,
      "edt",
    ),
    b(
      "s3-edt-paquete-3",
      "Paquete 3 — Módulo A (Valle Situación)",
      "Entregables 3.1–3.4: diseño, GIS/dashboard, app brigadas y pruebas.",
      EV3_EDT_P3,
      "edt",
    ),
    b(
      "s3-edt-paquete-4",
      "Paquete 4 — Módulo B (Valle Nexo)",
      "Entregables 4.1–4.3: modelo de datos, hub/integraciones y despliegue.",
      EV3_EDT_P4,
      "edt",
    ),
    b(
      "s3-edt-diccionario",
      "Diccionario completo de la EDT",
      "Tabla 1.1–4.6: código, responsable, duración, costo referencia, criterio de aceptación.",
      EDT_DICCIONARIO_COMPLETO,
      "edt",
    ),

    b(
      "ev3-secuencia",
      "2. Orden de trabajo y dependencias",
      "Por qué secuenciar, tipos de relación, dependencias obligatorias/externas, actividades ficticias.",
      EV3_SECUENCIA,
      "cronograma",
    ),
    b(
      "s4-cpm-concepto",
      "3. Estimación de tiempos — CPM y PERT",
      "Camino crítico, tres estimaciones a-m-b, fórmulas te y σ, ejemplo motor de alertas.",
      EV3_CPM_PERT,
      "cronograma",
    ),
    b(
      "ev3-redes",
      "4. Diagrama de redes (AoA)",
      "Círculos, flechas A B C, ficticias, ES EF LS LF y holgura en palabras simples.",
      EV3_REDES,
      "cronograma",
    ),
    b(
      "s4-red-cpm",
      "Cronograma en la app (semanas)",
      "Cómo usar pestaña PERT: E1–E4, ACTUALIZAR, Gantt según ES/EF, no meses.",
      `**En la plataforma (pestaña PERT/CPM):**

1. Elija **E1 Gestión**, **E2 Módulo C**, **E3 Módulo A** o **E4 Módulo B** (cada uno = cronograma de ese entregable con actividades A–F y códigos EDT 1.1, 2.1… en el nombre).
2. Complete **a, m, b** en semanas y pulse **ACTUALIZAR**.
3. Revise el **diagrama AoA** (círculos = eventos, flechas = actividades).
4. El **Gantt** se alinea solo con ES/EF del CPM — eje en **semanas**, no meses.

**Resumen E1–E4:** una fila por entregable grande (vista corta para la defensa).

**SIGPI completo:** plantilla con todas las letras enlazadas (A–X) si necesitan el proyecto entero en una sola red.`,
      "cronograma",
    ),
    b(
      "ev3-probabilidad",
      "5. Probabilidad de terminar a tiempo",
      "Z, tabla normal, ejemplo 37 sem y temporada de incendios.",
      EV3_PROBABILIDAD,
      "cronograma",
    ),
    b(
      "ev3-outsourcing",
      "6. Quién desarrolla y quién opera",
      "Proveedor vs municipalidad por función.",
      EV3_OUTSOURCING,
      "cronograma",
    ),
    b(
      "ev3-recursos-parte2",
      "PARTE II — Recursos y costos (resumen)",
      "Personas, plata, CAPEX/OPEX, equipo y enlace a Flujo de caja.",
      EV3_RECURSOS,
      "factibilidad",
    ),
    b(
      "s4-pert-formulas",
      "PERT — estimación probabilística",
      "Fórmulas te=(O+4M+P)/6, σ²=((P-O)/6)². Explicar O, M, P.",
      `te = (O + 4M + P) / 6
σ² = ((P - O) / 6)²
σ = (P - O) / 6

Calcule en pestaña PERT/CPM con columnas optimista, probable y pesimista.`,
      "cronograma",
    ),
    b(
      "s4-pert-tabla",
      "Tabla PERT — actividades críticas",
      "Tabla Actividad | O | M | P | te | σ | σ² y totales ruta crítica (~49 sem, σ≈2.6, rango 95%).",
      `Duración esperada ruta crítica: ~49 semanas (~12 meses con Fase 2)
σ total ≈ √6.6 ≈ 2.6 semanas
Rango 95%: 49 ± 5.1 semanas (43.9 – 54.1)

A1 Licitación: O6 M8 P14 → te 8.3
A5 Backend: O4 M5 P9 → te 5.5
A9 Visor GIS: O5 M7 P12 → te 7.2
(Completar resto en herramienta PERT)`,
      "cronograma",
    ),
    b(
      "s4-hitos-errores",
      "Hitos del proyecto y tasa de errores",
      "Hitos H1–H10 con semana y KPI. Tabla tasa de defectos por fase (UAT <5%).",
      `H6 UAT aprobado sem 33 — Tasa defectos <5% casos de prueba — APROBADO
H7 Piloto producción sem 35 — Sistema up >99.5%
H8 Evaluación piloto sem 37 — ≥40% reportes canal oficial

Tasa defectos = (defectos / casos prueba) × 100%`,
      "cronograma",
    ),

    b(
      "s5-arq-vs-infra",
      "Arquitectura vs infraestructura",
      "Diferencia lógica (capas, microservicios) vs físico/virtual (AWS, VPN, hardware).",
      `Arquitectura = planos (React → API → PostgreSQL/PostGIS → Firebase).
Infraestructura = cimientos (AWS EC2, RDS, S3, Lambda, CDN, VPN 4G brigadas).`,
      "arquitectura",
    ),
    b(
      "s5-arq-capas",
      "Arquitectura del sistema SIGPI",
      "Tabla Capa | Componentes | Tecnologías (presentación, gateway, servicios, datos, integraciones, infra).",
      `Presentación: PWA, Dashboard GIS, App brigadas — React/Next.js, Leaflet, PWA offline
API Gateway: NGINX / AWS API Gateway + JWT
Servicios: Reportes, Alertas, GIS, Usuarios, Integración — Node.js / FastAPI
Datos: PostgreSQL + PostGIS, Redis, RabbitMQ
Integraciones: Twilio, Firebase FCM, APIs CONAF/Bomberos
Infra: AWS EC2, RDS, S3, Lambda, CloudFront`,
      "arquitectura",
    ),
    b(
      "s5-infra-modulos",
      "Infraestructura por módulo",
      "Tabla Componente | Módulo C | A | B — hardware, software, conectividad, BD, CAPEX/OPEX.",
      `Módulo C: CAPEX USD 15–25k · OPEX USD 0.5–1.5k/mes
Módulo A: CAPEX USD 40–60k · OPEX USD 2–3k/mes
Módulo B: CAPEX USD 50–80k · OPEX USD 1–2k/mes`,
      "arquitectura",
    ),
    b(
      "s5-seguridad",
      "Principios de seguridad (mínimo privilegio)",
      "Roles: ciudadano, brigada, analista, admin TI, API externa — permisos por rol.",
      `Ciudadano: solo crear reportes
Brigada: mapa + su posición
Analista riesgos: validar, alertas, dashboard
Admin TI: plataforma sin datos personales usuarios
API externa: endpoints acordados, token scoped`,
      "arquitectura",
    ),

    b(
      "s6-fact-tecnica",
      "Factibilidad técnica",
      "Tabla Criterio | Particularidad | Obstáculo | Mitigación (infra, TI, compatibilidad, escalabilidad, seguridad).",
      `Infraestructura rural → offline-first + cola sync
TI acotado → proveedor + capacitación
Integración externa → Fase 2, conectores graduales
Escalabilidad → auto-scaling + pruebas de carga pre-verano
Seguridad → Security by Design, EIPD, auditoría`,
      "factibilidad",
    ),
    b(
      "s6-fact-organizacional",
      "Factibilidad organizacional",
      "Cambio cultural, soporte dirección, formación, roles, métricas adopción.",
      `WhatsApp/radio arraigados → piloto con métricas antes/después
Apoyo alcalde → wins antes del verano
Brecha digital → materiales simples + talleres brigadas
OPEX → incluir en contrato; moderadores honorarios estacionales`,
      "factibilidad",
    ),
    b(
      "s6-fact-legal",
      "Factibilidad legal y normativa",
      "Tabla Ley | Contenido | Vínculo SIGPI | Garantía cumplimiento (19.886, 19.628, 20.285, 21.364, 19.799).",
      `19.886 Compras públicas — Mercado Público — Bases y propuesta conforme criterios
19.628 Datos personales — Geolocalización reportantes — EIPD, consentimiento, cifrado
20.285 Transparencia — Trazabilidad alertas — Logs auditables
21.364 SINAPRED — Articulación nacional — APIs y protocolos
19.799 Documentos electrónicos — Evidencias digitales — Firma y resguardo`,
      "factibilidad",
    ),
    b(
      "s6-requisitos-licitacion",
      "Requisitos especiales de la licitación (proveedor)",
      "Lista: ChileProveedores, certificados, garantías, experiencia B2G, Ley 20.393, plan seguridad datos, seguros.",
      `• Inscripción ChileProveedores vigente
• Certificados tributario y previsional al día
• Boleta seriedad (~2–5%) y fiel cumplimiento (~5–10%)
• Experiencia B2G documentada
• Declaración Ley 20.393
• Plan seguridad datos Ley 19.628
• Seguros responsabilidad civil (recomendado)`,
      "factibilidad",
    ),

    b(
      "s7-alternativas",
      "Tres alternativas de implantación",
      "Tabla Alt. | Estrategia | Descripción | Ventajas | Desventajas.",
      `Alt.1 Gradual piloto→escala — Menor riesgo, más tiempo
Alt.2 Proveedor SaaS/llave en mano — Rapidez, SLA, 1 contrato — Dependencia, OPEX
Alt.3 Desarrollo interno TI — Control — Riesgo plazo y fallo en emergencia`,
      "alternativas",
    ),
    b(
      "s7-matriz",
      "Matriz multicriterio ponderada",
      "Resumen puntajes: Alt.1 345, Alt.2 355, Alt.3 265. Detalle editable en pestaña Matriz decisión.",
      `GANADORA: Alternativa 2 — Proveedor Especializado (355 pts)
Alt.1 Gradual: 345 pts
Alt.3 Interna: 265 pts

Criterios: Calidad 20%, Costo total CAPEX+OPEX 30%, Valor 15%, Mantenimiento 10%, Instalación 25%.`,
      "alternativas",
    ),
    b(
      "s7-justificacion",
      "Justificación de la alternativa seleccionada",
      "Fase 1 C+A meses 1–9, Fase 2 B meses 10–12. Razones calidad, costo, organización.",
      `Recomendación: Alt.2 con hoja de ruta por fases en un contrato.
Fase 1 (meses 1–9): módulos C + A — valor antes del verano.
Fase 2 (meses 10–12): módulo B — interoperabilidad e histórico.`,
      "alternativas",
    ),

    b(
      "s8-estado-resultados",
      "Estado de resultados simplificado (proveedor)",
      "Tabla Ingresos, costos variables/fijos, utilidad bruta, impuestos 27%, utilidad líquida. CAPEX contrato ~USD 115k.",
      `INGRESOS (contrato Fase 1+2): USD 115k
Costos variables (cloud, SMS): USD 28k/año
Costos fijos (equipo 12 meses): USD 62k
UTILIDAD BRUTA: USD 25k (~22% margen)
Impuestos 27%: USD 6.75k
UTILIDAD LÍQUIDA: USD 18.25k`,
      "financiera",
    ),
    b(
      "s8-inversion-inicial",
      "Inversión inicial (capital de trabajo)",
      "Salarios meses 1–3, cloud inicial, licencias, garantías licitación — total ~USD 22.3k.",
      `Salarios meses 1–3: USD 15k
Cloud inicial: USD 3k
Licencias dev: USD 2k
Garantías licitación (2%): USD 2.3k
TOTAL: USD 22.3k`,
      "financiera",
    ),
    b(
      "s8-depreciacion",
      "Activos fijos y depreciación",
      "Tablets, TVs, PCs, UPS — fórmula lineal anual. Total depreciación ~USD 4,045/año.",
      `Depreciación anual = (Valor inicial − Residual) / Vida útil
Tablets brigadas x12: USD 2,160/año
TV sala crisis: USD 400/año
PCs moderación: USD 945/año`,
      "financiera",
    ),
    b(
      "s8-amortizacion",
      "Activos intangibles y amortización",
      "Software SIGPI, capacitaciones, licencias GIS — total ~USD 9,000/año.",
      `Desarrollo software SIGPI: USD 6,000/año (5 años)
Capacitaciones: USD 2,000/año
Licencias GIS: USD 1,000/año`,
      "financiera",
    ),
    b(
      "s8-flujo-caja",
      "Flujo de caja del proyecto",
      "Tabla períodos M1–M12 y año 2 OPEX. Advertencia: utilidad ≠ flujo; meses sin cobro requieren capital de trabajo.",
      `⚠ Utilidad USD 18k pero flujos negativos en M1–M5 y M7–M9 sin hitos de pago.
M6 hito +USD 40k → equilibrio acumulado
M12 pago final → acumulado positivo
Año 2 OPEX neto ~+USD 6k/año`,
      "financiera",
    ),
    b(
      "s8-costos-fijos-variables",
      "Costos fijos vs variables",
      "Ejemplos SIGPI: salarios fijos; SMS y ancho de banda variables.",
      `FIJOS: salarios dev, PM, QA, oficina, herramientas
VARIABLES: SMS por emergencia, ancho de banda GIS, almacenamiento imágenes`,
      "financiera",
    ),
    b(
      "s8-ingresos-mercado",
      "Ingresos y mercado (B2G)",
      "CAPEX Fase 1 USD 65k, Fase 2 USD 50k, OPEX USD 24k/año, escalabilidad otros municipios.",
      `Fase 1 (C+A): USD 65k
Fase 2 (B): USD 50k
OPEX anual: USD 24k
Replicación regional: USD 40–50k por municipio adicional`,
      "financiera",
    ),

    b(
      "s9-casos-uso",
      "Diagrama de casos de uso",
      "Actores: Ciudadano, Analista, Brigada, Director TI, Sistema externo — casos de uso principales.",
      `Ciudadano: reportar, adjuntar evidencia, ver alertas
Analista Riesgos: validar, alertas masivas, dashboard
Brigada: mapa operativo, GPS, estado terreno
Director TI: usuarios, logs, configuración
Externo (Bomberos/CONAF): API alertas y focos`,
      "especificacion",
    ),
    b(
      "s9-actividad",
      "Diagrama de actividad — reporte ciudadano",
      "Flujo pasos 1–8 desde app hasta histórico y alertas masivas.",
      `1. Ciudadano abre app · 2. Geolocalización · 3. Tipo + evidencia · 4. Cola offline
5. Analista revisa · 6. Si válido → mapa + protocolo · 7. Si falso → archivar
8. Histórico B · 9. Si emergencia → SMS/push masivo`,
      "especificacion",
    ),
    b(
      "s9-componentes",
      "Diagrama de componentes",
      "Lista componentes: PWA, App brigadas, Dashboard, API Gateway, microservicios, BD, cola.",
      `PWA → API Gateway → Servicio Reportes → BD
App Brigadas → Servicio GIS
Motor Alertas → Twilio / Firebase
Servicio Integración → APIs externas
PostgreSQL + PostGIS + RabbitMQ`,
      "especificacion",
    ),
    b(
      "s9-uml-galeria",
      "Galería UML 4+1 — diagramas (pegar imágenes)",
      "Etapa 4 del flujo: casos de uso, actividad, componentes, despliegue. Adjunte exports PNG/SVG o enlaces. Los textos de los bloques anteriores describen el contenido.",
      `Vista 4+1 de SIGPI — adjunte un diagrama por sección.

━━━ 1. CASOS DE USO ━━━
(Ver también bloque «Diagrama de casos de uso»)
![UML casos de uso — pegar aquí]

━━━ 2. DIAGRAMA DE ACTIVIDAD (reporte ciudadano) ━━━
![UML actividad — pegar aquí]

━━━ 3. DIAGRAMA DE COMPONENTES ━━━
![UML componentes — pegar aquí]

━━━ 4. DIAGRAMA DE DESPLIEGUE (AWS) ━━━
Nodos: CloudFront, ALB, ECS/EKS, RDS PostgreSQL+PostGIS, S3, Twilio
![UML despliegue — pegar aquí]

━━━ 5. ESCENARIOS / SECUENCIA (opcional) ━━━
Ej.: secuencia «Validar reporte y disparar alerta SMS»
![UML secuencia — pegar aquí]

HERRAMIENTAS: StarUML, PlantUML, draw.io, Visual Paradigm, Excalidraw.`,
      "especificacion",
    ),

    b(
      "s10-outsourcing",
      "Outsourcing vs desarrollo in-house",
      "Definir outsourcing (Alt.2 recomendada) vs in-house (Alt.3 descartada). Modelo: proveedor desarrolla, municipio opera.",
      `Recomendado: outsourcing desarrollo + insourcing operación (moderación y análisis de riesgos en municipalidad).`,
      "ejecucion",
    ),
    b(
      "s10-funciones",
      "Qué se externaliza vs qué queda interno",
      "Tabla Función | Quién | Justificación.",
      `Desarrollo A,B,C — Proveedor — Capacidad TI insuficiente
Cloud — Proveedor/AWS — SLA
Moderación reportes — Municipal honorarios — Conocimiento local
Análisis riesgos — Planta municipal — No delegable
Capacitación — Proveedor + municipio — Metodología + contexto`,
      "ejecucion",
    ),

    b(
      "s11-5w1h",
      "Estudio técnico — 5W1H",
      "Tabla Qué, Cuándo, Cómo, Dónde, Cuánto, Quién para SIGPI.",
      `QUÉ: SIGPI módulos C, A, B
CUÁNDO: F1 meses 1–9, F2 10–12, operativo antes del verano
CÓMO: Licitación Alt.2, Scrum, CI/CD, AWS
DÓNDE: Municipalidad + terreno + dispositivos ciudadanos
CUÁNTO: CAPEX USD 115k, OPEX USD 24k/año
QUIÉN: Proveedor 5 roles + analista riesgos + moderadores`,
      "ejecucion",
    ),
    b(
      "s11-tamano-equipo",
      "Tamaño óptimo del sistema y organización del equipo",
      "Escenarios uso normal vs emergencia. Tabla roles PM, dev, GIS, DevOps, analista, moderadores.",
      `Normal: 5–20 internos + reportes esporádicos
Emergencia: 200–500 reportes simultáneos → auto-scaling obligatorio
Equipo: PM, Dev x2, GIS, DevOps 60%, Analista riesgos, Moderadores x2 estacionales`,
      "ejecucion",
    ),

    b(
      "s12-sintesis",
      "Síntesis del proyecto",
      "Viñetas: problema cuantificado, solución, viabilidad técnica/org/legal, justificación financiera.",
      `• Problema crítico: 35 min, 65% sin canal, 73% alertas tardías
• SIGPI cubre RN01–RN07
• Viable técnicamente, organizacionalmente y legalmente
• Reducción 40% superficie con 15 min anticipación justifica inversión`,
      "conclusiones",
    ),
    b(
      "s12-correcciones",
      "Ajustes metodológicos del informe",
      "Lista de correcciones o precisiones metodológicas aplicadas al análisis (rol licitación, fuentes, matriz, EDT, cronograma, finanzas).",
      `• Rol en licitación: empresa respondiente, no generadora de bases
• Requisitos trazados a entrevistas y encuestas
• Matriz multicriterio con escala y ponderaciones explícitas
• EDT en 4 paquetes con diccionario
• CPM/PERT con ruta crítica, holguras y PERT
• Evaluación financiera integrada`,
      "conclusiones",
    ),
    b(
      "s12-plan-accion",
      "Plan de acción inmediato",
      "Tabla Acción | Responsable | Plazo | Resultado.",
      `ChileProveedores — Equipo — Inmediato
Propuesta técnica — Equipo — Antes cierre bases
Cotizar AWS — DevOps — Semana 1
SLA contrato — PM — Con propuesta
Capacitación brigadas — PM — Fase 1 mes 4
Piloto pre-verano — Todo — Antes dic`,
      "conclusiones",
    ),
    b(
      "s12-kpis",
      "KPIs mínimos de éxito",
      "Tabla KPI | Actual | Meta F1 | Meta F2.",
      `Tiempo inicio→reporte: 35 min → <20 min → <10 min
% canal oficial: 22% → ≥50% → ≥75%
Georreferenciados: ~10% → ≥80% → ≥95%
Disponibilidad emergencia: N/A → ≥99.5% → ≥99.9%
Alertas <5 min: N/A → ≥90% → ≥99%`,
      "conclusiones",
    ),
    b(
      "s12-cierre-final",
      "Cierre del documento",
      "Línea final: equipo, asignatura, año.",
      `Fin del Documento Central Integral — SIGPI — Municipalidad Valle del Sol
Equipo: Gabriel Aguila · Alex Ampuero · Christian Mesa | GPY1101 | 2026`,
      "conclusiones",
    ),
  ]
}
