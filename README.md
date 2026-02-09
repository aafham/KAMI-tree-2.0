# KAMI Tree – Refactor Notes

## New Architecture (Focus vs Full Tree)

- **Focus Mode**: Renders a compact relationship hub around one person (Parents, Spouses, Children). Only 1–2 levels are shown by default; users can expand ancestors/descendants progressively.
- **Full Tree Mode**: Vertical descendant list with lazy expansion per branch. Uses a lightweight virtualized list to avoid rendering all nodes at once.
- **Search & Jump**: Search is always available in the toolbar. Selecting a person centers them in Focus Mode and opens the detail drawer.
- **Detail Drawer**: Single drawer (right on desktop, bottom on mobile) that shows profile and relationships with CTA to open branch.
- **Insights Panel**: Collapsible panel (right on desktop, bottom drawer on mobile).

## Key Components

- `renderFocusView()` – Focus Mode renderer
- `renderFullTree()` – Full Tree list renderer with lazy expansion
- `fetchDataJson()` – robust data loader for GitHub Pages
- `buildIndex()` – builds relationship maps (parents/spouses/children)

## Performance Strategies

- **Lazy expansion**: children are only rendered when expanded.
- **Virtualized list**: Full Tree only renders visible rows with overscan.
- **Memoized list**: flattened list stored in `state.listCache`.

## Shortcuts

- `/` focus search
- `Esc` close drawer / error modal
- `C` center selected

