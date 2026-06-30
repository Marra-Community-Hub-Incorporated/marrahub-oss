# MarraHub Design System — how to build with it

A small React design system for the Marra Community Hub website (a non-profit community
centre in Glen Eira). Warm, human, editorial. Brand palette: deep green `--primary`
(#1e453a), terracotta `--secondary` (#b05e45), golden-sand `--accent` (#d4a574), on a warm
off-white `--background` (#fdfcfb). Serif display type, clean sans body.

## Setup (required)

- **Load `styles.css`.** It is the single entry point for all styling — it pulls in the
  design tokens, the brand fonts (Inter for body, Ibarra Real Nova for headings, loaded
  from Google Fonts), and every component's styles. Without it, components render unstyled.
- **Wrap your page in a router.** `Button` (when given `href`), `Header`, and `Footer`
  render react-router `<Link>` and read the current route. Wrap your app/page in a
  react-router router or they throw a missing-context error:
  ```tsx
  import { BrowserRouter } from 'react-router';
  <BrowserRouter><YourPage /></BrowserRouter>
  ```

## Styling idiom — Tailwind v4 + CSS-variable tokens

Style with **Tailwind utility classes backed by design tokens** — never hard-coded hex.
Use these brand utilities (all verified present in the bundle) for your own layout glue so
it matches the components:

| Purpose | Classes |
|---|---|
| Surfaces | `bg-background` `bg-card` `bg-muted` `bg-primary` `bg-secondary` `bg-accent` |
| Text | `text-foreground` `text-muted-foreground` `text-primary` `text-secondary` `text-accent` `text-primary-foreground` `text-secondary-foreground` |
| Borders | `border-border` `border-primary` `border-secondary` |
| Type | `font-serif` (headings) · `font-sans` (body) · sizes `text-xl` `text-2xl` `text-3xl` |
| Radius | `rounded-xl` `rounded-2xl` `rounded-3xl` |

For custom CSS, the raw tokens are available as variables: `var(--primary)`,
`var(--secondary)`, `var(--accent)`, `var(--muted)`, `var(--foreground)`,
`var(--muted-foreground)`, `var(--card)`, `var(--border)`, `var(--radius)`,
`var(--font-serif)`, `var(--font-sans)`. Headings (`h1`–`h4`) are already `font-serif` and
green by default. Don't introduce new fonts, hex colors, or `Inter`/`Roboto`/system-font
defaults — stay on the tokens above.

## Where the truth lives

- **`styles.css`** (and the `_ds_bundle.css` it imports) — the full token + utility set.
- Each component's **`<Name>.d.ts`** is its exact prop contract; **`<Name>.prompt.md`** shows
  how to use it. Read these before composing a component.

## Components

`Button` · `CTABanner` · `Header` · `Footer` · `SectionHeader` · `ImpactCard` · `ProgramCard`.
Compose pages from these rather than rebuilding their markup.

## Idiomatic example

```tsx
import { BrowserRouter } from 'react-router';
import { SectionHeader, ProgramCard, CTABanner } from '<the design system>';
import { Sprout, BookOpen } from 'lucide-react';

<BrowserRouter>
  <section className="bg-background py-20">
    <div className="max-w-6xl mx-auto px-6">
      <SectionHeader subtitle="What we do" title="Our programs"
        description="Built around the real needs of the community." />
      <div className="grid md:grid-cols-2 gap-8">
        <ProgramCard icon={Sprout} title="Community Garden"
          description="A shared green space for neighbours to grow food together." />
        <ProgramCard icon={BookOpen} title="Homework Club"
          description="Free after-school tutoring and mentoring."
          outcomes={['Improved literacy', 'A safe place to study']} />
      </div>
      <div className="mt-16">
        <CTABanner title="Be part of something bigger"
          description="Join a growing community making Glen Eira more connected."
          primaryButtonText="Get involved" primaryButtonHref="/contact" />
      </div>
    </div>
  </section>
</BrowserRouter>
```

Card components (`ImpactCard`, `ProgramCard`) take a lucide-react icon component as the
`icon` prop. `ImpactCard` shows the icon instead of its `number` when an icon is given.
