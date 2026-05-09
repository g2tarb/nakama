export default function RootLoading() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="nk-spinner" role="status" aria-label="Chargement" />
        <span className="nk-eyebrow">Chargement…</span>
      </div>
    </div>
  );
}
