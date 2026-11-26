# Quest to Publish

A playable demo website for a proposed 3-hour workshop for the AI4DH Summer School 2027 at the University of Ljubljana:

**Quest to Publish: A Playful, AI-Assisted Workshop on Building and Sharing Digital Humanities Projects**

Participants with no coding experience use the free version of Claude or ChatGPT, together with GitHub and GitHub Pages, to publish a small website for their own research project. The workshop is game-based, with quests, collaborative badges (no ranked leaderboard), an AI bug hunt, and an accessibility challenge.

The site is plain HTML, CSS, and vanilla JavaScript. There is no framework, no build step, and nothing loaded from other servers.

**Live site:** <https://sepehrvafshar.github.io/quest-to-publish/>

**Mirror on Cloudflare Pages:** <https://quest-to-publish.pages.dev/>

## How the demo plays

- **Expedition map and field notes:** seven stops, from Briefing to Showcase. Pressing **Complete** awards coins, fills the level bar, unlocks a team badge, and moves Quest Bot along the trail.
- **AI Bug Hunt:** click or keyboard-activate anything suspicious on the practice page to zap one of 6 planted errors. There is no timer and no penalty for a miss.
- **Quest Bot:** an original mascot who guides the team.
- **Secret:** old cheat codes still work.
- **Settings:** night chart and day map themes, reduced motion, larger text, calm background, sound effects (off by default), and reset.
- **Screen sizes:** the layout runs from a 360px phone to a very wide monitor, adding columns and growing text as space allows.

Progress is saved only in the visitor's own browser (`localStorage`). Nothing is sent anywhere. On a shared computer, use **Reset progress**.

## What is in this repository

```text
.
├── index.html          Expedition map, field notes, badges, and results
├── 404.html            Friendly "page not found" screen
├── assets/
│   ├── style.css       Shared design system (both themes, motion)
│   ├── prefs.js        Applies saved settings before the page is drawn
│   ├── game.js         Progress, HUD, rewards, boot screen, settings
│   ├── home.js         Map page
│   ├── quest-bot.svg   Mascot
│   └── CREDITS.md
├── bug-hunt/
│   ├── index.html      Practice page with 6 planted errors
│   ├── bug-hunt.css
│   ├── bug-hunt.js     Zapping, tracker, and answer key
│   └── house.svg
├── template/
│   ├── index.html      Starter page that participants copy
│   ├── style.css
│   ├── README.md       Beginner guide: copy, edit with AI, publish
│   └── images/
└── .nojekyll           Tells GitHub Pages to serve files as they are
```

The starter template is deliberately calm and has no game layer, so participants can read and change it easily.

## Preview on your computer

From the repository folder, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Press Ctrl+C to stop. A local server is recommended because links to folders, such as `bug-hunt/`, do not open correctly when you double-click the files.

## Publish with GitHub Pages

1. Push this repository to GitHub. The repository must be public on a free account.
2. Open the repository on GitHub and go to **Settings > Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to **main** and the folder to **/ (root)**. Select **Save**.
5. After a minute or two, the site is available at `https://YOUR-USERNAME.github.io/quest-to-publish/`.

If you publish under a different username or repository name, update the two links to `github.com/sepehrvafshar/quest-to-publish`: one in `index.html` and one in `template/README.md`.

## Publish a copy on Cloudflare Pages (optional)

Deploy from a clean export, so that only committed files are uploaded:

```bash
rm -rf /tmp/quest-to-publish-dist && mkdir -p /tmp/quest-to-publish-dist
git archive HEAD | tar -x -C /tmp/quest-to-publish-dist
cd /tmp/quest-to-publish-dist
npx wrangler login
npx wrangler pages deploy . --project-name quest-to-publish --branch main
```

On the first deployment only, create the project before the last command:

```bash
npx wrangler pages project create quest-to-publish --production-branch main
```

Newer Wrangler versions may try to set up a Cloudflare Workers project instead. To create a Pages project, add `--force` to this one command. If your login has more than one account, set `CLOUDFLARE_ACCOUNT_ID` first.

Cloudflare does not update from GitHub automatically with this method. Run the commands again after each change.

## Accessibility

The site and the template are designed to meet WCAG 2.1 level AA.

- Semantic landmarks, ordered headings, and text alternatives
- Every game action works with the keyboard and has a visible focus style
- Level ups, badge unlocks, and bug zaps are announced to screen readers
- Text contrast checked in both the dark and light themes
- Layouts reflow on narrow screens
- With reduced motion (from the device or the site setting), ambient loops, confetti, coin pops, and the loading animation are turned off
- Nothing flashes, and sound is off until a visitor turns it on

Automated tools catch only some barriers. Before relying on the site, also test it by hand with a keyboard and a screen reader.

### The bug hunt breaks rules on purpose

Inside the section labeled **Practice page** in `bug-hunt/index.html`, some errors are intentional. An accessibility checker should report problems there. Please do not "fix" them.

## Facilitator notes

<details>
<summary>Bug hunt answer key (spoilers)</summary>

1. **Wrong date:** the museum "opened" in 1926. The fact sheet says 1962.
2. **Invented citation:** reference 2, also zappable at the sentence that cites it.
3. **Broken link:** the visiting hours link (`visiting-hours.html` does not exist, so do not create it).
4. **Image without alt text:** the house illustration.
5. **Low-contrast text:** the visitor note under "Plan Your Visit".
6. **Skipped heading level:** "The Kitchen Notebooks" is an `h5` under an `h3`.

The explanations shown to participants are in `bug-hunt/bug-hunt.js`.

</details>

<details>
<summary>The secret badge (spoiler)</summary>

On the map page or the bug hunt, press: Up, Up, Down, Down, Left, Right, Left, Right, B, A.

</details>

## Credits

Workshop by Sepehr Vaez Afshar, University of Illinois Urbana-Champaign: <https://sepafshar.com/>

See [assets/CREDITS.md](assets/CREDITS.md) for design, font, and art credits.
