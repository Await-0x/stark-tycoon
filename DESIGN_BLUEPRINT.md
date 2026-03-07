Stark Tycoon Client Implementation Guide (Blueprint Sci-Fi + MUI + 3D)
0) Goal

Create a super slick “blueprint architect” UI where the 3D board is the hero, MUI panels feel like holographic HUD overlays, and all interactions feel premium and responsive.

1) Design Pillars

P1. Blueprint World: dark background, thin grid lines, subtle scanlines/noise, cyan/indigo accents.
P2. 3D-first: board + buildings are 3D. UI is clean overlay (no clutter).
P3. Readable Systems: numbers, production, market cards are crystal clear.
P4. Microinteractions: hover glows, smooth transitions, “construction” animations.

2) Visual System (MUI Theme)
2.1 Color tokens (use exactly these names)

Create a theme.ts with these tokens:

bg.0 = near-black background (e.g. #070A12)

bg.1 = panel background (e.g. rgba(10, 16, 30, 0.72))

bg.2 = elevated panel (e.g. rgba(14, 22, 40, 0.82))

line.0 = blueprint line (e.g. rgba(110, 190, 255, 0.18))

line.1 = bright line (e.g. rgba(110, 190, 255, 0.32))

accent.cyan = cyan highlight

accent.violet = violet highlight

text.primary = near-white

text.secondary = cool gray-blue

Rule: Only 1 primary accent (cyan). Violet is secondary/rare.

2.2 Typography

Use a clean geometric font (e.g. Space Grotesk / Inter).

Enforce a strict scale:

H1: 28–32

H2: 18–20

Body: 14–15

Caption: 12–13

2.3 Component styling rules

Apply global MUI overrides:

Cards/Panels: glassy with border line

background: bg.1

border: 1px solid line.0

boxShadow: soft, not heavy

borderRadius: 16

Buttons: outlined blueprint style

default = outlined cyan border

primary action = filled but subtle

Tooltips: dark glass + thin border, no default MUI yellow

No big gradients. Keep it “technical blueprint”.

3) Layout Spec (Desktop-first, responsive later)
3.1 Primary layout

Use a 3-region layout:

Center (Hero): 3D Board Canvas (takes ~60–70% width)

Left Rail: Resources + production + timer + quick actions

Right Rail: Market (5 cards) + building details + buy CTA

Bottom Slim Bar: event feed / log (optional for MVP)

Rule: Market is always visible without scrolling (on desktop).

3.2 Information hierarchy

Top-left: Capital / Users / Research / Transactions (big)

Under it: production rates (small)

Right: market cards show building model thumbnail + costs

Click market card → opens details panel with upgrade list (if you have upgrades later)

4) 3D Integration (react-three-fiber)
4.1 Required packages

three

@react-three/fiber

@react-three/drei

4.2 Scene design

Camera (fixed, premium feel):

Perspective camera with a slight angle down at the board

Allow only:

gentle zoom (wheel)

gentle pan (right-click drag) OR disable pan for MVP

No free-fly controls

Lighting:

Keep lighting simple and stable:

1 ambient

1 directional

optional HDRI environment if performance permits

Board:

5×5 grid platform

Subtle emissive grid lines (blueprint look)

Hovered tile highlights with a thin cyan outline

4.3 Performance rules

Canvas should use frameloop="demand" and call invalidate() when state changes.

Buildings should be instanced if repeated models are common (optional MVP).

Prefer baked lighting in GLBs (Meshy export) when possible.

5) 3D Asset Pipeline (Meshy → GLB)
5.1 Model requirements (tell the model generator)

For each building GLB:

Consistent scale (same “footprint”)

Pivot at base center (so placement is easy)

Low poly (mobile friendly)

One consistent material style (matte + emissive accents)

Keep detail readable from zoomed-out

5.2 Asset naming conventions

Store in:
/public/models/buildings/{building_id}_{slug}.glb

Example:
/public/models/buildings/14_gaming_studio.glb

Maintain a buildings.ts registry mapping:

building_id

name

modelPath

costCapital

costUsers (if TX building)

effectText

type (capital/users/research/tx)

unique (bool)

5.3 Thumbnail strategy (important!)

For Market Cards, do NOT render full 3D in the card (expensive).
Instead:

pre-render a PNG thumbnail per building OR

render to texture once and cache (advanced)

MVP: ship with PNG thumbnails generated from the GLB in a small script/tool.

6) Interaction Design (Premium Feel)
6.1 Board interactions

Hover tile: outline + subtle glow

Hover building: highlight + show tooltip with name and production

Click empty tile + selected market card → buy and place

6.2 Buy flow (2-step)

Click market card to “arm” it (selected state)

Click board tile to place
Then show:

“construction” animation (scale 0.9 → 1.0, plus glow pulse)

toast event: “Placed {BuildingName}”

6.3 Market card states

Available

Selected

Cannot afford (dim)

Unique already owned (locked)

7) MUI Components to Build (Agent Checklist)
7.1 Core components

AppShell (layout)

ResourceTicker (big values + small /sec)

MarketPanel (list of 5)

MarketCard (thumbnail, name, costs, tags)

BuildingDetailsDrawer (optional MVP)

BoardCanvas (r3f)

TileHoverTooltip (minimal)

ToastFeed (snackbar stack)

7.2 Styling guidelines for MUI usage

Use sx sparingly; centralize styles in theme.components.

Use Paper for panels; Card for market cards.

Use Chip for tags like “TX”, “Capital”, “Unique”.

Use Dialog or Drawer for details.

8) Data & State (Client-side)
8.1 State structure

Use Zustand or a small reducer:

game: resources, productions, timestamps

market: ids, refresh time, countdown

board: buildings placed

ui: selectedMarketBuildingId, hover states

8.2 Rendering rules (avoid flicker)

Always derive displayed resource values from:

last known on-chain state + local tick extrapolation

Update from chain after each endpoint call:

start_game, buy_building, refresh_market, submit_score

9) Blueprint VFX Layer (2D only)

Add subtle global overlays:

Background grid (CSS)

Vignette

Very subtle noise/scanline (optional)

Glowing corners on panels (SVG border corners)

Rule: Effects must be subtle; clarity first.

10) Acceptance Criteria (Definition of “Slick”)

The agent is done when:

UI matches blueprint style: glass panels, thin lines, cyan accent.

Board is the hero and looks premium with gentle lighting and grid.

Buying a building feels great (animation + sound optional).

Market is readable and always visible.

Client runs smoothly (no heavy re-render loops, no jank).

3D assets load lazily and don’t block the initial UI.

11) Implementation Order (Fastest Path)

MUI theme + AppShell layout (static)

Market cards with thumbnails (static)

r3f board with grid + tile picking

Place dummy buildings (cubes) by ID

Swap cubes → GLB loader per building

Wire buy flow (select → place)

Add hover tooltips + toasts

Add polish (scanlines/noise, transitions)