/**
 * EV3 — Estudio técnico SIGPI en lenguaje claro (Documento central).
 * Estilo informe académico legible, no solo apuntes técnicos.
 */

export const EV3_FICHA = `| Campo | Información |
|-------|-------------|
| Asignatura | GPY1101 – Evaluación de Proyectos de Software |
| Equipo | Gabriel Aguila · Alex Ampuero · Christian Mesa |
| Docente | Gabriela Ruiz Acevedo |
| Organización | Municipalidad Valle del Sol – Región San Jorge |
| Proyecto | SIGPI (Sistema Integrado de Gestión y Prevención de Incendios) |
| Versión | EV3 – Mayo 2026 |

Somos una empresa que **responde** a la licitación de la municipalidad (ChileCompra / Ley 19.886). No somos quienes publican la licitación: presentamos una propuesta para construir y dejar operativo el sistema.`

export const EV3_5W1H = `Este estudio responde seis preguntas que ordenan todo el proyecto. Dos ya se trabajaron en evaluaciones anteriores; aquí cerramos **cuándo** y **cuánto**.

| Pregunta | Respuesta en pocas palabras | Estado |
|----------|----------------------------|--------|
| **QUÉ** — Alcance | SIGPI con módulos C (ciudadanos), A (operaciones/GIS) y B (datos e integración). Requisitos RN01–RN07 | EV1 y EV2 |
| **CÓMO** — Orden del trabajo | EDT en 4 paquetes; desarrollo por fases; Scrum; nube AWS | EV2 + este informe |
| **CUÁNDO** — Calendario | Tiempos con PERT y CPM; ruta crítica; Gantt en **semanas** | **Este documento** + pestaña PERT |
| **DÓNDE** — Lugar | Municipalidad, brigadas en terreno, ciudadanos con el celular | EV2 |
| **CUÁNTO** — Plata | Personas, equipos, licencias y dinero por paquete de trabajo | **Este documento** + Flujo de caja |
| **QUIÉN** — Equipo | Proveedor desarrolla; municipalidad opera y decide en emergencias | EV2 |

**En la app:** pestaña **EDT** (árbol), **PERT/CPM** (cronograma E1–E4), **Flujo de caja** (dinero).`

export const EV3_EDT_QUE_ES = `## 1. La EDT: qué es y para qué sirve

La **EDT** (también llamada WBS) es un “árbol” que parte del proyecto completo y lo va partiendo en piezas más pequeñas hasta llegar a trabajos que se pueden **asignar, estimar en semanas y aceptar** cuando estén listos.

**Idea clave:** en la EDT hablamos de **entregables** (qué queda listo), no solo de “tareas sueltas”.  
Ejemplo: no decimos solo “programar”; decimos “API de reportes funcionando y probada”.

**Niveles en SIGPI (sin complicarse):**

| Nivel | Nombre | Ejemplo |
|-------|--------|---------|
| 0 | Proyecto | SIGPI completo |
| 1 | Paquete grande | Gestión · Módulo C · Módulo A · Módulo B |
| 2 | Subpaquete | 1.1, 2.1, 3.2… (cada fila de las tablas de abajo) |
| Detalle | Entregables del subpaquete | Lista de lo que debe quedar hecho (wireframes, app, etc.) |

**No hace falta llegar a 6 niveles** en todos los paquetes. En SIGPI basta con desglosar hasta **subpaquete (2.x)** y describir entregables; el **cronograma** usa letras A, B, C… (pestaña PERT → E1, E2, E3, E4).

**Relación EDT ↔ PERT:**  
- EDT = el menú completo de lo que hay que entregar.  
- PERT = el calendario con semanas y el orden (quién va después de quién).`

