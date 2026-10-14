import { createPortal } from "react-dom";

export default function Sheet({ judul, subjudul, onTutup, children }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 !m-0 flex items-end bg-brand/40"
      onClick={onTutup}
    >
      <div
        className="mx-auto flex max-h-[92dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-3xl bg-paper shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between bg-cream px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">{judul}</h2>
            {subjudul && <p className="text-xs text-sage-dark">{subjudul}</p>}
          </div>
          <button onClick={onTutup} aria-label="Tutup" className="p-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M3 3l14 14M17 3L3 17" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
