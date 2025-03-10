import { useState, useMemo, useEffect } from 'react';
import { Package2, Search, Calculator, ThumbsUp, Zap, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { fetchCSSBUYShippingRates, formatCSSBUYShippingData } from '../utils/shippingUtils';

interface ShippingRate {
  weightRange: string;
  emsPrice: string;
  fedexPrice: string;
  dhlPrice: string;
}

interface PricePoint {
  weight: number;
  price: number;
}

interface ShippingMethodOption {
  id: string;
  name: string;
  prices: PricePoint[];
  description: string;
  deliveryTime: string;
  maxWeight: number;
  minDeliveryDays: number;
  maxDeliveryDays: number;
  // New property for dynamic calculation
  dynamicCalculation?: {
    baseFee: number;
    baseWeight: number;
    additionalFeePerUnit: number;
    unitWeight: number;
    maxWeightGrams: number;
  };
}

interface AgentShippingOptions {
  id: string;
  name: string;
  methods: ShippingMethodOption[];
}

const agentShippingOptions: AgentShippingOptions[] = [
  {
    id: "cssbuy",
    name: "CSSBUY",
    methods: [
      {
        id: "eub",
        name: "EUB",
        prices: [], // Empty array since we're using dynamic calculation
        description: "שירות חסכוני ומהימן, מתאים למשלוחים קטנים עד 3 ק״ג",
        deliveryTime: "15-30 ימים",
        maxWeight: 3,
        minDeliveryDays: 15,
        maxDeliveryDays: 30,
        dynamicCalculation: {
          baseFee: 4.85, // Base fee for first 100g
          baseWeight: 100, // First 100g
          additionalFeePerUnit: 1.38, // Fee per additional 100g
          unitWeight: 100, // Unit in grams
          maxWeightGrams: 3000 // Max weight in grams
        }
      }
    ]
  },
  {
    id: "basetao",
    name: "Basetao",
    methods: [
      {
        id: "eub",
        name: "EUB",
        prices: [
          { weight: 1, price: 17.22 },
          { weight: 2, price: 30.94 },
          { weight: 3, price: 44.48 },
          { weight: 4, price: 58.11 },
          { weight: 5, price: 71.74 }
        ],
        description: "שירות חסכוני ומהימן, מתאים למשלוחים עד 5 ק״ג",
        deliveryTime: "15-20 ימים",
        maxWeight: 5,
        minDeliveryDays: 15,
        maxDeliveryDays: 20
      }
    ]
  },
  {
    id: "kakobuy",
    name: "KAKOBUY",
    methods: [
      {
        id: "eub",
        name: "EUB",
        prices: [
          { weight: 1, price: 17.47 }, // הוספתי מחיר ל-1 קילו
          { weight: 2, price: 30.31 },
          { weight: 3, price: 43.15 },
          { weight: 4, price: 55.99 },
          { weight: 5, price: 68.83 }
        ],
        description: "שירות חסכוני ומהימן, מתאים למשלוחים עד 5 ק״ג",
        deliveryTime: "15-20 ימים",
        maxWeight: 5,
        minDeliveryDays: 15,
        maxDeliveryDays: 20
      },
      {
        id: "israel-line-f",
        name: "Israel Line-F",
        prices: [
          { weight: 1, price: 18.9 }, // הוספתי מחיר ל-1 קילו
          { weight: 2, price: 32.47 },
          { weight: 3, price: 46.04 },
          { weight: 4, price: 59.61 },
          { weight: 5, price: 73.17 }
        ],
        description: "שירות משלוח ייעודי לישראל, יחס מחיר-מהירות טוב",
        deliveryTime: "7-18 ימים",
        maxWeight: 5,
        minDeliveryDays: 7,
        maxDeliveryDays: 18
      }
    ]
  },
  {
    id: "ponybuy",
    name: "PONYBUY",
    methods: [
      {
        id: "china-post",
        name: "China Post Registered Packet",
        prices: [
          { weight: 1, price: 25.19 }, // הוספתי מחיר ל-1 קילו
          { weight: 2, price: 42.5 }
        ],
        description: "שירות דואר רשום סטנדרטי, מתאים למשלוחים עד 2 ק״ג",
        deliveryTime: "7-15 ימים",
        maxWeight: 2,
        minDeliveryDays: 7,
        maxDeliveryDays: 15
      },
      {
        id: "aramex",
        name: "Aramex",
        prices: [
          { weight: 1, price: 25.36 }, // הוספתי מחיר ל-1 קילו
          { weight: 2, price: 37.68 },
          { weight: 3, price: 49.99 },
          { weight: 4, price: 62.12 },
          { weight: 5, price: 74.44 }
        ],
        description: "משלוח מהיר יחסית, חברה מוכרת ואמינה",
        deliveryTime: "5-8 ימים",
        maxWeight: 5,
        minDeliveryDays: 5,
        maxDeliveryDays: 8
      },
      {
        id: "pb-express",
        name: "P&B Express (Tax Free)",
        prices: [
          { weight: 1, price: 26.34 }, // הוספתי מחיר ל-1 קילו
          { weight: 2, price: 42.56 },
          { weight: 3, price: 58.79 },
          { weight: 4, price: 75.01 },
          { weight: 5, price: 91.23 }
        ],
        description: "משלוח ללא מיסי ייבוא, מומלץ למשלוחים גדולים",
        deliveryTime: "8-20 ימים",
        maxWeight: 5,
        minDeliveryDays: 8,
        maxDeliveryDays: 20
      }
    ]
  }
];

const shippingRates: ShippingRate[] = [
  { weightRange: "0.5 - 1 ק״ג", emsPrice: "120-180 ₪", fedexPrice: "240-280 ₪", dhlPrice: "260-320 ₪" },
  { weightRange: "1 - 2 ק״ג", emsPrice: "180-240 ₪", fedexPrice: "280-340 ₪", dhlPrice: "320-400 ₪" },
  { weightRange: "2 - 3 ק״ג", emsPrice: "240-300 ₪", fedexPrice: "340-420 ₪", dhlPrice: "400-500 ₪" },
  { weightRange: "3 - 4 ק״ג", emsPrice: "300-380 ₪", fedexPrice: "420-500 ₪", dhlPrice: "500-600 ₪" },
  { weightRange: "4 - 5 ק״ג", emsPrice: "380-460 ₪", fedexPrice: "500-580 ₪", dhlPrice: "600-700 ₪" },
  { weightRange: "5 - 10 ק״ג", emsPrice: "460-800 ₪", fedexPrice: "580-1100 ₪", dhlPrice: "700-1300 ₪" },
  { weightRange: "10 - 15 ק״ג", emsPrice: "800-1200 ₪", fedexPrice: "1100-1600 ₪", dhlPrice: "1300-1900 ₪" },
  { weightRange: "15 - 20 ק״ג", emsPrice: "1200-1500 ₪", fedexPrice: "1600-2000 ₪", dhlPrice: "1900-2400 ₪" },
];

const dollarToShekelRate = 3.7; // המרה משוערת

const ShippingCosts = () => {
  const [searchWeight, setSearchWeight] = useState("");
  const [activeTab, setActiveTab] = useState<'table' | 'calculator'>('calculator');

  const filteredRates = searchWeight
    ? shippingRates.filter(rate => 
        rate.weightRange.includes(searchWeight)
      )
    : shippingRates;

  // מחשבון החדש
  const [selectedAgent, setSelectedAgent] = useState<string>(agentShippingOptions[0].id);
  const [selectedMethod, setSelectedMethod] = useState<string>(agentShippingOptions[0].methods[0].id);
  const [packageWeight, setPackageWeight] = useState<number>(1000); // כברירת מחדל מוגדר כעת ל-1000 גרם
  
  // State for CSSBUY API results
  const [cssbuySippingOptions, setCSSBUYShippingOptions] = useState<any[]>([]);
  const [isLoadingCSS, setIsLoadingCSS] = useState(false);
  const [cssApiError, setCSSApiError] = useState<string | null>(null);
  const [useCSBuyAPI, setUseCSBuyAPI] = useState<boolean>(false);

  // מצא את הסוכן הנבחר
  const currentAgent = agentShippingOptions.find(agent => agent.id === selectedAgent);
  
  // מצא את שיטת המשלוח הנבחרת
  const currentMethod = currentAgent?.methods.find(method => method.id === selectedMethod);

  // פונקציה לחישוב דינמי של עלויות משלוח לפי הסוכן והשיטה
  const calculateDynamicCost = (weightGrams: number, dynamicConfig: ShippingMethodOption['dynamicCalculation']) => {
    if (!dynamicConfig) return 0;
    
    if (weightGrams <= 0) return 0;
    if (weightGrams > dynamicConfig.maxWeightGrams) return -1; // חריגת משקל
    
    // חישוב מחיר לפי נוסחה דינמית
    const { baseFee, baseWeight, additionalFeePerUnit, unitWeight } = dynamicConfig;
    
    // מספר יחידות מלאות מעבר למשקל הבסיס
    const fullUnits = Math.floor((weightGrams - baseWeight) / unitWeight);
    
    // שארית גרמים מעבר ליחידות המלאות
    const remainingGrams = (weightGrams - baseWeight) % unitWeight;
    
    let cost = baseFee;
    
    // הוסף עלות עבור יחידות מלאות
    if (fullUnits > 0) {
      cost += fullUnits * additionalFeePerUnit;
    }
    
    // הוסף עלות יחסית עבור שארית המשקל
    if (remainingGrams > 0) {
      cost += (remainingGrams / unitWeight) * additionalFeePerUnit;
    }
    
    return cost;
  };

  // חישוב לפי שיטת Kakobuy EUB Pure Weight
  const calculateKakobuyEUBPureWeight = (weightGrams: number) => {
    const FIRST_PRICE = 1.55; // דולר ל-100 גרם הראשונים
    const CONTINUED_PRICE_PER_100G = 1.30; // דולר לכל 100 גרם נוספים
    const CARRIER_PROCESSING_FEE = 3.24; // עמלת עיבוד
    const OPERATION_FEE = 1.18; // עמלה תפעולית
    const MIN_WEIGHT = 200; // גרם
    const MAX_WEIGHT = 2000; // גרם

    if (weightGrams < MIN_WEIGHT) return -2; // Below minimum weight
    if (weightGrams > MAX_WEIGHT) return -1; // Above maximum weight

    const fullUnits = Math.floor((weightGrams - 100) / 100); // יחידות מלאות מעבר ל-100 גרם
    const remainingGrams = (weightGrams - 100) % 100; // שארית גרמים

    let baseCost = FIRST_PRICE;
    if (fullUnits > 0) {
      baseCost += fullUnits * CONTINUED_PRICE_PER_100G;
    }
    if (remainingGrams > 0) {
      baseCost += (remainingGrams / 100) * CONTINUED_PRICE_PER_100G;
    }

    const totalCost = baseCost + CARRIER_PROCESSING_FEE + OPERATION_FEE;
    return totalCost;
  };

  // חשב את עלות המשלוח לפי הטבלת מחירים או החישוב הדינמי
  const calculateShippingCost = () => {
    if (!currentMethod) return 0;
    
    // המרת משקל מגרמים לקילוגרמים לצורך השוואה עם המשקל המקסימלי המוגדר בקילוגרמים
    const weightInKg = packageWeight / 1000;
    
    // בדיקה אם המשקל גדול מהמקסימום המותר לשיטה זו
    if (weightInKg > currentMethod.maxWeight) {
      return -1; // קוד שגיאה למשקל חורג
    }
    
    // בדיקה אם מדובר ב-Kakobuy EUB - Pure Weight
    if (selectedAgent === "kakobuy" && selectedMethod === "eub") {
      return calculateKakobuyEUBPureWeight(packageWeight);
    }
    
    // במידה ויש חישוב דינמי, השתמש בו
    if (currentMethod.dynamicCalculation) {
      return calculateDynamicCost(packageWeight, currentMethod.dynamicCalculation);
    }
    
    // אחרת, חשב לפי טבלת המחירים הקבועה
    // מצא את נקודת המחיר הקרובה ביותר למשקל המבוקש (עיגול כלפי מעלה)
    const pricePoint = [...currentMethod.prices]
      .sort((a, b) => a.weight - b.weight)
      .find(point => point.weight >= weightInKg);
    
    if (pricePoint) {
      return pricePoint.price;
    } else if (currentMethod.prices.length > 0) {
      // אם אין מחיר מדויק, קח את המחיר לפי המשקל הגדול ביותר
      const highestPricePoint = currentMethod.prices.reduce(
        (max, point) => (point.weight > max.weight ? point : max),
        currentMethod.prices[0]
      );
      
      // חישוב פשוט: יחס ליניארי
      return (weightInKg / highestPricePoint.weight) * highestPricePoint.price;
    }
    
    return 0;
  };

  // המרת דולר לשקל
  const shippingCostUSD = calculateShippingCost();
  const shippingCostILS = shippingCostUSD > 0 ? shippingCostUSD * dollarToShekelRate : -1;

  // בדיקה אם המשקל חורג מהמקסימום המותר
  const isWeightExceeded = shippingCostUSD === -1;
  // בדיקה אם המשקל נמוך מהמינימום (עבור Kakobuy EUB)
  const isBelowMinWeight = shippingCostUSD === -2;

  // טיפול בשינוי הסוכן - איפוס שיטת המשלוח לברירת המחדל של הסוכן החדש
  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    // אם בוחרים CSSBUY, אפשר להשתמש ב-API
    setUseCSBuyAPI(agentId === "cssbuy");
    
    const newAgent = agentShippingOptions.find(agent => agent.id === agentId);
    if (newAgent && newAgent.methods.length > 0) {
      setSelectedMethod(newAgent.methods[0].id);
    }
  };

  // פונקציה לפתיחת חישוב באמצעות ה-API של CSSBUY
  const fetchCSSBUYRates = async () => {
    if (!packageWeight) return;
    
    setIsLoadingCSS(true);
    setCSSApiError(null);
    
    try {
      const response = await fetchCSSBUYShippingRates(packageWeight);
      
      if (response.error) {
        setCSSApiError(response.message || "שגיאה בטעינת נתוני משלוח");
        setCSSBUYShippingOptions([]);
      } else {
        const formattedOptions = formatCSSBUYShippingData(response);
        setCSSBUYShippingOptions(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching CSSBUY rates:", error);
      setCSSApiError("שגיאה בטעינת נתוני משלוח");
      setCSSBUYShippingOptions([]);
    } finally {
      setIsLoadingCSS(false);
    }
  };

  // מצא את כל שיטות המשלוח האפשריות עבור המשקל הנוכחי
  const availableShippingOptions = useMemo(() => {
    const options: Array<{
      agentId: string;
      agentName: string;
      methodId: string;
      methodName: string;
      price: number;
      minDeliveryDays: number;
      maxDeliveryDays: number;
    }> = [];

    agentShippingOptions.forEach(agent => {
      agent.methods.forEach(method => {
        // המרת משקל מגרמים לקילוגרמים לצורך השוואה עם המשקל המקסימלי המוגדר בקילוגרמים
        const weightInKg = packageWeight / 1000;
        
        if (weightInKg <= method.maxWeight) {
          // חישוב מחיר לשיטה זו - בדיקה אם יש חישוב דינמי
          let price = 0;
          
          if (method.dynamicCalculation) {
            price = calculateDynamicCost(packageWeight, method.dynamicCalculation);
            
            // אם המשקל חורג, דלג על האפשרות הזו
            if (price === -1) return;
          } else {
            // חישוב לפי טבלת מחירים רגילה
            const pricePoint = [...method.prices]
              .sort((a, b) => a.weight - b.weight)
              .find(point => point.weight >= weightInKg);
            
            if (pricePoint) {
              price = pricePoint.price;
            } else if (method.prices.length > 0) {
              const highestPricePoint = method.prices.reduce(
                (max, point) => (point.weight > max.weight ? point : max),
                method.prices[0]
              );
              price = (weightInKg / highestPricePoint.weight) * highestPricePoint.price;
            }
          }

          options.push({
            agentId: agent.id,
            agentName: agent.name,
            methodId: method.id,
            methodName: method.name,
            price,
            minDeliveryDays: method.minDeliveryDays,
            maxDeliveryDays: method.maxDeliveryDays
          });
        }
      });
    });

    return options;
  }, [packageWeight]);

  // מצא את האפשרות הזולה ביותר והמהירה ביותר
  const cheapestOption = useMemo(() => {
    return availableShippingOptions.length > 0
      ? availableShippingOptions.reduce((min, option) => 
          option.price < min.price ? option : min, availableShippingOptions[0])
      : null;
  }, [availableShippingOptions]);

  const fastestOption = useMemo(() => {
    return availableShippingOptions.length > 0
      ? availableShippingOptions.reduce((fastest, option) => 
          option.minDeliveryDays < fastest.minDeliveryDays ? option : fastest, availableShippingOptions[0])
      : null;
  }, [availableShippingOptions]);

  // קריאה ל-API כאשר המשקל משתנה ו-CSSBUY נבחר עם API מופעל
  useEffect(() => {
    if (selectedAgent === "cssbuy" && useCSBuyAPI) {
      fetchCSSBUYRates();
    }
  }, [packageWeight, selectedAgent, useCSBuyAPI]);

  return (
    <section id="shipping-costs" className="section-padding">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
              עלויות משלוח לישראל
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              להלן מחירוני המשלוחים הנפוצים מסין לישראל. המחירים הם הערכה בלבד וכפופים לשינויים לפי הסוכן, 
              נפח החבילה, ומדיניות המשלוח העדכנית.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center mb-6">
            <div className="bg-secondary rounded-lg p-1 flex">
              <button
                onClick={() => setActiveTab('table')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'table' 
                    ? 'bg-white shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                טבלת מחירים
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-4 py-2 rounded-md transition-all ${
                  activeTab === 'calculator' 
                    ? 'bg-white shadow-sm text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                מחשבון משלוח
              </button>
            </div>
          </div>

          {activeTab === 'table' && (
            <>
              <div className="mb-6 relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search size={18} className="text-muted-foreground" />
                </div>
                <Input
                  type="text"
                  placeholder="חפש לפי משקל..."
                  className="glass-card w-full py-3 px-10 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchWeight}
                  onChange={(e) => setSearchWeight(e.target.value)}
                />
              </div>

              <div className="glass-card rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-4 py-3 font-medium">טווח משקל</th>
                        <th className="px-4 py-3 font-medium">EMS</th>
                        <th className="px-4 py-3 font-medium">FedEx</th>
                        <th className="px-4 py-3 font-medium">DHL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRates.length > 0 ? (
                        filteredRates.map((rate, index) => (
                          <tr 
                            key={index}
                            className={`border-t border-border ${
                              index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'
                            }`}
                          >
                            <td className="px-4 py-3 font-medium">{rate.weightRange}</td>
                            <td className="px-4 py-3">{rate.emsPrice}</td>
                            <td className="px-4 py-3">{rate.fedexPrice}</td>
                            <td className="px-4 py-3">{rate.dhlPrice}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            לא נמצאו תוצאות מתאימות
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                * המחירים הם הערכה בלבד ועשויים להשתנות בהתאם לגודל החבילה, תכולתה ומדיניות חברת המשלוחים
              </div>
            </>
          )}

          {activeTab === 'calculator' && (
            <div className="glass-card rounded-xl p-6">
              <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-center mb-8">
                  <Calculator size={24} className="text-primary ml-2" />
                  <h3 className="text-xl font-medium">מחשבון עלויות משלוח</h3>
                </div>
                
                {/* המלצות עבור המשלוח הזול והמהיר */}
                {availableShippingOptions.length > 0 && (
                  <div className="mb-8 bg-secondary/20 rounded-xl p-5">
                    <h4 className="text-lg font-medium text-center mb-4">המלצות משלוח</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cheapestOption && (
                        <div className="bg-white rounded-lg p-4 shadow-sm flex">
                          <div className="flex-shrink-0 ml-3">
                            <div className="bg-green-100 rounded-full p-2 text-green-600">
                              <ThumbsUp size={20} />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">האפשרות הזולה ביותר</div>
                            <div className="text-sm text-muted-foreground">
                              {cheapestOption.agentName} - {cheapestOption.methodName}
                            </div>
                            <div className="text-sm font-medium text-primary">${cheapestOption.price.toFixed(2)}</div>
                          </div>
                        </div>
                      )}
                      
                      {fastestOption && (
                        <div className="bg-white rounded-lg p-4 shadow-sm flex">
                          <div className="flex-shrink-0 ml-3">
                            <div className="bg-blue-100 rounded-full p-2 text-blue-600">
                              <Zap size={20} />
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">האפשרות המהירה ביותר</div>
                            <div className="text-sm text-muted-foreground">
                              {fastestOption.agentName} - {fastestOption.methodName}
                            </div>
                            <div className="text-sm font-medium text-primary">{fastestOption.minDeliveryDays}-{fastestOption.maxDeliveryDays} ימים</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* בחירת סוכן */}
                  <div>
                    <label htmlFor="agent" className="block mb-2 font-medium">
                      בחר סוכן
                    </label>
                    <select
                      id="agent"
                      value={selectedAgent}
                      onChange={(e) => handleAgentChange(e.target.value)}
                      className="glass-card w-full py-3 px-4 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {agentShippingOptions.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* בחירת שיטת משלוח */}
                  <div>
                    <label htmlFor="shipping-method" className="block mb-2 font-medium">
                      שיטת משלוח
                    </label>
                    <select
                      id="shipping-method"
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="glass-card w-full py-3 px-4 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {currentAgent?.methods.map((method) => (
                        <option key={method.id} value={method.id} disabled={packageWeight/1000 > method.maxWeight}>
                          {method.name} (עד {method.maxWeight} ק"ג)
                        </option>
                      ))}
                    </select>
                    
                    {selectedAgent === "cssbuy" && (
                      <div className="mt-2">
                        <label className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={useCSBuyAPI}
                            onChange={(e) => setUseCSBuyAPI(e.target.checked)}
                            className="mr-2"
                          />
                          <span>השתמש ב-API מקוון של CSSBUY (נסיוני)</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* פרטי שיטת המשלוח */}
                {currentMethod && !useCSBuyAPI && (
                  <div className="bg-secondary/30 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2">{currentMethod.name}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{currentMethod.description}</p>
                    <div className="flex items-center text-sm">
                      <span>זמן משלוח משוער: {currentMethod.deliveryTime}</span>
                    </div>
                    <div className="text-sm mt-2 text-muted-foreground">
                      מקסימום משקל לשליחה: <span className="font-medium">{currentMethod.maxWeight} ק"ג ({currentMethod.maxWeight * 1000} גרם)</span>
                    </div>
                    {currentMethod.dynamicCalculation && (
                      <div className="mt-2 text-sm text-primary">
                        חישוב מחיר: דינמי לפי משקל מדויק
                      </div>
                    )}
                  </div>
                )}
                
                {/* הזנת משקל - עדכון להזנת גרמים */}
                <div className="mb-8">
                  <label htmlFor="weight" className="block mb-2 font-medium">
                    משקל החבילה (בגרמים)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    min="1"
                    max="30000"
                    step="1"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(Number(e.target.value))}
                    className="glass-card w-full py-3 px-4 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="למשל: 2000 עבור 2 ק״ג"
                  />
                  <div className="mt-2 text-sm text-muted-foreground">
                    משקל בקילוגרמים: <span className="font-medium">{(packageWeight / 1000).toFixed(2)} ק"ג</span>
                  </div>
                </div>

                {/* תצוגת אפשרויות המשלוח מ-API של CSSBUY */}
                {selectedAgent === "cssbuy" && useCSBuyAPI && (
                  <div className="mb-8">
                    <div className="glass-card rounded-xl overflow-hidden bg-white">
                      <div className="bg-primary/10 p-4 text-center">
                        <h4 className="font-medium">אפשרויות משלוח מ-CSSBUY עבור {packageWeight} גרם</h4>
                      </div>
                      <div className="p-6">
                        {isLoadingCSS ? (
                          <div className="text-center py-4">
                            <div className="loading-spinner mb-2"></div>
                            <p>טוען אפשרויות משלוח...</p>
                          </div>
                        ) : cssApiError ? (
                          <div className="text-center py-4 text-red-500">
                            <AlertCircle size={24} className="mx-auto mb-2" />
                            <p>{cssApiError}</p>
                          </div>
                        ) : cssbuySippingOptions.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            <p>לא נמצאו אפשרויות משלוח זמינות</p>
                            <button 
                              onClick={fetchCSSBUYRates}
                              className="mt-2 px-4 py-2 bg-secondary rounded-md text-sm"
                            >
                              נסה שוב
                            </button>
                          </div>
                        ) : (
                          <div className
