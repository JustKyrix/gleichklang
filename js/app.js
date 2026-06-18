/* =====================================================================
   gleichklang — Interaktionen (jQuery)
   Abhängig von: jQuery 3.7, Bootstrap 5.3 Bundle (für Collapse, Carousel,
   Accordion, ScrollSpy)
   ===================================================================== */
(function ($) {
  "use strict";

  $(function () {

    var $window = $(window);
    var $nav = $(".gk-nav");

    // -----------------------------------------------------------------
    // 1) Navbar: transparent -> solide beim Scrollen
    // -----------------------------------------------------------------
    function toggleNav() {
      $nav.toggleClass("gk-nav--solid", $window.scrollTop() > 40);
    }
    toggleNav();
    $window.on("scroll", toggleNav);

    // -----------------------------------------------------------------
    // 2) Sanftes Scrollen zu Anker-Links + mobiles Menü schließen
    // -----------------------------------------------------------------
    $('a[href^="#"]:not([href="#"])').on("click", function (e) {
      var target = $(this.getAttribute("href"));
      if (target.length) {
        e.preventDefault();
        var top = target.offset().top - 72; // Navbar-Höhe
        $("html, body").animate({ scrollTop: top }, 600, "swing");

        // offenes Collapse-Menü (mobil) schließen
        var $collapse = $(".navbar-collapse.show");
        if ($collapse.length) {
          var bsc = bootstrap.Collapse.getInstance($collapse[0]);
          if (bsc) { bsc.hide(); }
        }
      }
    });

    // -----------------------------------------------------------------
    // 3) Scroll-Reveal über IntersectionObserver
    // -----------------------------------------------------------------
    var $reveals = $(".reveal");
    if ("IntersectionObserver" in window && $reveals.length) {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
      $reveals.each(function () { io.observe(this); });
    } else {
      $reveals.addClass("is-visible");
    }

    // -----------------------------------------------------------------
    // 4) Kennzahlen hochzählen, sobald sie sichtbar werden
    //    (Tausender mit schmalem Leerzeichen — DIN 5008 / Mikrotypografie)
    // -----------------------------------------------------------------
    function groupThousands(n) {
      // schmales geschütztes Leerzeichen U+202F als Tausendertrenner
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u202F");
    }

    function runCounter($el) {
      var target = parseInt($el.data("count"), 10);
      var suffix = $el.data("suffix") || "";
      var prefix = $el.data("prefix") || "";
      var dur = 1600;
      var start = null;

      function frame(ts) {
        if (!start) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        var val = Math.round(eased * target);
        $el.text(prefix + groupThousands(val) + suffix);
        if (p < 1) { requestAnimationFrame(frame); }
      }
      requestAnimationFrame(frame);
    }

    var $counters = $("[data-count]");
    if ("IntersectionObserver" in window && $counters.length) {
      var io2 = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter($(entry.target));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      $counters.each(function () { io2.observe(this); });
    } else {
      $counters.each(function () { $(this).text($(this).data("count")); });
    }

    // -----------------------------------------------------------------
    // 5) Aktiver Navi-Link via Bootstrap ScrollSpy
    // -----------------------------------------------------------------
    if (window.bootstrap && bootstrap.ScrollSpy) {
      new bootstrap.ScrollSpy(document.body, {
        target: "#mainNav",
        rootMargin: "0px 0px -55%",
        smoothScroll: false
      });
    }

    // -----------------------------------------------------------------
    // 6) Zurück-nach-oben-Button
    // -----------------------------------------------------------------
    var $top = $("#backToTop");
    $window.on("scroll", function () {
      $top.toggleClass("is-visible", $window.scrollTop() > 600);
    });
    $top.on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 600, "swing");
    });

    // -----------------------------------------------------------------
    // 7) Kontaktformular (Mockup) — Bootstrap-Validierung + Bestätigung
    // -----------------------------------------------------------------
    var $form = $("#contactForm");
    $form.on("submit", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var form = this;
      if (!form.checkValidity()) {
        $(form).addClass("was-validated");
        return;
      }
      $(form).addClass("was-validated");
      var $btn = $form.find('button[type="submit"]');
      $btn.prop("disabled", true)
          .html('<span class="spinner-border spinner-border-sm me-2"></span>Wird gesendet …');

      // Mockup: kein echter Versand — nach kurzer Verzögerung Erfolg zeigen
      window.setTimeout(function () {
        $form.slideUp(250, function () {
          $("#formSuccess").removeClass("d-none").hide().slideDown(300);
        });
      }, 1100);
    });

  });
})(jQuery);
