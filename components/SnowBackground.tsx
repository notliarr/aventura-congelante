const flakes = Array.from({ length: 15 }, (_, index) => ({ left: `${(index * 37) % 100}%`, delay: `${(index * .63) % 7}s`, duration: `${8 + (index % 5)}s`, size: 8 + (index % 4) * 3 }));
export function SnowBackground() {
  return <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-55">{flakes.map((flake, index) => <span key={index} className="absolute -top-5 rounded-full bg-white shadow-[0_0_10px_white]" style={{ left: flake.left, width: flake.size, height: flake.size, animation: `drift ${flake.duration} linear ${flake.delay} infinite` }} />)}</div>;
}
