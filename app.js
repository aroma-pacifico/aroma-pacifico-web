/* Behavior of the Aroma Pacifico technical showcase. Plain JavaScript, no build step, no external requests. */
(() => {
  'use strict';

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const money = (value, digits = 2) => new Intl.NumberFormat('es-CO', {
    style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits
  }).format(value);
  const integer = (value) => new Intl.NumberFormat('es-CO').format(value);

  /* ---------- Header, navigation and reveal ---------- */
  const menuButton = qs('[data-menu]');
  const nav = qs('[data-nav]');
  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  qsa('a', nav).forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menuButton.focus(); }
  });

  const sections = qsa('main section[id]').filter((section) => qs(`a[href="#${section.id}"]`, nav));
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        qsa('a', nav).forEach((link) => {
          if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => navObserver.observe(section));

    if (reduceMotion) {
      qsa('.reveal').forEach((element) => element.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
        });
      }, { threshold: 0.08 });
      qsa('.reveal').forEach((element) => revealObserver.observe(element));
    }
  } else {
    qsa('.reveal').forEach((element) => element.classList.add('visible'));
  }

  /* ---------- Legacy filter ---------- */
  const legacyCols = qs('[data-legacy-cols]');
  qsa('[data-legacy]').forEach((button) => button.addEventListener('click', () => {
    const choice = button.dataset.legacy;
    qsa('[data-legacy]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    qsa('[data-legacy-col]').forEach((column) => { column.hidden = choice !== 'all' && column.dataset.legacyCol !== choice; });
    legacyCols.style.gridTemplateColumns = choice === 'all' ? '' : 'minmax(0, 1fr)';
  }));

  /* ---------- Offline buffer (ASM-074: 24 hour retention; 6 crop and 24 drying readings a day) ---------- */
  const CROP_PER_DAY = 6;
  const DRY_PER_DAY = 24;
  const RETENTION_HOURS = 24;
  const offline = qs('[data-offline]');
  const updateOffline = () => {
    const hours = Number(offline.value);
    const kept = Math.min(hours, RETENTION_HOURS);
    const lostHours = Math.max(0, hours - RETENTION_HOURS);
    const cropKept = Math.floor(kept * CROP_PER_DAY / 24);
    const dryKept = Math.floor(kept * DRY_PER_DAY / 24);
    const cropLost = Math.floor(lostHours * CROP_PER_DAY / 24);
    const dryLost = Math.floor(lostHours * DRY_PER_DAY / 24);
    qs('[data-offline-out]').textContent = `${hours} h`;
    qs('[data-crop-kept]').textContent = cropKept;
    qs('[data-dry-kept]').textContent = dryKept;
    qs('[data-crop-lost]').textContent = cropLost;
    qs('[data-dry-lost]').textContent = dryLost;
    qs('[data-bar-ok]').style.width = `${(kept / 36) * 100}%`;
    qs('[data-bar-lost]').style.width = `${(lostHours / 36) * 100}%`;
    const alert = qs('[data-signal-alert]');
    const title = qs('[data-signal-title]');
    const text = qs('[data-signal-text]');
    alert.className = 'ap-alert';
    if (hours === 0) {
      alert.classList.add('ap-alert--resolved');
      title.textContent = 'Con señal';
      text.textContent = 'Cada lectura se publica en vivo. El buffer solo se usa si la conexión se cae.';
    } else if (hours <= RETENTION_HOURS) {
      alert.classList.add('ap-alert--notice');
      title.textContent = 'Dentro del buffer';
      text.textContent = 'Al volver la señal, el nodo drena las lecturas de la más antigua a la más nueva, con su marca de tiempo original, y la alerta se emite al drenar.';
    } else {
      alert.classList.add('ap-alert--critical');
      title.textContent = 'Lecturas descartadas por retención';
      text.textContent = 'Una lectura que cumple 24 horas sin confirmación se descarta y suma al contador de descartes del nodo. Por eso el diseño usa un módulo satelital fuera de cobertura.';
    }
  };
  offline.addEventListener('input', updateOffline);
  updateOffline();

  /* ---------- Inference functions ---------- */
  const functions = [
    {
      id: 'telemetry', label: 'Lote de telemetría', active: [3, 4, 5, 6],
      trigger: 'Una lectura aceptada por AWS IoT Core en el tópico de telemetría.',
      path: 'La regla del tópico guarda la lectura en la tabla y, en lugar de invocar la función directo, envía la clave a la cola de la función de umbrales.',
      batch: 'Hasta 10 lecturas por invocación; una lectura en vivo suele llegar sola, un buffer drenado llena el lote.',
      result: 'Evalúa con la versión del umbral vigente en la marca de tiempo original, abre un episodio y registra crop_alert_raised.',
      cost: 0.00477
    },
    {
      id: 'confirmation', label: 'Confirmación del foco', active: [0, 1, 2, 3, 4, 5, 6],
      trigger: 'mission_record_persisted de una misión de tipo confirmation.',
      path: 'El stream de la tabla alimenta un EventBridge Pipe, que pone el evento en el bus del servicio de drones. Una regla lo envía a la cola de la función.',
      batch: 'Una misión por invocación.',
      result: 'Envía las fotos filtradas a Bedrock y registra focus_confirmed o focus_not_confirmed con confianza y objeto de origen. Nunca autoriza nada.',
      cost: 5.164
    },
    {
      id: 'verification', label: 'Verificación', active: [0, 1, 2, 3, 4, 5, 6],
      trigger: 'mission_record_persisted de una misión de tipo verification.',
      path: 'La misma ruta, con una regla distinta sobre el tipo de misión.',
      batch: 'Una misión por invocación.',
      result: 'Registra can_close o cannot_close. El caso solo se cierra con can_close, y solo después de persistido el registro de vuelo de la fumigación.',
      cost: 5.164
    },
    {
      id: 'estimation', label: 'Estimación de cosecha', active: [0, 1, 2, 3, 4, 5, 6],
      trigger: 'mission_record_persisted de una misión de tipo estimation.',
      path: 'La misma ruta, con una regla sobre el tipo de misión estimation.',
      batch: 'Una misión por invocación.',
      result: 'Registra el número estimado de sacos de la finca para su centro de acopio. Nunca fumiga ni genera una orden de empaque.',
      cost: 21.65
    }
  ];
  const tabs = qs('[data-tabs]');
  const panel = qs('[data-tabpanel]');
  const nodes = qsa('[data-node]');
  const selectFunction = (id, focus = false) => {
    const item = functions.find((entry) => entry.id === id);
    qsa('button', tabs).forEach((button) => {
      const selected = button.dataset.fn === id;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && focus) button.focus();
    });
    nodes.forEach((node) => node.classList.toggle('is-active', item.active.includes(Number(node.dataset.node))));
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.innerHTML = `<dl>
      <dt>Disparador</dt><dd>${item.trigger}</dd>
      <dt>Ruta de entrega</dt><dd>${item.path}</dd>
      <dt>Lote</dt><dd>${item.batch}</dd>
      <dt>Resultado</dt><dd>${item.result}</dd>
      <dt>Costo por 1.000 invocaciones</dt><dd><strong>${money(item.cost, item.cost < 1 ? 5 : 2)}</strong> <span class="note">(planeación de costos, con Amazon Nova Pro en us-east-1)</span></dd>
    </dl>`;
  };
  tabs.innerHTML = functions.map((item) => `<button type="button" role="tab" id="tab-${item.id}" data-fn="${item.id}" aria-selected="false" tabindex="-1">${item.label}</button>`).join('');
  tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-fn]');
    if (button) selectFunction(button.dataset.fn);
  });
  tabs.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const ids = functions.map((item) => item.id);
    const current = ids.indexOf(document.activeElement.dataset.fn);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === 'ArrowLeft') next = (current + ids.length - 1) % ids.length;
    if (event.key === 'ArrowRight') next = (current + 1) % ids.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = ids.length - 1;
    selectFunction(ids[next], true);
  });
  selectFunction('telemetry');

  /* ---------- Environment plan toggle (stack plans against the emulator) ---------- */
  const envData = {
    qa: { network: 163, security: 31, workload: 44 },
    pdn: { network: 167, security: 31, workload: 44 }
  };
  let currentEnv = 'qa';
  const renderEnv = () => {
    const env = envData[currentEnv];
    const name = (label) => label.padEnd(10, ' ');
    qs('[data-plan-network]').innerHTML = `${name('network')}Plan: <span class="hl">${env.network} to add</span>, 0 to change, 0 to destroy.`;
    qs('[data-plan-security]').innerHTML = `${name('security')}Plan: <span class="hl">${env.security} to add</span>, 0 to change, 0 to destroy.`;
    qs('[data-plan-workload]').innerHTML = `${name('workload')}Plan: <span class="hl">${env.workload} to add</span>, 0 to change, 0 to destroy.`;
    qs('[data-plan-total]').textContent = env.network + env.security + env.workload;
    qs('[data-env-name]').textContent = currentEnv;
    qs('[data-plan-text]').innerHTML = currentEnv === 'qa'
      ? 'Ambiente <strong>qa</strong>: 0 por cambiar y 0 por destruir en las tres pilas.'
      : 'Ambiente <strong>pdn</strong>: la pila de red suma 4 recursos por la asociación de un centro de acopio (163 + 4 = 167). 0 por cambiar y 0 por destruir.';
  };
  qsa('[data-env-value]').forEach((button) => button.addEventListener('click', () => {
    currentEnv = button.dataset.envValue;
    qsa('[data-env-value]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderEnv();
  }));
  renderEnv();

  /* ---------- Cost bars (pilot cost document A23) ---------- */
  const costDomains = [
    { name: 'Hardware de fincas (200 fincas, 400 nodos)', normal: 920.00, harvest: 920.00, annual: 85040.00 },
    { name: 'Centros de acopio (3 sitios)', normal: 645.00, harvest: 645.00, annual: 16290.00 },
    { name: 'Campaña de drones (vuelo contratado)', normal: 583.33, harvest: 8500.00, annual: 45250.00 },
    { name: 'Nube AWS e ingesta', normal: 558.94, harvest: 573.75, annual: 6766.52 }
  ];
  const costTotals = {
    normal: { label: 'Total mensual, mes normal', value: 2707.27 },
    harvest: { label: 'Total mensual, mes de cosecha', value: 10638.75 },
    annual: { label: 'Total anualizado del piloto', value: 153346.52 }
  };
  const cloudServices = [
    { name: 'Route 53 Resolver entrante', normal: 182.70, harvest: 182.70 },
    { name: 'AWS Transit Gateway', normal: 110.50, harvest: 110.50 },
    { name: 'AWS Site-to-Site VPN', normal: 109.50, harvest: 109.50 },
    { name: 'Observabilidad y telemetría', normal: 60.72, harvest: 60.72 },
    { name: 'Endpoints de VPC (interfaz)', normal: 58.90, harvest: 58.90 },
    { name: 'Amazon S3 y AWS KMS', normal: 15.80, harvest: 15.80 },
    { name: 'Notificaciones al caficultor (SMS y push)', normal: 4.95, harvest: 14.85 },
    { name: 'AWS WAF', normal: 9.15, harvest: 9.15 },
    { name: 'Amazon DynamoDB (bajo demanda)', normal: 4.83, harvest: 4.83 },
    { name: 'Amazon CloudFront', normal: 1.40, harvest: 1.40 },
    { name: 'Cómputo orientado a eventos e IA', normal: 0.30, harvest: 5.21 },
    { name: 'AWS IoT Core', normal: 0.19, harvest: 0.19 }
  ];
  const barRows = (items, value, formatter) => {
    const max = Math.max(...items.map(value));
    return items.map((item) => `
      <div class="cost-row"><span>${item.name}</span><div class="bar" aria-hidden="true"><i style="width:${(value(item) / max) * 100}%"></i></div><output>${formatter(value(item))}</output></div>`).join('');
  };
  const cloudBars = qs('[data-cloud-bars]');
  cloudBars.classList.add('cost-bars', 'cost-bars--cloud');
  const renderCost = (mode) => {
    qs('[data-cost-bars]').innerHTML = barRows(costDomains, (item) => item[mode], (v) => money(v));
    qs('[data-cost-total-label]').textContent = costTotals[mode].label;
    qs('[data-cost-total]').textContent = money(costTotals[mode].value);
    const cloudValue = mode === 'harvest'
      ? (item) => item.harvest
      : mode === 'annual' ? (item) => 8 * item.normal + 4 * item.harvest : (item) => item.normal;
    cloudBars.innerHTML = barRows(cloudServices, cloudValue, (v) => money(v));
  };
  qsa('[data-cm]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-cm]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderCost(button.dataset.cm);
  }));
  renderCost('normal');

  /* ---------- Project effort by iteration (planning workbook) ---------- */
  const effort = [
    { name: 'Fase 0 - Decisiones', est: 32, tasks: 7 },
    { name: 'Fase 1 - Arquitectura', est: 112, tasks: 14 },
    { name: 'Sprint 1 - IaC semana 1', est: 50, tasks: 7 },
    { name: 'Sprint 2 - IaC semana 2', est: 48, tasks: 6 },
    { name: 'Cierre - Entrega', est: 56, tasks: 8 }
  ];
  const effortBars = qs('[data-effort-bars]');
  effortBars.classList.add('cost-bars', 'cost-bars--effort');
  const renderEffort = (mode) => {
    const unit = mode === 'est' ? (v) => `${v} h` : (v) => `${v} tareas`;
    effortBars.innerHTML = barRows(effort, (item) => item[mode], unit);
    qs('[data-effort-label]').textContent = mode === 'est' ? 'Total de horas' : 'Total de tareas';
    qs('[data-effort-total]').textContent = mode === 'est' ? '298 h' : '42 tareas';
  };
  qsa('[data-em]').forEach((button) => button.addEventListener('click', () => {
    qsa('[data-em]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderEffort(button.dataset.em);
  }));
  renderEffort('est');

  /* ---------- Sortable and filterable 100 hour plan table ---------- */
  const planTable = qs('#plan-table');
  const planBody = qs('tbody', planTable);
  let planRole = 'all';
  const planRows = () => qsa('tr', planBody);
  const updatePlanCount = () => {
    const rows = planRows().filter((row) => !row.hidden);
    const total = rows.reduce((sum, row) => sum + Number(row.dataset.hours), 0);
    qs('[data-plan-count]').textContent = `${rows.length} partes, ${total} horas`;
  };
  qsa('[data-pr]').forEach((button) => button.addEventListener('click', () => {
    planRole = button.dataset.pr;
    qsa('[data-pr]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    planRows().forEach((row) => { row.hidden = planRole !== 'all' && row.dataset.role !== planRole; });
    updatePlanCount();
  }));
  qsa('[data-sort-col]', planTable).forEach((button) => button.addEventListener('click', () => {
    const column = Number(button.dataset.sortCol);
    const th = button.closest('th');
    const next = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    qsa('th', planTable).forEach((item) => item.setAttribute('aria-sort', 'none'));
    th.setAttribute('aria-sort', next);
    const key = (row) => row.dataset.sortvals.split('|')[column];
    const rows = planRows().sort((a, b) => key(a).localeCompare(key(b), 'es', { numeric: true }) * (next === 'ascending' ? 1 : -1));
    rows.forEach((row) => planBody.appendChild(row));
  }));
  updatePlanCount();

  /* ---------- Browsable table of the 28 pc-iac rules ---------- */
  const rulesBody = qs('#rules-table tbody');
  let ruleType = 'all';
  let ruleQuery = '';
  const applyRules = () => {
    let shown = 0;
    qsa('tr', rulesBody).forEach((row) => {
      const matchType = ruleType === 'all' || row.dataset.ruleType === ruleType;
      const text = `${row.dataset.ruleText} ${row.textContent.toLowerCase()}`;
      const matchQuery = !ruleQuery || text.includes(ruleQuery);
      row.hidden = !(matchType && matchQuery);
      if (!row.hidden) shown += 1;
    });
    qs('[data-rule-count]').textContent = `${shown} de 28 reglas`;
  };
  qsa('[data-rt]').forEach((button) => button.addEventListener('click', () => {
    ruleType = button.dataset.rt;
    qsa('[data-rt]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    applyRules();
  }));
  qs('[data-rule-search]').addEventListener('input', (event) => {
    ruleQuery = event.target.value.trim().toLowerCase();
    applyRules();
  });

  /* ---------- Error budget calculator ---------- */
  const validInput = qs('[data-valid-events]');
  const updateBudget = () => {
    const events = Math.max(0, Math.floor(Number(validInput.value) || 0));
    qs('[data-budget-1]').textContent = integer(Math.floor(events * 0.05));
    qs('[data-budget-2]').textContent = integer(Math.floor(events * 0.005));
  };
  validInput.addEventListener('input', updateBudget);
  updateBudget();

  /* ---------- Diagram explorer ---------- */
  const diagrams = window.AP_DIAGRAMS;
  const categories = window.AP_CATEGORIES;
  const boxNames = window.AP_BOXES;
  const filters = qs('[data-filters]');
  const boxSelect = qs('[data-box-filter]');
  const grid = qs('[data-grid]');
  const empty = qs('[data-empty]');
  const count = qs('[data-count]');
  const categoryLabel = (id) => categories.find((item) => item.id === id).label;
  const asset = (id, extension) => `assets/diagrams/${id}.${extension}`;
  const altText = (diagram) => `${diagram.title}. ${diagram.caption}`;
  let category = 'all';
  let box = 'all';
  let visible = diagrams.slice();

  filters.innerHTML = categories.map((item, index) => `<button type="button" data-category="${item.id}" aria-pressed="${index === 0}">${item.label}</button>`).join('');
  boxSelect.innerHTML = '<option value="all">Todas</option>' + Object.keys(boxNames).map((id) => `<option value="${id}">${id} · ${boxNames[id]}</option>`).join('');

  const renderGallery = () => {
    visible = diagrams.filter((item) => (category === 'all' || item.category === category) && (box === 'all' || item.boxes.includes(box)));
    count.textContent = `${visible.length} de ${diagrams.length} diagramas`;
    grid.hidden = visible.length === 0;
    empty.hidden = visible.length !== 0;
    grid.innerHTML = visible.map((item) => `
      <article class="diagram-card">
        <button class="diagram-preview" type="button" data-open-diagram="${item.id}" aria-label="Abrir en el visor: ${item.title}">
          <img src="assets/diagrams/thumbs/${item.id}.webp" alt="${altText(item).replace(/"/g, '&quot;')}" loading="lazy" decoding="async">
        </button>
        <div class="diagram-card-body">
          <h4>${item.title}</h4>
          <p>${item.caption}</p>
          <div class="diagram-meta">
            <span class="tag">${categoryLabel(item.category)}</span>
            ${item.boxes.length ? `<span class="tag" title="Cajas de IaC">${item.boxes.length > 4 ? `${item.boxes[0]}-${item.boxes[item.boxes.length - 1]}` : item.boxes.join(' ')}</span>` : '<span class="tag">Sin caja IaC</span>'}
          </div>
        </div>
      </article>`).join('');
  };

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    category = button.dataset.category;
    qsa('[data-category]', filters).forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderGallery();
  });
  filters.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = qsa('[data-category]', filters);
    const current = buttons.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    let next = current;
    if (event.key === 'ArrowLeft') next = (current + buttons.length - 1) % buttons.length;
    if (event.key === 'ArrowRight') next = (current + 1) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    buttons[next].focus();
  });
  boxSelect.addEventListener('change', () => { box = boxSelect.value; renderGallery(); });
  renderGallery();

  /* ---------- Lightbox: zoom buttons, pinch, drag, swipe and keys ---------- */
  const lightbox = qs('[data-lightbox]');
  const viewport = qs('[data-lb-viewport]');
  const image = qs('[data-lb-img]');
  const status = qs('[data-lb-status]');
  const zoomOutput = qs('[data-lb-zoom]');
  const pngButton = qs('[data-lb-png]');
  const svgButton = qs('[data-lb-svg]');
  let list = diagrams;
  let index = 0;
  let scale = 1;
  let fitScale = 1;
  let opener = null;
  let source = 'view';
  const pointers = new Map();
  let gesture = null;

  const current = () => list[index];
  const applyScale = (next, keepCenter = true) => {
    const [width, height] = current().size;
    const oldWidth = image.clientWidth || width * scale;
    const oldHeight = image.clientHeight || height * scale;
    const centerX = viewport.scrollLeft + viewport.clientWidth / 2;
    const centerY = viewport.scrollTop + viewport.clientHeight / 2;
    scale = Math.min(3, Math.max(0.05, next));
    image.style.width = `${width * scale}px`;
    image.style.height = `${height * scale}px`;
    zoomOutput.value = `${Math.round(scale * 100)} %`;
    zoomOutput.textContent = zoomOutput.value;
    if (keepCenter) {
      requestAnimationFrame(() => {
        viewport.scrollLeft = centerX * ((width * scale) / oldWidth) - viewport.clientWidth / 2;
        viewport.scrollTop = centerY * ((height * scale) / oldHeight) - viewport.clientHeight / 2;
      });
    }
  };
  const fit = () => {
    const [width, height] = current().size;
    fitScale = Math.min((viewport.clientWidth - 24) / width, (viewport.clientHeight - 24) / height, 1);
    applyScale(fitScale, false);
    requestAnimationFrame(() => { viewport.scrollLeft = 0; viewport.scrollTop = 0; });
  };
  const setSource = (next) => {
    source = next;
    pngButton.setAttribute('aria-pressed', String(next === 'png'));
    svgButton.setAttribute('aria-pressed', String(next === 'svg'));
    pngButton.textContent = next === 'png' ? 'PNG completo activo' : 'Ver PNG completo';
    svgButton.textContent = next === 'svg' ? 'SVG vectorial activo' : 'Ver SVG vectorial';
    const item = current();
    const heavy = next !== 'view';
    status.hidden = !heavy;
    if (heavy) status.textContent = next === 'svg' ? 'Cargando el SVG vectorial; puede pesar varios megabytes.' : 'Cargando el PNG completo.';
    image.src = next === 'view' ? `assets/diagrams/view/${item.id}.webp` : asset(item.id, next);
  };
  image.addEventListener('load', () => { if (source !== 'view') status.hidden = true; });
  image.addEventListener('error', () => { status.hidden = false; status.textContent = 'No se pudo cargar la imagen.'; });

  const show = (newIndex) => {
    index = (newIndex + list.length) % list.length;
    const item = current();
    qs('[data-lb-title]').textContent = item.title;
    qs('[data-lb-cat]').textContent = `${categoryLabel(item.category)} · ${index + 1} de ${list.length}`;
    qs('[data-lb-caption]').textContent = `${item.caption} Fuente: ${item.source}. Documento: ${item.doc}.`;
    qs('[data-lb-boxes]').textContent = item.boxes.length ? `Cajas IaC: ${item.boxes.join(', ')}` : 'Sin caja de IaC';
    image.alt = altText(item);
    qs('[data-lb-open]').href = asset(item.id, 'svg');
    qs('[data-lb-download]').href = asset(item.id, 'png');
    qs('[data-lb-download]').setAttribute('download', `${item.id}.png`);
    setSource('view');
    requestAnimationFrame(() => requestAnimationFrame(fit));
  };

  const openDiagram = (id, trigger) => {
    list = (trigger && trigger.closest('.featured')) ? diagrams : visible.length ? visible : diagrams;
    if (list.findIndex((item) => item.id === id) < 0) list = diagrams;
    opener = trigger;
    if (!lightbox.open) lightbox.showModal();
    document.body.classList.add('modal-open');
    show(list.findIndex((item) => item.id === id));
    viewport.focus();
  };
  const closeLightbox = () => { if (lightbox.open) lightbox.close(); };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-diagram]');
    if (trigger) openDiagram(trigger.dataset.openDiagram, trigger);
  });
  lightbox.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    image.removeAttribute('src');
    if (opener && document.contains(opener)) opener.focus();
  });
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  qs('[data-lb-close]').addEventListener('click', closeLightbox);
  qs('[data-lb-prev]').addEventListener('click', () => show(index - 1));
  qs('[data-lb-next]').addEventListener('click', () => show(index + 1));
  qs('[data-lb-in]').addEventListener('click', () => applyScale(scale * 1.25));
  qs('[data-lb-out]').addEventListener('click', () => applyScale(scale / 1.25));
  qs('[data-lb-fit]').addEventListener('click', fit);
  pngButton.addEventListener('click', () => setSource(source === 'png' ? 'view' : 'png'));
  svgButton.addEventListener('click', () => setSource(source === 'svg' ? 'view' : 'svg'));

  viewport.addEventListener('keydown', (event) => {
    if (event.key === '+' || event.key === '=') { event.preventDefault(); applyScale(scale * 1.25); }
    if (event.key === '-' || event.key === '_') { event.preventDefault(); applyScale(scale / 1.25); }
    if (event.key === '0') { event.preventDefault(); fit(); }
    if (event.key === 'PageUp') { event.preventDefault(); show(index - 1); }
    if (event.key === 'PageDown') { event.preventDefault(); show(index + 1); }
  });
  viewport.addEventListener('wheel', (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    applyScale(event.deltaY < 0 ? scale * 1.12 : scale / 1.12);
  }, { passive: false });

  const distance = () => {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    viewport.setPointerCapture(event.pointerId);
    if (pointers.size === 1) {
      gesture = { type: 'pan', x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop, time: Date.now() };
    } else if (pointers.size === 2) {
      gesture = { type: 'pinch', distance: distance(), scale };
    }
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (!gesture) return;
    if (gesture.type === 'pinch' && pointers.size === 2) {
      applyScale(gesture.scale * (distance() / gesture.distance));
    } else if (gesture.type === 'pan' && pointers.size === 1) {
      viewport.scrollLeft = gesture.left - (event.clientX - gesture.x);
      viewport.scrollTop = gesture.top - (event.clientY - gesture.y);
    }
  });
  const endPointer = (event) => {
    if (!pointers.has(event.pointerId)) return;
    const wasPan = gesture && gesture.type === 'pan' && pointers.size === 1;
    const point = pointers.get(event.pointerId);
    pointers.delete(event.pointerId);
    if (wasPan && event.type === 'pointerup') {
      const dx = point.x - gesture.x;
      const dy = point.y - gesture.y;
      const quick = Date.now() - gesture.time < 700;
      const atFit = scale <= fitScale * 1.05;
      if (quick && atFit && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(index + (dx < 0 ? 1 : -1));
    }
    if (pointers.size === 0) gesture = null;
    else if (pointers.size === 1) {
      const [rest] = [...pointers.values()];
      gesture = { type: 'pan', x: rest.x, y: rest.y, left: viewport.scrollLeft, top: viewport.scrollTop, time: Date.now() };
    }
  };
  viewport.addEventListener('pointerup', endPointer);
  viewport.addEventListener('pointercancel', endPointer);
  window.addEventListener('resize', () => { if (lightbox.open) fit(); });
})();
