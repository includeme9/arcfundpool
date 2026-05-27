import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-100">
      <AlertTriangle className="mt-0.5 shrink-0" size={18} />
      {message}
    </div>
  );
}
