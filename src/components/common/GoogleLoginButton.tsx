import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    google?: any;
  }
}

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "1081442493959-80so9v205tjto6n4j1geaaj8k85mri2n.apps.googleusercontent.com";

interface GoogleLoginButtonProps {
  onSuccess?: (user?: any) => void;
  onError?: (msg: string) => void;
  onLoadingChange?: (loading: boolean) => void;
  theme?: "outline" | "filled_black" | "filled_blue";
  shape?: "pill" | "rectangular";
  width?: number;
}

export default function GoogleLoginButton({
  onSuccess,
  onError,
  onLoadingChange,
  theme = "outline",
  shape = "pill",
  width = 300,
}: GoogleLoginButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      try {
        setIsVerifying(true);
        onLoadingChange?.(true);
        const res = await authService.googleLogin(response.credential);
        login(res.data.user, res.data.token);
        if (onSuccess) {
          onSuccess(res.data.user);
        } else {
          navigate("/", { replace: true });
        }
      } catch (err: any) {
        setIsVerifying(false);
        onLoadingChange?.(false);
        const msg =
          err.response?.data?.message || err.message || "Google authentication failed";
        if (onError) onError(msg);
      }
    };

    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      if (window.google?.accounts?.id && btnRef.current) {
        clearInterval(interval);
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
        window.google.accounts.id.renderButton(btnRef.current, {
          theme,
          size: "large",
          shape,
          width,
          text: "continue_with",
        });
      }
      if (checkCount > 25) clearInterval(interval);
    }, 150);

    return () => clearInterval(interval);
  }, [login, navigate, onSuccess, onError, onLoadingChange, theme, shape, width]);

  return (
    <div className="w-full flex justify-center py-1 relative">
      {isVerifying && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <div className="w-4 h-4 border-2 border-[#0ea9df]/30 border-t-[#0ea9df] rounded-full animate-spin" />
            <span>Verifying with Google...</span>
          </div>
        </div>
      )}
      <div ref={btnRef} className="min-h-[44px] flex items-center justify-center" />
    </div>
  );
}

