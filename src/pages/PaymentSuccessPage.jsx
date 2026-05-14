import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Loader } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { updateUserSubscription } from "../services/firestoreService";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("activating");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1] || "");
    const plan = params.get("plan") || "starter";
    const uid  = params.get("uid") || currentUser?.uid;

    if (!uid) { navigate("/signin"); return; }

    updateUserSubscription(uid, plan)
      .then(() => {
        setStatus("done");
        setTimeout(() => navigate("/client-dashboard"), 2500);
      })
      .catch(() => {
        setStatus("done");
        setTimeout(() => navigate("/client-dashboard"), 2500);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-[#0a0f1e] flex flex-col items-center justify-center text-white gap-5">
      {status === "activating" ? (
        <>
          <Loader size={44} className="animate-spin text-cyan-400" />
          <p className="text-gray-400">جارٍ تفعيل الاشتراك...</p>
        </>
      ) : (
        <>
          <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
            <CheckCircle size={44} className="text-green-400" />
          </div>
          <h1 className="text-2xl font-bold">تم الدفع بنجاح!</h1>
          <p className="text-gray-400">اشتراكك مفعَّل. سيتم توجيهك إلى لوحة التحكم...</p>
        </>
      )}
    </div>
  );
}
