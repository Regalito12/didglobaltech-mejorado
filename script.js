const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');

menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('is-open');
}));

const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = [...document.querySelectorAll('.page-section')];
const navLinks = [...document.querySelectorAll('#main-nav a[href]')];
const meterCurrent = document.querySelector('[data-meter-current]');
const meterLine = document.querySelector('.page-meter i');
const topbar = document.querySelector('.topbar');
const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
document.body.dataset.page = currentPage.replace(/\.html$/, '') || 'index';
const pageForLink = (link) => {
  const url = new URL(link.getAttribute('href'), location.href);
  return (url.pathname.split('/').pop() || 'index.html').toLowerCase();
};
navLinks.forEach((link) => {
  const isActive = pageForLink(link) === currentPage;
  link.classList.toggle('is-active', isActive);
  if (isActive) link.setAttribute('aria-current', 'page');
});
const sectionObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  const id = entry.target.id;
  const data = entry.target.dataset.section || '00';
  sections.forEach((section) => section.classList.toggle('is-current', section === entry.target));
  if (meterCurrent) meterCurrent.textContent = id === 'inicio' ? '01' : data;
  if (meterLine) meterLine.style.setProperty('--progress', `${Math.max(14, (Number(data) / 7) * 100)}%`);
  navLinks.filter((link) => link.hash).forEach((link) => link.classList.toggle('is-active', link.hash === `#${id}`));
}), { rootMargin: '-32% 0px -58% 0px' });
sections.forEach((section) => sectionObserver.observe(section));
const updateScrollState = () => {
  topbar?.classList.toggle('scrolled', scrollY > 24);
  const scrollable = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty('--scroll-progress', `${scrollable > 0 ? Math.min(100, (scrollY / scrollable) * 100) : 0}%`);
};
addEventListener('scroll', updateScrollState, { passive: true });
addEventListener('resize', updateScrollState, { passive: true });
updateScrollState();

const slides = [
  { image: 'assets/service-network.png', eyebrow: 'INFRAESTRUCTURA QUE CONECTA', title: 'Redes listas para<br /><em>crecer.</em>', copy: 'Diseñamos WAN/LAN, Wi-Fi empresarial y cableado estructurado para que cada área trabaje con más velocidad, estabilidad y visibilidad.' },
  { image: 'assets/service-security.png', eyebrow: 'CIBERSEGURIDAD POR CAPAS', title: 'Protección que<br /><em>se anticipa.</em>', copy: 'Integramos controles, segmentación, respaldo y monitoreo para reducir riesgos y mantener tu operación disponible.' },
  { image: 'assets/service-communications.png', eyebrow: 'COMUNICACIONES QUE FLUYEN', title: 'Cada llamada<br /><em>en su lugar.</em>', copy: 'Conectamos centrales IP, IVR y automatizaciones para que la atención sea más ordenada y medible.' },
  { image: 'assets/service-management.png', eyebrow: 'GESTIÓN QUE ACLARA', title: 'Datos listos para<br /><em>decidir.</em>', copy: 'Ordenamos la información de tu operación con sistemas de gestión que conectan equipos, procesos y resultados.' },
];
let currentSlide = 0;
const solutionImage = document.querySelector('[data-solution-image]');
const solutionEyebrow = document.querySelector('.solution-copy .eyebrow');
const solutionTitle = document.querySelector('[data-solution-title]');
const solutionCopy = document.querySelector('[data-solution-copy]');
const solutionCount = document.querySelector('[data-solution-count]');
const dots = [...document.querySelectorAll('.carousel-dots button')];
const renderSlide = (index) => {
  currentSlide = (index + slides.length) % slides.length;
  const slide = slides[currentSlide];
  const carousel = solutionImage?.closest('.solution-carousel');
  carousel?.classList.add('is-changing');
  window.setTimeout(() => carousel?.classList.remove('is-changing'), 260);
  if (solutionImage) solutionImage.style.backgroundImage = `linear-gradient(0deg,rgba(8,13,22,.88),rgba(8,13,22,.1)),url('${slide.image}')`;
  if (solutionEyebrow) solutionEyebrow.textContent = slide.eyebrow;
  if (solutionTitle) solutionTitle.innerHTML = slide.title;
  if (solutionCopy) solutionCopy.textContent = slide.copy;
  if (solutionCount) solutionCount.textContent = `${String(currentSlide + 1).padStart(2, '0')} / 04`;
  dots.forEach((dot, dotIndex) => {
    const isActive = dotIndex === currentSlide;
    dot.classList.toggle('is-active', isActive);
    dot.setAttribute('aria-selected', String(isActive));
    dot.setAttribute('tabindex', isActive ? '0' : '-1');
  });
};
 dots.forEach((dot) => {
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-selected', String(dot.classList.contains('is-active')));
  dot.setAttribute('tabindex', dot.classList.contains('is-active') ? '0' : '-1');
  dot.addEventListener('click', () => renderSlide(Number(dot.dataset.slide)));
});
document.querySelector('[data-prev]')?.addEventListener('click', () => renderSlide(currentSlide - 1));
document.querySelector('[data-next]')?.addEventListener('click', () => renderSlide(currentSlide + 1));
solutionImage?.closest('.solution-carousel')?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') renderSlide(currentSlide - 1);
  if (event.key === 'ArrowRight') renderSlide(currentSlide + 1);
});

