import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartButton() {
  const { jumlah } = useCart()
  const nav = useNavigate()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 mx-auto flex max-w-[430px] justify-end px-5">
      <button onClick={() => nav('/keranjang')} aria-label="Keranjang"
        className="pointer-events-auto relative flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 4h2l2.4 10.2h10L20 7H6.2" /><circle cx="9" cy="19" r="1.3" /><circle cx="17" cy="19" r="1.3" />
        </svg>
        {jumlah > 0 && (
          <span className="absolute -right-1 -top-2 flex h-7 min-w-7 items-center justify-center rounded-full bg-sand px-1 text-sm font-bold text-black">{jumlah}</span>
        )}
      </button>
    </div>
  )
}
