import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function PaymentFailedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-[#0a0f1e] flex flex-col items-center justify-center text-white gap-5">
      <div className="w-20 h-20 rounded-full bg-red-500/15 flex items-center justify-center">
        <XCircle size={44} className="text-red-400" />
      </div>
      <h1 className="text-2xl font-bold">فشل الدفع</h1>
      <p className="text-gray-400">لم يتم إتمام عملية الدفع. يرجى المحاولة مجدداً.</p>
      <button
        onClick={() => navigate("/pricing")}
        className="mt-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-xl font-semibold transition-colors"
      >
        العودة للخطط
      </button>
    </div>
  );
}
