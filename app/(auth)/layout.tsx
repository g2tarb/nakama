export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center">
      {children}
    </main>
  );
}
