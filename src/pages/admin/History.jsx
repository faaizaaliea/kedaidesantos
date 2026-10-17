import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../../components/OrderCard";
import SummaryCard from "../../components/SummaryCard";
import Pagination from "../../components/Pagination";
import useHistory from "../../hooks/useHistory";
import usePagination from "../../hooks/usePagination";
import { rupiah } from "../../lib/format";

const P = [
  ["harian", "Harian", "Hari Ini"],
  ["mingguan", "Mingguan", "Minggu Ini"],
  ["bulanan", "Bulanan", "Bulan Ini"],
];

export default function History({ onCetak }) {
  const nav = useNavigate();
  const [periode, setPeriode] = useState("harian");
  const { orders, jumlah, total } = useHistory(periode);
  const hal = usePagination(orders, 15);
  const label = P.find((p) => p[0] === periode)[2];

  return (
    <div>
      <div className="mb-4 flex gap-8 text-xl font-semibold">
        {P.map(([k, nama]) => (
          <button
            key={k}
            onClick={() => {
              setPeriode(k);
              hal.setPage(1);
            }}
            className={`flex flex-col items-start gap-1 ${
              periode === k ? "text-brand" : "text-sage-dark"
            }`}
          >
            {nama}
            <span
              className={`h-1 w-[35px] rounded-full ${
                periode === k ? "bg-brand" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <SummaryCard label={`Pesanan ${label}`} nilai={jumlah} />
        <SummaryCard label="Total Penjualan" nilai={rupiah(total)} />
      </div>
      <div className="space-y-3">
        {orders.length === 0 && (
          <p className="py-8 text-center text-sage-dark">
            Belum ada pesanan selesai.
          </p>
        )}
        {hal.data.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            mode="riwayat"
            showTanggal={periode !== "harian"}
            onCetak={onCetak}
            onBuka={(x) => nav(`/admin/pesanan/${x.id}`)}
          />
        ))}
      </div>
      <Pagination hal={hal} />
    </div>
  );
}
