import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--bg)",
        color: "var(--tx)",
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: "100%",
          background: "var(--srf)",
          border: "1px solid var(--brd)",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "var(--sh)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: 12,
            color: "var(--go)",
          }}
        >
          404
        </div>
        <h1
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Página no encontrada
        </h1>
        <p
          style={{
            fontFamily: "var(--font-dm-sans)",
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--mu)",
            marginBottom: 20,
          }}
        >
          La ruta que buscaste no existe o fue movida. Volvé al inicio para seguir navegando el dashboard.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 18px",
            borderRadius: 12,
            background: "var(--go)",
            color: "#fff",
            fontFamily: "var(--font-dm-sans)",
            fontSize: 14,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
