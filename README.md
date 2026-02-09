# KAMI Tree – UI/UX Improvements

## Highlights
- **Cleaner toolbar** with Focus/Full toggle, compact menus, and search hint (`/`).
- **Focus Mode** default with Parents/Spouses/Children sections and quick expand.
- **Full Tree** stays virtualized and fast with branch controls and breadcrumb chips.
- **Search overlay on mobile** for easier typing.
- **Action sheet on mobile** (menu icon) for View/Export/Insights.
- **Detail drawer** (right desktop, bottom mobile) with quick jump chips.
- **Insights panel** collapsible with compact legend.
- **Export** via dropdown menu (PNG / PDF).

## Keyboard Shortcuts
- `/` focus search (mobile opens overlay)
- `Esc` close drawer/search/menus

## Components
- `renderFocusView()` – focus hub
- `renderFullTree()` – virtualized list + lazy expansion
- `renderSearchResults()` – desktop dropdown + mobile overlay
- `exportToPng()` / `exportToPdf()` – export current view

## Mobile UX
- Toolbar simplified, search overlay full-screen.
- Drawer becomes bottom sheet.
- Insights becomes bottom sheet.
- Action sheet groups secondary controls.
