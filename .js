// Portfolio Generator - Complete Application with GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Global state
let currentStep = 1;
let portfolioData = {
  personal: {},
  skills: [],
  education: [],
  projects: [],
  social: {},
  selectedTemplate: null,
};

let particleSystem;

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 Portfolio Generator initializing...");
  initParticleSystem();
  initLoadingScreen();
  setupEventListeners();
});

// Particle System Class
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particle-canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.animationId = null;

    this.resize();
    this.createParticles();
    this.start();
    this.bindEvents();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    const count = Math.min(100, Math.floor(window.innerWidth / 12));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`,
      });
    }
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
    document.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  start() {
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle, index) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        const force = (120 - distance) / 120;
        particle.x -= dx * force * 0.02;
        particle.y -= dy * force * 0.02;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();

      // Draw connections
      this.particles.slice(index + 1).forEach((other) => {
        const dx2 = particle.x - other.x;
        const dy2 = particle.y - other.y;
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (distance2 < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = `rgba(59, 130, 246, ${
            0.2 * (1 - distance2 / 100)
          })`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });

      this.ctx.globalAlpha = 1;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

function initParticleSystem() {
  try {
    particleSystem = new ParticleSystem();
    console.log("✨ Particle system initialized");
  } catch (error) {
    console.warn("⚠️ Particle system failed to initialize:", error);
  }
}

function initLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen");
  if (!loadingScreen) return;

  setTimeout(() => {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        loadingScreen.style.display = "none";
        startWelcomeAnimations();
      },
    });
  }, 3000);
}

function startWelcomeAnimations() {
  console.log("🎬 Starting welcome animations");

  const tl = gsap.timeline();
  tl.to(".welcome-title", {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out",
  })
    .to(
      ".welcome-subtitle",
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=0.5"
    )
    .to(
      ".feature-card",
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        stagger: 0.15,
      },
      "-=0.4"
    );
}

function setupEventListeners() {
  console.log("🔧 Setting up event listeners");

  setupStartButton();
  setupFormNavigation();
  setupInputHandlers();

  console.log("✅ Event listeners ready");
}

function setupStartButton() {
  console.log("Setting up start button...");

  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      startPortfolioCreation();
    });

    startBtn.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        startPortfolioCreation();
      }
    });

    startBtn.setAttribute("tabindex", "0");
  }

  document.addEventListener("click", function (e) {
    const startButton = e.target.closest("#start-btn");
    if (startButton) {
      e.preventDefault();
      startPortfolioCreation();
    }
  });
}

function setupFormNavigation() {
  const skillInput = document.getElementById("skill-input");
  if (skillInput) {
    skillInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill();
      }
    });
  }
}

function setupInputHandlers() {
  document.addEventListener(
    "focus",
    (e) => {
      if (e.target.matches("input, textarea, select")) {
        gsap.to(e.target, {
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    true
  );

  document.addEventListener(
    "blur",
    (e) => {
      if (e.target.matches("input, textarea, select")) {
        gsap.to(e.target, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    },
    true
  );
}

function startPortfolioCreation() {
  console.log("🚀 Starting portfolio creation process...");

  const welcomeScreen = document.getElementById("welcome-screen");
  const formContainer = document.getElementById("form-container");

  if (!welcomeScreen || !formContainer) {
    console.error("❌ Required elements not found");
    showToast("Navigation error - please refresh the page", "error");
    return;
  }

  showToast("Starting portfolio creation... ✨", "info");

  formContainer.classList.remove("hidden");

  gsap.to(welcomeScreen, {
    opacity: 0,
    y: -50,
    duration: 0.8,
    ease: "power2.inOut",
    onComplete: () => {
      welcomeScreen.style.display = "none";

      gsap.fromTo(
        formContainer,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            showStep(1);
            updateProgress();
            showToast("Welcome to the portfolio builder! 🎉");
          },
        }
      );
    },
  });
}

// Navigation Functions
function nextStep(step) {
  console.log("Moving to step:", step);
  if (!validateCurrentStep()) return;

  saveCurrentStepData();
  navigateToStep(step);
}

function previousStep(step) {
  console.log("Going back to step:", step);
  navigateToStep(step);
}

function navigateToStep(step) {
  const currentStepEl = document.getElementById(`step-${currentStep}`);
  const nextStepEl = document.getElementById(`step-${step}`);

  if (!nextStepEl) {
    console.error("Step element not found:", step);
    return;
  }

  if (currentStepEl) {
    gsap.to(currentStepEl, {
      opacity: 0,
      x: step > currentStep ? -30 : 30,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        currentStepEl.classList.add("hidden");
        showStep(step);
      },
    });
  } else {
    showStep(step);
  }

  currentStep = step;
  updateProgress();
}

function showStep(step) {
  console.log("Showing step:", step);

  document.querySelectorAll(".form-step").forEach((stepEl) => {
    stepEl.classList.add("hidden");
  });

  const stepEl = document.getElementById(`step-${step}`);
  if (!stepEl) {
    console.error("Step element not found:", step);
    return;
  }

  stepEl.classList.remove("hidden");

  gsap.fromTo(
    stepEl,
    { opacity: 0, x: 30 },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: "power2.out",
    }
  );

  if (step === 6) {
    gsap.set(".template-card", { opacity: 0, y: 20 });
    gsap.to(".template-card", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.1,
      delay: 0.3,
    });
  }
}

function updateProgress() {
  const percentage = Math.round((currentStep / 6) * 100);

  gsap.to("#progress-fill", {
    width: `${percentage}%`,
    duration: 0.8,
    ease: "power2.out",
  });

  const percentageEl = document.getElementById("progress-percentage");
  if (percentageEl) {
    percentageEl.textContent = `${percentage}%`;
  }

  const stepIndicator = document.getElementById("current-step");
  if (stepIndicator) {
    stepIndicator.textContent = currentStep;
  }

  document.querySelectorAll(".progress-step").forEach((step, index) => {
    if (index + 1 <= currentStep) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

// Form Functions
function addSkill() {
  const skillInput = document.getElementById("skill-input");
  const categorySelect = document.getElementById("skill-category");
  const levelSelect = document.getElementById("skill-level");

  const skill = skillInput?.value.trim();
  const category = categorySelect?.value || "Other";
  const level = levelSelect?.value || "Intermediate";

  if (!skill) {
    showToast("Please enter a skill name", "error");
    return;
  }

  if (
    portfolioData.skills.some(
      (s) => s.skill.toLowerCase() === skill.toLowerCase()
    )
  ) {
    showToast("Skill already added", "error");
    return;
  }

  const skillObj = { skill, category, level };
  portfolioData.skills.push(skillObj);

  displaySkill(skillObj);
  skillInput.value = "";
  saveCurrentStepData();
  showToast("Skill added! ✨");
}

function displaySkill(skillObj) {
  const skillsList = document.getElementById("skills-list");
  if (!skillsList) return;

  const skillTag = document.createElement("div");
  skillTag.className = "skill-tag";
  skillTag.innerHTML = `
    <span>${skillObj.skill}</span>
    <span class="skill-level">${skillObj.level}</span>
    <button class="skill-remove" onclick="removeSkill('${skillObj.skill.replace(
      /'/g,
      "\\'"
    )}')" type="button">&times;</button>
  `;

  skillsList.appendChild(skillTag);

  gsap.from(skillTag, {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: "back.out(1.7)",
  });
}

function removeSkill(skillName) {
  portfolioData.skills = portfolioData.skills.filter(
    (s) => s.skill !== skillName
  );
  refreshSkillsDisplay();
  saveCurrentStepData();
  showToast("Skill removed");
}

function refreshSkillsDisplay() {
  const skillsList = document.getElementById("skills-list");
  if (skillsList) {
    skillsList.innerHTML = "";
    portfolioData.skills.forEach((skill) => displaySkill(skill));
  }
}

function addEducation() {
  const institution = document.getElementById("edu-institution")?.value.trim();
  const degree = document.getElementById("edu-degree")?.value.trim();
  const year = document.getElementById("edu-year")?.value.trim();
  const description =
    document.getElementById("edu-description")?.value.trim() || "";

  if (!institution || !degree || !year) {
    showToast("Please fill in institution, degree, and year", "error");
    return;
  }

  const eduObj = { institution, degree, year, description };
  portfolioData.education.push(eduObj);

  displayEducation(eduObj);
  clearEducationForm();
  saveCurrentStepData();
  showToast("Education added! 🎓");
}

function displayEducation(eduObj) {
  const eduList = document.getElementById("education-list");
  if (!eduList) return;

  const eduItem = document.createElement("div");
  eduItem.className = "education-item";
  eduItem.innerHTML = `
    <h4>${eduObj.degree}</h4>
    <p>${eduObj.institution} • ${eduObj.year}</p>
    ${eduObj.description ? `<p>${eduObj.description}</p>` : ""}
    <button class="remove-btn" onclick="removeEducation('${eduObj.institution.replace(
      /'/g,
      "\\'"
    )}', '${eduObj.degree.replace(/'/g, "\\'")}')" type="button">Remove</button>
  `;

  eduList.appendChild(eduItem);

  gsap.from(eduItem, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: "power2.out",
  });
}

function clearEducationForm() {
  ["edu-institution", "edu-degree", "edu-year", "edu-description"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    }
  );
}

function removeEducation(institution, degree) {
  portfolioData.education = portfolioData.education.filter(
    (e) => !(e.institution === institution && e.degree === degree)
  );
  refreshEducationDisplay();
  saveCurrentStepData();
  showToast("Education removed");
}

function refreshEducationDisplay() {
  const eduList = document.getElementById("education-list");
  if (eduList) {
    eduList.innerHTML = "";
    portfolioData.education.forEach((edu) => displayEducation(edu));
  }
}

function addProject() {
  const title = document.getElementById("project-title")?.value.trim();
  const description = document
    .getElementById("project-description")
    ?.value.trim();
  const technologies = document
    .getElementById("project-technologies")
    ?.value.trim();
  const github = document.getElementById("project-github")?.value.trim() || "";
  const demo = document.getElementById("project-demo")?.value.trim() || "";
  const image = document.getElementById("project-image")?.value.trim() || "";

  if (!title || !description || !technologies) {
    showToast("Please fill in title, description, and technologies", "error");
    return;
  }

  const projectObj = { title, description, technologies, github, demo, image };
  portfolioData.projects.push(projectObj);

  displayProject(projectObj);
  clearProjectForm();
  saveCurrentStepData();
  showToast("Project added! 🚀");
}

function displayProject(projectObj) {
  const projectsList = document.getElementById("projects-list");
  if (!projectsList) return;

  const projectItem = document.createElement("div");
  projectItem.className = "project-item";
  projectItem.innerHTML = `
    <h4>${projectObj.title}</h4>
    <p>${projectObj.description}</p>
    <div class="project-technologies">Technologies: ${
      projectObj.technologies
    }</div>
    ${
      projectObj.github || projectObj.demo
        ? `<div class="project-links">
        ${
          projectObj.github
            ? `<a href="${projectObj.github}" target="_blank">GitHub</a>`
            : ""
        }
        ${
          projectObj.demo
            ? `<a href="${projectObj.demo}" target="_blank">Demo</a>`
            : ""
        }
    </div>`
        : ""
    }
    <button class="remove-btn" onclick="removeProject('${projectObj.title.replace(
      /'/g,
      "\\'"
    )}')" type="button">Remove</button>
  `;

  projectsList.appendChild(projectItem);

  gsap.from(projectItem, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: "power2.out",
  });
}

function clearProjectForm() {
  [
    "project-title",
    "project-description",
    "project-technologies",
    "project-github",
    "project-demo",
    "project-image",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

function removeProject(title) {
  portfolioData.projects = portfolioData.projects.filter(
    (p) => p.title !== title
  );
  refreshProjectsDisplay();
  saveCurrentStepData();
  showToast("Project removed");
}

function refreshProjectsDisplay() {
  const projectsList = document.getElementById("projects-list");
  if (projectsList) {
    projectsList.innerHTML = "";
    portfolioData.projects.forEach((project) => displayProject(project));
  }
}

function selectTemplate(templateId) {
  console.log("🎨 Template selected:", templateId);

  document.querySelectorAll(".template-card").forEach((card) => {
    card.classList.remove("selected");
  });

  const selectedCard = document.querySelector(
    `[data-template="${templateId}"]`
  );
  if (selectedCard) {
    selectedCard.classList.add("selected");

    gsap.to(selectedCard, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.7)",
      onComplete: () => {
        gsap.to(selectedCard, { scale: 1, duration: 0.2 });
      },
    });
  }

  portfolioData.selectedTemplate = templateId;
  saveCurrentStepData();

  showToast("Generating your portfolio... 🎨", "info");

  setTimeout(() => {
    generatePortfolioCode();
    showCodeScreen();
  }, 1500);
}

function showCodeScreen() {
  console.log("Showing code screen...");

  const formContainer = document.getElementById("form-container");
  const codeScreen = document.getElementById("code-screen");

  if (!formContainer || !codeScreen) {
    console.error("Screen elements not found");
    return;
  }

  gsap.to(formContainer, {
    opacity: 0,
    y: -30,
    duration: 0.6,
    ease: "power2.inOut",
    onComplete: () => {
      formContainer.classList.add("hidden");
      codeScreen.classList.remove("hidden");

      gsap.from(codeScreen, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
      });

      showToast("Portfolio generated successfully! 🎉");
    },
  });
}

function showCodeTab(tab) {
  console.log("Showing code tab:", tab);

  document
    .querySelectorAll(".code-tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelectorAll(".code-tab-content")
    .forEach((content) => content.classList.add("hidden"));

  const tabBtn = event?.target?.closest(".code-tab-btn");
  const tabContent = document.getElementById(`${tab}-code`);

  if (tabBtn) tabBtn.classList.add("active");
  if (tabContent) {
    tabContent.classList.remove("hidden");
    gsap.from(tabContent, { opacity: 0, y: 10, duration: 0.3 });
  }
}

function copyCode(type) {
  console.log("Copying code:", type);

  const codeElement = document.getElementById(`${type}-content`);
  if (!codeElement) {
    console.error("Code element not found:", type);
    showToast("Code not found", "error");
    return;
  }

  const code = codeElement.textContent;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        showToast(`${type.toUpperCase()} code copied! 📋`);
      })
      .catch(() => {
        fallbackCopyTextToClipboard(code, type);
      });
  } else {
    fallbackCopyTextToClipboard(code, type);
  }
}

function fallbackCopyTextToClipboard(text, type) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast(`${type.toUpperCase()} code copied! 📋`);
    } else {
      throw new Error("Copy command failed");
    }
  } catch (err) {
    console.error("Copy failed:", err);
    showToast("Failed to copy code. Please select and copy manually.", "error");
  }

  document.body.removeChild(textArea);
}

async function previewPortfolio() {
  console.log("Opening live preview...");

  const htmlContent = document.getElementById("html-content");
  const cssContent = document.getElementById("css-content");
  const jsContent = document.getElementById("js-content");

  if (!htmlContent || !cssContent || !jsContent) {
    showToast("Code content not found", "error");
    return;
  }

  const html = htmlContent.textContent;
  const css = cssContent.textContent;
  const js = jsContent.textContent;

  // Create complete HTML with inline styles and scripts
  const completeHtml = html
    .replace(
      '<link rel="stylesheet" href="style.css">',
      `<style>${css}</style>`
    )
    .replace('<script src="script.js"></script>', `<script>${js}</script>`);

  try {
    const blob = new Blob([completeHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const newWindow = window.open(url, "_blank", "width=1200,height=800");
    if (!newWindow) {
      showToast("Please allow popups to preview your portfolio", "error");
    } else {
      showToast("Opening live preview... 🚀");
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }
  } catch (error) {
    console.error("Preview error:", error);
    showToast("Failed to create preview", "error");
  }
}

async function downloadPortfolio() {
  console.log("Starting download...");

  const htmlContent = document.getElementById("html-content");
  const cssContent = document.getElementById("css-content");
  const jsContent = document.getElementById("js-content");

  if (!htmlContent || !cssContent || !jsContent) {
    showToast("Code content not found", "error");
    return;
  }

  if (typeof JSZip === "undefined") {
    showToast(
      "JSZip library not loaded. Please refresh and try again.",
      "error"
    );
    return;
  }

  try {
    showToast("Creating ZIP file... 📦", "info");

    const zip = new JSZip();

    zip.file("index.html", htmlContent.textContent);
    zip.file("style.css", cssContent.textContent);
    zip.file("script.js", jsContent.textContent);

    const readme = `# Portfolio - ${
      portfolioData.personal.fullName || "Generated Portfolio"
    }

