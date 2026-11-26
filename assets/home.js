// Map page: the trail, the field notes, the patch board, and the certificate.
(function () {
  "use strict";

  var Quest = window.Quest;

  function $$(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  }

  function nextQuest() {
    return Quest.quests.filter(function (q) { return !Quest.isDone(q.id); })[0];
  }

  function render(detail) {
    var justDone = detail && detail.completed;
    var next = nextQuest();

    // Map stops and field notes.
    $$("[data-quest]").forEach(function (node) {
      var id = node.getAttribute("data-quest");
      node.classList.toggle("is-done", Quest.isDone(id));
      node.classList.toggle("is-current", Boolean(next) && next.id === id);
      if (justDone === id) { Quest.restartAnimation(node, "just-cleared"); }
      var state = node.querySelector("[data-node-state]");
      if (state) { state.textContent = Quest.isDone(id) ? ", completed" : ""; }
    });

    // The trail leading away from a finished quest is drawn solid.
    $$("[data-seg]").forEach(function (path) {
      path.classList.toggle("walked", Quest.isDone(path.getAttribute("data-seg")));
    });

    // Quest Bot walks to the next open stop (or rests at the last one).
    var token = document.getElementById("token");
    var stop = document.querySelector(".node[data-quest='" + (next ? next.id : "finale") + "']");
    token.style.setProperty("--x", stop.style.getPropertyValue("--x"));
    token.style.setProperty("--y", stop.style.getPropertyValue("--y"));

    $$("[data-complete]").forEach(function (button) {
      var done = Quest.isDone(button.getAttribute("data-complete"));
      button.setAttribute("aria-disabled", String(done));
      button.querySelector("[data-label]").textContent = done ? "Completed" : "Complete";
    });

    $$("[data-badge]").forEach(function (node) {
      var id = node.getAttribute("data-badge");
      var unlocked = id === "secret" ? Quest.hasSecret() : Quest.isDone(id);
      node.classList.toggle("is-unlocked", unlocked);
      node.querySelector("[data-badge-state]").textContent = unlocked ? "Unlocked" : "Locked";
      var secretName = node.querySelector("[data-secret-name]");
      if (secretName) { secretName.textContent = unlocked ? "Code Keeper" : "Secret badge"; }
      if (justDone === id || (detail && detail.secret && id === "secret")) {
        Quest.restartAnimation(node, "just-unlocked");
      }
    });

    var finished = !next;
    document.getElementById("run-kicker").textContent = finished ? "Expedition complete" : "Your expedition so far";
    document.getElementById("run-message").textContent = finished
      ? "Your team finished every quest. Continue to the starter template and make a site of your own."
      : "Progress is saved in this browser. Continue to jump to your next open quest.";
  }

  $$("[data-complete]").forEach(function (button) {
    button.addEventListener("click", function () {
      if (!Quest.complete(button.getAttribute("data-complete"), button)) { return; }
      if (!nextQuest()) {
        var heading = document.getElementById("thanks-title");
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "center" });
        Quest.confetti(heading, 60);
      }
    });
  });

  document.getElementById("continue-button").addEventListener("click", function () {
    var next = nextQuest();
    if (!next) {
      window.location.href = "template/";
      return;
    }
    var button = document.querySelector("[data-complete='" + next.id + "']");
    var card = button.closest(".note-card");
    card.classList.add("in");
    button.focus({ preventScroll: true });
    card.scrollIntoView({ block: "center" });
  });

  document.addEventListener("quest:change", function (event) { render(event.detail); });
  render();
}());