export const EV3_EDT_PAQUETES = `## 1.3 EDT SIGPI — los cuatro paquetes

### PAQUETE 1 — Gestión y administración

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 1.1 | Inicio | Plan del proyecto, acta de inicio, cronograma base |
| 1.2 | Contrato y legal | Contrato firmado, cumplimiento de bases |
| 1.3 | Calidad | Plan de calidad, listas de revisión |
| 1.4 | Riesgos | Matriz de riesgos y qué hacer si pasa algo |
| 1.5 | Comunicaciones | Informes de avance a la municipalidad |
| 1.6 | Capacitación | Talleres para que la gente use el sistema |

**Cronograma:** pestaña PERT → **E1 Gestión** (actividades A–F).

---

### PAQUETE 2 — Módulo C: Valle Alerta Ciudadana

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 2.1 | Diseño | Requisitos, bocetos, prototipo aprobado |
| 2.2 | App ciudadana | App/PWA con mapa, foto y reporte (funciona con poca señal) |
| 2.3 | Backend | Servidor que recibe y valida reportes |
| 2.4 | Alertas | SMS y avisos cuando hay riesgo |
| 2.5 | Panel municipal | Pantalla para validar reportes de vecinos |
| 2.6 | Pruebas y salida | Pruebas con usuarios reales y puesta en marcha piloto |

**Cronograma:** pestaña PERT → **E2 Módulo C**.

---

### PAQUETE 3 — Módulo A: Valle Situación

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 3.1 | Diseño | Requisitos del tablero y mapas |
| 3.2 | Mapa GIS | Mapa en vivo con focos y brigadas |
| 3.3 | Dashboard | Panel para la sala de crisis (KPI, estado) |
| 3.4 | App brigadas | App para personal en terreno |
| 3.5 | Sala de crisis | Equipos y conexión de la sala |
| 3.6 | Pruebas y salida | Pruebas con brigadas y go-live Fase 1 |

**Cronograma:** pestaña PERT → **E3 Módulo A**.

---

### PAQUETE 4 — Módulo B: Valle Nexo

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 4.1 | Diseño | Modelo de datos e integraciones |
| 4.2 | Hub de datos | Histórico y consultas rápidas |
| 4.3 | APIs externas | Conexión CONAF, Bomberos, SENAPRED |
| 4.4 | Reportes | Análisis y reportes para autoridades |
| 4.5 | Seguridad | Protección de datos y auditoría |
| 4.6 | Cierre Fase 2 | Pruebas finales y entrega |

**Cronograma:** pestaña PERT → **E4 Módulo B** (después de terminar C y A en piloto).`

export const EV3_EDT_P1 = `### PAQUETE 1 — Gestión y administración

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 1.1 | Inicio | Plan del proyecto, acta de inicio, cronograma base |
| 1.2 | Contrato y legal | Contrato firmado, cumplimiento de bases |
| 1.3 | Calidad | Plan de calidad, listas de revisión |
| 1.4 | Riesgos | Matriz de riesgos y qué hacer si pasa algo |
| 1.5 | Comunicaciones | Informes de avance a la municipalidad |
| 1.6 | Capacitación | Talleres para que la gente use el sistema |

**Cronograma:** pestaña PERT → **E1 Gestión** (actividades A–F).`

export const EV3_EDT_P2 = `### PAQUETE 2 — Módulo C: Valle Alerta Ciudadana

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 2.1 | Diseño | Requisitos, bocetos, prototipo aprobado |
| 2.2 | App ciudadana | App/PWA con mapa, foto y reporte (funciona con poca señal) |
| 2.3 | Backend | Servidor que recibe y valida reportes |
| 2.4 | Alertas | SMS y avisos cuando hay riesgo |
| 2.5 | Panel municipal | Pantalla para validar reportes de vecinos |
| 2.6 | Pruebas y salida | Pruebas con usuarios reales y puesta en marcha piloto |

**Cronograma:** pestaña PERT → **E2 Módulo C**.`

export const EV3_EDT_P3 = `### PAQUETE 3 — Módulo A: Valle Situación

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 3.1 | Diseño | Requisitos del tablero y mapas |
| 3.2 | Mapa GIS | Mapa en vivo con focos y brigadas |
| 3.3 | Dashboard | Panel para la sala de crisis (KPI, estado) |
| 3.4 | App brigadas | App para personal en terreno |
| 3.5 | Sala de crisis | Equipos y conexión de la sala |
| 3.6 | Pruebas y salida | Pruebas con brigadas y go-live Fase 1 |

**Cronograma:** pestaña PERT → **E3 Módulo A**.`

