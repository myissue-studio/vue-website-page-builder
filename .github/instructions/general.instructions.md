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

## TypeScript Configuration Types - Keep Them Flexible!

### Critical Rule: PageBuilderConfig Must Remain Flexible

The `PageBuilderConfig` interface is used by thousands of developers with different use cases. It MUST be kept flexible to avoid breaking their implementations.

### Guidelines for Config Types

#### ✅ DO:

- Use `string` instead of string literal unions for dynamic values
- **Provide autocomplete via union types**: Use `FormName | (string & {})` pattern to give IDE suggestions while accepting any string
- Make all properties optional unless absolutely required
- Use `Record<string, unknown>` or `[key: string]: unknown` for extensibility
- Support `readonly` arrays (for `as const` compatibility)
- Use intersection types (`& Record<string, unknown>`) over index signatures inside object literals
- Accept flexible nested objects
- **Omit `.ts` extensions** in imports (bundlers expect no extension)

#### ❌ DON'T:

- Restrict `formName` to specific string literals (users need dynamic values like `` `cms-page-${slug}` ``)
- Require `image` property if not essential
- Restrict language codes to specific values (users may have custom languages)
- Use strict array types that don't support readonly arrays
- Add new required properties without major version bump

### Current Flexible Implementation

```typescript
export interface PageBuilderConfig {
  updateOrCreate: {
    formType: 'create' | 'update' // Only restrict where it makes sense
    formName: FormName | (string & {}) // ✅ Provides autocomplete for common values while accepting ANY string
  }
  pageBuilderLogo?: { src: string } | null
  resourceData?: { title: string; id?: number; [key: string]: unknown } | null
  userForPageBuilder?: PageBuilderUser // ✅ image is optional
  [key: string]: unknown // ✅ Allow additional properties
  userSettings?:
    | ({
        language?: {
          default?: string // ✅ Accept any language
          enable?: readonly string[] // ✅ Support readonly for 'as const'
          disableLanguageDropDown?: boolean
          [key: string]: unknown
        }
        autoSave?: boolean
        fontFamily?: string
      } & Record<string, unknown>)
    | null // ✅ Use intersection type for compatibility, allow null
  settings?: {
    brandColor?: string
    [key: string]: unknown
  } | null
  pageSettings?: PageSettings
}

// FormName provides IDE autocomplete for common values
export type FormName = 'post' | 'article' | 'blog' | 'page' | 'product' | 'collection'
// ... 80+ common form names

// The pattern `FormName | (string & {})` means:
// ✅ IDE suggests 'post', 'article', etc.
// ✅ But users can use ANY string like 'cms-page-about', `custom-${id}`, etc.
```

### When Adding New Config Options

1. **Always make new properties optional** - Use `?:` not `:`
2. **Add index signatures** - Include `[key: string]: unknown` for nested objects
3. **Test with various patterns** - Run the config type tests: `npm run test`
4. **Update tests** - Add new test cases for the new option in `src/tests/config.test.ts`
5. **Document flexibility** - Update TypeScript docs with examples

### Testing Config Flexibility

Run the comprehensive config tests:

```bash
npm run test
```

This validates that config accepts:

- Dynamic string values (template literals)
- Objects with/without optional properties
- `as const` declarations
- Custom properties
- Various language configurations
- Minimal configs
- Maximal configs

### Common User Patterns to Support

```typescript
// ✅ Dynamic form names
formName: `cms-page-${pageSlug}`

// ✅ Minimal user object
userForPageBuilder: { name: userName }

// ✅ Custom settings
userSettings: {
  ...baseSettings,
  customTheme: 'dark',
  customProp: someValue,
}

// ✅ As const configs
const config = {
  userSettings: {
    language: { enable: ['en', 'fr'] },
  },
} as const

// ✅ Conditional properties
resourceData: existingData || undefined
```

### Historical Issues

- **Issue #1**: `formName` was restricted to `FormName` union → broke dynamic strings → **Fixed**: Changed to `FormName | (string & {})` for autocomplete + flexibility
- **Issue #2**: `userForPageBuilder.image` was required → broke minimal configs
- **Issue #3**: `language.enable` was `string[]` → broke `as const` arrays
- **Issue #4**: `userSettings` had inline index signature → broke custom UserSettings types
- **Issue #5**: Import used `.ts` extension → incompatible with bundlers → **Fixed**: Removed extension

All resolved by making types more flexible while maintaining type safety and developer experience.

### Version Policy

- **Patch/Minor**: Can add optional properties, relax types, add index signatures
- **Major**: Required for new required properties or removing properties

---

**Remember**: When in doubt, make it more flexible. Breaking users' builds is worse than slightly looser types.
