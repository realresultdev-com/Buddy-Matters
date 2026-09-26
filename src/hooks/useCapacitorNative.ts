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

    // 1. Configure native Status Bar
    try {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: "#ffffff" });
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
      if (location.pathname !== "/" && location.pathname !== "") {
        navigate(-1);
      } else {
        App.exitApp();
      }
    });

    return () => {
      backListener.then((handle) => handle.remove()).catch(() => {});
    };
  }, [location.pathname, navigate]);
}
