export default function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      </div>
      <span className="text-xs font-medium text-slate-400 animate-pulse">{text}</span>
    </div>
  );
}
