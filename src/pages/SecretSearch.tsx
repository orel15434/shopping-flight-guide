
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChineseMarketplaceSearch from "@/components/ChineseMarketplaceSearch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlertIcon } from "lucide-react";

const SecretSearch = () => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const correctPassword = "webuyil2024"; // Simple password protection

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      // Store in session storage so refresh doesn't log out
      sessionStorage.setItem("secretSearchAuth", "true");
    } else {
      alert("סיסמה שגויה. נסה שוב.");
    }
  };

  // Check session storage on component mount
  React.useEffect(() => {
    const authStatus = sessionStorage.getItem("secretSearchAuth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">חיפוש מוצרים בשווקים סיניים (גישה מוגבלת)</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="הזן סיסמה"
                  className="border p-3 rounded w-full text-right"
                  dir="rtl"
                />
              </div>
              <button 
                type="submit" 
                className="bg-primary text-white p-3 rounded w-full hover:bg-primary/80 transition-colors"
              >
                כניסה
              </button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
