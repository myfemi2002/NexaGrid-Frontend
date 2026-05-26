export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#fffdfa] lg:h-dvh lg:overflow-hidden">
      <main className="flex min-h-dvh items-stretch justify-center px-0 py-0 lg:h-dvh lg:overflow-hidden">
        <div className="h-full w-full">{children}</div>
      </main>
    </div>
  );
}
