import React from "react";
import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SyncStatusIndicatorProps {
  isSyncing: boolean;
  className?: string;
}

const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ 
  isSyncing, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`h-8 transition-all duration-300 ${className}`}>
      {isSyncing && (
        <div className="flex items-center justify-center py-2 px-4 bg-blue-50 border border-blue-100 rounded-lg">
          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin mr-2" />
          <span className="text-sm text-blue-700 font-medium">
            {t("syncing", "Sincronizando...")}
          </span>
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;