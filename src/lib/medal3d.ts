// The footer logo as a real 3D object, for its spin (see medalView.ts and
// components/MedalLogo.tsx): the logo PNG is traced into outlines and
// extruded into a solid with three.js. Every stroke — the ring, the leaves,
// the eye — gets continuous side walls, so the medal reads as one thick,
// solid object at every angle, while the open line-art stays see-through
// (from behind you see the logo mirrored, as through clear acrylic).
//
// This module is loaded on demand (dynamic import) and only drawn during a
// spin; at rest the page shows the plain <img>. The front face is drawn
// unlit in the PNG's own colour, at exactly the <img>'s size and position,
// so swapping the two at the start/end of a spin is invisible.

import {
  AmbientLight,
  DirectionalLight,
  ExtrudeGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  Scene,
  Shape,
  Vector2,
  WebGLRenderer,
} from 'three';

/** Thickness, as a fraction of the logo's height (12px on the 192px desktop logo). */
const DEPTH_RATIO = 0.0625;
/** Same viewing distance as the CSS spin used. */
const PERSPECTIVE_PX = 900;
const FACE_COLOR = '#e2e1b1'; // the PNG's own colour, rgb(226, 225, 177)
const SIDE_COLOR = '#9c9a74';

export interface Medal3D {
  /** Draw the medal turned `deg` degrees around its vertical axis, with
   *  perspective at `depth` strength (0 = none: seen from infinitely far,
   *  so face-on it matches the flat <img> exactly; 1 = the full 900px). */
  render(deg: number, depth: number): void;
  dispose(): void;
}

type Pt = [number, number];

// ---------------------------------------------------------------------------
// Tracing: marching squares on the alpha channel (50% contour, interpolated
// to sub-pixel accuracy), giving closed outline loops in image pixels.
// ---------------------------------------------------------------------------

// Segments per cell case (corner bits: TL 8, TR 4, BR 2, BL 1), each oriented
// with the opaque side on its right, so outer outlines and holes come out
// with opposite windings. Saddle cells (5, 10) depend on the cell centre:
// [centre opaque, centre clear].
type Edge = 'T' | 'R' | 'B' | 'L';
const SEGMENTS: Partial<Record<number, [Edge, Edge][]>> = {
  1: [['L', 'B']],
  2: [['B', 'R']],
  3: [['L', 'R']],
  4: [['R', 'T']],
  6: [['B', 'T']],
  7: [['L', 'T']],
  8: [['T', 'L']],
  9: [['T', 'B']],
  11: [['T', 'R']],
  12: [['R', 'L']],
  13: [['R', 'B']],
  14: [['B', 'L']],
};
const SADDLES: Partial<Record<number, [[Edge, Edge][], [Edge, Edge][]]>> = {
  5: [[['L', 'T'], ['R', 'B']], [['R', 'T'], ['L', 'B']]],
  10: [[['T', 'R'], ['B', 'L']], [['T', 'L'], ['B', 'R']]],
};

