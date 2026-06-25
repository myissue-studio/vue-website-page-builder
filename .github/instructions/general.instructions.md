---
applyTo: '**'
---

# GitHub Copilot Instructions

## General Rules

- Always update the existing documentation files in: `/docs` to reflect the code changes.
- If adding new md doc files to documentation, then remember to add them to the sidebar in file: `.vitepress/config.ts`

## Project Documentation

Documentation for this project uses **vitepress** and lives in:

```
`/docs`
```

Every `.md` file in `wiki/src/content/docs/` **must** start with this frontmatter block or vitepress will throw an error. Example:

```md
# Lorem ipsum

## Lorem ipsum, lorem ipsum
```

## Locale for Danish and English

Remember to add translations when creating new features. Translation files can be found here:

`/src/locales`
