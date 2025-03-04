
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define type for search results
interface SearchResult {
  name: string;
  price: string;
  currency: string;
  link: string;
  image: string;
  site: string;
}

const ChineseMarketplaceSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [translatedQuery, setTranslatedQuery] = useState("");
  const { toast } = useToast();

  const mockResults = (query: string): SearchResult[] => {
    // This is a mock function that simulates search results
    // In a real implementation, this would call a backend API
    
    const sites = ["Weidian", "1688", "Taobao"];
    const mockData: SearchResult[] = [];
    
    // Generate mock results
    for (let i = 0; i < 12; i++) {
      const randomPrice = Math.floor(50 + Math.random() * 200);
      const site = sites[i % sites.length];
      
      mockData.push({
        name: `${query} - ${site} מוצר ${i + 1}`,
        price: randomPrice.toString(),
        currency: "¥",
        link: "https://example.com/product",
        image: `https://picsum.photos/seed/${query}${i}/300/300`,
        site
      });
    }
    
    // Sort by price
    return mockData.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  };

  const mockTranslate = (text: string): string => {
    // This is a mock function that simulates translation
    // In a real implementation, this would call a translation API
    const translations: Record<string, string> = {
      "nike air force 1": "耐克空军1号",
      "adidas yeezy": "阿迪达斯椰子",
      "jordan 1": "乔丹1代",
      "puma": "彪马",
      "new balance": "新百伦"
    };

    // Default translation if no match found
    return translations[text.toLowerCase()] || `${text} (翻译)`;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן מילות חיפוש",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate translation
      const translated = mockTranslate(query);
      setTranslatedQuery(translated);
      
      // In a real implementation, this would call a backend API
      // that handles web scraping and translation
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Get mock results
      const searchResults = mockResults(query);
      setResults(searchResults);
      
      toast({
        title: "החיפוש הושלם",
        description: `נמצאו ${searchResults.length} תוצאות`,
      });
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "שגיאה בחיפוש",
        description: "אירעה שגיאה בעת ביצוע החיפוש. אנא נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string, currency: string) => {
    return `${currency}${price} (≈${Math.round(parseInt(price) * 0.5)} ₪)`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4" dir="rtl">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש מוצר (למשל: Nike Air Force 1)"
            className="flex-1 text-right"
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                מחפש...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                חפש
              </>
            )}
          </Button>
        </div>
      </form>

      {translatedQuery && (
        <div className="bg-slate-50 p-4 rounded-md" dir="rtl">
          <p className="text-sm text-slate-600">חיפוש בסינית: <span className="font-bold">{translatedQuery}</span></p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold" dir="rtl">תוצאות חיפוש ({results.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden bg-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold px-2 py-1 bg-slate-200 rounded">
                      {item.site}
                    </span>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(item.price, item.currency)}
                    </p>
                  </div>
                  <h3 className="text-md font-semibold mt-3 text-right" dir="rtl">{item.name}</h3>
                  <div className="mt-4">
                    <Button variant="outline" className="w-full" asChild>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        צפה במוצר <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!loading && results.length === 0 && translatedQuery && (
        <div className="text-center py-12">
          <p className="text-gray-500" dir="rtl">לא נמצאו תוצאות לחיפוש זה.</p>
        </div>
      )}
    </div>
  );
};

export default ChineseMarketplaceSearch;
