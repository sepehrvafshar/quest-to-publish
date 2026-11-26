// Runs before the page is drawn, so the saved theme and motion settings
// apply from the first frame. Every storage access is wrapped in try/catch.
(function () {
  "use strict";

  var root = document.documentElement;
  var prefs = {};
  try {
    prefs = JSON.parse(window.localStorage.getItem("qtp-prefs")) || {};
  } catch (error) {
    prefs = {};
  }

  var systemReduces = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("js");
  root.setAttribute("data-theme", prefs.theme === "light" ? "light" : "dark");
  root.setAttribute("data-motion", systemReduces || prefs.reduce ? "reduce" : "full");
  root.setAttribute("data-text", prefs.large ? "large" : "normal");
  root.setAttribute("data-calm", prefs.calm ? "on" : "off");
}());
