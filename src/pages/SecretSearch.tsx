
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChineseMarketplaceSearch from "@/components/ChineseMarketplaceSearch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlertIcon } from "lucide-react";

const SecretSearch = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-6" dir="rtl">חיפוש מוצרים בשווקים סיניים</h1>
      <Alert className="mb-6 bg-yellow-50 border-yellow-200">
        <ShieldAlertIcon className="h-4 w-4" />
        <AlertDescription dir="rtl">
          דף זה מאפשר חיפוש מוצרים בשווקים סיניים כמו Weidian, 1688, ו-Taobao. תוצאות החיפוש מסודרות לפי מחיר מהנמוך לגבוה.
        </AlertDescription>
      </Alert>
      <ChineseMarketplaceSearch />
    </div>
  );
};

export default SecretSearch;
