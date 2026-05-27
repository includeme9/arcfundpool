export function StickyMobileCTA({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[72px] z-40 border-t border-white/10 bg-[#06101f]/94 p-4 backdrop-blur-xl md:hidden">
      {children}
    </div>
  );
}
