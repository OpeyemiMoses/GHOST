---
name: personal-web-design
description: Personal design rulebook for building this user's web apps — landing pages, dashboards, docs, and help centers. Use this whenever the user asks to build, redesign, or add a page/section to their web app, whenever a landing page, dashboard, documentation site, or help center is requested, and whenever visual/animation/component decisions are being made for their product. This overrides generic default design instincts (see frontend-design skill) with this specific user's hard constraints on shapes, stickers, animation, imagery, gradients, and page structure. Always consult before writing any UI code for this user's projects.
---

# Personal Web Design Rules

This is a fixed rulebook for one user's web app projects. These are hard constraints, not suggestions — follow them by default on every build. Only deviate from a rule when the user explicitly says so in that conversation for that instance; the default rule still applies to everything else.

Use this skill alongside the general `frontend-design` skill for taste/craft judgment (typography, restraint, avoiding generic AI tells), but where the two conflict, THIS skill's rules win for this user.

## Hard constraints (always enforced unless the user overrides in-message)

1. **No pill-shaped elements.** No fully-rounded/pill buttons, pill tags, pill badges, pill nav items, etc. Use square corners or a modest border-radius instead. Only use pill shapes if the user explicitly asks for one in that message.
2. **No stickers, ever.** No sticker-style illustrations, sticker badges, peeling-corner effects, or sticker-like decorative graphics anywhere in the build. This is a strict, non-negotiable ban — do not include one "just in case," even subtly.
3. **No gradients, ever.** No gradient backgrounds, gradient text, gradient buttons, or gradient washes as decoration. Use flat, deliberate color instead. This is as strict as rule 2.
4. **Default layout is minimalist,** but layered with complex, deliberate animation on top (see rule 5) — minimalism governs spacing, color palette, and structure; animation is still expected by default. Don't flatten the page into a static minimal template — the two combine.
5. **Use complex/immersive animation by default:** immersive scroll-blur reveals, 3D carousel rotation, "water drop" click ripple effects, minimalist scroll-zoom, background elements/shapes that drift or move on their own (idle motion, not just on scroll or hover). Treat these as the default toolkit to draw from, not optional extras — pick what fits the build rather than skipping animation. Only simplify down if the user says otherwise.
6. **Always include a real-world photographic image** tied to the nature of the build (e.g., a relevant real photo used as a background or hero treatment) — understand what the product is first, then source/describe an image that fits it. This is enforced by default; skip only if the user says otherwise.
7. **Read the full build brief before designing.** Before producing a landing page, absorb everything about what's being built — purpose, audience, features, tone — and reflect all of it in the landing page content and structure. Don't produce a shell page; make it comprehensive and specific to the actual product.
8. **Always produce full documentation,** not a "how to run this" README. Study how notable products/companies structure their docs (structure, tone, depth) and write real documentation of what the build IS and does, covering its features and concepts in depth. Also always produce a Help Center page (FAQs, troubleshooting, guidance for end users) as a separate deliverable from the documentation.
9. **Dashboards:** if the user says they need a dashboard, ask whether they want a side-nav or top-bar dashboard layout before building it — don't assume. The landing page itself always uses a top bar nav, with a clear CTA button to enter the product (e.g., "Launch App," "Open Dashboard," or whatever name fits the product).
10. **Footer must be complete:** all standard navigation/legal links plus a link to the user's GitHub.
11. **Skill/polish bar is high.** Whatever is shipped should look and feel premium/immersive at first glance — this is a floor, not a nice-to-have.

## Working process

1. Understand the build: what the product is, who it's for, what it does. Don't design before this is clear — ask if it isn't.
2. If a dashboard is in scope, ask side-nav vs. top-bar before starting (rule 9).
3. Plan the page(s): content structure, hero treatment, where the real-world image fits, which animation(s) from rule 5 fit the product's character (don't force all of them onto one page — pick what serves this specific build).
4. Build with minimalist spacing/color discipline + the chosen animations layered in. No pills, no stickers, no gradients — check the output against these three before presenting it.
5. Deliver documentation and a help center page as their own artifacts/pages when a full build is requested, not just the landing page/app itself.
6. Before presenting, self-check against the "never" list: pill shapes? stickers? gradients? If any snuck in, remove them.

---

## Craft guidance (applies within the hard constraints above)

The sections below are about *how* to design well once the hard constraints are satisfied — typography, motion, layout, and copy craft. Where anything here would suggest a pill shape, a sticker, or a gradient, the hard constraints above always win; treat those examples in the source guidance as illustrative, not literal permission.