let carouselPointerStart = null;
solutionImage?.addEventListener('pointerdown', (event) => {
  carouselPointerStart = event.clientX;
  solutionImage.setPointerCapture?.(event.pointerId);
});
solutionImage?.addEventListener('pointerup', (event) => {
  if (carouselPointerStart === null) return;
  const distance = event.clientX - carouselPointerStart;
  carouselPointerStart = null;
  if (Math.abs(distance) > 42) renderSlide(currentSlide + (distance < 0 ? 1 : -1));
});

document.querySelectorAll('.service-card, .project-card, .brand-grid > div').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const bounds = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
    card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
  });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--spot-x', '50%');
    card.style.setProperty('--spot-y', '0%');
  });
});

const form = document.querySelector('#contact-form');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const status = form.querySelector('.form-status');
  if (!form.checkValidity()) { status.textContent = 'Completa los campos requeridos para continuar.'; form.reportValidity(); return; }
  const formData = new FormData(form);
  const subject = `Solicitud corporativa — ${formData.get('company')}`;
  const body = [
    `Nombre: ${formData.get('name')}`,
    `Empresa: ${formData.get('company')}`,
    `Correo: ${formData.get('email')}`,
    '',
    'Requerimiento:',
    formData.get('message'),
  ].join('\n');
  status.textContent = 'Solicitud lista. Se abrirá tu correo corporativo para enviarla.';
  window.location.href = `mailto:info@didglobaltech.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  form.reset();
});

const hero = document.querySelector('.hero');
hero?.addEventListener('pointermove', (event) => {
  if (reducedMotion) return;
  const bounds = hero.getBoundingClientRect();
  const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  const y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  document.documentElement.style.setProperty('--hero-pointer-x', x.toFixed(3));
  document.documentElement.style.setProperty('--hero-pointer-y', y.toFixed(3));
});
hero?.addEventListener('pointerleave', () => {
  document.documentElement.style.setProperty('--hero-pointer-x', '0');
  document.documentElement.style.setProperty('--hero-pointer-y', '0');
});

const canvas = document.querySelector('#network-scene');
const context = canvas?.getContext('2d');
if (canvas && context) {
  const nodes = Array.from({ length: 36 }, (_, index) => ({ x: Math.random() * 2 - 1, y: Math.random() * 1.45 - .72, z: Math.random() * 2 - 1, phase: index * .61 }));
  let width = 0; let height = 0; let lastFrame = 0;
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

    // Keep the DG core locked to the same projected focal point as the animated network.
    // The canvas starts below the fixed header, so include that offset in the hero coordinate.
    if (hero) {
      const heroBounds = hero.getBoundingClientRect();
      const sceneBounds = canvas.getBoundingClientRect();
      hero.style.setProperty('--hero-scene-x', `${(width * .71).toFixed(2)}px`);
      hero.style.setProperty('--hero-scene-y', `${(sceneBounds.top - heroBounds.top + height * .52).toFixed(2)}px`);
    }
  };
  const project = (node, time) => {
    const angle = reducedMotion ? .2 : time * .00008;
    const x = node.x * Math.cos(angle) - node.z * Math.sin(angle);
    const z = node.x * Math.sin(angle) + node.z * Math.cos(angle);
    const scale = 1 / (1.55 - z * .32);
    return { x: width * .71 + x * width * .39 * scale, y: height * .52 + node.y * height * .64 * scale, z, scale };
  };
  const draw = (time = 0) => {
    if (!reducedMotion && time - lastFrame < 32) { requestAnimationFrame(draw); return; }
    lastFrame = time; context.clearRect(0, 0, width, height);
    const points = nodes.map((node) => project(node, time));
    points.forEach((point, index) => points.slice(index + 1).forEach((other) => { const distance = Math.hypot(point.x - other.x, point.y - other.y); if (distance < 185) { context.strokeStyle = `rgba(92,225,210,${Math.max(0, .25 - distance / 900)})`; context.lineWidth = .7; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke(); } }));
    points.sort((a, b) => a.z - b.z).forEach((point) => { const radius = Math.max(1.1, 2.2 * point.scale); context.fillStyle = `rgba(92,225,210,${.25 + point.scale * .45})`; context.shadowBlur = point.z > .1 ? 12 : 0; context.shadowColor = '#5ce1d2'; context.beginPath(); context.arc(point.x, point.y, radius, 0, Math.PI * 2); context.fill(); });
    context.shadowBlur = 0;
    if (!reducedMotion) requestAnimationFrame(draw);
  };
  addEventListener('resize', resize); resize(); draw();
}

/* Progressive module enhancements: keep the original markup useful without a build step. */
const createFilterBar = (group, labels, cards, insertionPoint) => {
  if (!cards.length || document.querySelector(`[data-filter-bar="${group}"]`)) return;
  const bar = document.createElement('div');
  bar.className = 'filter-bar reveal is-visible';
  bar.dataset.filterBar = group;
  bar.setAttribute('role', 'tablist');
  bar.setAttribute('aria-label', `Filtrar ${group}`);
  const applyFilter = (value) => {
    labels.forEach(([option]) => {
      const optionButton = bar.querySelector(`[data-filter-value="${option}"]`);
      const active = option === value;
      optionButton?.classList.toggle('is-active', active);
      optionButton?.setAttribute('aria-selected', String(active));
      optionButton?.setAttribute('tabindex', active ? '0' : '-1');
    });
    cards.forEach((card) => {
      const visible = value === 'all' || card.dataset.filterCategory === value;
      card.classList.toggle('filter-hidden', !visible);
      card.hidden = !visible;
      card.setAttribute('aria-hidden', String(!visible));
    });
    const visibleCount = cards.filter((card) => !card.hidden).length;
    insertionPoint.dataset.visibleCount = String(visibleCount);
    if (group === 'brands') insertionPoint.style.setProperty('--brand-columns', String(Math.min(5, visibleCount)));
  };
  labels.forEach(([value, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = index === 0 ? 'is-active' : '';
    button.dataset.filterValue = value;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', String(index === 0));
    button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    button.textContent = label;
    button.addEventListener('click', () => applyFilter(value));
    button.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const next = (index + 1) % labels.length;
        const nextButton = bar.querySelector(`[data-filter-value="${labels[next][0]}"]`);
        nextButton?.focus();
        applyFilter(labels[next][0]);
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const previous = (index - 1 + labels.length) % labels.length;
        const previousButton = bar.querySelector(`[data-filter-value="${labels[previous][0]}"]`);
        previousButton?.focus();
        applyFilter(labels[previous][0]);
      }
    });
    bar.append(button);
  });
  applyFilter(labels[0][0]);
  insertionPoint.parentElement.insertBefore(bar, insertionPoint);
};

const enhanceServices = () => {
  const grid = document.querySelector('.service-grid');
  if (!grid) return;
  const categories = ['infrastructure', 'security', 'communications', 'management', 'management', 'consulting', 'security', 'security', 'security'];
  const cards = [...grid.children];
  cards.forEach((card, index) => { card.dataset.filterCategory = categories[index] || 'management'; });
  createFilterBar('services', [
    ['all', 'Todos'], ['infrastructure', 'Infraestructura'], ['security', 'Seguridad'], ['communications', 'Comunicaciones'], ['management', 'Gestión'], ['consulting', 'Consultoría'],
  ], cards, grid);
  if (document.querySelector('.process-panel')) return;
  const process = document.createElement('section');
  process.className = 'process-panel reveal is-visible';
  process.setAttribute('aria-labelledby', 'process-title');
  process.innerHTML = `<div class="process-heading"><span class="section-index">MÉTODO DIDGLOBALTECH</span><h2 id="process-title">Del diagnóstico a una operación<br /><em>que sigue avanzando.</em></h2><p>Un proceso claro para que cada decisión tenga contexto, responsable y siguiente paso.</p></div><div class="process-track" role="tablist" aria-label="Etapas del proceso"><button type="button" class="process-step is-active" data-process-step="0" role="tab" aria-selected="true"><span>01</span><strong>Diagnóstico</strong><small>Entender el punto de partida.</small></button><button type="button" class="process-step" data-process-step="1" role="tab" aria-selected="false"><span>02</span><strong>Diseño</strong><small>Convertir necesidades en arquitectura.</small></button><button type="button" class="process-step" data-process-step="2" role="tab" aria-selected="false"><span>03</span><strong>Implementación</strong><small>Instalar, configurar y probar.</small></button><button type="button" class="process-step" data-process-step="3" role="tab" aria-selected="false"><span>04</span><strong>Soporte</strong><small>Acompañar la operación real.</small></button></div><div class="process-detail" data-process-detail aria-live="polite">Levantamos contexto, riesgos, prioridades y restricciones antes de recomendar cualquier tecnología.</div>`;
  grid.insertAdjacentElement('afterend', process);
  const details = [
    'Levantamos contexto, riesgos, prioridades y restricciones antes de recomendar cualquier tecnología.',
    'Traducimos la operación en una arquitectura documentada, escalable y fácil de explicar.',
    'Coordinamos suministro, instalación, configuración, pruebas y puesta en marcha con orden.',
    'Dejamos documentación, acompañamiento y una ruta de mejora para que la solución no se quede estática.',
  ];
  process.querySelectorAll('[data-process-step]').forEach((step) => step.addEventListener('click', () => {
    const index = Number(step.dataset.processStep);
    process.querySelectorAll('[data-process-step]').forEach((item) => {
      const active = item === step;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    process.querySelector('[data-process-detail]').textContent = details[index];
  }));
};

const enhanceBrands = () => {
  const grid = document.querySelector('.brand-grid');
  if (!grid) return;
  const categories = ['security', 'infrastructure', 'infrastructure', 'security', 'security', 'security', 'communications', 'infrastructure', 'access', 'communications', 'infrastructure', 'infrastructure', 'infrastructure', 'cloud', 'cloud', 'cloud', 'backup', 'infrastructure', 'infrastructure', 'infrastructure'];
  const cards = [...grid.children];
  cards.forEach((card, index) => { card.dataset.filterCategory = categories[index] || 'infrastructure'; });
  createFilterBar('brands', [
    ['all', 'Todas'], ['infrastructure', 'Redes / infraestructura'], ['security', 'Seguridad'], ['communications', 'Comunicaciones'], ['cloud', 'Cloud / productividad'], ['access', 'Acceso'], ['backup', 'Respaldo'],
  ], cards, grid);
};

const enhanceProjects = () => {
  const grid = document.querySelector('.project-grid');
  if (!grid || document.querySelector('.case-studies')) return;
  const cases = document.createElement('section');
  cases.className = 'case-studies reveal is-visible';
  cases.id = 'casos';
  cases.setAttribute('aria-labelledby', 'cases-title');
  cases.innerHTML = `<div class="case-heading"><span class="section-index">CASOS DE IMPLEMENTACIÓN</span><h2 id="cases-title">Problemas reales.<br /><em>Arquitecturas que responden.</em></h2><p>Estos escenarios muestran cómo se conectan nuestras capacidades. El alcance final se define después del diagnóstico de cada organización.</p></div><div class="case-grid"><article class="case-study-card"><img src="assets/service-network.png" alt="Red corporativa conectada con nodos de infraestructura" loading="lazy" /><div><span>CASO TIPO / CONECTIVIDAD</span><h3>Una operación que necesita crecer sin perder control.</h3><p>Diseño de red, segmentación, Wi-Fi empresarial, enlaces redundantes y documentación para conectar sedes y equipos.</p><a class="text-link" href="contacto.html">Evaluar un escenario similar <span>↗</span></a></div></article><article class="case-study-card"><img src="assets/service-electronic-security.png" alt="Control de acceso protegiendo una operación corporativa" loading="lazy" /><div><span>CASO TIPO / CONTINUIDAD</span><h3>Más visibilidad para proteger la operación.</h3><p>Capas de seguridad, respaldo, controles de acceso y monitoreo coordinados para reducir exposición y responder mejor.</p><a class="text-link" href="contacto.html">Hablar con un especialista <span>↗</span></a></div></article><article class="case-study-card"><img src="assets/infrastructure-control.png" alt="Sala técnica de centro de datos preparada para continuidad" loading="lazy" /><div><span>CASO TIPO / SALA TÉCNICA</span><h3>Una base crítica preparada para el siguiente nivel.</h3><p>Racks, energía, servidores, almacenamiento y seguridad física y lógica organizados alrededor de la continuidad.</p><a class="text-link" href="contacto.html">Diseñar la siguiente etapa <span>↗</span></a></div></article></div>`;
  grid.insertAdjacentElement('afterend', cases);
};

const enhanceSolutions = () => {
  const list = document.querySelector('.ecosystem-list');
  if (!list || document.querySelector('.ecosystem-map')) return;
  const map = document.createElement('div');
  map.className = 'ecosystem-map reveal is-visible';
  map.setAttribute('aria-labelledby', 'ecosystem-map-title');
  map.innerHTML = `<div class="ecosystem-map-copy"><span class="section-index">ARQUITECTURA VIVA</span><h2 id="ecosystem-map-title">Conecta una pieza.<br /><em>Activa todo el sistema.</em></h2><p data-ecosystem-detail>Selecciona un nodo para ver cómo se relaciona con el resto de tu operación.</p><a class="text-link" href="contacto.html">Diseñar mi arquitectura <span>↗</span></a></div><div class="ecosystem-visual" role="tablist" aria-label="Capacidades del ecosistema"><span class="ecosystem-pulse" aria-hidden="true"></span><div class="ecosystem-core"><strong>DID</strong><small>CORE</small></div><button type="button" class="ecosystem-node node-top is-active" data-ecosystem-node="0" role="tab" aria-selected="true">Conectividad</button><button type="button" class="ecosystem-node node-right" data-ecosystem-node="1" role="tab" aria-selected="false">Seguridad</button><button type="button" class="ecosystem-node node-bottom" data-ecosystem-node="2" role="tab" aria-selected="false">Comunicaciones</button><button type="button" class="ecosystem-node node-left" data-ecosystem-node="3" role="tab" aria-selected="false">Gestión</button></div>`;
  list.insertAdjacentElement('afterend', map);
  const copy = [
    'Redes, enlaces y Wi-Fi que dan estabilidad al resto de las capacidades.',
    'Controles, monitoreo y continuidad para que la operación esté protegida.',
    'Telefonía, IVR e integraciones para que la información fluya entre personas.',
    'Datos, software y automatizaciones para tomar decisiones con más contexto.',
  ];
  map.querySelectorAll('[data-ecosystem-node]').forEach((node) => node.addEventListener('click', () => {
    const index = Number(node.dataset.ecosystemNode);
    map.querySelectorAll('[data-ecosystem-node]').forEach((item) => {
      const active = item === node;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });
    map.querySelector('[data-ecosystem-detail]').textContent = copy[index];
  }));
};

const enhanceContact = () => {
  const layout = document.querySelector('.contact-layout');
  if (!layout || document.querySelector('.faq-panel')) return;
  const faq = document.createElement('section');
  faq.className = 'faq-panel reveal is-visible';
  faq.setAttribute('aria-labelledby', 'faq-title');
  faq.innerHTML = `<div><span class="section-index">PREGUNTAS FRECUENTES</span><h2 id="faq-title">Antes de comenzar,<br /><em>aclaramos lo importante.</em></h2><p>Si tu pregunta no aparece aquí, escríbenos y la revisamos contigo.</p></div><div class="faq-list"><details open><summary>¿Qué información necesitan para evaluar un proyecto?</summary><p>Una descripción del objetivo, las sedes involucradas, la situación actual y cualquier fecha o restricción relevante. Con eso podemos preparar una primera conversación útil.</p></details><details><summary>¿Trabajan solo con una marca?</summary><p>No. Seleccionamos la combinación de tecnologías que mejor encaje con tu arquitectura, presupuesto, operación y ruta de crecimiento.</p></details><details><summary>¿Pueden hacerse cargo de una implementación completa?</summary><p>Sí. Podemos acompañar diagnóstico, diseño, suministro, instalación, configuración, pruebas, documentación y soporte según el alcance acordado.</p></details><details><summary>¿Atienden proyectos fuera de Santo Domingo?</summary><p>Coordinamos proyectos corporativos según sus sedes, necesidades de instalación y alcance operativo.</p></details></div>`;
  layout.insertAdjacentElement('afterend', faq);
};

const enhanceSiteShell = () => {
  const canonicalPath = currentPage === 'index.html' ? '' : currentPage;
  const canonicalUrl = `https://didglobaltech.com/${canonicalPath}`;
  if (!document.head.querySelector('link[rel="canonical"]')) {
    document.head.insertAdjacentHTML('beforeend', `<link rel="canonical" href="${canonicalUrl}" /><meta property="og:url" content="${canonicalUrl}" /><meta property="og:type" content="website" />`);
  }
  const description = document.querySelector('meta[name="description"]')?.content || 'Infraestructura, ciberseguridad, comunicaciones y soluciones tecnológicas para organizaciones que quieren avanzar.';
  if (!document.head.querySelector('meta[property="og:description"]')) document.head.insertAdjacentHTML('beforeend', `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`);
  if (!document.head.querySelector('meta[property="og:title"]')) document.head.insertAdjacentHTML('beforeend', `<meta property="og:title" content="${document.title.replace(/"/g, '&quot;')}" />`);
  document.querySelectorAll('.footer-links').forEach((footerLinks) => {
    if (!footerLinks.querySelector('a[href="privacidad.html"]')) footerLinks.insertAdjacentHTML('beforeend', '<a href="privacidad.html">Privacidad</a>');
    if (!footerLinks.querySelector('a[href="terminos.html"]')) footerLinks.insertAdjacentHTML('beforeend', '<a href="terminos.html">Términos</a>');
  });
  document.querySelectorAll('img').forEach((image) => {
    if (!image.closest('.brand')) image.loading = image.loading || 'lazy';
    image.decoding = image.decoding || 'async';
  });
  if (!document.querySelector('.whatsapp-float')) {
    document.body.insertAdjacentHTML('beforeend', '<a class="whatsapp-float" href="https://wa.me/18299440111?text=Hola%20DIDGLOBALTECH%2C%20quiero%20conversar%20sobre%20un%20proyecto." target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp de DIDGLOBALTECH"><span aria-hidden="true">↗</span><strong>WhatsApp</strong></a>');
  }
};

