import { useState } from "react";
import OrderCard from "../../components/OrderCard";
import EditOrderSheet from "../../components/EditOrderSheet";

export default function ActiveOrders({ orders, onSelesai, onCetak, onUbah }) {
  const [editId, setEditId] = useState(null);
  const sedangEdit = editId && orders.find((o) => o.id === editId);

  return (
    <div className="space-y-4">
      {orders.length === 0 && (
        <p className="py-10 text-center text-sage-dark">
          Belum ada pesanan aktif.
        </p>
      )}
      {orders.map((o) => (
        <OrderCard
          key={o.id}
          order={o}
          mode="aktif"
          onSelesai={onSelesai}
          onCetak={onCetak}
          onEdit={(x) => setEditId(x.id)}
        />
      ))}
      {sedangEdit && (
        <EditOrderSheet
          key={sedangEdit.id}
          order={sedangEdit}
          onSimpan={onUbah}
          onTutup={() => setEditId(null)}
        />
      )}
    </div>
  );
}
