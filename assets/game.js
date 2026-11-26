// Quest to Publish: the game layer shared by the map and the bug hunt.
// Progress stays in this browser. Nothing is sent anywhere.
(function () {
  "use strict";

  var root = document.documentElement;
  var PROGRESS_KEY = "qtp-progress";
  var PREFS_KEY = "qtp-prefs";
  var BOOT_KEY = "qtp-booted";
  var SVG_NS = "http://www.w3.org/2000/svg";

  var QUESTS = [
    { id: "q0", name: "Briefing", badge: "Trail Crew", coins: 20 },
    { id: "q1", name: "Base Camp", badge: "Camp Builders", coins: 20 },
    { id: "q2", name: "Build", badge: "Story Builders", coins: 20 },
    { id: "q3", name: "Go Live", badge: "Beacon Lighters", coins: 20 },
    { id: "q4", name: "AI Bug Hunt", badge: "Bug Spotters", coins: 20 },
    { id: "q5", name: "Access for All", badge: "Open Door", coins: 20 },
    { id: "finale", name: "Showcase and Debrief", badge: null, coins: 30 }
  ];
  var BUG_COINS = 5;
  var SECRET_COINS = 25;
  var BADGE_TOTAL = QUESTS.filter(function (q) { return q.badge; }).length;

  /* ---------- storage ---------- */

  function read(key) {
    try {
      return JSON.parse(window.localStorage.getItem(key));
    } catch (error) {
      return null;
    }
  }

  function write(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Storage is blocked or full: progress lasts until the page closes.
    }
  }

  function freshProgress() {
    return { quests: [], bugs: {}, secret: false };
  }

  function loadProgress() {
    var saved = read(PROGRESS_KEY);
    var progress = freshProgress();
    if (saved && Array.isArray(saved.quests)) {
      progress.quests = saved.quests.filter(function (id) {
        return QUESTS.some(function (q) { return q.id === id; });
      });
      progress.bugs = saved.bugs && typeof saved.bugs === "object" ? saved.bugs : {};
      progress.secret = saved.secret === true;
    }
    return progress;
  }

  var progress = loadProgress();
  var prefs = read(PREFS_KEY) || {};

  function save() { write(PROGRESS_KEY, progress); }

  /* ---------- derived numbers ---------- */

  function isDone(id) { return progress.quests.indexOf(id) !== -1; }

  function stats() {
    var coins = QUESTS.reduce(function (sum, q) { return sum + (isDone(q.id) ? q.coins : 0); }, 0);
    coins += Object.keys(progress.bugs).length * BUG_COINS;
    coins += progress.secret ? SECRET_COINS : 0;
    return {
      level: 1 + progress.quests.length,
      coins: coins,
      quests: progress.quests.length,
      questTotal: QUESTS.length,
      badges: QUESTS.filter(function (q) { return q.badge && isDone(q.id); }).length,
      badgeTotal: BADGE_TOTAL,
      secret: progress.secret
    };
  }

  /* ---------- small helpers ---------- */

  function motionOn() { return root.getAttribute("data-motion") === "full"; }

  function $(selector, scope) { return (scope || document).querySelector(selector); }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function icon(name, className) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", className || "ic");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var use = document.createElementNS(SVG_NS, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function restartAnimation(node, className) {
    if (!node) { return; }
    node.classList.remove(className);
    void node.getBoundingClientRect();
    node.classList.add(className);
  }

  /* ---------- screen reader announcements ---------- */

  var announceTimer;
  function announce(message) {
    var region = $("#announcer");
    if (!region) { return; }
    // Clearing first lets the same message be read twice in a row.
    region.textContent = "";
    window.clearTimeout(announceTimer);
    announceTimer = window.setTimeout(function () { region.textContent = message; }, 60);
  }

  /* ---------- effects ---------- */

  var toastTimer;
  function toast(title, detail, iconName) {
    var area = $("#toast-area");
    if (!area) { return; }
    area.textContent = "";
    var box = document.createElement("div");
    box.className = "toast";
    box.appendChild(icon(iconName || "star"));
    var text = document.createElement("div");
    var strong = document.createElement("strong");
    strong.textContent = title;
    text.appendChild(strong);
    text.appendChild(document.createTextNode(detail || ""));
    box.appendChild(text);
    area.appendChild(box);
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { area.textContent = ""; }, 4500);
  }

  function center(node) {
    if (!node) { return { x: window.innerWidth / 2, y: window.innerHeight / 3 }; }
    var box = node.getBoundingClientRect();
    return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
  }

  function coinPop(source, amount) {
    if (!motionOn()) { return; }
    var point = center(source);
    var pop = document.createElement("div");
    pop.className = "coin-pop";
    pop.setAttribute("aria-hidden", "true");
    pop.appendChild(icon("coin"));
    pop.appendChild(document.createTextNode("+" + amount));
    pop.style.left = Math.max(8, Math.min(point.x - 30, window.innerWidth - 90)) + "px";
    pop.style.top = (point.y - 40) + "px";
    document.body.appendChild(pop);
    window.setTimeout(function () { pop.remove(); }, 1200);
  }

  // One short burst that fades out. It never flashes.
  function confetti(source, count) {
    if (!motionOn()) { return; }
    var point = center(source);
    var colors = ["#ff8f66", "#ffd166", "#cdbcff", "#82e3b9", "#93d0f8", "#ffa8ba"];
    for (var n = 0; n < (count || 28); n++) {
      var piece = document.createElement("i");
      piece.className = "confetti";
      piece.setAttribute("aria-hidden", "true");
      piece.style.left = point.x + "px";
      piece.style.top = point.y + "px";
      piece.style.background = colors[n % colors.length];
      piece.style.setProperty("--x", (Math.random() * 260 - 130) + "px");
      piece.style.setProperty("--y", (Math.random() * 220 - 150) + "px");
      piece.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      document.body.appendChild(piece);
      window.setTimeout(function (node) { node.remove(); }, 1300, piece);
    }
  }

  /* ---------- sound: off unless the player turns it on ---------- */

  var audio;
  var TUNES = {
    coin: [[880, 0], [1320, 0.08]],
    level: [[523, 0], [659, 0.09], [784, 0.18], [1047, 0.27]],
    zap: [[220, 0], [660, 0.05]],
    miss: [[196, 0]]
  };

  function sound(name) {
    if (!prefs.sound) { return; }
    try {
      var Context = window.AudioContext || window.webkitAudioContext;
      audio = audio || new Context();
      if (audio.state === "suspended") { audio.resume(); }
      TUNES[name].forEach(function (note) {
        var tone = audio.createOscillator();
        var gain = audio.createGain();
        var start = audio.currentTime + note[1];
        tone.type = "triangle";
        tone.frequency.value = note[0];
        gain.gain.setValueAtTime(0.07, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
        tone.connect(gain).connect(audio.destination);
        tone.start(start);
        tone.stop(start + 0.18);
      });
    } catch (error) {
      // Sound is a bonus. Ignore browsers that cannot play it.
    }
  }

  /* ---------- Quest Bot speech with a typing caret ---------- */

  var typeTimer;
  function say(message) {
    var visible = $("#bot-typed");
    var spoken = $("#bot-spoken");
    if (!visible || !spoken) { return; }
    spoken.textContent = message;
    window.clearInterval(typeTimer);
    if (!motionOn()) {
      visible.textContent = message;
      return;
    }
    var length = 0;
    visible.textContent = "";
    typeTimer = window.setInterval(function () {
      length += 1;
      visible.textContent = message.slice(0, length);
      if (length >= message.length) { window.clearInterval(typeTimer); }
    }, 24);
  }

  /* ---------- HUD ---------- */

  var lastCoins = null;
  function renderHud() {
    var now = stats();
    $$("[data-stat='level']").forEach(function (node) { node.textContent = now.level; });
    $$("[data-stat='coins']").forEach(function (node) { node.textContent = now.coins; });
    $$("[data-stat='badges']").forEach(function (node) {
      node.textContent = now.badges + "/" + now.badgeTotal + (now.secret ? " +1" : "");
    });
    $$("[data-stat='quests']").forEach(function (node) {
      node.textContent = now.quests + "/" + now.questTotal;
    });
    $$("[data-xp]").forEach(function (node) {
      node.style.width = (now.quests / now.questTotal) * 100 + "%";
    });
    if (lastCoins !== null && now.coins > lastCoins) {
      restartAnimation($("#hud-coins"), "bump");
    }
    lastCoins = now.coins;
  }

  function changed(detail) {
    renderHud();
    document.dispatchEvent(new CustomEvent("quest:change", { detail: detail || {} }));
  }

  /* ---------- game actions ---------- */

  // "lead" is read to screen readers before the quest message.
  function complete(id, source, lead) {
    var quest = QUESTS.filter(function (q) { return q.id === id; })[0];
    if (!quest || isDone(id)) { return false; }
    progress.quests.push(id);
    save();
    changed({ completed: id });

    var now = stats();
    var detail = "You are level " + now.level + "." +
      (quest.badge ? " Badge unlocked: " + quest.badge + "." : "");
    coinPop(source, quest.coins);
    if (quest.badge) { confetti(source, 28); }
    sound("level");
    toast("Level up!", detail, quest.badge ? "badge" : "trophy");
    var message = (lead ? lead + " " : "") +
      "Quest complete: " + quest.name + ". " + quest.coins + " coins. Level up! " + detail;
    if (now.quests === now.questTotal) {
      message += " All quests complete.";
      say("You reached the summit. Thank you for playing, team!");
    } else {
      say(quest.badge
        ? "Nice work, team! The " + quest.badge + " badge is yours."
        : "What a show! Check which stops are still open.");
    }
    announce(message);
    return true;
  }

  // Records one zapped bug. Returns the total number found.
  function zap(bug, spot, source) {
    if (!progress.bugs[bug]) {
      progress.bugs[bug] = spot;
      save();
      coinPop(source, BUG_COINS);
      sound("zap");
      changed({ zapped: bug });
    }
    return Object.keys(progress.bugs).length;
  }

  function unlockSecret() {
    if (progress.secret) {
      toast("Cheat code accepted", "You already have the secret badge.", "key");
      announce("You already have the secret badge.");
    } else {
      progress.secret = true;
      save();
      changed({ secret: true });
      toast("Secret found!", "Badge unlocked: Code Keeper. " + SECRET_COINS + " coins.", "key");
      announce("Secret found. Badge unlocked: Code Keeper. " + SECRET_COINS + " coins.");
      say("An old cheat code! The Code Keeper badge is yours.");
    }
    confetti(null, 70);
    sound("level");
  }

  function reset() {
    progress = freshProgress();
    save();
    lastCoins = null;
    changed({ reset: true });
    announce("Progress reset. You are level 1 with 0 coins.");
    say("A fresh start. Choose a stop on the map.");
  }

  window.Quest = {
    quests: QUESTS,
    isDone: isDone,
    stats: stats,
    bugs: function () { return progress.bugs; },
    hasSecret: function () { return progress.secret; },
    complete: complete,
    zap: zap,
    reset: reset,
    announce: announce,
    toast: toast,
    confetti: confetti,
    sound: sound,
    say: say,
    icon: icon,
    motionOn: motionOn,
    restartAnimation: restartAnimation
  };

  /* ---------- reset buttons ask once before erasing ---------- */

  function setupReset(button) {
    var label = button.textContent;
    var armed = false;
    var timer;
    function disarm() {
      armed = false;
      button.textContent = label;
    }
    button.addEventListener("click", function () {
      if (!armed) {
        armed = true;
        button.textContent = "Press again to reset";
        timer = window.setTimeout(disarm, 6000);
        return;
      }
      window.clearTimeout(timer);
      disarm();
      reset();
      var note = $("#settings-note");
      if (note && button.closest("dialog")) { note.textContent = "Progress reset."; }
    });
    button.addEventListener("blur", disarm);
  }

  /* ---------- theme and accessibility settings ---------- */

  var systemMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function applyPrefs() {
    root.setAttribute("data-theme", prefs.theme === "light" ? "light" : "dark");
    root.setAttribute("data-motion", systemMotion.matches || prefs.reduce ? "reduce" : "full");
    root.setAttribute("data-text", prefs.large ? "large" : "normal");
    root.setAttribute("data-calm", prefs.calm ? "on" : "off");
    var themeButton = $("#theme-btn");
    if (themeButton) { themeButton.setAttribute("aria-pressed", String(prefs.theme === "light")); }
  }

  function setupSettings() {
    var themeButton = $("#theme-btn");
    if (themeButton) {
      themeButton.addEventListener("click", function () {
        prefs.theme = prefs.theme === "light" ? "dark" : "light";
        write(PREFS_KEY, prefs);
        applyPrefs();
      });
    }

    var dialog = $("#settings");
    var openButton = $("#settings-btn");
    if (!dialog || !openButton) { return; }

    function syncBoxes() {
      $$("input[data-pref]", dialog).forEach(function (box) {
        var name = box.getAttribute("data-pref");
        box.checked = Boolean(prefs[name]);
        if (name === "reduce" && systemMotion.matches) {
          box.checked = true;
          box.disabled = true;
          $("#reduce-note", dialog).textContent = "On because your device asks for reduced motion.";
        }
      });
    }

    openButton.addEventListener("click", function () {
      syncBoxes();
      $("#settings-note").textContent = "";
      dialog.showModal();
    });

    dialog.addEventListener("change", function (event) {
      var name = event.target.getAttribute("data-pref");
      if (!name) { return; }
      prefs[name] = event.target.checked;
      write(PREFS_KEY, prefs);
      applyPrefs();
      if (name === "sound") { sound("coin"); }
    });

    // A click on the dimmed background closes the dialog.
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) { dialog.close(); }
    });

    systemMotion.addEventListener("change", applyPrefs);
  }

  /* ---------- things drifting past the edges of the map ---------- */

  function buildSky() {
    var sky = $(".sky");
    if (!sky) { return; }
    var kinds = ["cloud", "plane", "cloud", "sparkle"];
    var spots = [[2, 22], [93, 14], [4, 62], [95, 47], [8, 88], [90, 78], [48, 94], [70, 6]];
    spots.forEach(function (spot, n) {
      var shape = icon(kinds[n % kinds.length], "ic shape");
      var size = 26 + (n * 11) % 30;
      shape.style.left = spot[0] + "%";
      shape.style.top = spot[1] + "%";
      shape.style.width = size + "px";
      shape.style.height = size + "px";
      shape.style.setProperty("--t", (4 + (n % 3)) + "s");
      shape.style.setProperty("--delay", (-(n % 5) * 0.8) + "s");
      shape.style.setProperty("--dx", ((n % 2 ? -1 : 1) * (10 + (n * 5) % 16)) + "px");
      shape.style.setProperty("--dy", (-(6 + (n * 3) % 12)) + "px");
      sky.appendChild(shape);
    });
  }

  /* ---------- cards rise in as they reach the screen ---------- */

  function setupRise() {
    var items = $$(".rise");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (item) { item.classList.add("in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -5% 0px" });
    items.forEach(function (item) { observer.observe(item); });
    // Anything reached by keyboard is shown at once.
    document.addEventListener("focusin", function (event) {
      var hidden = event.target.closest(".rise:not(.in)");
      if (hidden) { hidden.classList.add("in"); }
    });
  }

  /* ---------- boot screen, once per visitor ---------- */

  function boot(done) {
    var dialog = $("#boot");
    if (!dialog || !dialog.showModal || read(BOOT_KEY)) {
      done();
      return;
    }
    var tips = [
      "Tip: old cheat codes still work here.",
      "Tip: AI can sound sure and still be wrong.",
      "Tip: press Tab to explore without a mouse.",
      "Tip: badges belong to the whole team.",
      "Tip: good alt text is a superpower."
    ];
    var fill = $("#boot-fill");
    var percent = $("#boot-pct");
    var tip = $("#boot-tip");
    var skip = $("#boot-skip");
    var timer;

    dialog.addEventListener("close", function () {
      window.clearInterval(timer);
      write(BOOT_KEY, true);
      done();
    });
    skip.addEventListener("click", function () { dialog.close(); });
    dialog.showModal();
    skip.focus();

    if (!motionOn()) {
      // Static version: nothing moves and nothing closes on its own.
      $("#boot-status").textContent = "QUEST 0 READY";
      skip.textContent = "Start";
      return;
    }

    var duration = 4800;
    var began = Date.now();
    fill.style.transform = "scaleX(0)";
    percent.textContent = "0%";
    timer = window.setInterval(function () {
      var part = Math.min(1, (Date.now() - began) / duration);
      fill.style.transform = "scaleX(" + part + ")";
      percent.textContent = Math.round(part * 100) + "%";
      tip.textContent = tips[Math.min(2, Math.floor(part * 3))];
      if (part >= 1) { dialog.close(); }
    }, 80);
  }

  /* ---------- the old cheat code ---------- */

  function setupCheatCode() {
    var code = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft",
      "arrowright", "arrowleft", "arrowright", "b", "a"];
    var typed = [];
    document.addEventListener("keydown", function (event) {
      if (event.ctrlKey || event.metaKey || event.altKey || document.querySelector("dialog[open]")) {
        return;
      }
      typed.push(String(event.key).toLowerCase());
      typed = typed.slice(-code.length);
      if (typed.join() === code.join()) {
        typed = [];
        unlockSecret();
      }
    });
  }

  /* ---------- start ---------- */

  applyPrefs();
  buildSky();
  setupSettings();
  setupCheatCode();
  $$("[data-reset]").forEach(setupReset);
  renderHud();

  // Page scripts load after this one, so wait until they have set things up.
  document.addEventListener("DOMContentLoaded", function () {
    boot(function () {
      setupRise();
      var greeting = $("#bot-spoken");
      if (greeting) { say(greeting.textContent); }
    });
  });

  // Keep two open tabs in step.
  window.addEventListener("storage", function (event) {
    if (event.key === PROGRESS_KEY) {
      progress = loadProgress();
      changed({});
    }
  });
}());
