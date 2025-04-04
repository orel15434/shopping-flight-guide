
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AgentCard, { AgentInfo } from '../components/AgentCard';
import ShippingCosts from '../components/ShippingCosts';
import Footer from '../components/Footer';
import { CheckCircle, ArrowDown, ArrowLeft, ArrowRight, Camera } from 'lucide-react';

export const agents: AgentInfo[] = [
  {
    id: "cssbuy",
    name: "CSSBUY",
    logo: "https://play-lh.googleusercontent.com/uAl9_SpJwURdKGEoRgHSEQ-CAbegLmPx6dNzWBbqZJMkoGsa9Ta4i5M495NycimTKsw",
    description: "פלטפורמה פופולרית עם ממשק משתמש נוח, מחירים תחרותיים ומגוון אפשרויות משלוח.",
    features: [
      "הרשמה פשוטה וידידותית למשתמש", 
      "ממשק קניות אינטואיטיבי", 
      "אפשרויות משלוח מגוונות"
    ],
    website: "https://www.cssbuy.com"
  },
  {
    id: "ponybuy",
    name: "PONYBUY",
    logo: "https://yt3.googleusercontent.com/BoE-3gGWN5GEuco_XRBrkhBtVBOvkNRuKSmKOYscQ9JbdeqfCfYFeJ0xz2JgJEPhvo4WUgcDp2I=s900-c-k-c0x00ffffff-no-rj",
    description: "סוכן חדש יחסית עם שירות לקוחות מצוין, עמלות נמוכות ומחירי משלוח אטרקטיביים.",
    features: [
      "הרשמה מהירה", 
      "עמלות נמוכות", 
      "שירות לקוחות מצוין"
    ],
    website: "https://www.ponbuy.com"
  },
  {
    id: "kakobuy",
    name: "KAKOBUY",
    logo: "https://ugc.production.linktr.ee/8750f613-326d-45a7-9736-572bb9c00240_1732602858057.jpeg",
    description: "סוכן מוכר עם ניסיון רב, מציע איכות צילום גבוהה וממשק מתקדם.",
    features: [
      "תהליך הרשמה מאובטח", 
      "בדיקת איכות קפדנית", 
      "מערכת מעקב משלוחים"
    ],
    website: "https://www.kakobuy.com"
  },
  {
    id: "basetao",
    name: "Basetao",
    logo: "https://www.basetao.com/style/index/img/logo.svg",
    description: "סוכן ותיק עם מוניטין מעולה, שירות צילום מקצועי ותמיכה בעברית.",
    features: [
      "ממשק רב-לשוני", 
      "אפשרויות תשלום מגוונות", 
      "שירות אריזה מתקדם"
    ],
    website: "https://www.basetao.com"
  }
];

const benefits = [
  {
    title: "חיסכון משמעותי בעלויות",
    description: "רכישה דרך סוכנים מאפשרת לקנות ישירות ממקור המוצרים בסין במחירים נמוכים משמעותית מאשר בישראל."
  },
  {
    title: "גישה למגוון עצום של מוצרים",
    description: "אפשרות לרכוש מוצרים שאינם זמינים בישראל, ממגוון רחב של חנויות וספקים סיניים."
  },
  {
    title: "בדיקת איכות מקצועית",
    description: "הסוכנים מציעים שירותי בדיקת איכות וצילום מפורט של המוצרים לפני המשלוח לישראל."
  },
  {
    title: "מערכת מעקב משלוחים",
    description: "אפשרות לעקוב אחר החבילה לאורך כל הדרך, מרגע הרכישה ועד להגעתה לביתך."
  }
];

const Index = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set a timeout to trigger the animation
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <main id="main-content">
        {/* Agents Section */}
        <section id="agents" className="section-padding">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                סוכנים מובילים
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
                בחר את הסוכן המתאים לך
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ישנם מספר סוכנים סיניים מובילים, לכל אחד יתרונות וחסרונות. בחר את הסוכן המתאים לצרכים שלך
                ועקוב אחר המדריך המפורט.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent, index) => (
                <AgentCard 
                  key={agent.id} 
                  agent={agent} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                יתרונות
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
                למה לרכוש דרך סוכנים?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                רכישה באמצעות סוכנים סיניים מציעה מספר יתרונות משמעותיים לעומת רכישה ישירה או דרך אתרי קניות בינלאומיים
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div 
                  key={index} 
                  className={`glass-card rounded-xl p-6 ${isVisible ? 'slide-up' : 'opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary ml-4">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button
                onClick={() => document.getElementById('shipping-costs')?.scrollIntoView({ behavior: 'smooth' })}
                className="button-animation inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg"
              >
                <span>למידע על מחירי משלוח</span>
                <ArrowDown size={18} className="mr-2" />
              </button>
            </div>
          </div>
        </section>
        
        {/* QC Gallery Promo */}
        <section className="section-padding bg-gradient-to-r from-primary/10 to-secondary/40">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary/20 text-primary">
                <Camera size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
                גלריית תמונות QC
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                בדקו תמונות QC ממוצרים שקנו חברי הקהילה, דרגו את האיכות ושתפו את המוצרים שלכם
              </p>
              <Link 
                to="/qc-gallery"
                className="button-animation inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg"
              >
                <span>לגלריית התמונות</span>
                <ArrowLeft size={18} className="mr-2" />
              </Link>
            </div>
          </div>
        </section>
        
        {/* Shipping Costs Section */}
        <ShippingCosts />
        
        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 heading-gradient">
                מוכנים להתחיל לרכוש מסין?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                בחרו את הסוכן המתאים לכם ועקבו אחר המדריך המפורט שלנו כדי להתחיל לרכוש ולחסוך כסף
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {agents.map((agent) => (
                  <a
                    key={agent.id}
                    href={`/agent/${agent.id}`}
                    className="inline-flex items-center px-5 py-2.5 bg-white hover:bg-primary/5 border border-border rounded-lg transition-colors"
                  >
                    <span className="font-medium">{agent.name}</span>
                    <ArrowLeft size={16} className="mr-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
