# KAMI Tree

## Features
- Focus View with Parents / Spouses / Children cards and expand depth.
- Full Tree view with virtualization, branch controls, filters, and zoom.
- Insights: totals, gender (inferred), cucu/cicit, upcoming birthday.
- Detail drawer with photo, note, age, and quick actions (Set as Focus, Open Branch, Copy Link).
- Export PNG / PDF with graceful fallback.
- Mobile search overlay and actions sheet.

## How to Use
- Use search (`/`) to jump to a person.
- Toggle Focus / Full Tree in the top bar.
- Full Tree: use filters, Branch Only, Expand/Collapse, and Zoom.
- Click a person to open the drawer, then choose Focus, Open Branch, or Copy Link.

## Keyboard Shortcuts
- `/` focus search (mobile opens overlay)
- `Esc` close drawer, search, menus, actions sheet, insights

## How to Test
1. Open `index.html` and check console for errors or warnings.
2. Use `/` to search and select a person; verify focus cards update.
3. Toggle Focus / Full Tree and confirm selection highlight in both views.
4. Test filters (Relation, Status, Ada Foto, Ada Nota) in Full Tree.
5. Toggle Branch Only, Expand All (note limit toast if large), Collapse All.
6. Zoom + / - / Reset Zoom and ensure scrolling stays stable.
7. Open the drawer and test Set as Focus, Open Branch, Copy Link (#pXX deep link).
8. Test Esc/backdrop closing for menu, actions sheet, drawer, insights.
9. On mobile width, confirm toolbar stacks, drawer scrolls, and insights panel is usable.