function traceOutlines(alpha: Uint8ClampedArray, w: number, h: number): Pt[][] {
  const LEVEL = 127.5;
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= w || y >= h ? 0 : alpha[(y * w + x) * 4 + 3];

  // Edge ids: horizontal edge (x,y)–(x+1,y) and vertical edge (x,y)–(x,y+1).
  const hId = (x: number, y: number) => ((y + 1) * (w + 2) + (x + 1)) * 2;
  const vId = (x: number, y: number) => hId(x, y) + 1;
  const crossing = (x0: number, y0: number, x1: number, y1: number): Pt => {
    const a = at(x0, y0);
    const t = (LEVEL - a) / (at(x1, y1) - a);
    // +0.5: pixel values sit at pixel centres
    return [x0 + (x1 - x0) * t + 0.5, y0 + (y1 - y0) * t + 0.5];
  };

  const next = new Map<number, number>();
  const where = new Map<number, Pt>();
  for (let y = -1; y < h; y++) {
    for (let x = -1; x < w; x++) {
      const tl = at(x, y);
      const tr = at(x + 1, y);
      const br = at(x + 1, y + 1);
      const bl = at(x, y + 1);
      const cell =
        (tl >= LEVEL ? 8 : 0) | (tr >= LEVEL ? 4 : 0) | (br >= LEVEL ? 2 : 0) | (bl >= LEVEL ? 1 : 0);
      if (cell === 0 || cell === 15) continue;
      const saddle = SADDLES[cell];
      const segs = saddle ? saddle[(tl + tr + br + bl) / 4 >= LEVEL ? 0 : 1] : SEGMENTS[cell]!;
      const id = (e: Edge) => {
        if (e === 'T') {
          const k = hId(x, y);
          if (!where.has(k)) where.set(k, crossing(x, y, x + 1, y));
          return k;
        }
        if (e === 'B') {
          const k = hId(x, y + 1);
          if (!where.has(k)) where.set(k, crossing(x, y + 1, x + 1, y + 1));
          return k;
        }
        if (e === 'L') {
          const k = vId(x, y);
          if (!where.has(k)) where.set(k, crossing(x, y, x, y + 1));
          return k;
        }
        const k = vId(x + 1, y);
        if (!where.has(k)) where.set(k, crossing(x + 1, y, x + 1, y + 1));
        return k;
      };
      for (const [from, to] of segs) next.set(id(from), id(to));
    }
  }

  const loops: Pt[][] = [];
  const done = new Set<number>();
  for (const start of next.keys()) {
    if (done.has(start)) continue;
    const loop: Pt[] = [];
    let k: number | undefined = start;
    while (k !== undefined && !done.has(k)) {
      done.add(k);
      loop.push(where.get(k)!);
      k = next.get(k);
    }
    if (loop.length >= 3) loops.push(loop);
  }
  return loops;
}

