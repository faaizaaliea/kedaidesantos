export default function CategoryTabs({ kategori, aktif, onPilih }) {
  return (
    <div className="scroll-pendek-x flex gap-3 overflow-x-auto px-5 pb-2">
      {kategori.map((k) => (
        <button
          key={k}
          onClick={() => onPilih(k)}
          className={`shrink-0 rounded-xl border-2 border-brand px-5 py-1.5 text-sm ${aktif === k ? "bg-sage/50 font-semibold" : ""}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
}
