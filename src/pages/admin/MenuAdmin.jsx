import { useEffect, useState } from "react";
import Foto from "../../components/Foto";
import Field, { SelectField } from "../../components/Field";
import { supabase } from "../../lib/supabase";
import { rupiah } from "../../lib/format";

const BUCKET = "menu-images";
const KOSONG = {
  nama: "",
  deskripsi: "",
  harga: "",
  kategori: "",
  urutan: 0,
  tersedia: true,
  gambar_url: null,
};
async function hapusFile(url) {
  if (url && url.includes(`/${BUCKET}/`))
    await supabase.storage.from(BUCKET).remove([url.split(`/${BUCKET}/`)[1]]);
}
async function kecilkan(file) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 800 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((r) => c.toBlob(r, "image/webp", 0.8));
}

function Form({ awal, kategori, onSelesai, onTutup }) {
  const [f, setF] = useState({ ...KOSONG, ...awal });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(awal.gambar_url);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) =>
    setF({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  const pilihFile = (e) => {
    const x = e.target.files[0];
    if (x) {
      setFile(x);
      setPreview(URL.createObjectURL(x));
    }
  };
  const hapusFoto = () => {
    setFile(null);
    setPreview(null);
    setF({ ...f, gambar_url: null });
  };

  const simpan = async () => {
    if (
      !f.nama.trim() ||
      !f.kategori.trim() ||
      f.harga === "" ||
      Number(f.harga) < 0
    ) {
      return setErr("Nama, kategori, dan harga wajib diisi dengan benar");
    }
    setBusy(true);
    setErr("");
    try {
      let url = f.gambar_url;
      if (file) {
        const path = `${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, await kecilkan(file), { contentType: "image/webp" });
        if (error) throw error;
        url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
      }
      const row = {
        nama: f.nama.trim(),
        deskripsi: f.deskripsi?.trim() || null,
        harga: Number(f.harga),
        kategori: f.kategori.trim(),
        urutan: Number(f.urutan) || 0,
        tersedia: f.tersedia,
        gambar_url: url,
      };
      const { error } = awal.id
        ? await supabase.from("menu_items").update(row).eq("id", awal.id)
        : await supabase.from("menu_items").insert(row);
      if (error) throw error;
      if (awal.gambar_url && url !== awal.gambar_url)
        await hapusFile(awal.gambar_url);
      onSelesai();
    } catch (e) {
      setErr(e.message || "Gagal menyimpan");
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40"
      onClick={onTutup}
    >
      <div
        className="mx-auto max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-cream p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {awal.id ? "Edit Menu" : "Tambah Menu"}
          </h2>
          <button onClick={onTutup} aria-label="Tutup" className="text-2xl">
            ✕
          </button>
        </div>
        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-3">
            <Foto src={preview} className="h-20 w-20 rounded-lg" />
            <div className="flex flex-col gap-1 text-sm">
              <label className="cursor-pointer rounded-xl bg-sage px-3 py-1.5 font-semibold text-white">
                {preview ? "Ganti foto" : "Pilih foto"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={pilihFile}
                />
              </label>
              {preview && (
                <button
                  onClick={hapusFoto}
                  className="text-left text-sage-dark underline"
                >
                  Hapus foto
                </button>
              )}
            </div>
          </div>
          <Field label="Nama menu" value={f.nama} onChange={set("nama")} />
          <Field
            as="textarea"
            rows={3}
            label="Deskripsi"
            value={f.deskripsi || ""}
            onChange={set("deskripsi")}
          />
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Harga (Rp)"
              type="number"
              min="0"
              value={f.harga}
              onChange={set("harga")}
            />
            <Field
              label="Urutan"
              type="number"
              value={f.urutan}
              onChange={set("urutan")}
            />
          </div>
          <SelectField
            label="Kategori"
            placeholder="Pilih kategori"
            nilai={f.kategori}
            daftar={kategori}
            tambahBaru
            onPilih={(v) => setF({ ...f, kategori: v })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={f.tersedia}
              onChange={set("tersedia")}
            />{" "}
            Menu tersedia
          </label>
          {err && <p className="text-sm text-red-700">{err}</p>}
          <button
            onClick={simpan}
            disabled={busy}
            className="w-full rounded-xl bg-brand py-3 text-white disabled:opacity-50"
          >
            {busy ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MenuAdmin() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState(null);
  const [err, setErr] = useState("");

  const muat = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("kategori")
      .order("urutan");
    setErr(error ? error.message : "");
    setList(data || []);
  };
  useEffect(() => {
    muat();
  }, []);

  const toggle = async (it) => {
    await supabase
      .from("menu_items")
      .update({ tersedia: !it.tersedia })
      .eq("id", it.id);
    muat();
  };
  const hapus = async (it) => {
    if (
      !confirm(`Hapus "${it.nama}"? Riwayat penjualan lama tidak terpengaruh.`)
    )
      return;
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", it.id);
    if (error) setErr(error.message);
    else await hapusFile(it.gambar_url);
    muat();
  };
  const kategori = [...new Set(list.map((m) => m.kategori))];

  return (
    <div>
      <button
        onClick={() => setForm(KOSONG)}
        className="mb-4 w-full rounded-xl bg-brand py-3 text-white"
      >
        + Tambah Menu
      </button>
      {err && <p className="mb-3 text-sm text-red-700">{err}</p>}
      <div className="space-y-3">
        {list.map((it) => (
          <div
            key={it.id}
            className={`flex gap-3 rounded-2xl border-2 p-3 ${it.tersedia ? "border-line bg-cream" : "border-line bg-sand opacity-80"}`}
          >
            <Foto
              src={it.gambar_url}
              className="h-16 w-16 shrink-0 rounded-lg"
            />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold">{it.nama}</h3>
              <p className="text-sm text-sage-dark">
                {it.kategori} • {rupiah(it.harga)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => toggle(it)}
                  className={`rounded-lg px-3 py-1 font-semibold ${it.tersedia ? "bg-sage text-white" : "bg-red-700 text-white"}`}
                >
                  {it.tersedia ? "Tersedia" : "Habis"}
                </button>
                <button
                  onClick={() => setForm(it)}
                  className="rounded-lg border-2 border-brand px-3 py-1 text-brand"
                >
                  Edit
                </button>
                <button
                  onClick={() => hapus(it)}
                  className="rounded-lg px-3 py-1 text-red-700 underline"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && !err && (
          <p className="py-8 text-center text-sage-dark">Belum ada menu.</p>
        )}
      </div>
      {form && (
        <Form
          awal={form}
          kategori={kategori}
          onTutup={() => setForm(null)}
          onSelesai={() => {
            setForm(null);
            muat();
          }}
        />
      )}
    </div>
  );
}
