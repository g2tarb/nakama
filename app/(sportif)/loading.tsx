export default function SportifLoading() {
  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="nk-spinner" role="status" aria-label="Chargement" />
        <span className="nk-eyebrow">Chargement…</span>
      </div>
    </div>
  );
}