export const EV3_EDT_P4 = `### PAQUETE 4 — Módulo B: Valle Nexo

| Código | Qué incluye | Entregables principales |
|--------|-------------|------------------------|
| 4.1 | Diseño | Modelo de datos e integraciones |
| 4.2 | Hub de datos | Histórico y consultas rápidas |
| 4.3 | APIs externas | Conexión CONAF, Bomberos, SENAPRED |
| 4.4 | Reportes | Análisis y reportes para autoridades |
| 4.5 | Seguridad | Protección de datos y auditoría |
| 4.6 | Cierre Fase 2 | Pruebas finales y entrega |

**Cronograma:** pestaña PERT → **E4 Módulo B** (después de terminar C y A en piloto).`

export const EV3_EDT_INTRO_ARBOL = `## Vista general del proyecto

**Nivel 0:** SIGPI — Sistema Integrado de Gestión y Prevención de Incendios

**Nivel 1 — Cuatro paquetes:**
1. Gestión y administración  
2. Módulo C (Valle Alerta Ciudadana)  
3. Módulo A (Valle Situación)  
4. Módulo B (Valle Nexo)

**Fases:** Fase 1 = paquetes 1 + 2 + 3 (piloto antes del verano). Fase 2 = paquete 4.

Árbol editable en pestaña **EDT visual**. Tablas detalladas en los bloques siguientes.`

export const EV3_SECUENCIA = `## 2. Orden de trabajo y dependencias

Cuando la EDT está lista, hay que definir **qué va antes que qué**. No todo se puede hacer a la vez.

**Para qué sirve:**
- Ver el camino completo del proyecto.
- Saber cuánto dura en total (CPM).
- Saber qué actividades **no pueden atrasarse** (ruta crítica).

**Tipos de relación (en palabras simples):**

| Tipo | Significado | Ejemplo SIGPI |
|------|-------------|---------------|
| Fin → Inicio | Lo habitual: B empieza cuando A termina | Backend después del diseño |
| Inicio → Inicio | Dos cosas parten juntas | Análisis módulo C y A tras la licitación |
| Fin → Fin | Dos cosas deben terminar juntas | Cierre de pruebas coordinado |

**Dependencias:**
- **Obligatoria:** no se puede saltar (ej. probar sin haber construido).
- **Discrecional:** el equipo lo define por buena práctica.
- **Externa:** depende de otro (ej. CONAF habilita la API).
- **Interna:** entre actividades del mismo proyecto.

**Actividad ficticia (dummy):** flecha punteada, **cero semanas**, solo para que el diagrama no se confunda cuando dos caminos se juntan. Se ve en la pestaña PERT al usar diagrama **AoA** (círculos = momentos, flechas = trabajo A, B, C…).`

export const EV3_CPM_PERT = `## 3. Tiempos: CPM y PERT

### CPM (camino crítico)
Usa **una duración** por actividad (la más probable) y calcula la **fecha más corta posible** del proyecto. La **ruta crítica** es la cadena de trabajos sin margen: si uno se atrasa, se atrasa todo.

### PERT (tres estimaciones)
En la vida real no sabemos el tiempo exacto. Por eso cada actividad tiene:
- **a (optimista):** si todo sale bien.
- **m (probable):** lo normal.
- **b (pesimista):** si hay problemas.

**Fórmulas:**
- Tiempo esperado: **te = (a + 4·m + b) / 6**
- Incertidumbre: **σ = (b − a) / 6**

**Ejemplo — Motor de alertas (módulo C):**  
a = 3 sem · m = 4 sem · b = 7 sem → **te ≈ 4,3 semanas**

En la app: tabla con columnas a, m, b → pulse **ACTUALIZAR** → ve μ del proyecto y ruta crítica.`

export const EV3_REDES = `## 4. Diagrama de redes (AoA)

Es el **dibujo del proyecto**:
- **Círculo** = un momento (evento 1 = INICIO, último = FIN).
- **Flecha con letra** = una actividad (A, B, C…) con duración en semanas.
- **Flecha punteada** = ficticia (solo lógica, 0 semanas).

**Cuatro tiempos por actividad** (pestaña PERT, cuadros debajo del diagrama):

| Sigla | Nombre | En simple |
|-------|--------|-----------|
| ES | Inicio más temprano | Lo antes que puede empezar |
| EF | Fin más temprano | Lo antes que puede terminar |
| LS | Inicio más tardío | Lo último que puede empezar sin retrasar el proyecto |
| LF | Fin más tardío | Lo último que puede terminar sin retrasar el proyecto |

**Holgura** = LS − ES (si es **0**, la actividad es **crítica**).

**Importante:** la ruta crítica se calcula **después** de tener actividades con tiempos y dependencias en la red — no se inventa antes.`

