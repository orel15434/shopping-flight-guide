
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
          
          <div className="grid grid-cols-1 m