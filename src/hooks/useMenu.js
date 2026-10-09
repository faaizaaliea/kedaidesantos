import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const URUTAN_KATEGORI = [
  "Main Course",
  "Ricebowl",
  "Burger",
  "Indomie",
  "Snack",
  "Coffee Based",
  "Mocktails",
  "Milk Based",
  "Tea/Non Coffee",
  "Sparkling Based",
];

export default function useMenu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function muatMenu() {
      const { data, error } = await supabase.from("menu_items").select("*");

      if (error) {
        setError(error);
      } else {
        const dataTerurut = (data || []).sort((a, b) => {
          const kategoriA = URUTAN_KATEGORI.indexOf(a.kategori);
          const kategoriB = URUTAN_KATEGORI.indexOf(b.kategori);

          const urutA = kategoriA === -1 ? URUTAN_KATEGORI.length : kategoriA;

          const urutB = kategoriB === -1 ? URUTAN_KATEGORI.length : kategoriB;

          return urutA - urutB || a.urutan - b.urutan;
        });

        setMenu(dataTerurut);
      }

      setLoading(false);
    }

    muatMenu();
  }, []);

  const kategori = URUTAN_KATEGORI.filter((k) =>
    menu.some((m) => m.kategori === k),
  );

  const kategoriLain = [...new Set(menu.map((m) => m.kategori))].filter(
    (k) => !URUTAN_KATEGORI.includes(k),
  );

  return {
    menu,
    kategori: [...kategori, ...kategoriLain],
    loading,
    error,
  };
}
