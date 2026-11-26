// AI Bug Hunt: zap targets, the tracker, and the answer key.
// Facilitators: this file contains the answers.
(function () {
  "use strict";

  var Quest = window.Quest;

  // Which spot on the practice page hides which bug. Some bugs cover two spots.
  var SPOT_BUGS = { c: "alt", h: "date", k: "heading", l: "citation", n: "link", o: "contrast", r: "citation" };

  var ANSWERS = [
    {
      bug: "date",
      title: "Wrong date",
      why: "\"From Home to Museum\" says the museum opened in 1926. The fact sheet says 1962, and Beatrix Quillfeather was still living in the house until 1958.",
      fix: "Change 1926 to 1962. Check every date an AI writes against a trusted record."
    },
    {
      bug: "citation",
      title: "Invented citation",
      why: "Reference 2 (Pemberton and Vasquez-Lindqvist, 2017) was made up. It looks convincing, but no such article or journal supports the claim.",
      fix: "Remove the reference and the claim, or replace them with a real source that you have found and read yourself."
    },
    {
      bug: "link",
      title: "Broken link",
      why: "The \"current visiting hours and tour times\" link points to a page that does not exist.",
      fix: "Point the link to a real page, or remove it. Test every link after you publish."
    },
    {
      bug: "alt",
      title: "Image without alt text",
      why: "The drawing of the house has no alt attribute, so screen reader users cannot learn what it shows. A caption such as \"Figure 1\" does not replace it.",
      fix: "Add a short description, for example: alt=\"Drawing of a two-story house with a red roof, a chimney, and a front porch\"."
    },
    {
      bug: "contrast",
      title: "Low-contrast text",
      why: "The visitor note under \"Plan Your Visit\" is pale gray on white, at about 2 to 1. Normal-size text needs at least 4.5 to 1.",
      fix: "Use a darker text color, such as #55433a, and confirm it with a contrast checker."
    },
    {
      bug: "heading",
      title: "Skipped heading level",
      why: "\"The Kitchen Notebooks\" is a level 5 heading placed directly under a level 3 heading, which breaks the page outline.",
      fix: "Change it from h5 to h4. Choose heading levels for structure, and use CSS to change their size."
    }
  ];

  var spots = Array.prototype.slice.call(document.querySelectorAll(".spot"));
  var revealButton = document.getElementById("reveal-button");
  var panel = document.getElementById("answer-panel");
  var total = ANSWERS.length;

  function bugName(bug) {
    return ANSWERS.filter(function (answer) { return answer.bug === bug; })[0].title;
  }

  function found() {
    return Object.keys(Quest.bugs()).length;
  }

  // A short label so keyboard and screen reader users know what they are aiming at.
  function describe(spot) {
    if (spot.querySelector("img")) { return "image"; }
    if (spot.id === "fact-sheet") { return "archive fact sheet"; }
    var heading = spot.querySelector("h2, h3, h4, h5");
    var words = spot.textContent.trim().split(/\s+/);
    var snippet = words.slice(0, 6).join(" ") + (words.length > 6 ? "..." : "");
    if (heading) { return "heading, " + snippet; }
    if (spot.tagName === "LI") { return "reference, " + snippet; }
    return "text, " + snippet;
  }

  spots.forEach(function (spot) {
    spot.setAttribute("data-label", describe(spot));
    var button = document.createElement("button");
    button.type = "button";
    button.className = "zap-btn";
    button.appendChild(Quest.icon("zap"));
    spot.appendChild(button);
  });

  function render() {
    var bugs = Quest.bugs();
    spots.forEach(function (spot) {
      var bug = SPOT_BUGS[spot.getAttribute("data-spot")];
      var zapped = Boolean(bug) && bugs[bug] === spot.getAttribute("data-spot");
      spot.classList.toggle("zapped", zapped);
      var tag = spot.querySelector(".zap-tag");
      if (zapped && !tag) {
        tag = document.createElement("span");
        tag.className = "zap-tag";
        tag.appendChild(Quest.icon("check"));
        tag.appendChild(document.createTextNode("Zapped: " + bugName(bug)));
        spot.appendChild(tag);
      } else if (!zapped && tag) {
        tag.remove();
      }
      spot.querySelector(".zap-btn").setAttribute("aria-label", zapped
        ? "Zapped: " + bugName(bug)
        : "Zap this " + spot.getAttribute("data-label"));
    });

    ANSWERS.forEach(function (answer) {
      var row = document.querySelector("[data-bug='" + answer.bug + "']");
      var isFound = Boolean(bugs[answer.bug]);
      row.classList.toggle("found", isFound);
      row.querySelector("[data-bug-state]").textContent = isFound ? "found" : "not found yet";
    });

    document.getElementById("bug-count").textContent = found() + "/" + total;
    document.getElementById("meter-fill").style.width = (found() / total) * 100 + "%";
  }

  function aim(spot) {
    var id = spot.getAttribute("data-spot");
    var bug = SPOT_BUGS[id];

    if (!bug) {
      Quest.restartAnimation(spot, "miss");
      Quest.sound("miss");
      Quest.toast("No bug there", "That part checks out. Keep hunting.", "zap");
      Quest.announce("No bug there. Keep hunting.");
      return;
    }

    if (Quest.bugs()[bug]) {
      Quest.toast("Already zapped", bugName(bug) + " is on your tracker.", "check");
      Quest.announce("Already zapped: " + bugName(bug) + ".");
      return;
    }

    var button = spot.querySelector(".zap-btn");
    var count = Quest.zap(bug, id, button);
    render();
    Quest.restartAnimation(spot, "hit");
    var message = "Bug zapped: " + bugName(bug) + ". " + count + " of " + total + " found. 5 coins.";

    if (count < total) {
      Quest.toast("Zap! " + count + "/" + total, bugName(bug) + ". 5 coins.", "bug");
      Quest.announce(message);
      Quest.say("Got one: " + bugName(bug).toLowerCase() + "! " + (total - count) + " still hiding.");
      return;
    }

    // The last bug completes the quest.
    if (!Quest.complete("q4", button, message)) {
      Quest.confetti(button, 60);
      Quest.toast("All bugs zapped!", "6 of 6 found.", "trophy");
      Quest.announce(message + " All bugs zapped.");
    }
    Quest.say("All six bugs zapped! Compare notes, then reveal the answers.");
  }

  spots.forEach(function (spot) {
    spot.addEventListener("click", function (event) {
      // Links keep working, so players can discover which one is broken.
      if (event.target.closest("a")) { return; }
      // Selecting text, for example to search for a source, is not a zap.
      if (!event.target.closest("button") && String(window.getSelection())) { return; }
      aim(spot);
    });
    spot.addEventListener("animationend", function () {
      spot.classList.remove("hit", "miss");
    });
  });

  /* ---------- answers ---------- */

  function element(tag, text, className) {
    var node = document.createElement(tag);
    if (text) { node.textContent = text; }
    if (className) { node.className = className; }
    return node;
  }

  function labeledParagraph(label, text) {
    var paragraph = element("p");
    paragraph.appendChild(element("strong", label + " "));
    paragraph.appendChild(document.createTextNode(text));
    return paragraph;
  }

  // The answers are only added to the page after the button is pressed.
  function buildAnswers() {
    panel.appendChild(element("h2", "The 6 planted errors"));
    var list = element("ol", "", "answer-list");
    ANSWERS.forEach(function (answer, index) {
      var item = element("li", "", "panel");
      item.appendChild(element("h3", (index + 1) + ". " + answer.title));
      item.appendChild(labeledParagraph("What is wrong:", answer.why));
      item.appendChild(labeledParagraph("How to fix it:", answer.fix));
      list.appendChild(item);
    });
    panel.appendChild(list);
  }

  revealButton.addEventListener("click", function () {
    var opening = panel.hidden;
    if (opening && !panel.firstChild) { buildAnswers(); }
    panel.hidden = !opening;
    revealButton.setAttribute("aria-expanded", String(opening));
    revealButton.querySelector("[data-label]").textContent = opening ? "Hide answers" : "Reveal answers";
  });

  document.addEventListener("quest:change", render);
  render();
}());
