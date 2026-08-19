import { useEffect, useRef } from 'react';
import { Sparkle } from 'lucide-react';

/**
 * Custom cursor: a sparkle glyph that tracks the pointer over plain page
 * content, replacing the native arrow (see index.css's `.no-native-cursor`
 * rule, which only affects elements that don't already declare their own
 * `cursor` — i.e. everything EXCEPT buttons/links/inputs/anything tagged
 * `cursor-pointer`). This component hides itself over exactly those same
 * elements, by asking the browser what it would already render there
 * (`getComputedStyle(target).cursor`) rather than hand-maintaining a second
 * list of "interactive" selectors that could drift out of sync with the
 * CSS — so hovering a button/link/input/select/textarea shows that
 * element's own standard native shape (pointer, text caret, etc.) instead
 * of the sparkle.
 *
 * Position is written directly to a ref's transform on every pointermove —
 * no React state/re-render per frame, matching this project's other
 * cursor-adjacent code (cursorGlow.ts) which does the same for the same
 * reason. The interactive-or-not check only re-runs when the hovered
 * element actually changes (not on every pixel of motion), since
 * getComputedStyle forces a style recalculation.
 *
 * Real mouse/trackpad input only. `(pointer: fine)` gates the CSS side
 * (`.no-native-cursor`, toggled below), but that's a device-level media
 * query — a hybrid touchscreen laptop still matches it even while the user
 * is actively touching the screen. So `onMove` ALSO checks `e.pointerType`
 * per event: touch (and pen) pointermoves are ignored outright rather than
 * moving/showing the glyph and then hiding it again, which is what caused
 * it to visibly glitch under a fingertip on touch devices.
 */
export default function SparkleCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const el = dotRef.current;
    if (!el) return;

    const sync = () => {
      document.documentElement.classList.toggle('no-native-cursor', fine.matches);
    };
    sync();
    fine.addEventListener('change', sync);

    let lastTarget: Element | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const target = e.target as Element | null;
      if (target !== lastTarget) {
        lastTarget = target;
        // `none` is what index.css's inherited baseline computes to; any
        // other value means this element (or an ancestor closer than
        // <html>) declared its own real cursor, so let it show instead.
        const nativeCursor = target ? getComputedStyle(target).cursor : 'none';
        el.style.opacity = nativeCursor === 'none' ? '1' : '0';
      }
    };
    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      fine.removeEventListener('change', sync);
      document.documentElement.classList.remove('no-native-cursor');
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[2147483647]"
      style={{
        pointerEvents: 'none',
        opacity: 0,
        transition: 'opacity 0.2s ease',
        willChange: 'transform',
        transform: 'translate3d(-100px, -100px, 0)',
        marginLeft: -12,
        marginTop: -12,
        filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45))',
      }}
    >
      <Sparkle size={24} fill="#FFFFFF" color="#3a4734" strokeWidth={2} />
    </div>
  );
}
