export default function SummaryCard({ label, nilai }) {
  return (
    <div className="rounded-2xl border-2 border-brand bg-white px-4 py-3 text-brand">
      <p>{label}</p>
      <p className="text-3xl font-extrabold">{nilai}</p>
    </div>
  );
}
