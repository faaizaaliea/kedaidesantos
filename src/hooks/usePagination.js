import { useState } from "react";

export default function usePagination(items, perPage) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const aktif = Math.min(page, pages);
  const mulai = (aktif - 1) * perPage;
  return {
    page: aktif,
    pages,
    perPage,
    total: items.length,
    data: items.slice(mulai, mulai + perPage),
    setPage,
  };
}