const enhanceIndex = () => {
  const heroSection = document.querySelector('.hero');
  if (!heroSection || document.querySelector('.executive-summary')) return;
  const summary = document.createElement('section');
  summary.className = 'executive-summary page-section reveal is-visible';
  summary.id = 'resumen';
  summary.setAttribute('aria-labelledby', 'executive-title');
  summary.innerHTML = `<div class="executive-copy"><span class="section-index">RESUMEN EJECUTIVO / DIDGLOBALTECH</span><h2 id="executive-title">Una base tecnológica para que tu operación <em>avance con claridad.</em></h2><p>Conectamos infraestructura, seguridad, comunicaciones y gestión en una arquitectura que entiende el negocio y acompaña su crecimiento.</p><div class="executive-actions"><a class="button button-solid" href="servicios.html">Explorar capacidades <span>↗</span></a><a class="text-link" href="contacto.html">Solicitar una evaluación <span>↗</span></a></div></div><div class="executive-proof"><div class="proof-metric"><strong>~25</strong><span>Años aprox. de experiencia</span></div><div class="proof-metric"><strong>04</strong><span>Etapas de acompañamiento</span></div><div class="proof-metric"><strong>360°</strong><span>Visión de infraestructura</span></div><div class="proof-metric"><strong>04</strong><span>Capacidades conectadas</span></div></div><div class="executive-pillars" aria-label="Capacidades principales"><span><i>01</i> Conectar</span><span><i>02</i> Proteger</span><span><i>03</i> Gestionar</span><span><i>04</i> Escalar</span></div>`;
  heroSection.insertAdjacentElement('afterend', summary);
};

