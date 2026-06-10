# Product Requirements Document — Elemental Wizards

## 1. Overview

**Elemental Wizards** is a browser-based, top-down action-RPG built entirely in HTML/CSS/Canvas 2D (no framework, no build step). Players choose a magical element, wash ashore in a dangerous world, and fight their way through 40 campaign zones to defeat four elemental bosses and reach Ascension.

**Current state:** Playable single-player game running in-browser via a static file server.  
**Target players:** Casual to mid-core RPG fans, ages 10+. Intended for family/friend play sessions.

---

## 2. Core Pillars

| Pillar | Description |
|---|---|
| **Pick up and play** | No install, players have their accounts. Share a URL and start playing in seconds. |
| **Elemental identity** | Your chosen element shapes your attacks, skill tree, loot, and visual style throughout the entire run. |
| **Satisfying progression** | Levels, gear, skill gems, and a branching skill tree give constant upgrades. |
| **Atmospheric world** | Each of the 4 acts has distinct biomes, music mood, and monster themes. |

---

## 3. Player Experience Flow

```
Login screen (choose element + name)
        ↓
Beach intro zone (wake-up sequence, receive starter wand + gem)
        ↓
Town Hub (shop, quests, skill tree, NPC dialogue)
        ↓
Act I  — 9 zones → Boss: "The Water, Failed to Take Shape"
        ↓
Act II — 9 zones → Boss: "Uncontrolled Fire"
        ↓
Act III — 9 zones → Boss: "The Iced Automaton"
        ↓
Act IV — 9 zones → Boss: "The Thunder Manifestation"
        ↓
Ascension (level 50+) → Endgame Map System (tiered maps, infinite scaling)
```

---

## 4. Feature Requirements

### 4.1 Character System

| Feature | Status | Notes |
|---|---|---|
| 4 elements: Water, Fire, Electric, Ice | ✅ Done | Each has unique cloak/head/glow colors and element-specific wands + gems |
| Player name input | ✅ Done | Set on login screen, passed via URL query param |
| Level 1–100 with XP scaling | ✅ Done | XP-to-next grows 1.5× per level |
| Skill points on level up | ✅ Done | Spend in skill tree |
| Stats: HP, Strength, Speed, Fire/Water/Ice/Elec Dmg, Defense, Regen, Crit, Range | ✅ Done | |
| Ascension at level 50 | ✅ Done | Unlocks Map Portal |

### 4.2 Combat

| Feature | Status | Notes |
|---|---|---|
| Auto-attack (proximity) | ✅ Done | |
| Skill gems (Space / 1 / 2 / 3) | ✅ Done | Socketed into wands; each has cooldown |
| Skill gem types: Meteor Storm, Ice Lance, Thunder Bolt, Tidal Wave, + more | ✅ Done | |
| Monster AI: idle wander → chase → attack | ✅ Done | |
| Monster death / drop system | ✅ Done | |
| Boss monsters (one per act) with scaling HP/ATK | ✅ Done | Unique drop tables |
| Town guardian boss | ✅ Done | |
| YOU DIED screen + respawn at town | ✅ Done | |

### 4.3 Zones & World

| Feature | Status | Notes |
|---|---|---|
| Beach intro zone | ✅ Done | Unique wake-up cutscene |
| Town hub with sub-zones (Square, Market, Garden, Residential, Tower) | ✅ Done | |
| 40 campaign zones (4 acts × 10, including 1 boss arena per act) | ✅ Done | |
| Procedurally varied maps per zone (beach, forest, ember, tundra, storm biomes) | ✅ Done | Hash-based seeding |
| Zone-to-zone transitions with fade animation | ✅ Done | |
| Zone announcements (name toast) | ✅ Done | |
| Endgame map system (tiered 1/5/10/15/20) | ✅ Done | |
| Zone atmosphere colors and overlays | ✅ Done | Per-act darkening |

### 4.4 Inventory & Items