export const EV3_PROBABILIDAD = `## 5. ¿Llegamos a la fecha del verano?

Con la ruta crítica identificada, se suman las incertidumbres (σ) de esas actividades y se puede preguntar: *¿cuál es la probabilidad de terminar antes de la temporada de incendios?*

**Fórmula:** Z = (fecha objetivo − duración esperada) / σ del proyecto  
Se consulta en la **tabla normal** de la pestaña PERT.

**Ejemplo ilustrativo:**  
Si el proyecto esperado dura **37 semanas** con σ ≈ **2,6 sem**, y la municipalidad necesita el piloto en **40 semanas**:  
Z ≈ 1,15 → probabilidad cercana al **87%** de cumplir (según tabla Z).

Sirve para conversar con la municipalidad con números, no solo con fechas “a ojo”.`

export const EV3_OUTSOURCING = `## 6. Quién hace qué: externo o municipal

| Función | Quién lo hace | Por qué |
|---------|---------------|---------|
| Programar SIGPI | Empresa proveedora (licitación) | Capacidad técnica GIS, apps y nube |
| Operar en emergencia | Personal municipal | Conocen el territorio y la autoridad |
| Moderar reportes vecinos | Municipalidad (refuerzo estacional) | Es decisión pública |
| Nube (AWS) | Contrato con proveedor | Escala y respaldo |
| Convenios CONAF/Bomberos | Municipalidad + apoyo técnico | Los acuerdos los firma la autoridad |

**Modelo recomendado:** el proveedor **construye**; la municipalidad **usa y decide** en el día a día.`

export const EV3_RECURSOS = `---

# PARTE II — RECURSOS Y COSTOS (resumen)

## 7. Qué necesitamos para ejecutar

Por cada subpaquete de la EDT se define:
- **Personas** (PM, desarrolladores, GIS, municipalidad).
- **Cosas físicas** (tablets brigadas, pantallas sala crisis, servidores en nube).
- **Conocimiento** (código, manuales, licencias).
- **Dinero** (presupuesto licitación, FNDR, operación anual).

**Orden correcto:** EDT → tiempos (PERT) → recursos y costos. No al revés.

## 8. Equipo principal (humanos)

| Rol | Quién | Para qué |
|-----|-------|----------|
| Jefe de proyecto | Proveedor | Coordina y habla con la municipalidad |
| Desarrolladores | Proveedor | Módulos C y A |
| Especialista mapas (GIS) | Proveedor | Módulo A |
| DevOps / nube | Proveedor | Despliegue y seguridad |
| Analista de riesgos | Municipalidad | Valida reportes y opera dashboard |
| Moderadores | Municipalidad (temporada) | Revisan reportes ciudadanos |

## 9. Plata (en simple)

- **CAPEX:** plata fuerte al inicio (desarrollo, compra equipos).
- **OPEX:** gasto mensual después (nube, SMS, soporte).
- **Capital de trabajo:** dinero del proveedor para pagar sueldos **antes** del primer hito de pago municipal.

Detalle numérico: pestaña **Flujo de caja** y **Matriz de decisión**.

---

*Documento elaborado: Gabriel Aguila · Alex Ampuero · Christian Mesa — GPY1101 — Mayo 2026*`

/** IDs de bloques del informe humano EV3 (para merge en localStorage) */
export const EV3_HUMAN_BLOCK_IDS = new Set([
  "meta-ficha",
  "ev3-5w1h",
  "s3-edt-concepto",
  "s3-edt-desglose",
  "s3-edt-paquete-1",
  "s3-edt-paquete-2",
  "s3-edt-paquete-3",
  "s3-edt-paquete-4",
  "s3-edt-diccionario",
  "ev3-secuencia",
  "s4-cpm-concepto",
  "s4-red-cpm",
  "ev3-redes",
  "ev3-probabilidad",
  "ev3-outsourcing",
  "ev3-recursos-parte2",
])
