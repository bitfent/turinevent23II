**Ralio.co Landing Page**

Public Codebase and Animation Understanding Brief

Prepared from public web inspection on April 25, 2026

| Bottom line | The public site behaves like a Framer-published marketing site, not a conventional publicly visible application repository. The visible page structure is highly componentized and the animation system is likely Framer Effects: appear, stagger, hover, FAQ expansion, and scroll-triggered transforms. |
| :---- | :---- |
| **Confidence** | High for page structure and Framer signals; medium for exact animation timings because the private Framer project and production bundles were not accessible through the public crawl. |
| **Primary audience** | Product, design, and front-end teams that want to understand or recreate the Ralio landing page interaction model. |
| **Not covered** | Private source repository, Framer project settings, API endpoints behind forms, analytics configuration, and exact animation curve values. |

**Source scope note:** This is a public reverse-engineering brief. It does not claim access to Ralio private code, repository history, CMS, Framer project, or production deployment configuration.

# **1\. Executive summary**

* Ralio.co is positioned around a simple conversion narrative: AI agents can now move money, but businesses need guardrails, identity, and audit before those payments execute.  
* The landing page is built from repeated responsive sections: navigation, hero, investor/logo strip, problem cards, a trust-layer/infrastructure diagram, audience segmentation, article loader, FAQ accordion, and final CTA/footer.  
* The best public implementation read is a Framer-generated site. Evidence includes Framer-hosted image assets and Framer-like duplicated responsive text/layer output. Framer officially supports React code components and a visual Effects system for appear, hover, press, loop, scroll animations, scroll transforms, and scroll speed.  
* The animation language is likely intentionally restrained: reveal copy first, then progressively expose trust-layer modules and payment rail cards as users scroll. The goal is to make a complex infrastructure concept feel safe, sequential, and auditable.  
* If recreating this in hand-written code, use a small component system with React/Next.js, CSS/Tailwind, and Framer Motion or equivalent. Keep animations transform-only, staggered, and reduced-motion aware.

# **2\. Evidence collected from the public site**

| Area | What is visible publicly | Interpretation |
| :---- | :---- | :---- |
| **Hero** | Headline: "Trust Your Agents with Business Payments" and supporting line about guardrails, identity, and audit before money moves. | The hero explains a trust and governance layer, not a payment provider UI. This lets the animation focus on credibility and control rather than flashy fintech motion. |
| **Problem framing** | Sections call agents "Uncontrolled", "Unverified", and "Unaccountable". | These three cards are natural candidates for staggered reveal and scroll-in sequencing. |
| **Solution framing** | Ralio is described as "secure and programmable payment infrastructure" and "the safety layer between your agents and your payment rails". | This suggests a central architectural diagram: agents on one side, Ralio guardrails/identity/audit in the middle, payment rails on the other side. |
| **Infrastructure cards** | Visible labels include Guardrails, Identity, Audit, Spend, Payroll, Treasury, custom agent, Bank Accounts, Cards, Stablecoins, and Ralio Wallet. | The page likely uses repeated card components for capability tiles. Animation can reuse one card variant with delayed entrances. |
| **Audience section** | Two entry points: Agent Builders and Payment Providers. | This is a segmentation block, likely tab-like or two-card interaction. Motion should clarify switching or compare-and-contrast. |
| **Blog section** | The crawler sees "Loading..." and "Loading posts...". | The article cards are probably loaded client-side, likely from Substack or a lightweight fetch/embed integration. |
| **FAQ** | Questions are listed with numbers 01 to 04 and one expanded answer in the crawl. | The FAQ likely uses accordion behavior with animated height/opacity state transitions. |
| **Final CTA** | "Turn intent into execution" and CTA links to early access and partner/contact paths. | The final section repeats the trust message and should use a simple reveal, not compete with conversion actions. |
| **Contact page** | A partner page has direct booking/copy, form fields, and marketing consent text. | The contact flow is part of the marketing funnel, separate from the product console. |

# **3\. Public codebase interpretation**

The word "codebase" needs to be interpreted carefully here. From the public site alone, we can understand the produced front-end architecture, but not the private source files or Framer project. The public implementation is best modeled as the following layers:

