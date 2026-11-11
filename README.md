# VisualDSA 
### Visual Data Structures & Algorithms (DSA) Mastery Platform for Python

VisualDSA is a modern, high-performance interactive web application engineered specifically for students, bootcamps, and software engineering candidates to intuitively master Data Structures and Algorithms with synchronized line-by-line Python code tracing, bi-directional timeline scrubbing, and live complexity telemetry.

---

## ⚡ Tech Stack & Architecture

- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS with dark-mode optimized pedagogical palettes
- **Iconography:** Lucide React
- **Timeline Engine:** Generator / Step-State snapshot architecture
  - Pure, deterministic step generator: `VisualStep<TState>` yielding snapshots with `activeLine`, `pointers`, `highlights`, `metrics`, and plain-English explanations.
  - $O(1)$ random-access bi-directional timeline scrubbing (zero state recomputation on backward steps).
- **Interactive Visualizers:**
  - **Quick Sort & Merge Sort:** Animated columns with heights, dynamic Lomuto partition pointers (`low`, `high`, `pivot`, `i`, `j`), and auxiliary buffer views.
  - **Binary Search Tree (BST):** Interactive SVG layout canvas with real-time Node Insertion, Node Search, and In-Order Traversal sequence recorder.
  - **Binary Search:** Sorted array space elimination visualizer with dynamic `low`, `mid`, `high` pointers.
  - **Singly Linked List:** Interactive node and pointer traversal with three-pointer (`prev`, `curr`, `nxt`) reversal animation.

---

## 📂 Project Directory Structure

```
VisualDSA/
├── package.json               # Dependencies and scripts (React, Vite, Lucide, Tailwind)
├── tsconfig.json              # TypeScript compilation config
├── tsconfig.node.json
├── vite.config.ts             # Vite development & build setup
├── tailwind.config.js         # Custom colors, editor themes, animations
├── postcss.config.js
├── index.html                 # App shell with Google Fonts
├── public/
│   └── favicon.svg            # Custom AlgoVision icon
├── src/
│   ├── main.tsx               # App entrypoint
│   ├── App.tsx                # Main container & state coordinator
│   ├── index.css              # Custom scrollbars, glass panels, code pulse
│   ├── types/
│   │   ├── algorithm.ts       # VisualStep, Highlights, Playback types
│   │   └── dsa.ts             # DSATopic, Complexity, Snippets types
│   ├── data/
│   │   ├── topics.ts          # Complete DSA taxonomy (Sorting, Trees, Linear, Graphs, DP)
│   │   └── codeSnippets.ts    # Multi-language tabbed implementations (Python, C++, Java, JS)
│   ├── algorithms/
│   │   ├── sorting/
│   │   │   ├── quickSort.ts   # Lomuto partition step generator
│   │   │   ├── mergeSort.ts   # Divide & Conquer merge step generator
│   │   │   └── bubbleSort.ts  # Adjacent comparison & swap generator
│   │   ├── trees/
│   │   │   └── bst.ts         # BST SVG layout, Insert, Search, In-Order generators
│   │   ├── searching/
│   │   │   └── binarySearch.ts# Halving search interval generator
│   │   └── linear/
│   │       └── linkedList.ts  # Three-pointer reversal generator
│   ├── hooks/
│   │   ├── useVisualizer.ts   # Timeline playback, scrubber, speed controller
│   │   └── useKeyboardShortcuts.ts # Space, Arrows, R key bindings
│   └── components/
│       ├── common/
│       │   └── Badge.tsx
│       ├── layout/
│       │   ├── Navbar.tsx
│       │   ├── Sidebar.tsx    # Collapsible topic selector with instant search
│       │   └── SplitWorkspace.tsx # Split visualization stage & code tracing
│       ├── visualizers/
│       │   ├── SortingVisualizer.tsx
│       │   ├── BSTVisualizer.tsx
│       │   ├── BinarySearchVisualizer.tsx
│       │   └── LinkedListVisualizer.tsx
│       ├── panels/
│       │   ├── CodePanel.tsx       # Tabbed multi-language editor with active line sync
│       │   ├── ComplexityMeter.tsx # Best/Avg/Worst time & space badges + live metrics
│       │   ├── StepExplainer.tsx   # 2-line plain English breakdown
│       │   └── TheoryPanel.tsx     # Student takeaways & Python trainer tips
│       └── controls/
│           ├── PlaybackControls.tsx# Docked global playback controller
│           ├── SpeedSlider.tsx     # 0.25x to 3x multiplier
│           └── DataInputBar.tsx    # Random, Custom Input, and Edge Cases
```

---

### Setup & Running Locally

### 1. Install Node.js (if not already installed)
Ensure Node.js (v18 or higher) is installed on your computer.

### 2. Install Dependencies
```bash
cd VisualDSA
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser to [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## 🎮 Keyboard Shortcuts

- **Spacebar:** Play / Pause timeline execution
- **Right Arrow (`→`):** Step Forward by 1 frame
- **Left Arrow (`←`):** Step Backward by 1 frame
- **Key `R`:** Reset algorithm to initial state

---

## 🎨 Pedagogical Color Coding
- **Slate / Blue-gray:** Default elements at rest.
- **Amber / Yellow:** Active comparisons and pointer scans.
- **Rose / Red:** Swaps, write mutations, or boundary overwrites.
- **Cyan / Sky:** Active pivot or target node.
- **Emerald Green:** Finalized, sorted, or successfully visited elements.
