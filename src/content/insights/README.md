# Publishing an insight

Each article is one Markdown file in this folder. The file name becomes the
web address: `my-new-article.md` → `/insights/my-new-article`
(use lowercase letters, numbers and hyphens).

## Template — copy this into a new file

```
---
title: "Your article title"
excerpt: "One or two sentences shown on cards and in Google results."
date: 2026-10-20
category: Customer acquisition
cover: /insights/your-image.jpg
---

Your first paragraph.

## A section heading

More text. **Bold**, _italic_ and [links](https://example.com) work.

- Bullet points
- work too

> And quotes.
```

## Notes

- **date** controls ordering (newest first). An article dated in the future
  stays hidden until that day, so you can write ahead and schedule. Pages
  refresh hourly, so it goes live without a redeploy.
- **cover** is optional. Put the image in `public/insights/` and reference it
  as `/insights/file-name.jpg`. Without one, the card shows the category.
- **draft: true** keeps an article hidden while you work on it.
- The homepage shows the three most recent published articles automatically.
- This README file itself is ignored.
