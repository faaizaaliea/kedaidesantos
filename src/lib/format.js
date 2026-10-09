export const rupiah = (n) => Number(n || 0).toLocaleString('id-ID')
export const pad = (n) => String(n).padStart(2, '0')
export const jam = (iso) =>
  new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false }).replace('.', ':')
export const tanggal = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: '2-digit' })
