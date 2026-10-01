(function () {
  var header = document.querySelector(".header");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  var filters = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll(".car");
  var forms = document.querySelectorAll(".book-form");

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

  function applyFilter(value) {
    filters.forEach(function (item) {
      var active = item.getAttribute("data-filter") === value;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", active ? "true" : "false");
    });
    cards.forEach(function (card) {
      var show = value === "all" || card.getAttribute("data-class") === value;
      card.hidden = !show;
      if (show) card.classList.add("is-in");
    });
  }

  document.querySelectorAll("[data-car]").forEach(function (button) {
    button.addEventListener("click", function () {
      var value = button.getAttribute("data-car");
      forms.forEach(function (form) {
        var select = form.querySelector("[name='car']");
        if (!select) return;
        var hasOption = Array.prototype.some.call(select.options, function (option) {
          return option.value === value;
        });
        if (hasOption) select.value = value;
      });
      cards.forEach(function (card) {
        card.classList.toggle("is-picked", card.contains(button));
      });
      var book = document.querySelector("#book");
      if (book && button.tagName !== "A") {
        book.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      applyFilter(button.getAttribute("data-filter"));
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

  var today = new Date();
  var month = String(today.getMonth() + 1).padStart(2, "0");
  var day = String(today.getDate()).padStart(2, "0");
  var minDate = today.getFullYear() + "-" + month + "-" + day;
  document.querySelectorAll("input[type='date']").forEach(function (dateInput) {
    dateInput.min = minDate;
  });

  function digits(value) {
    return (value || "").replace(/\D/g, "");
  }

  function setInvalid(field, invalid) {
    if (!field) return;
    field.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  var bodyFilters = { "Купе": "coupe", "Лифтбек": "liftback", "Кроссовер": "crossover", "Гран купе": "grand" };

  forms.forEach(function (form) {
    var select = form.querySelector("[name='car']");
    if (select && form.closest(".finder")) {
      select.addEventListener("change", function () {
        applyFilter(bodyFilters[select.value] || "all");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var name = String(data.get("name") || "").trim();
      var phone = String(data.get("phone") || "").trim();
      var nameField = form.querySelector("[name='name']");
      var phoneField = form.querySelector("[name='phone']");
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

      var success = form.querySelector(".form-success");
      if (success) success.hidden = false;
      form.classList.add("is-sent");
    });
  });
})();
