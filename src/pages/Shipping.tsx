
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ShippingCosts from '../components/ShippingCosts';
import { Package2, AlertCircle, CheckCircle, Clock, CreditCard, TruckDelivery, Scale, FileText } from 'lucide-react';

interface ShippingMethodInfo {
  id: string;
  name: string;
  speed: number; // 1-5, where 5 is fastest
  cost: number; // 1-5, where 5 is most expensive
  reliability: number; // 1-5
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

const shippingMethods: ShippingMethodInfo[] = [
  {
    id: "ems",
    name: "EMS",
    speed: 3,
    cost: 2,
    reliability: 4,
    description: "שירות דואר מהיר בינלאומי, המספק משלוחים במחיר סביר עם יכולות מעקב בסיסיות.",
    pros: [
      "מחיר משתלם יחסית", 
      "כיסוי גלובלי כמעט מלא", 
      "פחות בעיות מכס ביחס לשירותים מסחריים"
    ],
    cons: [
      "איטי יותר מ-DHL/FedEx", 
      "פחות אמין במעקב", 
      "התמודדות עם בעיות עלולה להיות מסובכת"
    ],
    bestFor: "משלוחים שאינם דחופים, חבילות בינוניות במשקל, ומשלוחים בתקציב מוגבל"
  },
  {
    id: "dhl",
    name: "DHL",
    speed: 5,
    cost: 5,
    reliability: 5,
    description: "חברת משלוחים מובילה המספקת שירות מהיר ואמין עם מעקב מפורט ושירות לקוחות מעולה.",
    pros: [
      "המהיר ביותר לרוב", 
      "מעקב מעולה ומפורט", 
      "שירות לקוחות ברמה גבוהה"
    ],
    cons: [
      "יקר משמעותית", 
      "עמלות מכס ומס גבוהות יותר", 
      "לא כדאי לחבילות קטנות או לא דחופות"
    ],
    bestFor: "משלוחים דחופים, פריטים יקרי ערך, וכאשר אמינות ומהירות חשובים יותר מעלות"
  },
  {
    id: "fedex",
    name: "FedEx",
    speed: 4,
    cost: 4,
    reliability: 4,
    description: "חברת משלוחים מוכרת המספקת שירות מהיר ואמין עם מגוון אפשרויות משלוח.",
    pros: [
      "שירות מהיר ואמין", 
      "אפשרויות משלוח מגוונות", 
      "מעקב טוב אחר חבילות"
    ],
    cons: [
      "עלות גבוהה", 
      "עמלות נוספות עלולות להיות מפתיעות", 
      "שירות לא עקבי בכל המדינות"
    ],
    bestFor: "משלוחים בזמן קצר, חבילות גדולות יותר, ומשלוחים הדורשים מעקב מדויק"
  },
  {
    id: "china-post",
    name: "China Post",
    speed: 1,
    cost: 1,
    reliability: 2,
    description: "שירות דואר בסיסי וזול ביותר, אך איטי משמעותית וללא מעקב מפורט.",
    pros: [
      "הזול ביותר", 
      "זמין כמעט בכל הסוכנים", 
      "עלויות מכס ומס נמוכות יותר"
    ],
    cons: [
      "איטי מאוד (20-60 ימים)", 
      "מעקב מוגבל או לא קיים", 
      "סיכוי גבוה יותר לאיבוד חבילות"
    ],
    bestFor: "פריטים זולים, לא דחופים, וכאשר המחיר הוא השיקול העיקרי"
  }
];

const Shipping = () => {
  const [selectedMethod, setSelectedMethod] = useState<ShippingMethodInfo | null>(null);

  const renderRating = (value: number, maxValue: number = 5) => {
    return (
      <div className="flex items-center">
        {[...Array(maxValue)].map((_, i) => (
          <div
            key={i}
            className={`w-2 h-8 rounded-full mx-0.5 ${
              i < value ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <div className="pt-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6 heading-gradient">
              מידע על משלוחים מסין לישראל
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              מדריך מקיף לכל אפשרויות המשלוח מסין לישראל, כולל השוואת מחירים, זמני משלוח, ומידע על מכס ומיסים
            </p>
          </div>
        </div>
      </div>
      
      <main className="container py-12">
        {/* Shipping Methods Comparison */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 heading-gradient">
              השוואת שיטות משלוח
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              סקירה של שיטות המשלוח הנפוצות מסין לישראל, כולל השוואה של מהירות, עלות ואמינות
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingMethods.map((method) => (
              <div
                key={method.id}
                className={`glass-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  selectedMethod?.id === method.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedMethod(method)}
              >
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{method.name}</h3>
                    <div className="flex space-x-2 space-x-reverse">
                      <div className="flex items-center text-sm">
                        <Clock size={14} className="ml-1 text-primary" />
                        <span>מהירות</span>
                      </div>
                      {renderRating(method.speed)}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center text-sm">
                      <CreditCard size={14} className="ml-1 text-primary" />
                      <span>עלות</span>
                    </div>
                    {renderRating(method.cost)}
                  </div>
                  
                  <div className="flex justify-between mb-4">
                    <div className="flex items-center text-sm">
                      <TruckDelivery size={14} className="ml-1 text-primary" />
                      <span>אמינות</span>
                    </div>
                    {renderRating(method.reliability)}
                  </div>
                  
                  <div className="px-3 py-1.5 bg-secondary/50 rounded-lg text-sm inline-block">
                    מתאים עבור: {method.bestFor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Selected Method Details */}
        {selectedMethod && (
          <section className="mb-16 fade-in">
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-2xl font-serif font-bold mb-6 heading-gradient">
                {selectedMethod.name} - מידע מפורט
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <CheckCircle size={18} className="ml-2 text-green-500" />
                    יתרונות
                  </h4>
                  <ul className="space-y-2">
                    {selectedMethod.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-500 ml-2 mt-0.5">
                          <CheckCircle size={12} />
                        </span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3 flex items-center">
                    <AlertCircle size={18} className="ml-2 text-destructive" />
                    חסרונות
                  </h4>
                  <ul className="space-y-2">
                    {selectedMethod.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-destructive/10 text-destructive ml-2 mt-0.5">
                          <AlertCircle size={12} />
                        </span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4 mt-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary ml-3">
                      <Info size={20} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">למי {selectedMethod.name} מתאים?</h4>
                    <p className="text-muted-foreground">{selectedMethod.bestFor}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* Shipping Costs */}
        <ShippingCosts />
        
        {/* Customs and Taxes */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4 heading-gradient">
              מידע על מכס ומיסים
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              מידע חשוב על תהליכי המכס ותשלומי המיסים בעת ייבוא מוצרים מסין לישראל
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-3 flex items-center">
                  <FileText size={18} className="ml-2 text-primary" />
                  חוקי המכס בישראל
                </h3>
                <p className="text-muted-foreground mb-2">
                  כל חבילה המגיעה לישראל עוברת בדיקה במכס. חשוב להכיר את הכללים והפטורים:
                </p>
                <ul className="space-y-2 pr-5 list-disc">
                  <li>חבילות בשווי של עד $75 (כולל משלוח) פטורות ממע״מ וממכס (פטור אישי).</li>
                  <li>מעל $75 ועד $500, יחול מע״מ (17%) על כל שווי החבילה כולל המשלוח.</li>
                  <li>מעל $500, יחול גם מכס בהתאם לקטגוריית המוצר (בנוסף למע״מ).</li>
                  <li>עלויות שחרור מהמכס כוללות דמי טיפול ואחסנה אם לא משוחרר בזמן.</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-3 flex items-center">
                  <Scale size={18} className="ml-2 text-primary" />
                  שיעורי מכס לקטגוריות מוצרים נפוצות
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-4 py-2 font-medium">קטגוריה</th>
                        <th className="px-4 py-2 font-medium">שיעור מכס</th>
                        <th className="px-4 py-2 font-medium">הערות</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 font-medium">ביגוד והנעלה</td>
                        <td className="px-4 py-2">6-12%</td>
                        <td className="px-4 py-2">תלוי בסוג הפריט</td>
                      </tr>
                      <tr className="border-t border-border bg-secondary/20">
                        <td className="px-4 py-2 font-medium">אלקטרוניקה</td>
                        <td className="px-4 py-2">0-15%</td>
                        <td className="px-4 py-2">מוצרי IT רבים פטורים ממכס</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 font-medium">תכשיטים</td>
                        <td className="px-4 py-2">12%</td>
                        <td className="px-4 py-2">גם על תכשיטי אופנה</td>
                      </tr>
                      <tr className="border-t border-border bg-secondary/20">
                        <td className="px-4 py-2 font-medium">מוצרי קוסמטיקה</td>
                        <td className="px-4 py-2">12-16%</td>
                        <td className="px-4 py-2">דורש אישורים מיוחדים</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-4 py-2 font-medium">צעצועים ומשחקים</td>
                        <td className="px-4 py-2">12%</td>
                        <td className="px-4 py-2">צעצועים עד גיל 3 דורשים תקן</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-primary mt-1 ml-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">חשוב לדעת</h4>
                    <p className="text-sm">
                      הצהרת ערך נמוכה מדי עלולה להוביל לעיכובים, קנסות ואף להחרמת המוצרים. 
                      מומלץ להצהיר על הערך האמיתי של החבילה כדי להימנע מבעיות במכס.
                      שירותי המכס בישראל הופכים יעילים יותר בזיהוי הערכות חסר.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