This portfolio was generated using the Portfolio Generator tool.

## Files:
- index.html - Main HTML file
- style.css - Stylesheet with Tailwind CSS and custom styles  
- script.js - JavaScript with GSAP animations

## To run:
1. Open index.html in a modern web browser
2. Ensure you have an internet connection for CDN resources (Tailwind CSS, GSAP)

## Template: ${portfolioData.selectedTemplate || "modern"}
## Generated: ${new Date().toLocaleDateString()}

Enjoy your new portfolio! 🚀
`;

    zip.file("README.md", readme);

    const content = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    const fileName = `portfolio-${
      portfolioData.selectedTemplate || "modern"
    }-${Date.now()}.zip`;

    link.href = url;
    link.download = fileName;
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    showToast("Portfolio downloaded successfully! 📥");
  } catch (error) {
    console.error("Download error:", error);
    showToast("Download failed. Please try again.", "error");
  }
}

function startOver() {
  console.log("Starting over...");

  const codeScreen = document.getElementById("code-screen");
  const welcomeScreen = document.getElementById("welcome-screen");

  if (!codeScreen || !welcomeScreen) {
    console.error("Screen elements not found");
    return;
  }

  gsap.to(codeScreen, {
    opacity: 0,
    y: 30,
    duration: 0.6,
    ease: "power2.inOut",
    onComplete: () => {
      codeScreen.classList.add("hidden");
      welcomeScreen.style.display = "block";
      welcomeScreen.classList.remove("hidden");

      gsap.from(welcomeScreen, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "power2.out",
      });
    },
  });

  portfolioData = {
    personal: {},
    skills: [],
    education: [],
    projects: [],
    social: {},
    selectedTemplate: null,
  };

  currentStep = 1;

  document
    .querySelectorAll("input, textarea")
    .forEach((input) => (input.value = ""));
  const skillsList = document.getElementById("skills-list");
  const educationList = document.getElementById("education-list");
  const projectsList = document.getElementById("projects-list");

  if (skillsList) skillsList.innerHTML = "";
  if (educationList) educationList.innerHTML = "";
  if (projectsList) projectsList.innerHTML = "";

  document
    .querySelectorAll(".template-card")
    .forEach((card) => card.classList.remove("selected"));

  updateProgress();

  showToast("Starting over... 🔄");
}

// Validation Functions
function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      const name = document.getElementById("fullName")?.value.trim();
      const title = document.getElementById("title")?.value.trim();
      const email = document.getElementById("email")?.value.trim();
      const about = document.getElementById("about")?.value.trim();

      if (!name || !title || !email || !about) {
        showToast("Please fill in all required fields", "error");
        return false;
      }

      if (!isValidEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return false;
      }
      break;
  }
  return true;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveCurrentStepData() {
  switch (currentStep) {
    case 1:
      portfolioData.personal = {
        fullName: document.getElementById("fullName")?.value.trim() || "",
        title: document.getElementById("title")?.value.trim() || "",
        email: document.getElementById("email")?.value.trim() || "",
        phone: document.getElementById("phone")?.value.trim() || "",
        location: document.getElementById("location")?.value.trim() || "",
        profileImage:
          document.getElementById("profileImage")?.value.trim() || "",
        about: document.getElementById("about")?.value.trim() || "",
      };
      break;

    case 5:
      portfolioData.social = {
        github: document.getElementById("social-github")?.value.trim() || "",
        linkedin:
          document.getElementById("social-linkedin")?.value.trim() || "",
        twitter: document.getElementById("social-twitter")?.value.trim() || "",
        website: document.getElementById("social-website")?.value.trim() || "",
        resume: document.getElementById("social-resume")?.value.trim() || "",
      };
      break;
  }
}

// Utility function for skill percentages
function getSkillPercentage(level) {
  switch (level.toLowerCase()) {
    case "beginner":
      return "25";
    case "intermediate":
      return "50";
    case "advanced":
      return "75";
    case "expert":
      return "90";
    default:
      return "50";
  }
}

// Template Generators
function generatePortfolioCode() {
  console.log(
    "🎨 Generating portfolio code for template:",
    portfolioData.selectedTemplate
  );

  let result;

  switch (portfolioData.selectedTemplate) {
    case "modern":
      result = generateModernTemplate();
      break;
    case "creative":
      result = generateCreativeTemplate();
      break;
    case "minimal":
      result = generateMinimalTemplate();
      break;
    case "dark-neon":
      result = generateDarkNeonTemplate();
      break;
    case "glassmorphism":
      result = generateGlassmorphismTemplate();
      break;
    case "cyberpunk":
      result = generateCyberpunkTemplate();
      break;
    case "gradient-paradise":
      result = generateGradientTemplate();
      break;
    case "particle-nexus":
      result = generateParticleTemplate();
      break;
    default:
      result = generateModernTemplate();
  }

  // Display generated code
  const htmlContent = document.getElementById("html-content");
  const cssContent = document.getElementById("css-content");
  const jsContent = document.getElementById("js-content");

  if (htmlContent) htmlContent.textContent = result.html;
  if (cssContent) cssContent.textContent = result.css;
  if (jsContent) jsContent.textContent = result.js;

  // Syntax highlighting
  if (window.Prism) {
    setTimeout(() => Prism.highlightAll(), 100);
  }

  console.log("✅ Code generation complete");
}

// Template 1: Modern Professional
function generateModernTemplate() {
  const data = portfolioData;

  const skillsHTML = data.skills.map(skill => `
    <div class="mb-4">
      <div class="flex justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">${skill.skill}</span>
        <span class="text-sm text-gray-500">${skill.level}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-blue-600 h-2.5 rounded-full skill-bar" data-skill="${getSkillPercentage(skill.level)}" style="width: 0%"></div>
      </div>
    </div>
  `).join('');

  const projectsHTML = data.projects.map(project => `
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 project-card">
      ${project.image ? `<img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">` : ''}
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-2">${project.title}</h3>
        <p class="text-gray-600 mb-4">${project.description}</p>
        <div class="text-sm text-blue-600 mb-4">${project.technologies}</div>
        <div class="flex gap-4">
          ${project.github ? `<a href="${project.github}" target="_blank" class="text-blue-600 hover:text-blue-800">GitHub</a>` : ''}
          ${project.demo ? `<a href="${project.demo}" target="_blank" class="text-blue-600 hover:text-blue-800">Live Demo</a>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - ${data.personal.title || "Developer"}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="font-sans bg-gray-50">
    <div id="loading" class="loading-screen">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600">Loading...</p>
    </div>

    <nav class="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 shadow-sm">
        <div class="container mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <div class="text-2xl font-bold text-gray-900">${data.personal.fullName || "Portfolio"}</div>
                <div class="hidden md:flex space-x-8">
                    <a href="#hero" class="text-gray-600 hover:text-blue-600 transition-colors">Home</a>
                    <a href="#about" class="text-gray-600 hover:text-blue-600 transition-colors">About</a>
                    <a href="#skills" class="text-gray-600 hover:text-blue-600 transition-colors">Skills</a>
                    <a href="#projects" class="text-gray-600 hover:text-blue-600 transition-colors">Projects</a>
                    <a href="#contact" class="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <section id="hero" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
        <div class="container mx-auto px-6 text-center">
            ${data.personal.profileImage ? `<div class="hero-image mb-8">
                <img src="${data.personal.profileImage}" alt="${data.personal.fullName}" class="w-32 h-32 rounded-full mx-auto object-cover shadow-xl">
            </div>` : ""}
            <h1 class="hero-title text-6xl md:text-7xl font-bold text-gray-900 mb-6">
                Hi, I'm <span class="text-blue-600">${(data.personal.fullName || "Developer").split(" ")[0]}</span>
            </h1>
            <h2 class="hero-subtitle text-2xl md:text-3xl text-gray-600 mb-8">${data.personal.title || "Full Stack Developer"}</h2>
            <p class="hero-description text-lg text-gray-600 max-w-3xl mx-auto mb-12">${data.personal.about || "Passionate developer creating amazing digital experiences."}</p>
            <div class="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#projects" class="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                    View My Work
                </a>
                <a href="#contact" class="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                    Get In Touch
                </a>
            </div>
        </div>
    </section>

    ${data.skills?.length ? `<section id="skills" class="py-20 bg-white">
        <div class="container mx-auto px-6">
            <h2 class="section-title text-4xl font-bold text-center text-gray-900 mb-16">Skills & Expertise</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${skillsHTML}
            </div>
        </div>
    </section>` : ""}

    ${data.projects?.length ? `<section id="projects" class="py-20 bg-gray-50">
        <div class="container mx-auto px-6">
            <h2 class="section-title text-4xl font-bold text-center text-gray-900 mb-16">Featured Projects</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 projects-grid">
                ${projectsHTML}
            </div>
        </div>
    </section>` : ""}

    <section id="contact" class="py-20 bg-gray-900 text-white">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-bold mb-8">Let's Work Together</h2>
            <p class="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">Ready to bring your ideas to life? Let's create something amazing together.</p>
            
            ${Object.values(data.social || {}).some(link => link) ? `<div class="flex justify-center space-x-8 mb-12">
                ${data.social?.github ? `<a href="${data.social.github}" target="_blank" class="text-gray-300 hover:text-white transition-colors">GitHub</a>` : ""}
                ${data.social?.linkedin ? `<a href="${data.social.linkedin}" target="_blank" class="text-gray-300 hover:text-white transition-colors">LinkedIn</a>` : ""}
                ${data.social?.twitter ? `<a href="${data.social.twitter}" target="_blank" class="text-gray-300 hover:text-white transition-colors">Twitter</a>` : ""}
            </div>` : ""}
            
            <a href="mailto:${data.personal.email || "contact@example.com"}" class="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all inline-block">
                Send Message
            </a>
        </div>
    </section>

    <footer class="bg-gray-800 text-gray-300 py-8">
        <div class="container mx-auto px-6 text-center">
            <p>&copy; 2024 ${data.personal.fullName || "Portfolio"}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `body {
    font-family: 'Inter', sans-serif;
    scroll-behavior: smooth;
}

.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease-out;
}

