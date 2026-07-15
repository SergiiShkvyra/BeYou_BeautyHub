// Decorative scrolling strip between Hero and Services. Repeats existing
// service names only — no new copy. Hidden from assistive tech and ignored
// by tests (spans, not headings).
const ITEMS = [
  'Signature Korean Lash lift',
  'Brow Lamination + Tweezing',
  'Mapping + tweezing',
  'L&L Combo Deluxe',
  'Lash Lift + Tinting',
];

const Strip = () => (
  <div className="flex items-center gap-10 pr-10 flex-shrink-0">
    {ITEMS.map((item) => (
      <span
        key={item}
        className="flex items-center gap-10 text-warm/90 text-xs font-semibold uppercase tracking-[0.3em] whitespace-nowrap"
      >
        {item}
        <span className="text-warm/40 text-base leading-none">✦</span>
      </span>
    ))}
  </div>
);

const Marquee = () => (
  <div
    aria-hidden="true"
    className="relative z-10 bg-olive py-4 overflow-hidden select-none"
  >
    <div className="flex w-max animate-marquee will-change-transform">
      <Strip />
      <Strip />
    </div>
  </div>
);

export default Marquee;
