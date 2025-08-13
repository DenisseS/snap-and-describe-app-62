
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthentication } from "../hooks/useAuthentication";
import ShoppingListService from "../services/ShoppingListService";
import { useTranslation } from "react-i18next";
import { SHOPPING_LIST_CACHE_KEYS } from "@/constants/cacheKeys";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sessionService, refreshUserInfo } = useAuthentication();
  const { t } = useTranslation();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [error, setError] = useState<string>("");
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (isProcessingRef.current) {
        console.log("🔐 AuthCallback: Already processing, skipping...");
        return;
      } else {
        isProcessingRef.current = true;
      }

      if (error) {
        console.error("🔐 AuthCallback: OAuth error:", error);
        setStatus("error");
        setError(error);
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      if (!code) {
        console.error("🔐 AuthCallback: No authorization code received");
        setStatus("error");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      // Verificar que existe el code verifier antes de proceder
      const codeVerifier = localStorage.getItem("dropbox_code_verifier");
      if (!codeVerifier) {
        console.error("🔐 AuthCallback: No code verifier found");
        setStatus("error");
        setError("Authentication state lost. Please try again.");
        setTimeout(() => navigate("/"), 3000);
        return;
      }

      try {
        console.log("🔐 AuthCallback: Processing callback with code verifier...");
        const success = await sessionService.handleCallback(code);

        if (success) {
          setStatus("success");
          console.log("🔐 AuthCallback: Triggering shopping lists merge...");
          const mergeRes = await ShoppingListService.getInstance().mergeLocalListsWithRemote();
          if (mergeRes?.success) {
            console.log("🧹 AuthCallback: Clearing LOCAL shopping list caches after merge...");
            sessionService.clearLocalCache(SHOPPING_LIST_CACHE_KEYS.LOCAL_LIST_DATA_PREFIX);
            sessionService.clearCache(SHOPPING_LIST_CACHE_KEYS.LOCAL_SHOPPING_LISTS);
          }
          console.log("🔐 AuthCallback: Refreshing user info to update auth state...");
          await refreshUserInfo();
          setTimeout(() => navigate("/"), 1500);
        } else {
          console.error("🔐 AuthCallback: Token exchange failed");
          setStatus("error");
          setError("Failed to complete authentication");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("🔐 AuthCallback: Callback handling error:", error);
        setStatus("error");
        setError("Authentication failed");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
        }, 1000);
      }
    };
    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-md w-full mx-4">
        {status === "processing" && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("connectingWithDropbox")}
            </h2>
            <p className="text-gray-600">
              {t("pleaseWaitProcessing")}
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("connectionSuccessful")}
            </h2>
            <p className="text-gray-600">
              {t("finalizingLogin")}
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {t("authenticationError")}
            </h2>
            <p className="text-gray-600 mb-4">
              {error || t("authenticationErrorOccurred")}
            </p>
            <p className="text-sm text-gray-500">
              {t("redirectToHome")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