| Feature | Status | Notes |
|---|---|---|
| Equipment slots: Helmet, Chestplate, Leggings, Shoes, Wand×2 | ✅ Done | |
| Bag (unlimited items) | ✅ Done | |
| Item rarities: Normal, Magic, Rare | ✅ Done | Color-coded |
| Gem socketing into wands | ✅ Done | |
| Currency orbs: Chaos, Exalt, Mirror, Control | ✅ Done | Modify item stats |
| Shop NPC (buy items with gold) | ✅ Done | |
| Ground drops with timer | ✅ Done | |

### 4.5 Skill Tree

| Feature | Status | Notes |
|---|---|---|
| Per-element skill trees | ✅ Done | Branching node layout |
| Stat nodes (HP, STR, SPD, element damage, etc.) | ✅ Done | |
| Visual skill tree overlay (Tab key) | ✅ Done | |
| Tier 1 and Tier 2 nodes | ✅ Done | |

### 4.6 Quests

| Feature | Status | Notes |
|---|---|---|
| Act-based quest log | ✅ Done | Q key |
| Quest rewards: Gold, XP, items | ✅ Done | |
| Quest tracking (zones visited, kills, bosses) | ✅ Done | |

### 4.7 UI / HUD

| Feature | Status | Notes |
|---|---|---|
| Minimap with player dot, NPC dots, enemy dots | ✅ Done | |
| HP / XP / Gold bars | ✅ Done | |
| Skill bar (3 gem slots with cooldown timers) | ✅ Done | |
| Zone label on minimap | ✅ Done | |
| Inventory overlay (I key) | ✅ Done | |
| Guide path line to next objective | ✅ Done | Animated dashed line |
| Controls legend at bottom of screen | ✅ Done | |

---

## 5. Known Issues / Backlog

### Bugs
- **Wake sequence visual** — When barrels land and the player awakens, the transition is abrupt. The player character (small colored circle) is hard to notice. *Partial fix applied (fade + ring flash), needs further testing.*
- **Server redirect drops query string** — `npx serve` redirects `/world.html?p=1&name=X` to `/world` and loses the query params. Player always defaults to Fire Mage / name "Mage" unless URL is typed directly as `/world?p=1&name=X`.

### Feature Gaps
| Priority | Feature | Description |
|---|---|---|
| High | **Sound / Music** | No audio at all. Background music per act + hit/cast/level-up SFX would greatly improve feel. |
| High | **Save system** | Progress is lost on page refresh. LocalStorage save would let players continue across sessions. |
| Medium | **Mobile / touch controls** | D-pad + buttons overlay for phones. |
| Medium | **Multiplayer** | Co-op with 2–4 players (same screen or via WebSocket). |
| Medium | **More skill gems** | Currently ~12 gems. Add 20+ for more build variety per element. |
| Medium | **Arena mode** | arena.html exists but integration with main progression is unclear. |
| Low | **Animated sprites** | Players and monsters are circles. Pixel-art sprites would improve immersion. |
| Low | **Dialogue system** | NPCs currently just open shop/quest screens. Story text per NPC. |
| Low | **Settings menu** | Volume, controls, difficulty. |
| Low | **Achievements** | Tracked milestones with cosmetic rewards. |

---

## 6. Technical Architecture

| Layer | Technology |
|---|---|
| Rendering | HTML5 Canvas 2D (no WebGL) |
| Logic | Vanilla JavaScript (no framework) |
| Fonts | Google Fonts — Cinzel (titles), Rajdhani (body) |
| Tile map | 64×64 grid, 32px tiles, hash-based procedural generation |
| State | All in-memory (no backend, no database) |
| Serving | `npx serve` or any static file server |
| Hosting | Render.com (render.yaml present) or self-hosted |

---

## 7. Out of Scope (v1)

- Server-side state / leaderboards
- Microtransactions
- Account system / login
- Third-party analytics

---

## 8. Success Metrics

| Metric | Target |
|---|---|
| New player can reach Town Hub | Within 5 minutes of first load |
| A full Act I clear | Under 30 minutes for a new player |
| Full 4-act campaign | 3–5 hours playtime |
| Page load time | Under 2 seconds on Wi-Fi |
