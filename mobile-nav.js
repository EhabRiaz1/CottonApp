document.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector("nav");
  if (!nav) {
    return;
  }

  var toggle = nav.querySelector(".nav-toggle");
  var panel = nav.querySelector(".nav-panel");
  if (!toggle || !panel) {
    return;
  }

  if (!panel.id) {
    panel.id = "site-nav-panel";
  }

  function setMenu(open) {
    nav.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-menu-open", open && window.innerWidth <= 768);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.setAttribute("aria-controls", panel.id);
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("nav-open"));
  });

  nav.querySelectorAll(".nav-links a, .nav-cta").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("click", function (event) {
    if (window.innerWidth > 768 || !nav.classList.contains("nav-open")) {
      return;
    }

    if (!nav.contains(event.target)) {
      setMenu(false);
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      setMenu(false);
    }
  });
});
