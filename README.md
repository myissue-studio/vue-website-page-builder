<p align="center" dir="auto">
<img width="200" style="max-width: 100%;" src="./public/logo/logo.svg" alt="Vue Website Page Builder Logo" />
</p>

# Free Click & Drop Page Builder

- [Free Click \& Drop Page Builder](#free-click--drop-page-builder)
  - [Demo](#demo)
  - [Guide](#guide)
  - [Overview](#overview)
  - [Get Started in Minutes](#get-started-in-minutes)
  - [About](#about)
  - [Real-World Application Example](#real-world-application-example)
  - [Reviews, Ratings, and User Testimonials](#reviews-ratings-and-user-testimonials)
  - [Features](#features)
  - [How the Page Builder Works](#how-the-page-builder-works)
  - [Page Builder Architecture](#page-builder-architecture)
  - [Contributing](#contributing)
  - [Security Vulnerabilities](#security-vulnerabilities)
  - [Get in Touch for Customization or Any Questions](#get-in-touch-for-customization-or-any-questions)
  - [Report Issues or Request Features](#report-issues-or-request-features)
  - [Feedback](#feedback)
  - [Support the Project](#support-the-project)
  - [License](#license)

## Demo

Vue 3 Page Builder component with drag-and-drop functionality for creating dynamic web pages.

Try the live demo to explore real-time visual updates and smooth content management.
<br>
[Play around with the Page Builder](https://mybuilder.dev)

Create and enhance digital experiences with Vue on any backend.
Experience the power and simplicity of the Vue Website Page Builder in action, with a live SEO analyzer for content optimization.

<img style="width: 100%;" src="./public/home/for_read_me/vue3_page_builder_myissue.gif" alt="Vue Website Page Builder - the editor" />

## Guide

A Page Builder designed for growth. Build your website pages with ready-made components that are fully customizable and always responsive, designed to fit every need. A powerful Page Builder for growing merchants, brands, and agencies. And it is totally free.

Find everything you need to get started, configure, and master the Vue Website Page Builder.
This section covers installation, requirements, quick start, advanced usage, and integration tips—so you can build and launch pages with confidence.

[Guide](https://myissue-studio.github.io/vue-website-page-builder/)

## Overview

If you're a Vue 3 developer, this builder feels right at home. It installs quickly via npm and supports full customization through props and configuration objects. You can even set specific user settings like image, name, theme, language, company logo, and autosave preferences, making it a personalized experience for every user.

A lightweight and minimalist Page Builder with an elegant and intuitive design, focused on simplicity and speed.

Build responsive pages like listings, jobs, or blog posts and manage content easily.

<img style="width: 100%;" src="./public/home/for_read_me/browser_boat.svg" alt="Vue Website Page Builder - the editor" />

## Get Started in Minutes

Easy setup and instant productivity.
Follow the [Quick Start](#quick-start) guide to begin building with just a few simple steps.

---

## About

A Page Builder designed for growth. Build your website pages with ready-made components that are fully customizable and always responsive, designed to fit every need. A powerful Page Builder for growing merchants, brands, and agencies. And it is totally free.

<img style="width: 100%;" src="./public/home/for_read_me/browser_components.svg" alt="Vue Website Page Builder - the editor" />

## Real-World Application Example

From solo freelancers to fast-growing startups and established enterprises, the Page Builder is trusted by teams everywhere. With its intuitive click-and-drop editor, real-time visual editing, and a rich library of reusable components, you can turn ideas into polished pages in minutes. Built for merchants, brands, and agencies, it empowers anyone to create high-impact content.

Discover how the Vue Website Page Builder is empowering businesses to create dynamic and responsive web pages. A prime example is [myself.ae](https://www.myself.ae/stores), where the builder is utilized to create engaging and user-friendly online store pages.

## Reviews, Ratings, and User Testimonials

Here’s what users are saying about the Vue Website Page Builder:

⭐⭐⭐⭐⭐ "Game-Changer for Our Business"

_"The Vue Website Page Builder has completely transformed how we create and manage our website pages. The click-and-drop functionality is intuitive, and the real-time editing saves us so much time. Highly recommended!"_
— **Sarah L., Marketing Manager**

---

⭐⭐⭐⭐⭐ "Perfect for Agencies"

_"As an agency, we needed a tool that was flexible, fast, and easy to use for our clients. This builder ticks all the boxes. The reusable components and responsive design features are a huge plus!"_
— **James R., Founder of CreativeWorks**

---

⭐⭐⭐⭐ "Impressive Features and Support"

_"The builder is packed with features, and the support team is incredibly responsive."_
— **Emily T., Freelance Web Designer**

---

⭐⭐⭐⭐⭐ "A Must-Have for Blogs"

_"We use the builder for our blog. The ability to customize every detail while keeping the pages responsive is amazing. Our sales have increased since switching to this tool!"_
— **Ahmed K., Owner of Trendy**

---

⭐⭐⭐⭐⭐ "Great for Beginners and Experts Alike"

_"I’m not a developer, but I was able to create a professional-looking page in minutes. The interface is user-friendly, and the results are stunning."_
— **Lisa M., Small Business Owner**

---

Want to share your experience? [Submit your testimonial here](#feedback).

## Features

Includes:

- **Page Builder**: A Click & Drop Page Builder.
- **Customizable Design**: Customize the look to match your brand.

The Page Builder is packed with features:

- **Click & Drop**: Easily rearrange elements on your page.
- **Reordering**: Change the order of your content without hassle.
- **True Visual Editing**: See your changes in real-time as you make them.
- **Media Library**: Easily inject your own custom media library component.
- **Local Storage & Auto-Save**: Never lose your work—changes are saved as you go.
- **Unsplash**: Unsplash integration.
- **Responsive Editing**: Ensure your site looks great on all devices.
- **Text Editing**: Edit text content live and in real-time.
- **Font Customization**: Choose the perfect fonts to match your style.
- **SEO Score Checker**: Analyze your content live while editing for SEO optimization, including keyword density, readability, heading structure, and overall score to boost search rankings.
- **Undo & Redo**: Experiment confidently with the ability to revert changes.
- **Global Styles**: Global styles for fonts, designs, and colors.
- **YouTube Videos**: Integrate video content smoothly.
- **Download HTML**: Export the entire page as a standalone HTML file.
- **Global Page Styling**: Instantly define, update, or clear global styles for the main page wrapper at initialization or dynamically at runtime. Gain full control over fonts, colors, backgrounds, and more for a dynamic user experience.
- **Tailwind Support**: Fully compatible with Tailwind CSS (with automatic class prefixing to avoid conflicts). Tailwind installation is not required for the Page Builder to work.
- **Scoped Styles**: To ensure clean and predictable styling, the builder uses scoped style isolation. There is no risk of style conflicts between the builder and your app.
- **HTML Editor**: Access and edit raw HTML directly for full customization and developer-level control.

## How the Page Builder Works

The Page Builder is designed to be easy to use and flexible for any web project. Here’s how it works behind the scenes:

- **Configuration First:**
  When you start the builder, you pass in your configuration (such as what type of page you’re building, user info, branding, and any existing content).
  The builder saves this configuration immediately—even if the editing interface `DOM` isn’t loaded yet. This means you can safely set up the builder in advance, and it will be ready as soon as the editor appears on the page.

- **Loading Content:**
  If you have existing content (like a published page), the builder loads it so you can continue editing. If not, you start with a blank page.

- **Editing Experience:**
  As you add, move, or edit components (like text, images, or sections), the builder keeps everything in sync—both in the app’s memory and in your browser’s local storage. This means your work is always saved, even if you close the browser.

**In short:**
The Page Builder handles all the technical details of editing, saving, and loading pages, so your users can focus on creating great content—without worrying about losing their work or dealing with a complicated setup.

## Page Builder Architecture

The Page Builder is designed as a modular, state-driven editor for dynamic page content. Its architecture separates configuration, state management, and `DOM` interaction, ensuring flexibility and maintainability.

<img style="max-width: 100%;" src="./public/home/for_read_me/page_builder_architecture.svg" alt="Vue Website Page Builder - the editor" />

## Contributing

1. Fork the repository.
2. Create your feature branch.
3. Make your changes.
4. Build and test locally.
5. Submit a pull request.

## Security Vulnerabilities

If you discover a security vulnerability, please send us a message.

## Get in Touch for Customization or Any Questions

If you have any questions or if you're looking for customization, feel free to connect with our developer.

- [Email](mailto:qais.wardag@outlook.com)
- [LinkedIn](https://www.linkedin.com/in/qaiswardag)

## Report Issues or Request Features

Encountered a bug, have suggestions, or need a new feature? Create a GitHub issue:

- [Submit an Issue](https://github.com/myissue-studio/vue-website-page-builder/issues)

## Feedback

Feedback, suggestions or any issues you encounter while using this app. Feel free to reach out.

- [Submit your testimonial here](https://github.com/myissue-studio/vue-website-page-builder/issues)

## Support the Project

We would greatly appreciate it if you could star the GitHub repository. Starring the project helps to boost its visibility.

## License

[MIT License](./LICENSE)
