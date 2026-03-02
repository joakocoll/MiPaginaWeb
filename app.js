/**
 * App - Navegación y renderizado de secciones
 * Portfolio Brutalista / Hacker-core — UX para Reclutadores
 */

(function () {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const projectLog = document.getElementById('project-log');
  const experienceLog = document.getElementById('experience-log');
  const coreSkillsEl = document.getElementById('core-skills');
  const cvLink = document.getElementById('cv-download');

  const skills = [ 'Python', '.NET (C#)', 'Java',  'JavaScript ', 'SQL Server', 'Linux ', 'Windows', 'Ciberseguridad', 'Networking'];

  const professionalExperience = [
    {
      company: 'Grandi y Asociados (Practicas Profesionales Supervisadas)',
      focus: '.NET Full Stack',
      techStack: ['.NET', 'SQL Server', 'ASP.NET Web API', 'AngularJS', 'Entity Framework'],
      achievements: 'Implementación de arquitectura escalable con Entity Framework Code First. APIs REST y patrones de diseño (Dependency Injection, Unit of Work).',
      insights: 'Arquitectura en capas, separación de responsabilidades y migraciones de base de datos Code First.'
    },
    {
      company: 'Viejo Lapacho (Automatización)',
      focus: 'Python y pandas',
      techStack: ['Python', 'pandas', 'pipelines'],
      achievements: 'Reducción del 70% en tiempo de procesamiento y eliminación del 90% de errores manuales mediante pipelines automáticos.',
      insights: 'Automatización de ETL, validación de datos y optimización de flujos de trabajo repetitivos.'
    },
    {
      company: 'Simple (Soporte & Consultoría)',
      focus: 'Hardware y optimización de sistemas',
      techStack: ['Hardware', 'Sistemas', 'Infraestructura'],
      achievements: 'Base de mis conocimientos actuales en infraestructura y soporte técnico.',
      insights: 'Diagnóstico de fallas, optimización de equipos y gestión de recursos tecnológicos.'
    }
  ];

  const personalProjects = [
    {
      name: 'Organizador de Torneos de Padel',
      date: '2024-11',
      status: 'Stable',
      description: 'Sistema complejo de gestión de llaves y resultados. Arquitectura escalable para torneos de distintos formatos.',
      techs: ['C#', '.NET', 'SQLite']
    },
    {
      name: 'Sistema de Stock (PocketBase + .NET)',
      date: '2024-09',
      status: 'Dev',
      description: 'Arquitectura robusta para inventarios en redes locales. Backend con PocketBase y clientes .NET.',
      techs: ['PocketBase', '.NET', 'JavaScript']
    }
  ];

  function setActiveSection(sectionId) {
    sections.forEach(s => {
      s.classList.toggle('active', s.dataset.section === sectionId);
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function renderCoreSkills() {
    if (!coreSkillsEl) return;
    coreSkillsEl.innerHTML = skills.map(s =>
      `<span class="skill-tag">${escapeHtml(s)}</span>`
    ).join('');
  }

  function renderProfessionalExperience() {
    if (!experienceLog) return;

    experienceLog.innerHTML = professionalExperience.map(exp => `
      <div class="experience-entry">
        <div class="experience-header">
          <span class="experience-company">${escapeHtml(exp.company)}</span>
          <span class="experience-focus">${escapeHtml(exp.focus)}</span>
        </div>
        <div class="experience-body">
          <p><strong>Tech Stack:</strong> ${exp.techStack.map(t => `<span class="accent">${escapeHtml(t)}</span>`).join(', ')}</p>
          <p><strong>Achievements:</strong> ${escapeHtml(exp.achievements).replace(/(\d+%)/g, '<span class="accent">$1</span>')}</p>
          <p><strong>Insights:</strong> ${escapeHtml(exp.insights)}</p>
        </div>
      </div>
    `).join('');
  }

  function renderProjects() {
    if (!projectLog) return;

    projectLog.innerHTML = personalProjects.map(p => `
      <div class="project-mini-card">
        <div class="project-title">
          ${escapeHtml(p.name)}
          <span class="project-status ${p.status.toLowerCase()}">${escapeHtml(p.status)}</span>
        </div>
        <div class="project-meta">${escapeHtml(p.date)}</div>
        <p class="project-description">${escapeHtml(p.description)}</p>
        <div class="project-techs">
          ${p.techs.map(t => `<span class="project-tech accent">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  function handleNavClick(e) {
    e.preventDefault();
    const sectionId = e.currentTarget.dataset.section;
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }

  function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'home';
    const validSections = ['home', 'experiencia', 'proyectos', 'cv'];
    const sectionId = validSections.includes(hash) ? hash : 'home';
    setActiveSection(sectionId);
    if (sectionId === 'cv') checkCvAvailability();
  }

  function setupCvLink() {
    if (!cvLink) return;
    // Apuntamos al nuevo nombre real del archivo
    cvLink.href = 'JoaquinCollaudCV.pdf';
    // El atributo download asegura que el reclutador lo guarde con este nombre
    cvLink.setAttribute('download', 'Joaquín_Collaud_CV.pdf');
  }

  function checkCvAvailability() {
    if (!cvLink) return;
    // Verificamos el archivo real que subiste
    fetch('JoaquinCollaudCV.pdf', { method: 'HEAD' })
      .then(res => {
        if (res.ok) console.log('[CV] Archivo disponible: OK');
        else console.warn('[CV] No se encuentra JoaquinCollaudCV.pdf en la raíz.');
      })
      .catch(() => console.warn('[CV] Error de red al verificar el archivo.'));
  }

  function verifyCvOnSectionLoad() {
    const cvSection = document.getElementById('cv');
    if (!cvSection || !cvLink) return;
    if (cvSection.classList.contains('active')) checkCvAvailability();
    else {
      const observer = new MutationObserver(() => {
        if (cvSection.classList.contains('active')) {
          checkCvAvailability();
          observer.disconnect();
        }
      });
      observer.observe(cvSection, { attributes: true, attributeFilter: ['class'] });
    }
  }

  navLinks.forEach(link => link.addEventListener('click', handleNavClick));
  window.addEventListener('hashchange', handleHashChange);

  renderCoreSkills();
  renderProfessionalExperience();
  renderProjects();
  setupCvLink();
  verifyCvOnSectionLoad();
  handleHashChange();
})();
