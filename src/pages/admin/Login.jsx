import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Field from "../../components/Field";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [lihatPw, setLihatPw] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const masuk = async () => {
    if (busy) return;

    setErr("");
    setBusy(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pw,
    });

    if (error) {
      setErr("Email atau password salah");
      setBusy(false);
    } else {
      nav("/admin");
    }
  };

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] bg-cream">
      <Navbar judul={"Dashboard\nKasir"} />

      <div className="space-y-4 px-8 pt-10">
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <Field
            label="Password"
            type={lihatPw ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setLihatPw((v) => !v)}
            aria-label={lihatPw ? "Sembunyikan password" : "Lihat password"}
            aria-pressed={lihatPw}
            className="absolute right-3 bottom-2 flex h-8 w-8 items-center justify-center text-sage-dark"
          >
            {lihatPw ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3l18 18" />
                <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                <path d="M9.9 5.2A11.5 11.5 0 0 1 12 5c5 0 8.5 4.5 9.5 7a11.8 11.8 0 0 1-3.1 4.2" />
                <path d="M6.2 6.2A12.5 12.5 0 0 0 2.5 12c1 2.5 4.5 7 9.5 7 1 0 2-.2 2.9-.5" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        {err && <p className="text-sm text-red-700">{err}</p>}

        <button
          onClick={masuk}
          disabled={busy}
          className="w-full rounded-xl bg-brand py-3 text-white disabled:opacity-50"
        >
          {busy ? "Memproses..." : "Masuk"}
        </button>
      </div>
    </div>
  );
}