.loading-screen.hidden {
    opacity: 0;
    pointer-events: none;
}

.hero-image, .hero-title, .hero-subtitle, .hero-description, .hero-buttons {
    opacity: 0;
    transform: translateY(30px);
}

.section-title, .skill-card, .project-card {
    opacity: 0;
    transform: translateY(30px);
}

.skill-bar {
    width: 0;
    transition: width 1.5s ease-out;
}

@media (max-width: 768px) {
    .hero-title { font-size: 3rem !important; }
    .hero-subtitle { font-size: 1.5rem !important; }
}`;

  const js = `gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
});

function initializePortfolio() {
    const loading = document.getElementById('loading');
    
    setTimeout(() => {
        loading.classList.add('hidden');
        startAnimations();
    }, 1500);
}

function startAnimations() {
    const tl = gsap.timeline();
    
    tl.to('.hero-image', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
      .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.5')
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
      .to('.hero-description', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
      .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
    
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: title, start: 'top 80%' }
        });
    });
    
    gsap.utils.toArray('.skill-bar').forEach(bar => {
        gsap.to(bar, {
            width: bar.getAttribute('data-skill') + '%',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 80%' }
        });
    });
    
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)',
            delay: index * 0.1,
            scrollTrigger: { trigger: card, start: 'top 80%' }
        });
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}`;

  return { html, css, js };
}

// Template 2: Creative Developer  
function generateCreativeTemplate() {
  const data = portfolioData;

  const skillsHTML = data.skills.map((skill, index) => `
    <div class="skill-item bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg transform hover:scale-105 transition-all duration-300" style="animation-delay: ${index * 0.1}s">
        <h3 class="font-semibold">${skill.skill}</h3>
        <div class="mt-2">
            <div class="w-full bg-white/30 rounded-full h-2">
                <div class="bg-white h-2 rounded-full skill-progress" data-skill="${getSkillPercentage(skill.level)}" style="width: 0%"></div>
            </div>
        </div>
    </div>
  `).join('');

  const projectsHTML = data.projects.map(project => `
    <div class="project-card group relative bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-500">
        <div class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 z-10"></div>
        ${project.image ? `
            <div class="h-48 bg-gradient-to-r from-pink-400 to-purple-500 relative">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
            </div>
        ` : `
            <div class="h-48 bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                <div class="text-white text-4xl font-bold">${project.title.charAt(0)}</div>
            </div>
        `}
        <div class="p-6 relative z-20">
            <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-white transition-colors">${project.title}</h3>
            <p class="text-gray-600 mb-4 group-hover:text-white/90 transition-colors">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.technologies.split(',').map(tech => `
                    <span class="px-2 py-1 bg-pink-100 text-pink-600 text-xs rounded-full group-hover:bg-white/20 group-hover:text-white transition-colors">${tech.trim()}</span>
                `).join('')}
            </div>
            <div class="flex gap-4">
                ${project.github ? `<a href="${project.github}" target="_blank" class="text-pink-500 hover:text-pink-700 group-hover:text-white font-semibold transition-colors">GitHub</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" target="_blank" class="text-purple-500 hover:text-purple-700 group-hover:text-white font-semibold transition-colors">Live Demo</a>` : ''}
            </div>
        </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Creative Developer</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-900 text-white min-h-screen">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div class="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style="animation-delay: 1s;"></div>
        <div class="absolute bottom-20 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style="animation-delay: 2s;"></div>
    </div>

    <nav class="fixed top-0 w-full bg-gray-900/80 backdrop-blur-md z-50">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-gradient">${data.personal.fullName || "Creative Dev"}</h1>
                <div class="hidden md:flex space-x-8">
                    <a href="#about" class="text-gray-300 hover:text-pink-400 transition-colors duration-300">About</a>
                    <a href="#skills" class="text-gray-300 hover:text-pink-400 transition-colors duration-300">Skills</a>
                    <a href="#projects" class="text-gray-300 hover:text-pink-400 transition-colors duration-300">Projects</a>
                    <a href="#contact" class="text-gray-300 hover:text-pink-400 transition-colors duration-300">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <section id="hero" class="min-h-screen flex items-center justify-center relative">
        <div class="text-center z-10">
            <div class="hero-content">
                <h1 class="text-6xl md:text-8xl font-bold mb-6">
                    <span class="block text-white hero-name">${data.personal.fullName || "Your Name"}</span>
                    <span class="block text-gradient hero-title">${data.personal.title || "Creative Developer"}</span>
                </h1>
                <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto hero-description">
                    ${data.personal.about || "Crafting digital experiences that inspire and engage through creative code and innovative design."}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
                    <a href="#projects" class="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full hover:from-pink-600 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 font-semibold">
                        Explore My Work
                    </a>
                    <a href="#contact" class="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full hover:bg-pink-500 hover:text-white transition-all duration-300 font-semibold">
                        Let's Connect
                    </a>
                </div>
            </div>
        </div>
    </section>

    <section id="skills" class="py-20 relative">
        <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">Creative Skills</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 skills-grid">
                ${skillsHTML}
            </div>
        </div>
    </section>

    <section id="projects" class="py-20 relative">
        <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">Featured Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 projects-grid">
                ${projectsHTML}
            </div>
        </div>
    </section>

    <section id="contact" class="py-20 relative">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-4xl md:text-5xl font-bold mb-8 text-gradient">Let's Create Together</h2>
            <p class="text-xl text-gray-300 mb-12">Ready to bring your creative vision to life? Let's collaborate and build something extraordinary.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 contact-info">
                ${data.personal.email ? `
                    <a href="mailto:${data.personal.email}" class="bg-gradient-to-r from-pink-500 to-purple-600 p-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300">
                        <div class="text-3xl mb-4">📧</div>
                        <div class="font-semibold">Email</div>
                        <div class="text-gray-200">${data.personal.email}</div>
                    </a>
                ` : ''}
            </div>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes colorShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.animate-float { animation: float 3s ease-in-out infinite; }
