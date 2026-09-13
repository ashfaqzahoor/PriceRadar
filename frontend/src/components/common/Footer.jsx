export function Footer() {
  return (
    <footer className="border-t border-term-border bg-term-bg font-mono text-xs">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8 text-term-muted">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 bg-term-cyan/70" />
          <span>PRICERADAR_SYSTEM // PARALLEL QUICK-COMMERCE ENGINE</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-term-dim">
          <span>BLINKIT • INSTAMART • BIGBASKET • GROCERY_API</span>
          <span>LATENCY: ~180MS</span>
        </div>
      </div>
    </footer>
  );
}
