/* Diagram catalog of the explorer. One entry per exported diagram of aroma-pacifico-diagrams.
   `size` is the intrinsic SVG size in pixels; `boxes` are the IaC boxes D01-D13 that the diagram badges.
   Titles and captions are Spanish site copy; ids, sources and documents keep their English names. */
window.AP_CATEGORIES = [
  { id: 'all', label: 'Todos' },
  { id: 'complete', label: 'Completa' },
  { id: 'accounts', label: 'Cuentas' },
  { id: 'network', label: 'Red' },
  { id: 'security', label: 'Seguridad' },
  { id: 'flows', label: 'Flujos' },
  { id: 'pipelines', label: 'Pipelines' },
  { id: 'data-paths', label: 'Rutas de datos' },
  { id: 'legacy', label: 'Legado 2020' }
];

window.AP_BOXES = {
  D01: 'Estructura de los repositorios IaC', D02: 'Estado remoto', D03: 'Variables y secretos',
  D04: 'Módulo de red', D05: 'Asociación del centro de acopio', D06: 'Línea base de seguridad',
  D07: 'Reglas de firewall', D08: 'Módulo de finca', D09: 'Ingesta de telemetría',
  D10: 'Patrón de función de inferencia', D11: 'CI', D12: 'CD', D13: 'Validación final'
};

