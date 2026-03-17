## Webpocalypse Frontend Best Practices

- **Folder structure**
  - `app/page.tsx`: only wires up and renders page-level components (no business logic).
  - `components/page/*`: page-level components and layouts composed from smaller UI components.
  - `components/ui/*`: reusable, presentation-only UI primitives (buttons, cards, inputs, icons, etc.).
  - `components/*`: feature components that are mostly presentational and consume hooks for behavior.
  - `hooks/*`: all stateful and business logic for components and pages (data fetching, state machines, side effects, formatting helpers).
  - `types/*`: shared TypeScript types and interfaces.
  - `docs/*`: architecture, conventions, and decision records for the project.

- **page.tsx rules**
  - **Render only**: `app/page.tsx` must not contain React state, effects, or business logic.
  - **Single responsibility**: it should import a page component from `components/page` and return JSX.
  - **No side effects**: network calls, DOM access, and complex computations must live in hooks.

- **Component rules (`*.tsx`)**
  - **Rendering focus**: components describe UI structure and styling using props and hook outputs.
  - **Use hooks for logic**: any non-trivial state management, API calls, data transforms, or imperative DOM work belongs in a hook under `hooks/`.
  - **Props over globals**: components receive all data and callbacks via props or from their dedicated hooks, not from ad-hoc globals.
  - **Composition first**: prefer composing small focused components rather than creating large, monolithic ones.
  - **Pure where possible**: keep components as close to pure functions of props as practical; avoid hidden side effects.

- **Hook rules (`hooks/*`)**
  - **One concern per hook**: each hook should own a coherent piece of behavior (e.g. conversion flow, stats formatting, upload handling).
  - **Export minimal API**: return only the state, derived values, and callbacks that the UI needs.
  - **Encapsulate side effects**: network requests, timers, subscriptions, and event listeners live inside hooks, not components.
  - **Testing-friendly**: make hooks deterministic and easy to test by isolating I/O and exposing clear inputs/outputs.
  - **Naming**: hook names start with `use` and describe intent, e.g. `useWebpocalypse`, `useConversionSettings`.

- **State and data flow**
  - **Lift state thoughtfully**: keep state as close as possible to where it is used while avoiding duplication.
  - **Derived state in hooks**: compute derived values (flags like `isProcessing`, formatted stats, etc.) inside hooks instead of re-deriving them in multiple components.
  - **Immutable updates**: always use immutable patterns when updating state to keep React behavior predictable.

- **API and side-effect guidelines**
  - **Centralize API calls**: put fetch/axios logic in hooks or dedicated data utilities, not directly in components.
  - **Error handling**: hooks are responsible for mapping raw errors into UI-friendly flags/messages that components can render.
  - **Resource cleanup**: hooks that create resources (object URLs, subscriptions, listeners) must clean them up when appropriate.

- **Styling and UI**
  - **Tailwind-first**: use Tailwind utility classes and project tokens defined in `globals.css` for layout and theming.
  - **Consistent tokens**: prefer semantic colors (`bg-card`, `text-muted-foreground`, etc.) over raw hex codes in components.
  - **Accessibility**: ensure interactive elements have clear focus states, labels, and appropriate ARIA attributes when needed.

- **Scalability and organization**
  - **Feature-oriented structure**: as the app grows, group hooks, components, and types by feature (e.g. `conversion`, `upload`) while keeping shared primitives in `components/ui` and `hooks/`.
  - **Avoid duplication**: extract repeated UI patterns into shared components and repeated logic into hooks/utilities early.
  - **Document decisions**: when introducing new patterns or architectural decisions, add a short note under `docs/` so future changes stay consistent.

