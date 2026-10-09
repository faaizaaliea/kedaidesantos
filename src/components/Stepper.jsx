const Ikon = ({ d }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export default function Stepper({ qty, onTambah, onKurang }) {
  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onKurang}
        aria-label="Kurangi"
        className="flex h-7 w-7 items-center justify-center"
      >
        <Ikon d="M2 7h10" />
      </button>
      <span className="flex h-7 min-w-[2.75rem] items-center justify-center rounded-xl border border-brand bg-white font-bold">
        {qty}
      </span>
      <button
        onClick={onTambah}
        aria-label="Tambah"
        className="flex h-7 w-7 items-center justify-center"
      >
        <Ikon d="M2 7h10M7 2v10" />
      </button>
    </div>
  );
}