* **Published shell:** A Framer-published HTML/JS/CSS output serving responsive marketing pages under ralio.co.  
* **Design system:** Reusable layers/components for nav, CTAs, logo strips, cards, diagram nodes, tabs, FAQ rows, and footer links.  
* **Content layer:** Mostly static marketing copy embedded in the published page, with a dynamic article area that appears to load posts after page execution.  
* **External destinations:** Early access points to console.ralio.co/register, blog content to Substack, and partner/contact pages under ralio.co/contact.  
* **Asset layer:** Image assets served from Framer-hosted infrastructure. This is a strong signal that the site is produced or at least hosted through Framer.  
* **Animation layer:** Framer Effects or generated Framer Motion-style transforms applied to layers/components: viewport appear, scroll transforms, hover/press states, accordion open/close, and possibly nav behavior on scroll.

# **4\. Likely component map**

| Component | Role | Core props/state | Animation behavior |
| :---- | :---- | :---- | :---- |
| **Header/Nav** | Global navigation and CTAs | links, active section, mobile menu open | Initial fade/drop. Optional scroll hide/reveal. Hover underline or opacity changes. |
| **Hero** | Primary message and conversion actions | headline variants, body copy, CTA destinations | Staggered headline/body/CTA reveal. Background visual fades or scales subtly. |
| **Backed-by strip** | Social proof | logo list, logo size, spacing | Logos reveal in a small stagger or remain static for credibility. |
| **ProblemCard** | Frames market pain points | title, description, icon/number | Staggered viewport reveal from y-offset and opacity 0 to 1\. |
| **TrustLayerDiagram** | Explains Ralio as checkpoint between agents and rails | left nodes, middle guardrail tiles, right rail tiles | Scroll-driven reveal, slight parallax, card sequencing, possible connector-line drawing. |
| **AudienceTabs** | Shows Agent Builders vs Payment Providers | active tab, copy, CTA | Tab switch with crossfade/slide, hover states on buttons. |
| **ArticleFeed** | Shows recent posts | loading, posts array, error/empty state | Skeleton or loading fade into article cards after fetch. |
| **FAQAccordion** | Answers objections | open item index, question, answer | Height auto transition, opacity fade, icon rotate. |
| **FinalCTA/Footer** | Final conversion and utility links | CTA copy, links, legal links | Soft viewport reveal with minimal motion. |

# **5\. Animation understanding of the landing page**

The animation system appears designed to make the product proposition legible. The motion pattern should be understood as narrative progression rather than decorative movement.

## **5.1 Animation principles**

* Use reveal timing to guide the reading order: headline, support copy, CTAs, then proof.  
* Use staggered cards to turn abstract risks into separate, digestible problems.  
* Use scroll-triggered section effects for the central trust-layer diagram so the visitor sees agents, controls, and rails as a controlled flow.  
* Use hover/press microinteractions only on navigation, CTAs, tabs, and FAQ controls. Keep infrastructure cards stable and trustworthy.  
* Avoid motion that implies uncontrolled money movement. The brand promise is governance, so animations should feel precise and bounded.

## **5.2 Likely Framer effect types**

* Appear effect: fade/slide elements into view on page load or viewport entry.  
* Scroll animation and scroll transform: cards or diagram groups move, scale, or fade as a section enters/leaves viewport.  
* Hover/press effects: CTAs and tabs change state when interacted with.  
* Accordion animation: FAQ answer expands/collapses with height and opacity changes.  
* Responsive duplicated layers: the public crawl shows repeated copy blocks, consistent with a visual builder exporting different layers/breakpoints.

## **5.3 Section-by-section storyboard**

* Hero: navigation and headline reveal first; CTA buttons appear after the value proposition. Any large visual should move subtly, not distract from the regulatory/trust message.  
* Problem: three risk cards enter sequentially. This creates a checklist-like feeling: uncontrolled, unverified, unaccountable.  
* Solution diagram: Ralio modules appear between agent use cases and payment rails. The animation should make the checkpoint metaphor obvious.  
* Audience entry: Agent Builders and Payment Providers cards or tabs crossfade to show two go-to-market paths.  
* Articles: loading state resolves into post cards. This should be a simple opacity swap.  
* FAQ: one answer is open; additional answers expand via click. Icon rotation and answer fade are likely enough.  
* Final CTA: copy fades in, CTAs are immediately reachable, footer remains stable.

# **6\. Recommended rebuild spec if implementing in a custom codebase**

A clean rebuild can preserve the same visual system while making the implementation explicit and maintainable.