window.AP_DIAGRAMS = [
  {
    id: 'complete-architecture', category: 'complete', size: [2924, 2409],
    title: 'Arquitectura completa (ejecución)',
    caption: 'Arquitectura de punta a punta: borde y nube, aislamiento por cuentas, enrutamiento de red y las cajas D01 a D13 que el código implementa.',
    boxes: ['D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','D11','D12','D13'],
    source: 'complete/architecture.drawio (página 1)', doc: 'architecture.md, secciones 4, 7, 11 y 14'
  },
  {
    id: 'complete-architecture-iac', category: 'complete', size: [2933, 1157],
    title: 'Arquitectura completa (trazabilidad IaC)',
    caption: 'Mapa de las cajas D01 a D13 del Epic 6 y del plan revisable con promoción por ambientes.',
    boxes: ['D01','D02','D03','D04','D05','D06','D07','D08','D09','D10','D11','D12','D13'],
    source: 'complete/architecture.drawio (página 2)', doc: 'architecture.md, sección 14; automation-and-pipelines.md, secciones 3 a 5'
  },
  {
    id: 'accounts-landing-zone', category: 'accounts', size: [2373, 2207],
    title: 'Landing zone, controles y auditoría',
    caption: 'Organización AWS con cinco cuentas miembro, políticas de control de servicio y de etiquetas desde la raíz, presupuestos y auditoría de cinco años.',
    boxes: ['D02','D03','D04','D06','D09'],
    source: 'accounts/landing-zone.drawio', doc: 'landing-zone.md, secciones 3 a 7'
  },
  {
    id: 'network-addressing-plan', category: 'network', size: [2753, 2026],
    title: 'Plan de direccionamiento',
    caption: 'Partición RFC 1918 entre los centros, la nube AWS y el espacio de Azure sin desplegar, con los niveles de subred y la escala de 200 a 1.000 fincas sin rediseño.',
    boxes: ['D04','D05'],
    source: 'network/addressing-plan.drawio', doc: 'addressing-plan.md, secciones 2 a 5'
  },
  {
    id: 'network-collection-center', category: 'network', size: [2394, 1621],
    title: 'Patrón de red del centro de acopio',
    caption: 'LAN estándar de los tres centros: siete zonas segmentadas, firewall perimetral y dos túneles IPsec hacia el Transit Gateway.',
    boxes: ['D04','D05','D07'],
    source: 'network/collection-center.drawio', doc: 'collection-center-network.md, secciones 2 a 6'
  },
  {
    id: 'network-connectivity', category: 'network', size: [3653, 2272],
    title: 'Conectividad de punta a punta',
    caption: 'Los siete flujos que conectan nodos de finca, beneficiadero, estación de tierra del dron, transportador, centro de acopio y puerto con la nube.',
    boxes: ['D04','D05','D06','D07','D08','D09','D10'],
    source: 'network/connectivity.drawio', doc: 'connectivity.md, secciones 2 a 11'
  },
  {
    id: 'network-no-signal-sequence', category: 'network', size: [3746, 2277],
    title: 'Operación sin señal y alerta de cultivo',
    caption: 'Almacenar y reenviar: buffer local de hasta 24 horas, drenado primero lo vivo, deduplicación idempotente y presupuesto de latencia de siete saltos bajo 300 segundos.',
    boxes: ['D09','D10'],
    source: 'network/no-signal-sequence.drawio', doc: 'connectivity.md, secciones 4.3, 6, 7 y 8'
  },
  {
    id: 'security-firewall-policy', category: 'security', size: [2693, 1603],
    title: 'Política de firewall perimetral y en la nube',
    caption: 'Defensa en capas: reglas del firewall de cada centro, grupos de seguridad, políticas de endpoints y límite de tasa con AWS WAF.',
    boxes: ['D04','D05','D07'],
    source: 'security/firewall-policy.drawio', doc: 'firewall-policy.md, secciones 3 a 6'
  },
  {
    id: 'security-identity-and-access', category: 'security', size: [3413, 1782],
    title: 'Identidad y acceso',
    caption: 'Cinco niveles: operadores humanos, certificados de borde, pools de Cognito, roles IAM de mínimo privilegio y ocho llaves KMS administradas por el cliente.',
    boxes: ['D02','D06','D08','D09'],
    source: 'security/identity-and-access.drawio', doc: 'security-and-identity.md, secciones 2 a 7 y 10'
  },
  {
    id: 'security-revocation-sequence', category: 'security', size: [3713, 2657],
    title: 'Revocación de credenciales',
    caption: 'Secuencia de revocación inmediata: certificado retirado en IoT Core, tokens de Cognito invalidados y sesiones cerradas para cada tipo de actor.',
    boxes: ['D06','D08'],
    source: 'security/revocation-sequence.drawio', doc: 'security-and-identity.md, sección 10'
  },
  {
    id: 'flows-drone-fumigation-sequence', category: 'flows', size: [4247, 5262],
    title: 'Secuencia de fumigación con dron',
    caption: 'De la alerta de plaga al cierre del caso en ocho compuertas, con la autorización del agrónomo con MFA y el registro de vuelo persistido.',
    boxes: ['D04','D06','D08','D09','D10'],
    source: 'flows/drone-fumigation-sequence.drawio', doc: 'drone-service.md, secciones 3 a 6 y 10'
  },
  {
    id: 'flows-drone-state-machines', category: 'flows', size: [4132, 1607],
    title: 'Máquinas de estado del dron',
    caption: 'Los dos modelos de estado que gobiernan la misión de vuelo y la orden de fumigación, con transiciones protegidas por guardas.',
    boxes: ['D06','D09','D10'],
    source: 'flows/drone-state-machines.drawio', doc: 'drone-service.md, sección 5'
  },
  {
    id: 'flows-farm-monitoring-sequence', category: 'flows', size: [3154, 3027],
    title: 'Monitoreo de finca y alertas',
    caption: 'Desde la medición del sensor hasta la notificación al caficultor: ingesta por dos tópicos, evaluación de umbrales y deduplicación por episodio.',
    boxes: ['D06','D08','D09','D10'],
    source: 'flows/farm-monitoring-sequence.drawio', doc: 'farm-monitoring.md, secciones 3 a 7'
  },
  {
    id: 'flows-inference-functions', category: 'flows', size: [2753, 2332],
    title: 'Funciones de inferencia orientadas a eventos',
    caption: 'El orquestador de capacidades del dron (ADR-004): bus personalizado, una regla por tipo de misión, una cola y una cola de fallos por función, y el estado en DynamoDB.',
    boxes: ['D06','D09','D10'],
    source: 'flows/inference-functions.drawio', doc: 'inference-functions.md, secciones 2 a 6 y 10; adr-004'
  },
  {
    id: 'flows-sack-and-trip-sequence', category: 'flows', size: [3453, 3757],
    title: 'Custodia de saco y viaje',
    caption: 'Registro del saco, traspasos de custodia entre tramos del viaje y verificación del comprador por código QR sin autenticación.',
    boxes: ['D04','D05','D06','D07'],
    source: 'flows/sack-and-trip-sequence.drawio', doc: 'sack-and-trip.md, secciones 2, 4, 5 y 7'
  },
  {
    id: 'flows-sack-states', category: 'flows', size: [3333, 1442],
    title: 'Estados del saco',
    caption: 'Los siete estados del saco de 60 kg, desde el beneficiadero hasta la entrega en el puerto, y sus ocho transiciones.',
    boxes: ['D04','D05','D06'],
    source: 'flows/sack-states.drawio', doc: 'sack-and-trip.md, sección 3'
  },
  {
    id: 'pipelines-ingestion-and-flight-objects', category: 'pipelines', size: [2613, 1292],
    title: 'Ingesta de telemetría y objetos de vuelo',
    caption: 'Dos canales en paralelo: la ingesta de telemetría y la recepción de objetos de vuelo con URL prefirmadas, SHA-256 y cuarentena.',
    boxes: ['D08','D09','D10'],
    source: 'pipelines/ingestion-and-flight-objects.drawio', doc: 'automation-and-pipelines.md, secciones 6 y 7'
  },
  {
    id: 'pipelines-platform-pipeline', category: 'pipelines', size: [2613, 1152],
    title: 'Pipeline CI/CD de la plataforma',
    caption: 'GitHub Actions: compuertas por rama, plan revisable, promoción dev, qa y pdn, aprobación y ventana de congelamiento de la semana de cosecha.',
    boxes: ['D01','D02','D03','D04','D05','D06','D08','D10','D11','D12','D13'],
    source: 'pipelines/platform-pipeline.drawio', doc: 'automation-and-pipelines.md, secciones 3 a 5, 8 y 10'
  },
  {
    id: 'legacy-2020', category: 'legacy', size: [3153, 2527],
    title: 'Legado 2020: conservar, retirar, reemplazar',
    caption: 'Cada elemento del piloto de 2020 frente a su decisión de 2026 y a la caja de IaC que lo implementa.',
    boxes: ['D01','D03','D04','D05','D06','D08','D09','D10'],
    source: 'legacy/legacy-2020.drawio', doc: 'legacy-2020.md, secciones 2 a 4'
  },
  {
    id: 'data-paths-telemetry', category: 'data-paths', size: [2883, 972],
    title: 'Ruta de datos: telemetría',
    caption: 'Lecturas de cultivo y secado por MQTT sobre TLS hasta AWS IoT Core, almacenamiento en DynamoDB y evaluación de alertas.',
    boxes: [],
    source: 'data-paths/telemetry.drawio', doc: 'connectivity.md, sección 4'
  },
  {
    id: 'data-paths-transporter-position', category: 'data-paths', size: [2822, 912],
    title: 'Ruta de datos: posición del transportador',
    caption: 'Posición GNSS, buzón de salida cifrado en el teléfono y carga por red móvil durante el viaje por tierra hasta el puerto.',
    boxes: [],
    source: 'data-paths/transporter-position.drawio', doc: 'connectivity.md, sección 7'
  },
  {
    id: 'data-paths-drone-objects', category: 'data-paths', size: [2893, 1222],
    title: 'Ruta de datos: objetos del dron',
    caption: 'Paquete de misión, URL prefirmadas de S3, verificación de checksum, filtro de personas en el equipo y cuarentena.',
    boxes: [],
    source: 'data-paths/drone-objects.drawio', doc: 'connectivity.md, sección 6'
  }
];
