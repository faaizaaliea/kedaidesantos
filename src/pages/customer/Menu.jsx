import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import CategoryTabs from '../../components/CategoryTabs'
import MenuCard from '../../components/MenuCard'
import BottomSheet from '../../components/BottomSheet'
import CartButton from '../../components/CartButton'
import useMenu from '../../hooks/useMenu'
import { useCart } from '../../context/CartContext'

export default function Menu() {
  const { meja, ubahQty, qtyOf } = useCart()
  const { menu, kategori, loading, error } = useMenu()
  const [kat, setKat] = useState(null)
  const [detail, setDetail] = useState(null)
  if (!meja) return <Navigate to="/" replace />

  const aktif = kat || kategori[0]
  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-cream pb-28">
      <Navbar meja={meja.nomor} />
      <h2 className="px-5 pb-3 pt-5 text-xl font-semibold">Daftar Menu</h2>
      <CategoryTabs kategori={kategori} aktif={aktif} onPilih={setKat} />
      <div className="space-y-3 px-5 pt-4">
        {loading && <p>Memuat menu…</p>}
        {error && <p className="text-red-700">Gagal memuat menu.</p>}
        {menu.filter((m) => m.kategori === aktif).map((it) => (
          <MenuCard key={it.id} item={it} qty={qtyOf(it.id)}
            onTambah={() => ubahQty(it, 1)} onKurang={() => ubahQty(it, -1)} onBuka={() => setDetail(it)} />
        ))}
      </div>
      <CartButton />
      {detail && (
        <BottomSheet item={detail} qty={qtyOf(detail.id)} onTutup={() => setDetail(null)}
          onTambah={() => ubahQty(detail, 1)} onKurang={() => ubahQty(detail, -1)} />
      )}
    </div>
  )
}
