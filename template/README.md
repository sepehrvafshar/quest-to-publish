# Starter template: your research website

This folder is a small website that you can copy and make your own. You do not need to know how to code. You will use your web browser, a free GitHub account, and the free version of [Claude](https://claude.ai/) or [ChatGPT](https://chatgpt.com/).

## What is in this folder

| File | What it does |
| --- | --- |
| `index.html` | The words and structure of your page. This is the file you edit most. |
| `style.css` | The colors, fonts, and layout. |
| `images/` | Your pictures go here. |
| `README.md` | These instructions. |

## Step 1: Copy the template

1. Sign in to [GitHub](https://github.com/). If you are new, create a free account first. Your username will be part of your web address.
2. Open the [workshop repository](https://github.com/sepehrvafshar/quest-to-publish).
3. Select the green **Code** button, then **Download ZIP**.
4. Unzip the file on your computer. On a Mac, double-click it. On Windows, right-click it and choose **Extract All**.
5. Back on GitHub, select the **+** icon at the top right, then **New repository**.
6. Name it something short, such as `my-research-site`. Choose **Public**, because free accounts need a public repository for GitHub Pages. Select **Create repository**.
7. On the new, empty repository page, select the link **uploading an existing file**.
8. On your computer, open the unzipped folder, then open the `template` folder. Select everything **inside** it (`index.html`, `style.css`, `README.md`, and the `images` folder) and drag it all onto the GitHub page.
9. Select **Commit changes**.

Check: `index.html` should appear in the main file list of your repository, not inside another folder.

About the **Use this template** button: on the workshop repository, it copies the whole workshop website, not only this starter. Use the download steps above if you want just your own page.

## Step 2: Edit it with help from Claude or ChatGPT

### Before you share anything with an AI tool

- Do not paste private, sensitive, or unpublished material that you are not allowed to share. This includes personal details about living people.
- AI tools can state wrong facts and invent sources with great confidence. Check every date, name, quotation, link, and citation yourself.

### The editing loop

1. In your repository, open `index.html` and select the **Copy raw file** button.
2. Paste it into Claude or ChatGPT, together with your request.
3. Read the answer. Ask questions about anything you do not understand.
4. Return to GitHub, select the pencil icon (**Edit this file**), replace the contents with the new version, and select **Commit changes**.
5. Look at your site and repeat.

Change one thing at a time. If something breaks, open the file's **History**, copy the last version that worked, and paste it back.

### Three example prompts

Replace the words in square brackets with your own details.

**Prompt 1: Fill in the placeholders**

```text
Here is the index.html file for my research website. I am a beginner.
Replace the placeholders marked with EDIT comments using these notes:
Title: [your title]
Description: [two or three sentences]
About me: [your name, role, institution, interests]
Use only the facts I gave you. Do not invent dates, sources, or achievements.
If something is missing, leave the placeholder and tell me.
Return the complete file and list what you changed.

[paste index.html here]
```

**Prompt 2: Add an image with good alt text**

```text
I uploaded an image to the images folder. The file name is [filename.jpg].
It shows [describe what you see]. It comes from [archive or website],
dated [date], with this license: [license].
Update the first gallery item in my index.html to use this image.
Write short, useful alt text based only on my description, and a caption
with the source and license. Return the complete file.

[paste index.html here]
```

**Prompt 3: Check accessibility**

```text
Please review my index.html and style.css for accessibility against
WCAG 2.1 level AA. Check heading order, alt text, link text, color contrast,
keyboard focus, and the page language. Explain each problem in plain language,
show me exactly which lines to change, and say what you cannot check from
the code alone.

[paste index.html here]

[paste style.css here]
```

## Step 3: Add your images

1. In your repository, open the `images` folder.
2. Select **Add file**, then **Upload files**, add your pictures, and select **Commit changes**.
3. In `index.html`, change `src="images/placeholder.svg"` to your file name, for example `src="images/town-map.jpg"`.
4. Change the `alt` text to describe the picture, and update the caption.

Tips:

- File names are case-sensitive: `Map.JPG` and `map.jpg` are different files. Avoid spaces.
- Large photos load slowly. A width of about 1600 pixels is usually plenty.

### Using public domain and openly licensed images

This template contains no historical images, only a clearly marked placeholder. Before you publish a picture, confirm that you are allowed to:

- Good places to look include [Wikimedia Commons](https://commons.wikimedia.org/), [Europeana](https://www.europeana.eu/), [the Library of Congress](https://www.loc.gov/free-to-use/), and the [Digital Library of Slovenia (dLib)](https://www.dlib.si/).
- Not everything on these sites is free to reuse. Read the rights statement on **each item**.
- Look for **Public Domain**, **CC0**, or a Creative Commons license whose conditions you can meet.
- Record the creator, title, date, source, and license in the caption, even when it is not required.

## Step 4: Publish with GitHub Pages

1. In your repository, select **Settings**.
2. In the left menu, select **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, choose **main** and the folder **/ (root)**. Select **Save**.
5. Wait a minute or two, then refresh the page. GitHub shows your web address, which usually looks like `https://YOUR-USERNAME.github.io/my-research-site/`.
6. Open the address on your computer and on your phone.

Each time you commit a change, GitHub updates your site. This can take a few minutes. If you still see the old version, reload the page without the cache (Ctrl+Shift+R on Windows, Cmd+Shift+R on a Mac).

## Step 5: Check before you share

- [ ] All text in square brackets has been replaced.
- [ ] Facts, dates, and sources have been checked by a person.
- [ ] Every link works.
- [ ] Every image has alt text, a source, and permission to be published.
- [ ] You can reach every link with the **Tab** key and see where you are. (In Safari on a Mac, use **Option+Tab**.)
- [ ] There is one main heading, and heading levels are not skipped.
- [ ] The page is readable on a phone.
- [ ] A free checker such as [WAVE](https://wave.webaim.org/) reports no errors.

## If something goes wrong

| Problem | What to check |
| --- | --- |
| The address shows "404" | Wait a few minutes. Confirm that `index.html` is in the main folder and that Pages uses **main** and **/ (root)**. |
| The page has no colors or layout | Confirm that `style.css` is next to `index.html` and is spelled exactly that way. |
| An image does not appear | Compare the file name in `src` with the file in `images`, including capital letters. |
| Raw code or odd symbols appear on the page | The AI answer may have added extra text or code fences. Keep only the HTML, from `<!doctype html>` to `</html>`. |
