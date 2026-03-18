import { motion } from "framer-motion";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full"
      />
      <p className="text-sm text-slate-500 font-medium">{text}</p>
    </div>
  );
}

export function InlineLoader() {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
    />
  );
}