| Area | Recommendation |
| :---- | :---- |
| **Framework** | Next.js or another React-based static site framework. The public landing page does not require a heavy app architecture. |
| **Styling** | Tailwind CSS, CSS Modules, or vanilla CSS variables. Keep spacing, radius, and color tokens centralized. |
| **Motion** | Framer Motion or native CSS transitions. Use opacity, translate, and scale to stay GPU-friendly. |
| **Content model** | JSON/MDX content blocks for problem cards, rail cards, FAQs, and CTA copy. |
| **Blog feed** | Use a server-side cached Substack/RSS fetch or static import to avoid visible "Loading posts..." on first paint. |
| **Forms** | Use a protected form endpoint, spam protection, validation, and clear consent text. |
| **Accessibility** | Respect prefers-reduced-motion, preserve semantic heading order, make FAQ buttons real buttons with aria-expanded, and keep CTAs keyboard reachable. |
| **Performance** | Preload critical font/assets, lazy-load lower-page images, and compress large hero/diagram imagery. |
| **Analytics** | Track CTA clicks, section visibility, FAQ opens, and form submissions. Do not over-instrument card hover events. |

# **7\. Example animation architecture for a code rebuild**

Use one small set of variants across the page instead of bespoke animation code in each section.

const reveal \= {  
  hidden: { opacity: 0, y: 24 },  
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } }  
}

const staggerGroup \= {  
  hidden: {},  
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.10 } }  
}

// Apply to Hero, ProblemCard list, TrustLayerDiagram cards, FAQ rows, and FinalCTA.  
// Add a prefers-reduced-motion guard so the page remains accessible.

# **8\. Risks, unknowns, and validation checklist**

## **Unknowns**

* Exact animation timing, easing, delay values, and scroll thresholds are not visible from the text crawl.  
* The private Framer project may contain code overrides or code components not detectable from the public text output.  
* The contact form backend and blog fetch implementation are not visible from the public crawl.  
* Analytics, A/B testing, and consent tooling were not confirmed from accessible text.

## **Validation checklist**

* Open the site in a browser with DevTools and record a scroll-through video at desktop and mobile widths.  
* Inspect Network tab for Framer bundles, blog feed requests, image weights, and form endpoints.  
* Check if motion respects prefers-reduced-motion.  
* Run Lighthouse or WebPageTest for performance and accessibility.  
* If Ralio grants access, inspect the Framer project layers/effects and export a definitive animation inventory.

# **9\. Sources reviewed**

* **Ralio homepage:** [https://ralio.co/](https://ralio.co/) \- Used for page structure, positioning, CTAs, problem/solution sections, FAQ, and footer.  
* **Ralio contact page:** [https://ralio.co/contact](https://ralio.co/contact) \- Used for partner/contact funnel and form structure.  
* **Ralio Substack redirect:** [https://ralio.substack.com/](https://ralio.substack.com/) \- Used to confirm blog/publication destination and external content dependency.  
* **Framer Code Components documentation:** [https://www.framer.com/developers/components-introduction](https://www.framer.com/developers/components-introduction) \- Used to explain React-based code components and the Framer authoring model.  
* **Framer Component Effects update:** [https://www.framer.com/updates/component-effects](https://www.framer.com/updates/component-effects) \- Used to explain supported effects such as Appear, Hover, Press, Loop, Scroll Animations, Scroll Transforms, and Scroll Speed.  
* **Framer Scroll Animations lesson:** [https://www.framer.com/academy/lessons/scroll-animations](https://www.framer.com/academy/lessons/scroll-animations) \- Used to explain viewport and scroll-triggered effects and mobile performance guidance.

# **10\. One-page handoff summary**

* Build model: Framer-generated marketing page with repeated reusable sections and Framer-hosted assets.  
* Core narrative: agents can pay, but Ralio checks intent, enforces rules, verifies identity, and records audit before money moves.  
* Key interaction: scroll narrative from risk to safety infrastructure to audience-specific CTA.  
* Main components: Header, Hero, BackedByLogos, ProblemCards, TrustLayerDiagram, AudienceTabs, ArticleFeed, FAQAccordion, FinalCTA, Footer.  
* Motion recipe: reveal \+ stagger \+ scroll transforms \+ CTA hover \+ FAQ height transition. Keep all effects subtle and trustworthy.  
* Implementation warning: do not claim exact source code or exact timings without access to the Framer project or production bundles.