/** Ramer–Douglas–Peucker on an open polyline (endpoints kept). */
function simplify(pts: Pt[], eps: number): Pt[] {
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const len = Math.hypot(bx - ax, by - ay) || 1;
    let worst = -1;
    let worstD = eps;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - pts[i][1]) - (ax - pts[i][0]) * (by - ay)) / len;
      if (d > worstD) {
        worstD = d;
        worst = i;
      }
    }
    if (worst > 0) {
      keep[worst] = 1;
      stack.push([a, worst], [worst, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

/** RDP for a closed loop: split at the point farthest from the start. */
function simplifyLoop(loop: Pt[], eps: number): Pt[] {
  let far = 0;
  let farD = -1;
  for (let i = 1; i < loop.length; i++) {
    const d = (loop[i][0] - loop[0][0]) ** 2 + (loop[i][1] - loop[0][1]) ** 2;
    if (d > farD) {
      farD = d;
      far = i;
    }
  }
  const a = simplify(loop.slice(0, far + 1), eps);
  const b = simplify([...loop.slice(far), loop[0]], eps);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

/** Shoelace area in image coordinates: > 0 for outlines, < 0 for holes
 *  (given the opaque-on-the-right winding from traceOutlines). */
function area(loop: Pt[]): number {
  let s = 0;
  for (let i = 0; i < loop.length; i++) {
    const [x1, y1] = loop[i];
    const [x2, y2] = loop[(i + 1) % loop.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

function contains(loop: Pt[], [px, py]: Pt): boolean {
  let inside = false;
  for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
    const [xi, yi] = loop[i];
    const [xj, yj] = loop[j];
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Outlines → three.js shapes (each outline with the holes directly inside it). */
function toShapes(loops: Pt[][], w: number, h: number): Shape[] {
  const toV = ([x, y]: Pt) => new Vector2(x - w / 2, h / 2 - y); // centred, y up
  const items = loops
    .map((pts) => ({ pts, a: area(pts) }))
    .filter((l) => Math.abs(l.a) >= 3); // drop specks
  const outers = items.filter((l) => l.a > 0).sort((p, q) => p.a - q.a); // smallest first
  const shapes = new Map(outers.map((o) => [o, new Shape(o.pts.map(toV))]));
  for (const hole of items.filter((l) => l.a < 0)) {
    const parent = outers.find((o) => contains(o.pts, hole.pts[0]));
    if (parent) shapes.get(parent)!.holes.push(new Path(hole.pts.map(toV)));
  }
  return [...shapes.values()];
}

const nextIdle = () =>
  new Promise<void>((resolve) => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => resolve(), { timeout: 1500 });
    else setTimeout(resolve, 30);
  });

/**
 * Build the 3D medal for `img` (the logo <img>), drawing into `canvas` —
 * which must be centred on the img and at least as big (its overhang is room
 * for the near edge growing in perspective mid-turn). render() needs the
 * canvas displayed, since it measures both boxes. Returns null when WebGL
 * isn't available or the image can't be traced; callers then keep the plain
 * CSS spin.
 */
export async function buildMedal(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
): Promise<Medal3D | null> {
  // Trace from a fresh copy (same URL, so it comes from cache): the page's
  // own <img> is loading="lazy" and may not have loaded yet.
  const source = new Image();
  source.src = img.currentSrc || img.src;
  await source.decode();
  await nextIdle(); // the trace + WebGL setup is ~tens of ms: keep it off busy frames
  const w = source.naturalWidth;
  const h = source.naturalHeight;
  const scratch = document.createElement('canvas');
  scratch.width = w;
  scratch.height = h;
  const ctx = scratch.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(source, 0, 0);
  const loops = traceOutlines(ctx.getImageData(0, 0, w, h).data, w, h).map((l) =>
    simplifyLoop(l, 0.3),
  );
  const shapes = toShapes(loops, w, h);
  if (!shapes.length) return null;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    });
  } catch {
    return null; // no WebGL
  }
  renderer.setClearColor(0x000000, 0);

  const depth = h * DEPTH_RATIO;
  const geometry = new ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 1,
  });
  geometry.translate(0, 0, -depth / 2); // centred, so it turns around its middle
  // Group 0 = front/back faces (unlit: exactly the PNG's colour, like the
  // <img>); group 1 = side walls (lit, so they read as solid depth).
  const faces = new MeshBasicMaterial({ color: FACE_COLOR });
  const sides = new MeshStandardMaterial({ color: SIDE_COLOR, roughness: 0.55, metalness: 0.1 });
  const medal = new Mesh(geometry, [faces, sides]);
  medal.position.z = -depth / 2; // front face on z = 0 — the <img>'s plane

  const keyLight = new DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(-1, 1.4, 2); // above-left, in front
  const scene = new Scene();
  scene.add(medal, keyLight, new AmbientLight(0xffffff, 0.6));

  // Camera: the z = 0 plane maps 1:1 onto the page — the image lands exactly
  // on the <img>'s box, the rest of the canvas is overhang — seen from the
  // CSS spin's 900px at full perspective. Weaker perspective = a farther
  // camera with a narrower view, so that plane stays put while the depth
  // effect fades: at 0 the sides are exactly edge-on when face-on, the way
  // the flat <img> looks (a real near camera would already show slivers of
  // the inner walls).
  const camera = new PerspectiveCamera();
  const reach = Math.hypot(w, h) / 2 + depth; // furthest the medal extends from its pivot
  let unitsPerPx = 0; // image px per CSS px
  let viewH = 0; // canvas height, in image px
  let laidOutFor = '';
  const layout = () => {
    // Exact fractional CSS sizes (clientWidth/Height would round, skewing
    // the 1:1 mapping by a fraction of a pixel).
    const imgH = img.getBoundingClientRect().height;
    const { width: canvasW, height: canvasH } = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const size = `${canvasW.toFixed(2)}x${canvasH.toFixed(2)}/${imgH.toFixed(2)}@${dpr}`;
    if (!imgH || !canvasH || size === laidOutFor) return;
    laidOutFor = size;
    renderer.setPixelRatio(dpr);
    renderer.setSize(canvasW, canvasH, false);
    unitsPerPx = h / imgH;
    viewH = canvasH * unitsPerPx;
    camera.aspect = canvasW / canvasH;
  };

  // Warm-up while still idle (the canvas is hidden): compiling the shaders
  // and uploading the mesh happen on the first draw, which would otherwise
  // be the first frame of the first spin — a visible hitch on a phone.
  renderer.compile(scene, camera);
  renderer.render(scene, camera);

  return {
    render(deg, strength) {
      layout(); // cheap no-op unless the logo's size or the zoom changed
      if (!unitsPerPx) return;
      const distance = (PERSPECTIVE_PX * unitsPerPx) / Math.max(strength, 0.02);
      camera.fov = (2 * Math.atan(viewH / 2 / distance) * 180) / Math.PI;
      camera.near = distance - reach;
      camera.far = distance + reach;
      camera.position.set(0, 0, distance);
      camera.updateProjectionMatrix();
      medal.rotation.y = (deg * Math.PI) / 180;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      faces.dispose();
      sides.dispose();
      renderer.dispose();
    },
  };
}
