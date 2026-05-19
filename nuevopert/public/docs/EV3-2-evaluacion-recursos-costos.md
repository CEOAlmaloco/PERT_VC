# EV3-2 — Estimación de recursos, costos y evaluación económica

**Curso:** GPY1101 · **Caso:** SIGPI — Municipalidad Valle del Sol  
**Rol del equipo:** Empresa licitante (proveedor) que responde en Mercado Público (Ley 19.886)

Esta guía responde punto por punto los apuntes de **EV3-2** y los conecta con lo que ya tiene en la plataforma: **Documento central**, **EDT**, **PERT/CPM**, **Flujo de caja** y **Matriz de decisión**.

---

## Índice

1. [5W1H aplicado al proyecto](#1-5w1h-aplicado-al-proyecto)
2. [Estimación por paquete de trabajo](#2-estimación-por-paquete-de-trabajo)
3. [Tipos de recursos](#3-tipos-de-recursos)
4. [Recursos físicos: arriendo vs compra](#4-recursos-físicos-arriendo-vs-compra)
5. [Inversión, costos y rentabilidad](#5-inversión-costos-y-rentabilidad)
6. [Evaluación costo-beneficio](#6-evaluación-costo-beneficio)
7. [Vida útil técnica vs vida útil contable](#7-vida-útil-técnica-vs-vida-útil-contable)
8. [Utilidad y formas de clasificar costos](#8-utilidad-y-formas-de-clasificar-costos)
9. [Estimación de costo con tres puntos (como PERT)](#9-estimación-de-costo-con-tres-puntos-como-pert)
10. [¿Cuánto cobrar para no tener pérdida?](#10-cuánto-cobrar-para-no-tener-pérdida)
11. [Ejemplo del curso: vender sandwiches](#11-ejemplo-del-curso-vender-sandwiches)
12. [Recursos económicos: propios, ajenos y sostenibilidad](#12-recursos-económicos-propios-ajenos-y-sostenibilidad)
13. [Contratos y presupuesto](#13-contratos-y-presupuesto)
14. [Enfoques de estimación: bottom-up y top-down](#14-enfoques-de-estimación-bottom-up-y-top-down)
15. [Costos directos, indirectos y ciclo de vida](#15-costos-directos-indirectos-y-ciclo-de-vida)
16. [Momento 0, capital de trabajo e inversión](#16-momento-0-capital-de-trabajo-e-inversión)
17. [¿Qué se hace en este paso?](#17-qué-se-hace-en-este-paso)
18. [Requisitos previos](#18-requisitos-previos)
19. [Mapa rápido: dónde está cada cosa en la plataforma](#19-mapa-rápido-dónde-está-cada-cosa-en-la-plataforma)

---

## 1. 5W1H aplicado al proyecto

El **5W1H** ordena el estudio técnico-económico. En SIGPI cada pregunta se responde con **entregables distintos** (no todo va en un solo párrafo).

| Pregunta | Significado en evaluación | Qué es en SIGPI | Dónde en la plataforma |
|----------|---------------------------|-----------------|------------------------|
| **QUÉ** | **Alcance** — qué se entrega y qué queda fuera | SIGPI: módulos C (Valle Alerta), A (Valle Situación), B (Valle Nexo); RN01–RN07; Fase 1 = C+A, Fase 2 = B | Documento → requisitos, módulos, solución · EDT (paquetes 2–4) |
| **CÓMO** | **Método / desglose** — cómo se organiza el trabajo | EDT/WBS: Gestión + paquetes por módulo (1.1–4.6); procesos AS-IS/TO-BE; arquitectura | Pestaña **EDT** · Documento → EDT, BPMN, UML |
| **CUÁNDO** | **Tiempo** — calendario y dependencias | CPM/PERT: red de actividades, ruta crítica (~37 sem Fase 1 en informe), Gantt 18 meses | Pestaña **PERT/CPM** · Documento → cronograma |
| **DÓNDE** | **Espacio físico / despliegue** | Comuna Valle del Sol, Región San Jorge; nube (AWS); PMU; terreno con brigadas; conectividad rural | Documento → contexto, infraestructura, despliegue |
| **CUÁNTO** | **Dinero** — ¿vale la pena? | Ingresos contrato ~USD 115k, costos, KT, VAN/TIR, flujo de caja | Pestaña **Flujo de caja** · Documento → s8 finanzas |
| **QUIÉN** | Stakeholders y equipo | Municipio, Dir. Riesgos, brigadas, proveedor licitante | Documento → ficha, entrevistas, 5W1H bloque s11 |

### QUÉ = Alcance (detalle)

- **Incluye:** plataforma integrada, reporte ciudadano, mapa operativo, alertas, histórico (según fase).
- **Excluye (ejemplo):** operación permanente de brigadas por parte del proveedor, compra de terrenos, políticas forestales de CONAF.
- **Criterio:** si no está en el contrato o en la EDT, no se presupuesta como entregable del proveedor.

### CÓMO = EDT (y lo que definieron en Excel)

La **EDT** responde *cómo* se descompone el proyecto en **entregables**, no solo en “tareas de programación”.

```
Nivel 0: SIGPI completo
├── Paquete 1 — Gestión (contrato, calidad, riesgos, capacitación)
├── Paquete 2 — Módulo C (PWA ciudadana, alertas, moderación)
├── Paquete 3 — Módulo A (GIS, dashboard, brigadas, sala crisis)
└── Paquete 4 — Módulo B (hub datos, API, analítica, seguridad)
```

Cada ítem 2.1, 2.2… debe tener en el **diccionario EDT**: responsable, duración, costo estimado, criterio de aceptación.

### CUÁNDO = CPM y PERT

- **CPM:** tiempo **esperado** (Te) y **ruta crítica** (cadena sin holgura).
- **PERT:** tres estimaciones por actividad (optimista **a**, probable **m**, pesimista **b**):

```
Te = (a + 4·m + b) / 6
σ² = ((b − a) / 6)²
```

El **cuándo** del proyecto = fecha fin de la ruta crítica + hitos de contrato (UAT, despliegue pre-verano).

### DÓNDE = Espacio físico

| Lugar | Uso en SIGPI |
|-------|----------------|
| Oficina proveedor / remoto | Desarrollo, PM, QA |
| Nube (AWS u otra) | Hosting SIGPI, BD, APIs |
| Municipalidad / PMU | Tablero operativo, sala crisis |
| Terreno comuna | Brigadas con app móvil, conectividad variable |
| Ciudadanía (móvil) | PWA reportes, geolocalización |

### CUÁNTO = Dinero

No es un solo número: incluye **CAPEX**, **OPEX**, **capital de trabajo**, **flujo de caja**, **VAN/TIR**. Ver secciones 5–10 y pestaña Flujo de caja.

---

## 2. Estimación por paquete de trabajo

Por **cada paquete EDT** (o paquete de trabajo) debe quedar claro:

| Pregunta | Qué documentar |
|----------|----------------|
| ¿Qué trabajo hay que hacer? | Lista de entregables/tareas del paquete (EDT + diccionario) |
| ¿Qué recursos humanos? | Roles, horas, tarifas (PM, dev front/back, GIS, QA, DevOps) |
| ¿Qué recursos físicos? | Tablets, servidores, sala crisis — compra o arriendo |
| ¿Qué recursos intelectuales? | Diseño, código, licencias, metodología |
| ¿Qué recursos económicos? | Plata propia vs préstamo vs pago del cliente |
| ¿Cuándo se usan? | Cronograma (PERT/Gantt) — mes/semana |
| ¿Cuánto cuesta? | Presupuesto del paquete → suma al total |

**No solo desarrollo:** el Paquete 1 (Gestión) incluye contrato, riesgos, comunicaciones, capacitación — también consume recursos humanos y costos.

### Ejemplo SIGPI — Paquete 2 (Módulo C) esquema

| Recurso | Ejemplo | Cuándo | Costo orientativo |
|---------|---------|--------|-------------------|
| HH | 1 dev front, 1 dev back, 0,5 QA | Meses 2–5 | Sueldos × meses |
| Físico | Tablets prueba (compra) | P0 | Inversión + depreciación |
| Intelectual | Diseño UX PWA, API reportes | Meses 2–4 | HH + licencias |
| Económico | KT para pagar HH antes del hito | P0 | Capital de trabajo |
| Operación | SMS Twilio (variable) | Post go-live | Costo variable por alerta |

---

## 3. Tipos de recursos

### 3.1 Recursos humanos (HH)

Personas y tiempo: PM, desarrolladores, especialista GIS, moderadores, capacitación.

- Se estiman en **horas o meses × tarifa**.
- En licitación: organigrama del proveedor + dedicación por fase.
- **Gestión** también es HH (no es “gratis”): reuniones, informes, control de cambios.

### 3.2 Recursos físicos

**Bienes tangibles:** edificios, instalaciones, máquinas, equipos, materias primas.

En SIGPI: tablets brigadas, PCs moderación, TVs sala crisis, servidores (si on-premise), UPS.

### 3.3 Recursos intelectuales

- Trabajo intelectual del equipo: análisis, diseño UML, código, pruebas.
- **Bienes intangibles** desarrollados: software SIGPI, documentación, capacitaciones — se **amortizan** en contabilidad.

### 3.4 Recursos económicos

El **dinero** que financia el proyecto:

| Tipo | Descripción |
|------|-------------|
| **Recursos propios** | Utilidades retenidas, aportes de socios |
| **Recursos ajenos** | Préstamos bancarios, leasing, **pago del cliente (municipio)** |

En SIGPI el ingreso principal del proveedor son los **hitos del contrato municipal** (recurso ajeno en el sentido de que no es “caja propia”, es cobro al cliente).

---

## 4. Recursos físicos: arriendo vs compra

**Regla clave para la evaluación económica:**

| Situación | Tratamiento típico | En flujo de caja |
|-----------|-------------------|------------------|
| **Compra** de activo (tablet, servidor) | **Inversión** en período 0 (o año de compra) + **depreciación** años siguientes | Salida de caja al comprar; GND en resultados |
| **Arriendo** (oficina, servidor cloud “puro”, leasing) | **Costo** (fijo o variable) del período | Salida de caja cada mes/año |
| **Cloud consumo** (pago por uso) | Suele ser **costo variable** | Según facturación |

**No es lo mismo:** comprar un servidor es invertir; arrendar el mismo servidor es gastar. Mezclarlos distorsiona VAN y utilidad.

### SIGPI

- **Compra/inversión:** tablets, equipos sala crisis → P0 + depreciación.
- **Arriendo/costo:** oficina temporal, algunos servicios SaaS con cuota fija.
- **Variable:** SMS, GB GIS en emergencia.

---

## 5. Inversión, costos y rentabilidad

```
Rentabilidad del proyecto (visión proveedor) =
  ¿Los ingresos del contrato cubren costos + inversión + retorno exigido?
```

| Concepto | Significado |
|----------|-------------|
| **Inversión** | Desembolso inicial para que exista el proyecto (activos + KT) |
| **Costos** | Gastos de operar (fijos + variables) durante la ejecución |
| **Ingresos** | Pagos del municipio por hitos |
| **Rentabilidad** | Se mide con **utilidad**, **flujo de caja**, **VAN**, **TIR** |

**Relación:** primero invierto y gasto (salidas); después cobro hitos (entradas). Si cobro tarde, necesito **capital de trabajo** aunque la utilidad final sea positiva.

---

## 6. Evaluación costo-beneficio

Compara **costos totales** del proyecto con **beneficios** (ingresos contractuales + beneficios intangibles si el curso los pide: menos riesgo reputacional, replicación a otros municipios).

### Pasos recomendados

1. Identificar **costos** (directos, indirectos, ciclo de vida).
2. Identificar **beneficios** cuantificables (contrato USD 115k referencia informe).
3. Construir **flujo de caja** por período.
4. Calcular **VAN** y **TIR** con tasa de descuento justificada.
5. Conclusión: aceptar / rechazar / condicionar (ej. solo Fase 1).

### Criterio simple del curso

- **VAN > 0** → el proyecto genera valor a la tasa de descuento usada.
- **TIR > TD** (tasa exigida) → conviene respecto al costo de oportunidad del dinero.

---

## 7. Vida útil técnica vs vida útil contable

| | Vida útil **técnica** | Vida útil **contable** |
|---|----------------------|------------------------|
| **Pregunta** | ¿Cuánto dura útil el activo en operación? | ¿En cuántos años contablemente reparto su costo? |
| **Ejemplo tablet** | 3–4 años en terreno (desgaste, obsolescencia) | 3 años depreciación lineal en libros |
| **Ejemplo software** | 5+ años si se mantiene | 5 años amortización intangible |
| **Impacto** | Cuándo hay que **reponer** el activo | Cuánto **GND** aparece cada año en el estado de resultados |

Si vida técnica < contable: el activo deja de servir antes de depreciarse contablemente → revisar residual o acelerar depreciación (según política contable del curso).

---

## 8. Utilidad y formas de clasificar costos

### Utilidad básica

```
Utilidad bruta ≈ Ingresos − Costos directos principales
Utilidad (BAI) = Ingresos − Costos totales (incl. GND, intereses según plantilla)
Utilidad líquida (UAI) = BAI − Impuestos
```

### Clasificación por comportamiento

| Tipo | Definición | SIGPI |
|------|------------|-------|
| **Costo fijo (CF)** | No cambia con cantidad de uso | Sueldos, arriendo, cloud mínimo |
| **Costo variable (CV)** | Cambia con volumen Q | SMS, GB, APIs por uso |

```
Costos totales = Costo fijo total + (Costo variable unitario × Cantidad)
Utilidad = Ingresos − Costos totales
```

Equivalente:

```
Utilidad = Ingresos − (CVU × Q + CFT)
```

Donde **CVU** = costo variable unitario, **Q** = cantidad (alertas, usuarios, etc.).

### Otras clasificaciones (EV3)

| Clasificación | Ejemplo SIGPI |
|---------------|---------------|
| **Directo** | HH desarrollo módulo C, licencia GIS solo para A |
| **Indirecto** | PM general, contador, oficina compartida |
| **Inversión** | Compra tablets |
| **Operación** | OPEX cloud, soporte año 2 |
| **Mantenimiento** | Parches, actualizaciones post entrega |

---

## 9. Estimación de costo con tres puntos (como PERT)

Igual que el tiempo, el **costo** puede estimarse con optimista, probable y pesimista:

```
Ce = (Co + 4·Cm + Cp) / 6
```

| Símbolo | Significado |
|---------|-------------|
| Co | Costo optimista |
| Cm | Costo más probable |
| Cp | Costo pesimista |
| Ce | Costo esperado |

**Varianza del costo** (análogo a PERT):

```
σ²_costo = ((Cp − Co) / 6)²
```

**Uso:** cuando hay incertidumbre (integraciones CONAF, picos SMS, alcance legal). Suma Ce por paquete EDT → presupuesto base; usa Cp para **reserva de contingencia**.

---

## 10. ¿Cuánto cobrar para no tener pérdida?

Si **no conoce la utilidad objetivo** pero quiere **evitar pérdida**, despeje **Ingresos** del punto de equilibrio:

```
0 = Ingresos − (CVU × Q + CFT)
Ingresos mínimos = CVU × Q + CFT
```

O incluyendo inversión amortizada en el período analizado:

```
Ingresos mínimos = Costos totales del período (incl. parte de inversión/KT)
```

**Si el resultado es negativo** (ingresos del contrato < costos totales esperados), el proyecto **no es viable** para el proveedor salvo subsidio, renegociación o reducción de alcance (EDT).

### Aplicación SIGPI

- Estime **CFT** (equipo 12 meses ~USD 62k referencia informe).
- Estime **CVT** (cloud + SMS ~USD 28k/año).
- Compare con **USD 115k** contrato → margen bruto ~USD 25k antes de impuestos en el informe.
- Si sube Cp (pesimista) y ingresos fijos, recalcule: ¿sigue VAN > 0?

---

## 11. Ejemplo del curso: vender sandwiches

La profesora usa **sandwiches** para enseñar **punto de equilibrio**:

| Concepto | Sandwich | SIGPI (proveedor) |
|----------|----------|-------------------|
| Ingreso unitario | Precio por sandwich | Pago por hito / contrato total |
| CVU | Pan, jamón por unidad | SMS por alerta, GB por uso |
| CFT | Arriendo local, sueldo fijo | Sueldos equipo, cloud base |
| Q | Cantidad vendida | Cantidad de alertas / meses de servicio |
| Equilibrio | Precio × Q = CVU×Q + CFT | Ingresos contrato = costos totales |

La lógica es **idéntica**; solo cambia el producto.

---

## 12. Recursos económicos: propios, ajenos y sostenibilidad

### Propios vs ajenos

| | Propios | Ajenos |
|---|---------|--------|
| **Fuente** | Caja de la empresa, socios | Banco, leasing, **cliente** |
| **Riesgo** | Riesgo del empresario | Riesgo de deuda + costo interés |
| **SIGPI** | KT y utilidades reinvertidas | Préstamo + **pagos Valle del Sol** |

### Sostenibilidad (mención del curso)

- **Económica:** ¿el proyecto se paga y genera flujo positivo después del año 1?
- **Operativa:** ¿el municipio puede operarlo sin el proveedor para siempre?
- **OPEX** recurrente (USD 24k/año referencia) debe estar en el contrato o asumido por el cliente.

---

## 13. Contratos y presupuesto

### Contratos

- **Licitación pública:** precio, plazos, multas, garantías, propiedad intelectual, SLA.
- El **presupuesto** del proveedor debe ser **coherente** con lo ofertado en la licitación.

### Estimación de costos y presupuesto (antes de integrar legacy)

1. **Revisar sistemas legacy** del municipio (Excel, papeles, WhatsApp) — impacta esfuerzo de integración y riesgo.
2. Se puede trabajar con **aproximados** en la fase de estudio.
3. **Al aprobarse el proyecto**, el presupuesto se **congela** como baseline — cambios = control de cambios.
4. **Tiempo y esfuerzo** según **nivel de riesgo** (más riesgo → más reserva → Cp más alto).

---

## 14. Enfoques de estimación: bottom-up y top-down

| Enfoque | Cómo | Cuándo usar |
|---------|------|-------------|
| **Bottom-up (recomendada)** | Suma costos de cada tarea/paquete EDT | SIGPI: sumar 2.1…4.6 + Paquete 1 |
| **Top-down** | % sobre un total histórico o referencia de mercado | Validación cruzada (“¿USD 115k es creíble?”) |

**Recomendación EV3:** hacer **bottom-up** desde la EDT y contrastar con **top-down** (benchmark municipal o proyecto similar).

---

## 15. Costos directos, indirectos y ciclo de vida

### Directos vs indirectos

- **Directos:** se asignan claramente a un paquete (ej. dev módulo C).
- **Indirectos:** gastos compartidos (PM, administración) — se reparten con algún criterio (% HH, % costo directo).

### Costo de ciclo de vida (Life Cycle Cost)

Suma **todas** las fases en el tiempo:

| Fase | Costos típicos SIGPI |
|------|----------------------|
| Adquisición / inversión | CAPEX, KT, licitación |
| Operación | OPEX cloud, SMS, soporte |
| Mantención y reparación | Parches, actualizaciones |
| Liquidación / cierre | Migración datos, cierre contrato |

### Tipos de costo (lista EV3)

| Tipo | SIGPI |
|------|-------|
| **Costo de inversión** | Tablets, equipos, desarrollo capitalizable |
| **Capital de trabajo** | Financiar meses 1–3 antes del primer hito |
| **Costo de operación** | OPEX anual |
| **Mantenimiento y reparación** | Soporte post garantía |
| **Costo de liquidación** | Baja — cierre de servicios, archivos |

### Inversión vs capital de trabajo

| | Inversión (activos) | Capital de trabajo (KT) |
|---|---------------------|-------------------------|
| **Qué es** | Compras que quedan (activos) | Efectivo para pagar mientras no cobra |
| **Ejemplo** | Tablets USD 5k | Sueldos 3 meses USD 15k |
| **En plantilla** | P0 equipos/muebles | P0 KT |
| **Recuperación** | Depreciación + uso | Se recupera al cobrar hitos |

### Pérdida y costo en situaciones del proyecto

- **Retraso municipal en pagos** → flujo negativo aunque haya utilidad contable.
- **Subestimar SMS en verano** → costos variables explotan.
- **Cambio de alcance** → más HH → hay que pedir adenda o absorber pérdida.

---

## 16. Momento 0, capital de trabajo e inversión

**Momento 0 (P0)** = inicio del proyecto en el flujo de caja:

```
P0: salidas grandes (inversión + KT) — pocas o ninguna entrada
P1…Pn: ingresos por hitos − costos operativos
```

**Relación con KT:** el proveedor paga equipo y sueldos **antes** del hito M6 (ej. +USD 40k en informe). Por eso el **FCA** puede ser negativo varios meses aunque el proyecto “sea rentable” al final.

---

## 17. ¿Qué se hace en este paso?

Según EV3, en esta etapa debe estimar:

1. **Recursos humanos** — por paquete y por mes.
2. **Recursos materiales / físicos** — compra vs arriendo.
3. **Costos de operación** — OPEX.
4. **Recursos tecnológicos** — cloud, licencias, herramientas.
5. **Flujo de pago** — cuándo entra y sale el dinero (flujo de caja).

**Salida esperada:** presupuesto por paquete + flujo de caja + indicadores (VAN/TIR) + narrativa costo-beneficio en el informe.

---

## 18. Requisitos previos

**No hacer este paso bien sin:**

| Requisito | Herramienta | Por qué |
|-----------|-------------|---------|
| **EDT (CÓMO)** | Pestaña EDT + documento s3 | Sin desglose no hay bottom-up serio |
| **Duración (CUÁNDO)** | PERT/CPM + Gantt | Sin tiempo no se planifica HH ni cuándo se gasta |
| **Alcance (QUÉ)** | Requisitos RN, módulos | Sin alcance se estiman costos de “otro proyecto” |
| **Ingresos** | Contrato / hitos | Sin ingresos no hay evaluación costo-beneficio |

Orden recomendado: **QUÉ → EDT → PERT → CUÁNTO (esta guía + flujo de caja)**.

---

## 19. Mapa rápido: dónde está cada cosa en la plataforma

| Tema EV3 | Pestaña / lugar |
|----------|-----------------|
| 5W1H, alcance | Documento central · bloques proceso y s11 |
| EDT | **EDT** |
| CPM / PERT | **PERT / CPM** |
| Ingresos, costos, VAN, KT | **Flujo de caja** (botones **?** en cada concepto) |
| Alternativas | **Matriz decisión** |
| Glosario | **Glosario** |
| Ruta del curso | **Ruta evaluación** |
| Esta guía completa | **EV3 Estimación** (esta pestaña) |

---

## Referencias del caso SIGPI (resumen numérico informe)

| Concepto | Valor referencia (informe) |
|----------|----------------------------|
| Contrato total | ~USD 115 000 |
| Fase 1 (C+A) | ~USD 65 000 |
| Fase 2 (B) | ~USD 50 000 |
| OPEX anual | ~USD 24 000 |
| Costos variables/año | ~USD 28 000 |
| Costos fijos (equipo 12 meses) | ~USD 62 000 |
| Inversión inicial / KT | ~USD 22 300 |
| Impuesto ejemplo | 27 % sobre BAI |
| TD plantilla curso | 16 % (verificar con profesor) |

> **Nota:** Ajuste estos valores en la pestaña **Flujo de caja** y documente el tipo de cambio si mezcla CLP y USD.

---

*Documento generado para GPY1101 — SIGPI Valle del Sol. Revise con su Excel 2.5.4 / 2.5.5 y el informe del equipo antes de entregar.*
