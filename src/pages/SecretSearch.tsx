import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Loader2, Search, ExternalLink, SortAsc, Globe, DollarSign } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import Header from '../components/Header';
import Footer from '../components/Footer';

// Initial translation mapping for common search terms
const translationMap: Record<string, string> = {
  // Clothing
  "חולצה": "shirt",
  "חולצת": "shirt",
  "מכנסיים": "pants",
  "ג'ינס": "jeans",
  "ג׳ינס": "jeans",
  "נעליים": "shoes",
  "נעלי": "shoes",
  "כובע": "hat",
  "תיק": "bag",
  "שעון": "watch",
  "משקפיים": "glasses",
  "גרביים": "socks",
  "סווטשירט": "sweatshirt",
  "קפוצ'ון": "hoodie",
  "חגורה": "belt",
  "גופיה": "tank top",
  "צמיד": "bracelet",
  "שרשרת": "necklace",
  "טבעת": "ring",
  "עגילים": "earrings",
  
  // Brands
  "נייקי": "nike",
  "אדידס": "adidas",
  "פומה": "puma",
  "גוצ'י": "gucci",
  "לואי ויטון": "louis vuitton",
  "לקוסט": "lacoste",
  "נורת פייס": "north face",
  "ריבוק": "reebok",
  "אנדר ארמור": "under armour",
  "ניו באלאנס": "new balance",
  "נייק אייר פורס": "nike air force",
  "נייק אייר ג'ורדן": "nike air jordan",
  "נייק דאנק": "nike dunk",
  
  // Electronics
  "אוזניות": "headphones",
  "רמקול": "speaker",
  "מטען": "charger",
  "כבל": "cable",
  "מצלמה": "camera",
  "סמארטפון": "smartphone",
  "טלפון": "phone",
  "מחשב": "computer",
  
  // Other
  "זול": "cheap",
  "איכותי": "quality",
  "עותק": "replica",
  "חיקוי": "replica",
  "משלוח": "shipping",
  "צבע": "color",
  "שחור": "black",
  "לבן": "white",
  "אדום": "red",
  "כחול": "blue",
  "ירוק": "green",
  "צהוב": "yellow",
  "כתום": "orange",
  "סגול": "purple",
  "ורוד": "pink",
  "אפור": "gray",
  "חום": "brown"
};

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  image?: string;
  site: string;
  price?: string;
  priceValue?: number;
}

const SecretSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translatedQuery, setTranslatedQuery] = useState("");
  const [sortOption, setSortOption] = useState("relevance");
  const [marketplaceFilter, setMarketplaceFilter] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Extract Chinese price from text and convert to approximate ILS
  const extractPrice = (text: string): { price: string; value: number } | null => {
    // Match Chinese Yuan price patterns (¥123, 123元, etc)
    const patterns = [
      /¥\s*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*¥/i,
      /(\d+(?:\.\d+)?)\s*元/i,
      /CNY\s*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*CNY/i,
      /价格[:：]?\s*(\d+(?:\.\d+)?)/i,
      /价格[:：]?\s*¥?(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*RMB/i,
      /RMB\s*(\d+(?:\.\d+)?)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const yuan = parseFloat(match[1]);
        if (!isNaN(yuan)) {
          // Convert to ILS with approximate rate (1 CNY ≈ 0.53 ILS)
          const ilsValue = yuan * 0.53;
          return {
            price: `¥${yuan.toFixed(2)} (≈₪${ilsValue.toFixed(2)})`,
            value: yuan
          };
        }
      }
    }
    
    return null;
  };
  
  // Translate Hebrew to Chinese/English using translation map or API
  const translateQuery = async (hebrewQuery: string): Promise<string> => {
    try {
      // First check if we can translate using our mapping
      const words = hebrewQuery.trim().split(/\s+/);
      let translated = '';
      let usedMapping = false;
      
      for (const word of words) {
        if (translationMap[word.toLowerCase()]) {
          translated += translationMap[word.toLowerCase()] + ' ';
          usedMapping = true;
        } else {
          translated += word + ' ';
        }
      }
      
      // If we used the mapping for at least some words, use the result
      if (usedMapping) {
        return translated.trim();
      }
      
      // Otherwise try the translation API
      const response = await axios.get(
        `https://libretranslate.de/translate?q=${encodeURIComponent(hebrewQuery)}&source=auto&target=zh&format=text`,
        { timeout: 5000 } // 5 second timeout
      );
      
      if (response.data && response.data.translatedText) {
        return response.data.translatedText;
      }
      
      // Fallback - use original query if API fails
      return hebrewQuery;
    } catch (err) {
      console.error("Translation error:", err);
      // Fallback to original query if translation fails
      return hebrewQuery;
    }
  };
  
  const performSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Translate the query
      const translated = await translateQuery(query);
      setTranslatedQuery(translated);
      
      // Use Google Custom Search API
      const API_KEY = "AIzaSyA6xA8dr2RNKQE2Li5fRIBkjgR6SmZyByk";
      const SEARCH_ENGINE_ID = "94549664e44b34ac8";
      
      // Build the site restriction based on filter
      let siteRestriction = "";
      if (marketplaceFilter === "weidian") {
        siteRestriction = "site:weidian.com";
      } else if (marketplaceFilter === "1688") {
        siteRestriction = "site:1688.com";
      } else if (marketplaceFilter === "taobao") {
        siteRestriction = "site:taobao.com";
      } else {
        // Balance results across all platforms
        siteRestriction = "site:weidian.com OR site:1688.com OR site:taobao.com";
      }
      
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(translated)} ${siteRestriction}&num=10`
      );
      
      if (response.data.items && response.data.items.length > 0) {
        // Process search results
        const processedResults: SearchResult[] = response.data.items.map((item: any) => {
          // Determine which site the result is from
          let site = "unknown";
          if (item.link.includes("weidian.com")) site = "weidian";
          else if (item.link.includes("1688.com")) site = "1688";
          else if (item.link.includes("taobao.com")) site = "taobao";
          
          // Extract price from snippet or title
          const textToSearch = item.snippet || item.title || "";
          const priceInfo = extractPrice(textToSearch);
          
          return {
            title: item.title || "No title",
            link: item.link,
            snippet: item.snippet || "No description",
            image: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src || "/placeholder.svg",
            site,
            price: priceInfo?.price || "מחיר לא זמין",
            priceValue: priceInfo?.value
          };
        });
        
        // Sort results if needed
        if (sortOption === "price") {
          processedResults.sort((a, b) => {
            if (a.priceValue === undefined) return 1;
            if (b.priceValue === undefined) return -1;
            return a.priceValue - b.priceValue;
          });
        }
        
        setResults(processedResults);
      } else {
        setResults([]);
        setError("לא נמצאו תוצאות לחיפוש זה");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("שגיאה בביצוע החיפוש, אנא נסו שוב מאוחר יותר");
      toast({
        variant: "destructive",
        title: "שגיאה בחיפוש",
        description: "לא הצלחנו לבצע את החיפוש. אנא נסו שוב.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">חיפוש מוצרים סיני</h1>
          <p className="text-center text-muted-foreground">
            חפשו מוצרים באתרי קניות סיניים (Weidian, 1688, Taobao)
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="הזינו מה תרצו לחפש..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                </div>
                
                <Select
                  value={marketplaceFilter}
                  onValueChange={setMarketplaceFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="בחר שוק" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל האתרים</SelectItem>
                    <SelectItem value="weidian">Weidian בלבד</SelectItem>
                    <SelectItem value="1688">1688 בלבד</SelectItem>
                    <SelectItem value="taobao">Taobao בלבד</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      מחפש...
                    </>
                  ) : (
                    "חפש"
                  )}
                </Button>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span>מיון:</span>
                  <Select
                    value={sortOption}
                    onValueChange={setSortOption}
                  >
                    <SelectTrigger className="h-8 w-[140px]">
                      <SelectValue placeholder="מיון לפי" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">רלוונטיות</SelectItem>
                      <SelectItem value="price">מחיר (מהנמוך לגבוה)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {translatedQuery && (
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Globe size={14} className="mr-1" />
                    <span>תורגם ל: <span className="font-medium">{translatedQuery}</span></span>
                  </div>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        {error && (
          <div className="text-center p-6 bg-secondary/20 rounded-lg mb-6">
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}
        
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card key={index} className="overflow-hidden flex flex-col h-full">
                <div className="aspect-video bg-secondary/20 relative">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-background/80 px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                    {result.site === "weidian" && "Weidian"}
                    {result.site === "1688" && "1688"}
                    {result.site === "taobao" && "Taobao"}
                  </div>
                </div>
                
                <CardContent className="py-4 flex-1">
                  <h3 className="font-medium line-clamp-2 mb-2" title={result.title}>
                    {result.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{result.snippet}</p>
                  
                  <div className="flex items-center text-sm font-medium">
                    <DollarSign size={16} className="mr-1 text-green-600" />
                    <span className="text-green-600">{result.price}</span>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 pb-4">
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
                      <ExternalLink size={16} className="mr-2" />
                      פתח באתר המקורי
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : !loading && !error && (
          <div className="text-center p-10 bg-secondary/10 rounded-xl">
            <Search size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-1">חפשו מוצרים מסין</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              הזינו את מה שאתם מחפשים בעברית או אנגלית, ואנחנו נמצא את זה באתרי הקניות הסיניים.
            </p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default SecretSearch;
