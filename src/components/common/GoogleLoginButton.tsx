import { useEffect, useRef } from "react";
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
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = async (response: any) => {
      try {
        const res = await authService.googleLogin(response.credential);
        login(res.data.user, res.data.token);
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/");
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || err.message || "Google authentication failed";
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
          theme: "filled_black",
          size: "large",
          shape: "rectangular",
          width: 360,
          text: "continue_with",
        });
      }
      if (checkCount > 25) clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, [login, navigate, onSuccess, onError]);

  return (
    <div className="w-full flex justify-center py-1">
      <div ref={btnRef} className="min-h-[44px]" />
    </div>
  );
}