const prepareMotionEnhancements = () => {
  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.setProperty('--reveal-index', String(Math.min(index % 6, 5)));
  });
  if (reducedMotion || !matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.service-card, .project-card, .case-study-card').forEach((card) => {
    if (card.dataset.tiltReady === 'true') return;
    card.dataset.tiltReady = 'true';
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 5;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * -5;
      card.style.setProperty('--tilt-x', `${x.toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${y.toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
};

const prepareTextAndValueMotion = () => {
  const valueObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const rawValue = element.dataset.motionValue || element.textContent.trim();
      element.classList.add('is-counting');
      observer.unobserve(element);

      if (reducedMotion) {
        element.textContent = rawValue;
        element.classList.add('is-counted');
        return;
      }

      const parts = [];
      const matcher = /\d+/g;
      let cursor = 0;
      let match;
      while ((match = matcher.exec(rawValue))) {
        if (match.index > cursor) parts.push(rawValue.slice(cursor, match.index));
        parts.push({ value: Number(match[0]), width: match[0].length });
        cursor = match.index + match[0].length;
      }
      if (cursor < rawValue.length) parts.push(rawValue.slice(cursor));

      const startedAt = performance.now();
      const duration = 1150;
      const render = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - ((1 - progress) ** 3);
        element.textContent = parts.map((part) => {
          if (typeof part === 'string') return part;
          return String(Math.round(part.value * eased)).padStart(part.width, '0');
        }).join('');
        if (progress < 1) requestAnimationFrame(render);
        else {
          element.textContent = rawValue;
          element.classList.add('is-counted');
        }
      };
      requestAnimationFrame(render);
    });
  }, { threshold: 0.65 });

  document.querySelectorAll('.proof-metric strong, .security-stats strong').forEach((element) => {
    if (element.dataset.motionReady === 'true') return;
    element.dataset.motionReady = 'true';
    element.dataset.motionValue = element.textContent.trim();
    element.classList.add('value-motion');
    valueObserver.observe(element);
  });

  const wordObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-text-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  document.querySelectorAll('.hero-copy h1, .module-page .page-heading, .module-directory h2, .section-intro h2, .executive-copy h2').forEach((heading) => {
    if (heading.dataset.wordMotionReady === 'true') return;
    heading.dataset.wordMotionReady = 'true';
    const accessibleLabel = heading.textContent.replace(/\s+/g, ' ').trim();
    heading.setAttribute('aria-label', accessibleLabel);
    const walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
    let wordIndex = 0;
    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) fragment.appendChild(document.createTextNode(part));
        else {
          const word = document.createElement('span');
          word.className = 'motion-word';
          word.textContent = part;
          word.style.setProperty('--word-delay', `${50 + wordIndex * 55}ms`);
          wordIndex += 1;
          fragment.appendChild(word);
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });
    heading.classList.add('text-motion');
    wordObserver.observe(heading);
  });
};

enhanceIndex();
enhanceServices();
enhanceBrands();
enhanceProjects();
enhanceSolutions();
enhanceContact();
enhanceSiteShell();
prepareMotionEnhancements();
prepareTextAndValueMotion();