.bg-animated { background-size: 200% 200%; animation: colorShift 3s ease infinite; }
.text-gradient { background: linear-gradient(45deg, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.skill-item, .project-card { opacity: 0; transform: translateY(30px); }
.skill-progress { width: 0%; transition: width 2s ease-out; }

@media (max-width: 768px) {
    .hero-name { font-size: 2.5rem !important; }
    .hero-title { font-size: 2rem !important; }
}`;

  const js = `gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();
    tl.from('.hero-name', { opacity: 0, y: 100, duration: 1, ease: 'power3.out' })
      .from('.hero-title', { opacity: 0, y: 100, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from('.hero-description', { opacity: 0, y: 50, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .from('.hero-buttons', { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    gsap.fromTo('.skill-item', 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1,
          scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' }
        }
    );

    gsap.utils.toArray('.skill-progress').forEach(bar => {
        gsap.to(bar, {
            width: bar.dataset.skill + '%',
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 80%' }
        });
    });

    gsap.fromTo('.project-card',
        { opacity: 0, y: 100, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2,
          scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' }
        }
    );

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});`;

  return { html, css, js };
}

// Template 3: Minimal Portfolio
function generateMinimalTemplate() {
  const data = portfolioData;

  const skillsHTML = data.skills.map(skill => `
    <div class="skill-item mb-6">
        <div class="flex justify-between items-center mb-2">
            <span class="text-gray-800 font-medium">${skill.skill}</span>
            <span class="text-gray-500 text-sm">${skill.level}</span>
        </div>
        <div class="w-full h-px bg-gray-200">
            <div class="h-px bg-gray-800 skill-line" data-skill="${getSkillPercentage(skill.level)}" style="width: 0%"></div>
        </div>
    </div>
  `).join('');

  const projectsHTML = data.projects.map(project => `
    <div class="project-item group mb-16 pb-16 border-b border-gray-200 last:border-b-0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
                <h3 class="text-2xl font-light text-gray-900 mb-4">${project.title}</h3>
                <p class="text-gray-600 mb-6 leading-relaxed">${project.description}</p>
                <div class="text-sm text-gray-500 mb-6 font-mono">${project.technologies}</div>
                <div class="flex gap-6">
                    ${project.github ? `<a href="${project.github}" target="_blank" class="text-gray-800 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-600">GitHub</a>` : ''}
                    ${project.demo ? `<a href="${project.demo}" target="_blank" class="text-gray-800 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-600">Live Demo</a>` : ''}
                </div>
            </div>
            ${project.image ? `
                <div class="order-first lg:order-last">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-64 object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                </div>
            ` : ''}
        </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Minimal Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-white text-gray-900 font-light">
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div class="max-w-4xl mx-auto px-6 py-6">
            <div class="flex justify-between items-center">
                <div class="text-xl font-light">${data.personal.fullName || "Portfolio"}</div>
                <div class="hidden md:flex space-x-12">
                    <a href="#about" class="text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide">About</a>
                    <a href="#skills" class="text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide">Skills</a>
                    <a href="#work" class="text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide">Work</a>
                    <a href="#contact" class="text-gray-600 hover:text-gray-900 transition-colors text-sm tracking-wide">Contact</a>
                </div>
            </div>
        </div>
    </nav>

    <section id="hero" class="min-h-screen flex items-center justify-center">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h1 class="text-4xl md:text-6xl font-light text-gray-900 mb-8 hero-title">
                ${data.personal.fullName || "Your Name"}
            </h1>
            <p class="text-xl md:text-2xl text-gray-600 font-light mb-12 hero-subtitle">
                ${data.personal.title || "Designer & Developer"}
            </p>
            <div class="w-16 h-px bg-gray-400 mx-auto mb-12 hero-line"></div>
            <p class="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed hero-description">
                ${data.personal.about || "Creating thoughtful digital experiences through clean design and elegant code. Focused on simplicity, functionality, and user-centered design."}
            </p>
        </div>
    </section>

    <section id="about" class="py-32">
        <div class="max-w-4xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                    <h2 class="text-3xl font-light text-gray-900 mb-8 section-title">About</h2>
                    <div class="w-12 h-px bg-gray-400 mb-8"></div>
                    <p class="text-gray-700 leading-relaxed mb-6 about-text">
                        ${data.personal.about || "I am a passionate designer and developer with a focus on creating meaningful digital experiences. My approach combines aesthetic sensibility with technical expertise to deliver solutions that are both beautiful and functional."}
                    </p>
                    <div class="flex flex-wrap gap-6 text-sm text-gray-600 contact-details">
                        ${data.personal.email ? `<div>Email: ${data.personal.email}</div>` : ''}
                        ${data.personal.location ? `<div>Location: ${data.personal.location}</div>` : ''}
                    </div>
                </div>
                <div>
                    <h2 class="text-3xl font-light text-gray-900 mb-8 section-title">Skills</h2>
                    <div class="w-12 h-px bg-gray-400 mb-8"></div>
                    <div class="skills-container">
                        ${skillsHTML}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section id="work" class="py-32 bg-gray-50">
        <div class="max-w-4xl mx-auto px-6">
            <h2 class="text-3xl font-light text-gray-900 mb-8 text-center section-title">Selected Work</h2>
            <div class="w-12 h-px bg-gray-400 mx-auto mb-20"></div>
            <div class="projects-container">
                ${projectsHTML}
            </div>
        </div>
    </section>

    <section id="contact" class="py-32">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-3xl font-light text-gray-900 mb-8 section-title">Let's Work Together</h2>
            <div class="w-12 h-px bg-gray-400 mx-auto mb-12"></div>
            <p class="text-lg text-gray-700 mb-12 max-w-2xl mx-auto contact-description">
                I'm always interested in new opportunities and creative collaborations. 
                Let's discuss how we can bring your ideas to life.
            </p>
            <div class="flex flex-col sm:flex-row gap-8 justify-center items-center contact-links">
                ${data.personal.email ? `<a href="mailto:${data.personal.email}" class="text-gray-800 hover:text-gray-600 transition-colors border-b border-gray-300 hover:border-gray-600">${data.personal.email}</a>` : ''}
            </div>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `body { font-family: 'Inter', sans-serif; }
.font-light { font-weight: 300; }

.hero-title, .hero-subtitle, .hero-line, .hero-description { opacity: 0; transform: translateY(30px); }
.section-title, .skill-item, .project-item { opacity: 0; transform: translateY(30px); }
.skill-line { width: 0%; transition: width 1.5s ease-out; }

@media (max-width: 768px) {
    .hero-title { font-size: 1.75rem; }
    .w-40 { width: 10rem; height: 10rem; }
}`;

  const js = `gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline({ delay: 0.5 });
    tl.from('.hero-title', { opacity: 0, y: 40, duration: 1.2, ease: 'power2.out' })
      .from('.hero-subtitle', { opacity: 0, y: 30, duration: 1, ease: 'power2.out' }, '-=0.8')
      .from('.hero-line', { opacity: 0, scaleX: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out',
              scrollTrigger: { trigger: title, start: 'top 85%' }
            }
        );
    });

    gsap.fromTo('.skill-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: '.skills-container', start: 'top 80%' }
        }
    );

    gsap.utils.toArray('.skill-line').forEach(line => {
        gsap.to(line, {
            width: line.dataset.skill + '%',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: line, start: 'top 80%' }
        });
    });

    gsap.fromTo('.project-item',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', stagger: 0.3,
          scrollTrigger: { trigger: '.projects-container', start: 'top 80%' }
        }
    );

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});`;

  return { html, css, js };
}

// Template 4: Dark Neon Theme
function generateDarkNeonTemplate() {
  const data = portfolioData;

  const skillsHTML = data.skills.map(skill => `
    <div class="neon-card bg-gray-800 border border-green-400/30 rounded-lg p-4 hover:border-green-400 transition-all duration-300 skill-item">
        <div class="flex justify-between items-center mb-3">
            <span class="text-green-400 font-semibold">${skill.skill}</span>
            <span class="text-gray-400 text-sm">${skill.level}</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-green-400 to-green-300 h-2 rounded-full skill-glow" data-skill="${getSkillPercentage(skill.level)}" style="width: 0%; box-shadow: 0 0 10px #10b981;"></div>
        </div>
    </div>
  `).join('');

  const projectsHTML = data.projects.map(project => `
    <div class="neon-card bg-gray-800 border border-green-400/20 rounded-xl overflow-hidden hover:border-green-400/60 hover:shadow-lg hover:shadow-green-400/20 transition-all duration-300 group project-card">
        ${project.image ? `
            <div class="h-48 overflow-hidden">
                <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
        ` : `
            <div class="h-48 bg-gradient-to-br from-green-400/20 to-teal-500/20 flex items-center justify-center">
                <div class="text-green-400 text-4xl font-bold">${project.title.charAt(0)}</div>
            </div>
        `}
        <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">${project.title}</h3>
            <p class="text-gray-300 mb-4 leading-relaxed">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-6">
                ${project.technologies.split(',').map(tech => `
                    <span class="px-3 py-1 bg-green-400/10 text-green-400 text-xs rounded-full border border-green-400/30">${tech.trim()}</span>
                `).join('')}
            </div>
            <div class="flex gap-4">
                ${project.github ? `<a href="${project.github}" target="_blank" class="text-green-400 hover:text-green-300 transition-colors glow-text">GitHub →</a>` : ''}
                ${project.demo ? `<a href="${project.demo}" target="_blank" class="text-teal-400 hover:text-teal-300 transition-colors glow-text">Live Demo →</a>` : ''}
            </div>
        </div>
    </div>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Dark Neon</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-900 text-white min-h-screen overflow-x-hidden" style="background: radial-gradient(circle at 20% 80%, #10b981 0%, transparent 50%), radial-gradient(circle at 80% 20%, #059669 0%, transparent 50%), #111827;">
    <nav class="fixed top-0 w-full bg-gray-900/90 backdrop-blur-md border-b border-green-400/20 z-50">
        <div class="max-w-6xl mx-auto px-6 py-4">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold text-green-400 glow-text">${data.personal.fullName || "NEON.DEV"}</h1>
                <div class="hidden md:flex space-x-8">
                    <a href="#about" class="text-gray-300 hover:text-green-400 hover:glow-text transition-all duration-300">ABOUT</a>
                    <a href="#skills" class="text-gray-300 hover:text-green-400 hover:glow-text transition-all duration-300">SKILLS</a>
                    <a href="#projects" class="text-gray-300 hover:text-green-400 hover:glow-text transition-all duration-300">PROJECTS</a>
                    <a href="#contact" class="text-gray-300 hover:text-green-400 hover:glow-text transition-all duration-300">CONTACT</a>
                </div>
            </div>
        </div>
    </nav>

    <section id="hero" class="min-h-screen flex items-center justify-center relative">
        <div class="text-center z-10">
            <div class="hero-glitch mb-8">
                <h1 class="text-6xl md:text-8xl font-black text-white mb-4 hero-name">
                    ${data.personal.fullName || "CYBER DEV"}
                </h1>
                <div class="w-32 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto neon-glow hero-line"></div>
            </div>
            <p class="text-xl md:text-2xl text-green-400 font-bold mb-8 hero-title neon-flicker">
                ${data.personal.title || "FULL STACK DEVELOPER"}
            </p>
            <p class="text-lg text-gray-300 max-w-3xl mx-auto mb-12 hero-description">
                ${data.personal.about || "Building neon interfaces and hi-performance applications with cutting-edge technology."}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
                <a href="#projects" class="bg-gradient-to-r from-green-400 to-teal-400 text-black px-8 py-4 rounded-lg font-bold hover:from-green-300 hover:to-teal-300 transform hover:scale-105 transition-all duration-300 neon-glow">
                    VIEW PROJECTS
                </a>
                <a href="#contact" class="border-2 border-green-400 text-green-400 px-8 py-4 rounded-lg font-bold hover:bg-green-400 hover:text-black transition-all duration-300">
                    CONTACT
                </a>
            </div>
        </div>
    </section>

    <section id="skills" class="py-20 relative">
        <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-4xl font-bold text-center mb-16 text-green-400 glow-text">TECHNICAL SKILLS</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 skills-grid">
                ${skillsHTML}
            </div>
        </div>
    </section>

    <section id="projects" class="py-20 relative">
        <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-4xl font-bold text-center mb-16 text-green-400 glow-text">FEATURED PROJECTS</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 projects-grid">
                ${projectsHTML}
            </div>
        </div>
    </section>

    <section id="contact" class="py-20 relative">
        <div class="max-w-4xl mx-auto px-6 text-center">
            <h2 class="text-4xl font-bold mb-8 text-green-400 glow-text">LET'S CONNECT</h2>
            <p class="text-xl text-gray-300 mb-12">Ready to build the future together? Get in touch.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 contact-info">
                ${data.personal.email ? `
                    <a href="mailto:${data.personal.email}" class="bg-gray-800 border border-green-400/30 p-6 rounded-xl hover:border-green-400 hover:shadow-lg hover:shadow-green-400/20 transform hover:scale-105 transition-all duration-300">
                        <div class="text-3xl mb-4 text-green-400">📧</div>
                        <div class="font-semibold text-white">EMAIL</div>
                        <div class="text-gray-300">${data.personal.email}</div>
                    </a>
                ` : ''}
            </div>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `.glow-text { text-shadow: 0 0 10px currentColor; }
.neon-glow { box-shadow: 0 0 20px #10b981, 0 0 40px #10b981, 0 0 80px #10b981; }
.neon-border { border: 2px solid #10b981; box-shadow: 0 0 20px #10b981; }
.text-glow { text-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 40px #10b981; }

@keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px #10b981; } 50% { box-shadow: 0 0 30px #10b981, 0 0 50px #10b981; } }
.pulse-glow { animation: pulse-glow 2s infinite; }

@keyframes neon-flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
.neon-flicker { animation: neon-flicker 1.5s infinite; }

.hero-name, .hero-title, .hero-description, .hero-buttons, .skill-item, .project-card { opacity: 0; transform: translateY(30px); }
.skill-glow { width: 0%; transition: width 2s ease-out; }

@media (max-width: 768px) {
    .hero-name { font-size: 2rem !important; }
    .hero-title { font-size: 1.5rem !important; }
}`;

  const js = `gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    const tl = gsap.timeline();
    tl.from('.hero-name', { opacity: 0, scale: 0.8, duration: 1.5, ease: 'power3.out' })
      .from('.hero-line', { opacity: 0, scaleX: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .from('.hero-title', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.2');

    gsap.fromTo('.skill-item', 
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.1,
          scrollTrigger: { trigger: '.skills-grid', start: 'top 80%' }
        }
    );

    gsap.utils.toArray('.skill-glow').forEach(bar => {
        gsap.to(bar, {
            width: bar.dataset.skill + '%',
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 80%' }
        });
    });

    gsap.fromTo('.project-card',
        { opacity: 0, y: 100, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.8, ease: 'power2.out', stagger: 0.2,
          scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' }
        }
    );

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});`;

  return { html, css, js };
}

// Template 5: Glassmorphism
function generateGlassmorphismTemplate() {
  const data = portfolioData;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Glassmorphism</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="min-h-screen text-white" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <section class="min-h-screen flex items-center justify-center">
        <div class="glass rounded-3xl p-12 text-center max-w-4xl mx-6">
            <h1 class="text-5xl md:text-7xl font-bold mb-8 hero-title">${data.personal.fullName || "Glass Portfolio"}</h1>
            <p class="text-xl mb-8">${data.personal.title || "Creative Developer"}</p>
            <p class="text-lg opacity-90 max-w-2xl mx-auto">${data.personal.about || "Beautiful glassmorphism design with modern aesthetics."}</p>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.glass { background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
.hero-title { opacity: 0; transform: translateY(50px); }`;

  const js = `gsap.registerPlugin(ScrollTrigger);
gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1.5, ease: 'power3.out' });`;

  return { html, css, js };
}

// Template 6: Cyberpunk
function generateCyberpunkTemplate() {
  const data = portfolioData;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Cyberpunk</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-900 text-cyan-400 min-h-screen font-mono">
    <section class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl md:text-8xl font-bold mb-8 glitch hero-glitch" data-text="${data.personal.fullName || "CYBER.EXE"}">${data.personal.fullName || "CYBER.EXE"}</h1>
            <p class="text-xl mb-8 text-green-400">${data.personal.title || "> HACKING_THE_MATRIX.EXE"}</p>
            <div class="border border-cyan-400 p-4 max-w-2xl mx-auto">
                <p class="text-sm">${data.personal.about || "> Connecting to neural network... \\n> Initializing cyberpunk portfolio... \\n> Welcome to the future."}</p>
            </div>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `.glitch { position: relative; }
.glitch::before { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                 background: #0f172a; color: #06b6d4; z-index: -1; animation: glitch1 0.3s infinite; }
@keyframes glitch1 { 0%, 100% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 
                    40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 
                    80% { transform: translate(2px, -2px); } }
.hero-glitch { opacity: 0; transform: scale(0.8); }`;

  const js = `gsap.registerPlugin(ScrollTrigger);

gsap.from('.hero-glitch', { 
    opacity: 0, 
    scale: 0.8, 
    duration: 2, 
    ease: 'power3.out',
    onComplete: () => {
        gsap.to('.hero-glitch', {
            x: () => Math.random() * 4 - 2,
            duration: 0.1,
            repeat: -1,
            yoyo: true
        });
    }
});`;

  return { html, css, js };
}

// Template 7: Gradient Paradise
function generateGradientTemplate() {
  const data = portfolioData;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Gradient Paradise</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="gradient-bg min-h-screen text-white">
    <section class="min-h-screen flex items-center justify-center">
        <div class="text-center">
            <h1 class="text-6xl md:text-8xl font-bold mb-8 text-gradient hero-gradient">${data.personal.fullName || "Gradient Magic"}</h1>
            <p class="text-xl mb-8 bg-white/20 backdrop-blur-md rounded-full px-8 py-4 inline-block">
                ${data.personal.title || "Designer & Developer"}
            </p>
            <p class="text-lg max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6">
                ${data.personal.about || "Creating beautiful gradients and smooth animations that bring websites to life."}
            </p>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `.gradient-bg { background: linear-gradient(45deg, #fa709a 0%, #fee140 100%); 
              background-size: 200% 200%; animation: gradientShift 5s ease infinite; }
@keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.text-gradient { background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4); 
                -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 300% 300%; 
                animation: gradientShift 3s ease infinite; }
.hero-gradient { opacity: 0; transform: scale(0.5) rotate(-15deg); }`;

  const js = `gsap.registerPlugin(ScrollTrigger);

gsap.from('.hero-gradient', { 
    opacity: 0, 
    scale: 0.5, 
    rotation: -15,
    duration: 2, 
    ease: 'back.out(1.7)' 
});`;

  return { html, css, js };
}

// Template 8: Particle Nexus
function generateParticleTemplate() {
  const data = portfolioData;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.personal.fullName || "Portfolio"} - Particle Nexus</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-gray-900 text-white min-h-screen overflow-x-hidden" style="background: #0f0f23;">
    <canvas id="particles" class="fixed inset-0 z-0"></canvas>
    
    <section class="min-h-screen flex items-center justify-center relative z-10">
        <div class="text-center">
            <h1 class="text-6xl md:text-8xl font-bold mb-8 hero-particle" style="color: #6366f1;">${data.personal.fullName || "Particle Master"}</h1>
            <p class="text-xl mb-8 text-indigo-300">${data.personal.title || "Interactive Developer"}</p>
            <p class="text-lg max-w-2xl mx-auto text-gray-300">
                ${data.personal.about || "Crafting interactive experiences with particle systems and smooth animations."}
            </p>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>`;

  const css = `#particles { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: transparent; }
.hero-particle { opacity: 0; transform: translateY(100px); }
html { scroll-behavior: smooth; }`;

  const js = `gsap.registerPlugin(ScrollTrigger);

// Particle system
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.radius = Math.random() * 2 + 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Draw connections
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(other => {
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = \`rgba(99, 102, 241, \${0.3 * (1 - distance / 150)})\`;
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animate);
}

animate();

// Hero animation
gsap.from('.hero-particle', { 
    opacity: 0, 
    y: 100, 
    duration: 2, 
    ease: 'power3.out' 
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});`;

  return { html, css, js };
}

// Toast notification system
function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const messageEl = document.getElementById("toast-message");

  if (toast && messageEl) {
    messageEl.textContent = message;

    toast.className = toast.className.replace(/bg-\w+-\d+/g, "");

    if (type === "error") {
      toast.classList.add("bg-red-600");
    } else if (type === "info") {
      toast.classList.add("bg-blue-600");
    } else {
      toast.classList.add("bg-green-600");
    }

    gsap.to(toast, {
      x: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      onStart: () => {
        toast.classList.add("show");
      },
    });

    setTimeout(() => {
      gsap.to(toast, {
        x: "100%",
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          toast.classList.remove("show");
        },
      });
    }, 3000);
  }

  console.log(`${type.toUpperCase()}: ${message}`);
}

// Make functions globally available for onclick handlers
window.nextStep = nextStep;
window.previousStep = previousStep;
window.addSkill = addSkill;
window.addEducation = addEducation;
window.addProject = addProject;
window.removeSkill = removeSkill;
window.removeEducation = removeEducation;
window.removeProject = removeProject;
window.selectTemplate = selectTemplate;
window.showCodeTab = showCodeTab;
window.copyCode = copyCode;
window.previewPortfolio = previewPortfolio;
window.downloadPortfolio = downloadPortfolio;
window.startOver = startOver;

console.log("🎉 Portfolio Generator fully loaded and production ready!");