### Ground every design in the subject

Approach each build as the design lead at a studio known for giving every client a visual identity that couldn't be mistaken for anyone else's. Name the concrete subject, its audience, and the page's single job before designing. Pull from the subject's own world — its materials, instruments, artifacts, vernacular — rather than generic template moves. Build with the brief's real content throughout, not placeholder filler.

### Design principles

- **The hero is a thesis.** Open with the most characteristic thing in the subject's world — headline, image, animation, live demo, or interactive moment. Don't default to "big number + small label + supporting stats" unless it's genuinely the best fit.
- **Typography carries the personality of the page.** Pair a characterful display face (used with restraint) with a complementary body face, and a utility face for captions/data if needed. Avoid generic fonts (Arial, Inter, system defaults, Roboto) — choose distinctive faces and set a clear type scale with intentional weight, width, and spacing.
- **Structure is information.** Numbering, eyebrows, dividers, and labels should encode something true about the content, not decorate it. Numbered markers (01/02/03) only belong where the content is a real sequence.
- **Motion should serve the subject.** Within the animation toolkit from the hard constraints (rule 5), think about where each animation actually earns its place — a page-load sequence, a scroll-triggered reveal, ambient atmosphere, hover micro-interactions. One well-orchestrated moment usually lands harder than scattered effects layered everywhere for their own sake.
- **Match complexity to the vision.** Maximalist directions need elaborate execution; minimalist directions need precision in spacing, type, and detail. Elegance is executing the chosen direction well, not adding more.
- **Color & theme:** commit to a cohesive palette (4–6 named hex values) with dominant colors and sharp accents, rather than timid evenly-distributed color. No gradients (hard constraint 3) — use flat, deliberate color relationships instead to create depth and hierarchy.
- **Spatial composition:** don't default to predictable centered-card grids. Consider asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space or controlled density — whatever the subject calls for.
- **Backgrounds & atmosphere:** create depth and mood rather than defaulting to a flat solid backdrop alone — this is where the required real-world photographic image (hard constraint 6) and any idle background motion (hard constraint 5) do their work together.

### Process: plan, critique, build, critique again

For calibration, generic AI-generated design clusters around a few tells: a warm cream background (~#F4F1EA) with a high-contrast serif and a terracotta accent; a near-black background with one bright acid-green or vermilion accent; broadsheet layouts with hairline rules and dense newspaper columns; and gradient accents used as a default hero treatment. These are defaults, not choices — avoid reaching for them just because they're safe. Where the user's brief pins down a direction, follow it exactly.

Work in two passes:
1. **Plan first.** Sketch a compact token system: Color (4–6 named hex values), Type (2+ typefaces and their roles), Layout (one-sentence concepts + ASCII wireframes to compare options), and Signature (the one unique element this build will be remembered by).
2. **Review the plan against the brief** before writing code. If any part reads like the generic default for any similar page, revise it and note what changed and why. Only then start building, deriving every color/type decision from the reviewed plan.

Watch CSS selector specificity when building — type-based selectors (`.section`) and element-based selectors (`.cta`) can cancel each other out, especially around section padding/margins.

Do most of this planning and iteration before showing drafts — only surface ideas once there's real confidence they'll land well.

### Restraint and self-critique

Spend boldness in one place: let the signature element be the memorable thing, keep everything around it quiet and disciplined, and cut decoration that doesn't serve the brief. Not taking a risk can be its own risk. Build to a quality floor without announcing it: responsive down to mobile, visible keyboard focus, reduced motion respected. Take screenshots to critique the work as it's built where possible. Before shipping, look for one thing to remove (Chanel's rule: remove one accessory before leaving the house).

### Writing in design

Words are design material, not decoration — treat copy with the same intentionality as spacing and color.

- Write from the end user's side of the screen: name things by what people control and recognize, not by system internals. "Notifications," not "webhook config."
- Use active voice by default: a control says exactly what happens when used ("Save changes," not "Submit"). Keep the same name for an action through the whole flow — a "Publish" button produces a "Published" toast.
- Treat failure and empty states as moments for direction, not mood: explain what happened and how to fix it, in the interface's voice. Errors don't apologize and are never vague. An empty screen is an invitation to act.
- Keep tone conversational and tuned to the brand/audience: plain verbs, sentence case, no filler. Each element does exactly one job.
