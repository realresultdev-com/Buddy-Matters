import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

export function useCapacitorNative() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only run on native Android/iOS
    if (!Capacitor.isNativePlatform()) return;

    // 1. Configure native Status Bar (prevent overlaying webview, match rich navy theme)
    try {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: "#0f172a" });
      StatusBar.setOverlaysWebView({ overlay: false });
    } catch (e) {
      console.warn("StatusBar setup warning:", e);
    }

    // 2. Hide Splash Screen after React has rendered
    try {
      SplashScreen.hide();
    } catch (e) {
      console.warn("SplashScreen hide warning:", e);
    }

    // 3. Android Hardware Back Button listener
    const backListener = App.addListener("backButton", ({ canGoBack }) => {
      // Check if any modal or drawer is open
      const closeBtn = document.querySelector<HTMLButtonElement>("[data-modal-close], button[aria-label='Close']");
      if (closeBtn) {
        closeBtn.click();
        return;
      }

      if (location.pathname !== "/" && location.pathname !== "") {
        navigate(-1);
      } else {
        App.exitApp();
      }
    });

    // 4. App lifecycle handling (Pause media decoders when backgrounded, save battery and CPU)
    const appStateListener = App.addListener("appStateChange", ({ isActive }) => {
      const videos = Array.from(document.querySelectorAll("video"));
      if (!isActive) {
        videos.forEach((v) => {
          if (!v.paused) {
            v.setAttribute("data-was-playing", "true");
            v.pause();
          }
        });
      } else {
        videos.forEach((v) => {
          if (v.getAttribute("data-was-playing") === "true") {
            v.removeAttribute("data-was-playing");
            v.play().catch(() => {});
          }
        });
      }
    });

    return () => {
      backListener.then((handle) => handle.remove()).catch(() => {});
      appStateListener.then((handle) => handle.remove()).catch(() => {});
    };
  }, [location.pathname, navigate]);
}
