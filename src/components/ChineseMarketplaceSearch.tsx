
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ExternalLink, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Define type for search results
interface SearchResult {
  name: string;
  price: string;
  currency: string;
  link: string;
  image: string;
  site: string;
  snippet?: string;
}

const ChineseMarketplaceSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [translatedQuery, setTranslatedQuery] = useState("");
  const { toast } = useToast();

  // Enhanced translation mapping for common terms
  const mockTranslate = (text: string): string => {
    const translations: Record<string, string> = {
      "nike air force 1": "耐克空军1号",
      "adidas yeezy": "阿迪达斯椰子",
      "jordan 1": "乔丹1代",
      "puma": "彪马",
      "new balance": "新百伦",
      "yeezy": "椰子",
      "nike": "耐克",
      "adidas": "阿迪达斯",
      "shoes": "鞋子",
      "sneakers": "运动鞋",
      "jordan": "乔丹",
      "shirt": "衬衫",
      "t-shirt": "T恤",
      "jacket": "夹克",
      "jeans": "牛仔裤",
      "pants": "裤子",
      "hoodie": "连帽衫",
      "sweater": "毛衣",
      "dress": "连衣裙",
      "skirt": "裙子",
      "bag": "包包",
      "backpack": "背包",
      "hat": "帽子",
      "cap": "鸭舌帽",
      "socks": "袜子",
      "watch": "手表",
      "sunglasses": "太阳镜",
      "glasses": "眼镜",
      "boots": "靴子",
      "sandals": "凉鞋",
      "men": "男士",
      "women": "女士",
      "kids": "儿童"
    };

    // Split text into words and check each word for translation
    const words = text.toLowerCase().split(" ");
    const translatedWords = words.map(word => translations[word] || word);
    
    // Check for full phrase match
    if (translations[text.toLowerCase()]) {
      return translations[text.toLowerCase()];
    }
    
    // Try to match partial phrases
    for (const key in translations) {
      if (text.toLowerCase().includes(key)) {
        return text.toLowerCase().replace(key, translations[key]);
      }
    }

    // Return the full translated words
    return translatedWords.join(" ") + " (翻译)";
  };

  // Function to translate text using LibreTranslate
  const translateWithLibreTranslate = async (text: string): Promise<string> => {
    try {
      const response = await axios.post('https://libretranslate.de/translate', {
        q: text,
        source: 'auto', // Detect language automatically
        target: 'zh',  // Translate to Chinese
        format: 'text'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data && response.data.translatedText) {
        return response.data.translatedText;
      } else {
        console.error('Translation error: Invalid response from LibreTranslate');
        return mockTranslate(text); // Fallback to mockTranslate
      }
    } catch (error) {
      console.error('Translation error:', error);
      return mockTranslate(text); // Fallback to mockTranslate on error
    }
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
    setResults([]);
    
    try {
      // Try to translate with LibreTranslate first
      let translated = "";
      try {
        translated = await translateWithLibreTranslate(query);
        console.log(`LibreTranslate: "${query}" → "${translated}"`);
      } catch (translationError) {
        console.error("LibreTranslate failed:", translationError);
        translated = mockTranslate(query);
        console.log(`Fallback translation: "${query}" → "${translated}"`);
      }
      
      setTranslatedQuery(translated);
      
      // Google Custom Search API credentials
      const GOOGLE_API_KEY = 'AIzaSyA6xA8dr2RNKQE2Li5fRIBkjgR6SmZyByk';
      const SEARCH_ENGINE_ID = '94549664e44b34ac8';
      
      // Search sites separately to ensure balanced results
      const sites = ['weidian.com', '1688.com', 'taobao.com'];
      let allResults: SearchResult[] = [];
      
      for (const site of sites) {
        try {
          // Create a query with site restriction
          const siteQuery = `${translated} site:${site}`;
          
          // Make API request for this site
          const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
              key: GOOGLE_API_KEY,
              cx: SEARCH_ENGINE_ID,
              q: siteQuery,
              num: 4 // Limit to 4 results per site
            }
          });
          
          // Process results for this site
          if (response.data.items && response.data.items.length > 0) {
            const siteResults: SearchResult[] = response.data.items.map((item: any) => {
              // Determine which site this result is from
              let siteName = site.split('.')[0].charAt(0).toUpperCase() + site.split('.')[0].slice(1);
              
              // Extract price - try to find it in the snippet or title
              let price = "N/A";
              // Improved price regex that matches various formats of Chinese currency
              const priceRegex = /¥\s*\d+(\.\d+)?|\d+(\.\d+)?\s*元|\d+(\.\d+)?\s*¥/;
              const priceMatch = item.snippet?.match(priceRegex) || item.title?.match(priceRegex);
              
              if (priceMatch) {
                price = priceMatch[0];
              }
              
              return {
                name: item.title || "No title",
                price: price,
                currency: price !== "N/A" ? "" : "¥", // Currency already included in price if found
                link: item.link,
                image: item.pagemap?.cse_image?.[0]?.src || 
                      item.pagemap?.cse_thumbnail?.[0]?.src || 
                      `https://via.placeholder.com/300x300?text=${encodeURIComponent(siteName)}`,
                site: siteName,
                snippet: item.snippet
              };
            });
            
            allResults = [...allResults, ...siteResults];
          }
        } catch (siteError) {
          console.error(`Error searching ${site}:`, siteError);
        }
      }
      
      // Sort by price (if available)
      const sortedResults = allResults.sort((a, b) => {
        // Extract numeric price value
        const getNumericPrice = (priceStr: string) => {
          const match = priceStr.match(/\d+(\.\d+)?/);
          return match ? parseFloat(match[0]) : Infinity;
        };
        
        const priceA = getNumericPrice(a.price);
        const priceB = getNumericPrice(b.price);
        
        return priceA - priceB;
      });
      
      setResults(sortedResults);
      
      if (sortedResults.length > 0) {
        toast({
          title: "החיפוש הושלם",
          description: `נמצאו ${sortedResults.length} תוצאות`,
        });
      } else {
        toast({
          title: "אין תוצאות",
          description: "לא נמצאו תוצאות עבור חיפוש זה",
        });
      }
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
    if (price === "N/A") return "מחיר לא זמין";
    
    // If the price already includes the currency symbol
    if (price.includes("¥") || price.includes("元")) {
      // Estimate conversion to ILS (0.5 rate)
      const numericPrice = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
      return `${price} (≈${Math.round(numericPrice * 0.5)} ₪)`;
    }
    
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
        <>
          <div className="bg-amber-50 border-amber-200 border p-4 rounded-md" dir="rtl">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 ml-2 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-amber-800">הערה חשובה למשתמשים</h3>
                <p className="text-sm text-amber-700 mt-1">
                  המחירים והתמונות המוצגים כאן עשויים להיות שונים מאלה המופיעים בדף המוצר. 
                  מומלץ לבדוק את המחיר והתמונה בדף המוצר עצמו לפני קבלת החלטה.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold" dir="rtl">תוצאות חיפוש ({results.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square overflow-hidden bg-slate-100 relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-slate-200 rounded-full">
                        {item.site}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-md font-semibold mt-1 text-right line-clamp-2" dir="rtl">{item.name}</h3>
                    
                    <p className="text-lg font-bold text-primary mt-2 text-right" dir="rtl">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    
                    {item.snippet && (
                      <p className="text-xs text-gray-500 mt-2 text-right line-clamp-3" dir="rtl">
                        {item.snippet}
                      </p>
                    )}
                    
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
        </>
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
