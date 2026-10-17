const Panah = ({ arah }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="block shrink-0"
  >
    <path d={arah === "kiri" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

const BASE =
  "flex h-9 w-9 items-center justify-center rounded-full p-0 text-base font-medium leading-none text-[#222325] focus:outline-none";
const ARROW = `${BASE} bg-sand hover:bg-sage focus-visible:bg-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-sand`;
const NOMOR = `${BASE} bg-transparent hover:bg-sage hover:font-semibold hover:text-white focus-visible:bg-brand focus-visible:font-semibold focus-visible:text-white`;
const AKTIF = `${BASE} bg-brand shadow-pop font-semibold text-white`;

export default function Pagination({ hal }) {
  const { page, pages, perPage, total, setPage } = hal;
  if (pages <= 1) return null;

  // 1 … (page-1) page (page+1) … terakhir
  const nomor = [];
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nomor.push(i);
    else if (nomor[nomor.length - 1] !== "…") nomor.push("…");
  }

  const pindah = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const awal = (page - 1) * perPage + 1;
  const akhir = Math.min(page * perPage, total);

  return (
    <nav
      aria-label="Halaman"
      className="mb-2.5 mt-6 flex flex-col items-center gap-2"
    >
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => pindah(page - 1)}
          aria-label="Halaman sebelumnya"
          className={ARROW}
        >
          <Panah arah="kiri" />
        </button>
        {nomor.map((n, i) =>
          n === "…" ? (
            <span
              key={`e${i}`}
              className="flex h-9 w-5 items-center justify-center text-sage-dark"
            >
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => pindah(n)}
              aria-current={n === page ? "page" : undefined}
              className={n === page ? AKTIF : NOMOR}
            >
              {n}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page === pages}
          onClick={() => pindah(page + 1)}
          aria-label="Halaman berikutnya"
          className={ARROW}
        >
          <Panah arah="kanan" />
        </button>
      </div>
      <p className="text-center text-xs text-sage-dark">
        Menampilkan {awal}–{akhir} dari {total}
      </p>
    </nav>
  );
}
