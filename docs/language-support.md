## Language Support

The Page Builder offers robust multilingual support, enabling you to reach a global audience with ease. By default, it supports the following languages, chosen for their widespread use and strong developer communities:

| Language             | Code    |
| -------------------- | ------- |
| English              | en      |
| Chinese (Simplified) | zh-Hans |
| French               | fr      |
| Japanese             | ja      |
| Russian              | ru      |
| Spanish              | es      |
| Portuguese (Brazil)  | pt      |
| German               | de      |
| Arabic               | ar      |
| Hindi                | hi      |
| Danish               | da      |
| Italian              | it      |

## Default language

You can set a default language for your project:

```typescript
userSettings: {
	language: {
		default: 'en',
	},
},
```

If you prefer to offer only a subset of these languages for users to switch between, specify them using the `enable` option.

If you do not provide the `enable` array, the Page Builder will default to showing all supported languages by default.

```typescript
userSettings: {
	language: {
		default: 'en',
		enable: ['en', 'zh-Hans', 'fr'],
	},
},
```

## Disabling the Language Dropdown

If you want to completely hide the language selector from the UI (e.g., when only one language is available or you want a fixed language), simply set `disableLanguageDropdown` to `true`.

Even when the dropdown is disabled, the default language will still be applied automatically. This gives you full control over localization while keeping the interface simple for your users.

```typescript
userSettings: {
	theme: 'light',
	language: {
		default: 'en',
		disableLanguageDropdown: true,
	},
},
```

This flexibility allows you to tailor the language experience to your audience’s needs.
