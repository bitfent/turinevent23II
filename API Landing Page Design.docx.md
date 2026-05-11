# YouHodler Business API Landing Page & Sandbox Sign‑up – Project Description

## Project overview & objectives

The YouHodler Business API enables electronic‑money institutions (EMIs) and regulated payment platforms to embed secure crypto capabilities without operating their own custody platform. A new landing page will market this API to decision‑makers and convert visitors by guiding them toward a **sandbox sign‑up** form. The page should convey how YouHodler helps businesses **bridge the gap between traditional finance and crypto**[\[1\]](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020#:~:text=General) while assuring them of strong compliance and governance controls. The primary success metric is the number of sandbox registrations; all design and copy choices should support that goal.

## Target audience & messaging

The audience includes EMIs, fintechs, treasury teams, payroll providers and marketplace platforms that need to add crypto‑asset services. The copy should:

* Highlight YouHodler’s ability to **connect fiat and crypto**[\[1\]](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020#:~:text=General) and handle segregated master and client accounts.

* Emphasise **compliance and governance** (policies, approvals, idempotent operations) and YouHodler’s regulatory status in the EU and Switzerland.

* Demonstrate **simplicity and speed of integration**: authenticate, read your perimeter, create a service account and start onboarding clients.

* Introduce **agentic finance** as a differentiator: the API is event‑driven and ready for AI‑driven automation.

* Use clear, regulated language (“stablecoins”, “tokenised assets”, “enterprise custody”) and avoid retail crypto jargon.

* Segment the narrative by persona (EMIs, treasury teams, payroll providers, marketplace platforms) so each visitor sees their use case.

## Page structure

1. **Hero section.** A dark, atmospheric banner with the headline “Bridge fiat and crypto with our regulated API” and a short subheading explaining the API’s value. Place one or two bright call‑to‑action buttons (“Try our Sandbox”, “Get started now”) prominently. Use a gradient background or abstract illustration of interconnected currencies to evoke transformation.

2. **Features & benefits.** Show the core capabilities through four cards or panels:

3. **Multi‑currency accounts & stablecoin payments** – handle fiat and digital currencies with segregated service accounts.

4. **Service accounts & governance controls** – enforce policies, approvals and client‑level segregation.

5. **Quick integration & API‑first design** – one API with developer‑friendly docs; event‑driven and idempotent operations.

6. **Regulated custody & compliance** – highlight EU/SWISS supervision and bank‑grade security.

7. **How it works.** Present a simple four‑step process: **Authenticate → Read your perimeter → Create service accounts → Onboard clients**. Use icons and a timeline or a numbered list to visualise the journey.

8. **Use cases & personas.** Provide short sections for:

9. **EMIs:** embed crypto services without changing their licence.

10. **Treasury teams:** manage multiple currencies, accounts and approvals.

11. **Payroll providers:** send global stablecoin payouts with instant conversion.

12. **Marketplace platforms:** hold client funds, earn yield and convert instantly.

13. **API capabilities & agentic readiness.** Offer a bullet list of functions (create clients, fund accounts, deposit/withdraw, enforce policies, on/off ramps, real‑time notifications). Describe how the API’s event‑driven design supports AI agents and future‑proofs operations.

14. **Trust & compliance.** List certifications and standards (MPC/HSM support, SOC 2, ISO 27001, EU DORA, FINMA‑style compliance). Include a case‑study quote or client logo to build credibility.

15. **Sandbox sign‑up form.** A dedicated section with a simple form (fields for name, company, email, job title and intended use). Keep it visually distinct with a light card on the dark background. Include privacy messaging and a prominent button (“Try our sandbox for free”). After submission, display a confirmation message.

16. **FAQ.** Use an accordion component with clear questions and succinct answers covering AML/KYC, supported assets, fees, integration timeline and support.

17. **Footer.** Use a dark background with links to documentation, API reference, legal information, case studies, careers and social channels. Include a secondary call‑to‑action to the sandbox. Provide regional disclosures (e.g., UK restrictions) as in the existing site[\[2\]](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020#:~:text=YouHodler%20is%20regulated%20in%20the,offered%20to%20UK%20customers%20here).

## Visual style & design guidelines

### Color palette

| Purpose | Colour & usage |
| :---- | :---- |
| **Primary** | **\#2879FE** – Dodger Blue. Use for buttons, primary links and interactive highlights. |
| **Secondary accent** | **\#87CBFF** – Anakiwa. Use for hovers, gradients and subtle highlights. |
| **Background** | **\#0E0F13** – Woodsmoke. Dark base for sections and hero area. |
| **Light surfaces** | **\#F7F9FC** – near‑white for cards and forms on dark backgrounds. |
| **Text** | **\#FFFFFF** or **\#E1E5EB** – white or light grey for high‑contrast typography on dark backgrounds. |

### Typography

* **Headings:** Modern, geometric sans‑serif such as **Montserrat** or **Poppins**. Use bold weights for hierarchy; H1 around 48–64 px on desktop, scaled down for tablets and mobile.

* **Body text:** Clean sans‑serif like **Inter**, **Roboto** or **Arial**, sized at 16–18 px with 1.5 line‑height for readability.

* **Hierarchy:** Distinct sizes and weights for H1–H6, paragraph text and captions; consistent letter‑spacing.

### Layout & responsiveness

* **Grid system:** Use CSS Grid or Flexbox with a maximum content width (\~1200 px) and generous horizontal padding. Align content centrally and allow columns to collapse to single‑column layouts on screens below 768 px.

* **Navigation:** Top navigation bar with logo, primary links and a contrasting call‑to‑action button. Collapse to a hamburger menu on small screens. Use a sticky header for quick access.

* **Spacing:** Provide sufficient white space (32 px or more) between sections. Alternate dark and slightly lighter backgrounds to delineate sections.

* **Cards & panels:** Use rounded corners and subtle drop shadows to separate cards from the dark background. On mobile, stack cards vertically and increase touch targets.

* **Images & illustrations:** Use abstract or isometric illustrations depicting multi‑currency flows, secure custody and integration. Use line icons that reflect the Y‑shaped logo and keep them consistent in thickness and style.

### Buttons & interactions

* **Primary buttons:** Filled with \#2879FE and white text. Hover state: lighten colour (e.g., \#3D8CFF) and add a gentle shadow. Focus state: outline with the accent colour for accessibility.

* **Secondary buttons:** Transparent with a 2 px border in the primary colour. Use for secondary actions like “Learn more”.

* **Micro‑interactions:** Fade‑in or slide‑up animations on scroll; button press effects; smooth colour transitions (0.2–0.3 s ease‑in‑out). Avoid excessive animation to keep performance high.

### Form design

* **Field layout:** Stack input fields vertically with clear labels above each input. Use lightly coloured backgrounds (\#1B1D22) and darker borders with corner radii. On focus, highlight the border with the primary colour.

* **Validation:** Provide inline validation messages in a contrasting colour (e.g., green for success, red for errors). Include tooltips for additional guidance.

* **Submission feedback:** After successful submission, show a confirmation message or redirect to a thank‑you page with next steps.

### Accessibility & SEO

* Ensure text/background contrast ratios meet WCAG 2.1 AA standards. Use accessible font sizes and responsive line‑heights.

* Use semantic HTML (\<nav\>, \<main\>, \<section\>, \<article\>, \<form\>, \<footer\>) and descriptive \<h1\>–\<h3\> headings to improve readability for screen readers and search engines.

* Add aria-labels to interactive elements and aria-expanded to accordion controls.

* Provide alt text for all images and icons. Avoid using images of text.

* Optimise images (use SVGs where possible) and lazy‑load below‑the‑fold assets to improve page speed.

* Include meta tags (title, description) using targeted keywords (e.g., “digital asset custody API”, “stablecoin payments API”, “EMI crypto integration”) and implement [Product](https://schema.org/Product) and [FAQ](https://schema.org/FAQPage) Schema.

### Performance & mobile considerations

* **Optimisation:** Minify CSS and JavaScript; combine files where appropriate. Use preload for fonts and critical CSS. Avoid heavy video backgrounds on mobile; substitute with static imagery.

* **Responsive images:** Use srcset and sizes attributes to serve appropriately sized images. Compress all images and icons.

* **Mobile‑first design:** Design and test for smaller screens before scaling up. Keep navigation simple and ensure the call‑to‑action button appears early and remains accessible. Increase button sizes and spacing for touch gestures.

## SEO & AI‑agent optimisation

* **Keyword placement:** Integrate high‑volume phrases like “digital asset custody API”, “stablecoin payments API” and niche phrases like “EMI crypto integration” in headings, subheadings and body copy. Pair them with descriptors such as “regulated”, “compliant” and “governance‑ready” to attract targeted traffic.

* **Structured content:** Use clear H1/H2/H3 headings, short paragraphs and bullet lists so that search engines and AI agents can parse the page easily. Provide summary lists of API capabilities and benefits.

* **FAQ schema:** Mark up the FAQ section with FAQPage Schema to enable rich‑result snippets and direct answers in ChatGPT and search engines.

* **Documentation links:** Include links to the API reference, OpenAPI specification and case studies. Provide machine‑readable documentation so that AI agents can verify endpoints and capabilities.

* **Freshness:** Update the page regularly to reflect new features, supported assets or regulatory changes. Fresh content signals relevance to both humans and AI models.

## Deliverables

The project should result in:

* HTML and CSS (optionally JS) files implementing the landing page and sign‑up form according to the above design and content guidelines.

* Responsive layouts for desktop, tablet and mobile, with cross‑browser testing.

* Exported assets (SVG icons, illustrations) and optimised images.

* SEO‑friendly meta tags, structured data and accessibility compliance.

* Integration of the sign‑up form with the sandbox registration backend (API call or marketing automation platform).

The objective is to create a visually compelling, trustworthy and conversion‑focused landing page that conveys YouHodler’s ability to bridge traditional finance and crypto[\[1\]](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020#:~:text=General) and encourages visitors to start building with the sandbox.

---

[\[1\]](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020#:~:text=General) [\[2\]](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020#:~:text=YouHodler%20is%20regulated%20in%20the,offered%20to%20UK%20customers%20here) YouHodler Month in Review: July 2020

[https://www.youhodler.com/blog/youhodler-month-in-review-july-2020](https://www.youhodler.com/blog/youhodler-month-in-review-july-2020)