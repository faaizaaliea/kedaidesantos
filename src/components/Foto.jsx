export default function Foto({ src, className = '' }) {
  return (
    <img src={src || '/menu-placeholder.webp'} alt="" onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
      className={`bg-sand object-cover ${className}`} />
  )
}
