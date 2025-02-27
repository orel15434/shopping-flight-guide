
import { useState } from 'react';
import { Package2, Search, ArrowRight, RefreshCw, Calculator } from 'lucide-react';

interface ShippingRate {
  weightRange: string;
  emsPrice: string;
  fedexPrice: string;
  dhlPrice: string;
}

interface ShippingMethodOption {
  id: string;
  name: string;
  pricePerKg: number;
  description: string;
  deliveryTime: string;
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
        pricePerKg: 17.52,
        description: "שירות חסכוני ומהימן, מתאים למשלוחים קטנים עד 2 ק״ג",
        deliveryTime: "15-25 ימים",
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
        pricePerKg: 17.52,
        description: "שירות חסכוני ומהימן, מתאים למשלוחים קטנים עד 2 ק״ג",
        deliveryTime: "15-25 ימים",
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
        pricePerKg: 17.52,
        description: "שירות חסכוני ומהימן, מתאים למשלוחים קטנים עד 2 ק״ג",
        deliveryTime: "15-25 ימים",
      },
      {
        id: "israel-line-f",
        name: "Israel Line-F",
        pricePerKg: 18.95,
        description: "שירות משלוח ייעודי לישראל, יחס מחיר-מהירות טוב",
        deliveryTime: "12-20 ימים",
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
        pricePerKg: 25.19,
        description: "שירות דואר רשום סטנדרטי, מחיר סביר",
        deliveryTime: "20-35 ימים",
      },
      {
        id: "aramex",
        name: "Aramex",
        pricePerKg: 25.36,
        description: "משלוח מהיר יחסית, חברה מוכרת ואמינה",
        deliveryTime: "10-15 ימים",
      },
      {
        id: "pb-express",
        name: "P&B Express (Tax Free)",
        pricePerKg: 26.34,
        description: "משלוח ללא מיסי ייבוא, מומלץ למשלוחים גדולים",
        deliveryTime: "12-20 ימים",
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
  const [activeTab, setActiveTab] = useState<'table' | 'calculator'>('table');

  const filteredRates = searchWeight
    ? shippingRates.filter(rate => 
        rate.weightRange.includes(searchWeight)
      )
    : shippingRates;

  // מחשבון החדש
  const [selectedAgent, setSelectedAgent] = useState<string>(agentShippingOptions[0].id);
  const [selectedMethod, setSelectedMethod] = useState<string>(agentShippingOptions[0].methods[0].id);
  const [packageWeight, setPackageWeight] = useState<number>(1);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // מצא את הסוכן הנבחר
  const currentAgent = agentShippingOptions.find(agent => agent.id === selectedAgent);
  
  // מצא את שיטת המשלוח הנבחרת
  const currentMethod = currentAgent?.methods.find(method => method.id === selectedMethod);

  // חשב את עלות המשלוח
  const calculateShippingCost = () => {
    if (!currentMethod) return 0;
    
    // הדמיית חישוב (לסימולציה בלבד)
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 800);
    
    return currentMethod.pricePerKg * packageWeight;
  };

  // המרת דולר לשקל
  const shippingCostUSD = calculateShippingCost();
  const shippingCostILS = shippingCostUSD * dollarToShekelRate;

  // טיפול בשינוי הסוכן - איפוס שיטת המשלוח לברירת המחדל של הסוכן החדש
  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    const newAgent = agentShippingOptions.find(agent => agent.id === agentId);
    if (newAgent && newAgent.methods.length > 0) {
      setSelectedMethod(newAgent.methods[0].id);
    }
  };

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
                <input
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
                        <option key={method.id} value={method.id}>
                          {method.name} (${method.pricePerKg}/ק"ג)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* פרטי שיטת המשלוח */}
                {currentMethod && (
                  <div className="bg-secondary/30 rounded-lg p-4 mb-6">
                    <h4 className="font-medium mb-2">{currentMethod.name}</h4>
                    <p className="text-muted-foreground text-sm mb-2">{currentMethod.description}</p>
                    <div className="flex items-center text-sm">
                      <ArrowRight size={14} className="ml-1 text-primary" />
                      <span>זמן משלוח משוער: {currentMethod.deliveryTime}</span>
                    </div>
                  </div>
                )}
                
                {/* הזנת משקל */}
                <div className="mb-8">
                  <label htmlFor="weight" className="block mb-2 font-medium">
                    משקל החבילה (בק״ג)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    min="0.1"
                    max="30"
                    step="0.1"
                    value={packageWeight}
                    onChange={(e) => setPackageWeight(Number(e.target.value))}
                    className="glass-card w-full py-3 px-4 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                {/* תוצאת החישוב */}
                <div className="glass-card rounded-xl overflow-hidden bg-white">
                  <div className="bg-primary/10 p-4 text-center">
                    <h4 className="font-medium">עלות משלוח משוערת</h4>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">מחיר בדולר</div>
                        <div className="flex items-center justify-center">
                          {isCalculating ? (
                            <RefreshCw size={20} className="animate-spin text-primary" />
                          ) : (
                            <div className="text-xl font-medium">${shippingCostUSD.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-secondary/20 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">מחיר בשקלים</div>
                        <div className="flex items-center justify-center">
                          {isCalculating ? (
                            <RefreshCw size={20} className="animate-spin text-primary" />
                          ) : (
                            <div className="text-xl font-medium">₪{shippingCostILS.toFixed(2)}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-primary/5 rounded-lg p-4 text-sm text-muted-foreground">
                  <div className="flex items-start">
                    <Package2 size={18} className="ml-2 mt-0.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="mb-1">
                        <strong>אודות עלויות המשלוח:</strong>
                      </p>
                      <ul className="space-y-1 list-disc pr-5">
                        <li>המחיר המחושב הוא הערכה בלבד המבוססת על מחיר לק"ג × משקל החבילה.</li>
                        <li>העלות הסופית עשויה להשתנות בהתאם לנפח החבילה, המדינה המדויקת ודמי טיפול.</li>
                        <li>שער ההמרה לשקל הוא משוער (שער נוכחי: ${dollarToShekelRate} ₪ לדולר).</li>
                        <li>רוב הסוכנים מציעים EUB כאופציית משלוח מועדפת לישראל.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShippingCosts;
