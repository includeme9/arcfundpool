export function StickyMobileCTA({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-[58px] z-40 border-t border-white/10 bg-[#06101f]/94 p-3 backdrop-blur-xl lg:hidden">
      {children}
    </div>
  );
}
