(function () {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var form = document.querySelector("#book-form");
  var carSelect = document.querySelector("#car");
  var success = document.querySelector("#form-success");
  var filters = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll(".car");

  var ticking = false;
  function onScroll() {
    if (!header || ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
      ticking = false;
    });
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  document.querySelectorAll("[data-car]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!carSelect) return;
      carSelect.value = button.getAttribute("data-car");
      cards.forEach(function (card) {
        card.classList.toggle("is-picked", card.contains(button));
      });
      var book = document.querySelector("#book");
      if (book && button.tagName !== "A") {
        book.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      var nameField = document.querySelector("#name");
      if (nameField) {
        window.setTimeout(function () {
          nameField.focus({ preventScroll: true });
        }, 450);
      }
    });
  });

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-filter");
      filters.forEach(function (item) {
        var active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });
      cards.forEach(function (card) {
        var show = value === "all" || card.getAttribute("data-class") === value;
        card.hidden = !show;
        if (show) card.classList.add("is-in");
      });
    });
  });

  document.querySelectorAll(".faq-item").forEach(function (item) {
    var trigger = item.querySelector(".faq-q");
    if (!trigger) return;
    trigger.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  var revealNodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealNodes.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    revealNodes.forEach(function (node) {
      observer.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add("is-in");
    });
  }

  var video = document.querySelector(".hero-video");
  if (video) {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
    } else if ("IntersectionObserver" in window) {
      var videoObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var playAttempt = video.play();
              if (playAttempt && playAttempt.catch) playAttempt.catch(function () {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.15 }
      );
      var hero = document.querySelector(".hero");
      if (hero) videoObserver.observe(hero);
    }
  }

  var dateInput = document.querySelector("#date");
  if (dateInput) {
    var today = new Date();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");
    dateInput.min = today.getFullYear() + "-" + month + "-" + day;
  }

  function digits(value) {
    return (value || "").replace(/\D/g, "");
  }

  function setInvalid(field, invalid) {
    if (!field) return;
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var nameField = form.querySelector("#name");
      var phoneField = form.querySelector("#phone");
      var valid = true;

      if (name.length < 2) {
        setInvalid(nameField, true);
        valid = false;
      } else {
        setInvalid(nameField, false);
      }

      if (digits(phone).length < 9) {
        setInvalid(phoneField, true);
        valid = false;
      } else {
        setInvalid(phoneField, false);
      }

      if (!valid) {
        var firstInvalid = form.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (success) {
        success.hidden = false;
      }
      form.classList.add("is-sent");
    });
  }
})();
