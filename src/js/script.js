const header = document.querySelector(".site-header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");
const changingRole = document.getElementById("changingRole");
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

// Sticky header appearance
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}
window.addEventListener("scroll", updateHeader);
updateHeader();

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Light / dark theme
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") document.body.classList.add("light-theme");
themeToggle.textContent = document.body.classList.contains("light-theme") ? "☾" : "☼";

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☾" : "☼";
});

// Rotating hero role
const roles = ["digital products", "AI-powered solutions", "better user experiences"];
let roleIndex = 0;
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    changingRole.style.opacity = "0";
    setTimeout(() => {
      changingRole.textContent = roles[roleIndex];
      changingRole.style.opacity = "1";
    }, 220);
  }, 2600);
}

// Reveal sections as they enter the viewport
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Highlight the navigation link for the current section
const sections = document.querySelectorAll("main section[id]");
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: "-35% 0px -55% 0px" });
sections.forEach(section => navObserver.observe(section));

// Contact form: validate, then open the visitor's email application.
// Replace the email below with your real address before publishing.
form.addEventListener("submit", event => {
  event.preventDefault();
  if (!form.reportValidity()) return;

  const recipient = "YOUR_EMAIL@example.com"; // Replace with your actual email
  if (recipient === "YOUR_EMAIL@example.com") {
    formMessage.textContent = "Please add your real email address in js/script.js before using this form.";
    formMessage.style.color = "#e7a66b";
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(data.get("subject"));
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
  );
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
  formMessage.textContent = "Your email application should open with your message prepared.";
});

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Avoid dead placeholder project links: explain that URLs need to be added.
document.querySelectorAll(".placeholder-link").forEach(link => {
  link.addEventListener("click", event => {
    if (link.getAttribute("href") === "#") {
      event.preventDefault();
      alert("Add your actual project URL to this link in index.html.");
    }
  });
});
