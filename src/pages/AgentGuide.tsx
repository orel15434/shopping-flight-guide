
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuideSection from '../components/GuideSection';
import ShippingCosts from '../components/ShippingCosts';
import { User, ShoppingBag, Truck, ArrowLeft, ArrowRight, ExternalLink, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface AgentDetails {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  registrationSteps: string[];
  purchaseSteps: string[];
  shippingSteps: string[];
  pros: string[];
  cons: string[];
  tips: string[];
}

const agentsData: Record<string, AgentDetails> = {
  "cssbuy": {
    id: "cssbuy",
    name: "CSSBUY",
    logo: "https://play-lh.googleusercontent.com/uAl9_SpJwURdKGEoRgHSEQ-CAbegLmPx6dNzWBbqZJMkoGsa9Ta4i5M495NycimTKsw",
    description: "CSSBUY הוא אחד הסוכנים הוותיקים והמוכרים בתחום, המציע מגוון רחב של שירותים במחירים תחרותיים. הממשק נוח לשימוש וקיימת תמיכה באנגלית.",
    website: "https://www.cssbuy.com",
    registrationSteps: [
      "היכנסו לאתר CSSBUY והקליקו על כפתור ה-Register בפינה השמאלית העליונה.",
      "מלאו את הפרטים הנדרשים: כתובת אימייל, שם משתמש וסיסמה.",
      "אשרו את הרישום דרך האימייל שנשלח לכתובת שהזנתם.",
      "התחברו לחשבון החדש שלכם והשלימו את פרטי הכתובת בישראל תחת האזור האישי.",
      "טענו את החשבון באמצעות PayPal, כרטיס אשראי או Wise לביצוע רכישות."
    ],
    purchaseSteps: [
      "היכנסו לאזור 'Shopping Agent' באתר CSSBUY.",
      "הדביקו את הקישור למוצר מאתר סיני כמו Taobao או Weidian בשדה המתאים.",
      "מלאו את הפרטים הנדרשים: צבע, מידה, כמות וכל מידע נוסף הנחוץ למוכר.",
      "הוסיפו את המוצר לסל הקניות ובדקו את הפרטים.",
      "בצעו את התשלום עבור המוצר + עמלת הסוכן (בד\"כ כ-5%).",
      "המתינו לאישור הרכישה ועדכונים לגבי הגעת המוצר למחסן."
    ],
    shippingSteps: [
      "לאחר שכל המוצרים הגיעו למחסן, היכנסו לאזור 'My Warehouse' באתר.",
      "סמנו את כל המוצרים שברצונכם לשלוח לישראל.",
      "בחרו את שיטת המשלוח המועדפת (EMS, DHL, FedEx) בהתאם למשקל ודחיפות המשלוח.",
      "הוסיפו שירותים נוספים לפי הצורך, כמו אריזה מיוחדת או הסרת קופסאות.",
      "בצעו את התשלום עבור המשלוח.",
      "עקבו אחר המשלוח באמצעות מספר המעקב שתקבלו עד להגעתו לישראל."
    ],
    pros: [
      "ממשק ידידותי למשתמש",
      "תמונות באיכות גבוהה",
      "אפשרויות משלוח מגוונות",
      "עמלות תחרותיות (כ-5%)"
    ],
    cons: [
      "זמני טעינה לפעמים איטיים",
      "שער המרה פחות טוב מחלק מהמתחרים",
      "תמיכת לקוחות לא תמיד מהירה"
    ],
    tips: [
      "השתמשו באפשרות Rehearsal Shipping לקבלת הערכת משקל מדויקת לפני התשלום הסופי.",
      "בקשו הסרת אריזות מיותרות להפחתת משקל המשלוח.",
      "מומלץ לצלם צילום מסך של עמוד המוצר המקורי למקרה שיהיו שאלות.",
      "אם אתם מזמינים בגדים, בדקו טבלאות מידות בקפידה או בקשו מידות מדויקות מהמוכר."
    ]
  },
  "ponybuy": {
    id: "ponybuy",
    name: "PONYBUY",
    logo: "https://yt3.googleusercontent.com/BoE-3gGWN5GEuco_XRBrkhBtVBOvkNRuKSmKOYscQ9JbdeqfCfYFeJ0xz2JgJEPhvo4WUgcDp2I=s900-c-k-c0x00ffffff-no-rj",
    description: "PONYBUY הוא סוכן חדש יחסית עם שירות לקוחות מצוין, עמלות נמוכות ומחירי משלוח אטרקטיביים. הפלטפורמה מציעה ממשק נוח ואפשרויות תשלום מגוונות.",
    website: "https://www.ponbuy.com",
    registrationSteps: [
      "פתחו את אתר PONYBUY ולחצו על כפתור 'Sign Up' בפינה הימנית העליונה.",
      "הזינו את פרטיכם האישיים, כולל אימייל תקף וסיסמה.",
      "אשרו את הרישום באמצעות הקישור שנשלח לאימייל שלכם.",
      "השלימו את פרופיל המשתמש שלכם עם כתובת המשלוח בישראל.",
      "הפקידו כסף לחשבונכם באמצעות PayPal, כרטיס אשראי או העברה בנקאית."
    ],
    purchaseSteps: [
      "חפשו מוצרים ישירות דרך ממשק החיפוש של PONYBUY או העתיקו קישור מאתרים סיניים.",
      "בחרו את הצבע, המידה והכמות הרצויים.",
      "הוסיפו את המוצר לעגלת הקניות.",
      "בדקו שכל הפרטים נכונים ומלאו הערות מיוחדות אם יש צורך.",
      "בצעו את התשלום (מחיר המוצר + עמלת סוכן של כ-3-5%).",
      "המתינו לעדכון במערכת כאשר המוצר יגיע למחסן."
    ],
    shippingSteps: [
      "לאחר שכל המוצרים הגיעו למחסן, היכנסו לחשבונכם וכנסו לאזור המחסן.",
      "בחרו את המוצרים שברצונכם לשלוח.",
      "בחרו את שיטת המשלוח המועדפת בהתאם לתקציב והדחיפות.",
      "בחרו אפשרויות אריזה ושירותים נוספים לפי הצורך.",
      "בצעו את התשלום עבור המשלוח.",
      "קבלו מספר מעקב ועקבו אחר המשלוח עד הגעתו לישראל."
    ],
    pros: [
      "עמלות נמוכות יחסית (3-5%)",
      "תמיכת לקוחות מהירה ויעילה",
      "ממשק משתמש נוח",
      "מחירי משלוח תחרותיים"
    ],
    cons: [
      "פחות ותיק ומוכר מסוכנים אחרים",
      "פחות אפשרויות משלוח בהשוואה למתחרים",
      "מאגר תמונות מוגבל יותר"
    ],
    tips: [
      "בקשו QC (בדיקת איכות) מפורטת לפני המשלוח.",
      "הפקידו סכום גדול יותר בבת אחת לחסוך בעמלות העברה.",
      "השתמשו בקוד קופון 'NEWUSER' לקבלת הנחה ברכישה הראשונה.",
      "בקשו תמונות נוספות של המוצר ללא תשלום נוסף."
    ]
  },
  "kakobuy": {
    id: "kakobuy",
    name: "KAKOBUY",
    logo: "https://ugc.production.linktr.ee/8750f613-326d-45a7-9736-572bb9c00240_1732602858057.jpeg",
    description: "KAKOBUY הוא סוכן יחסית חדש אך מבטיח, המציע שירות לקוחות מצוין, צילומי מוצר באיכות גבוהה ומחירים תחרותיים. הממשק פשוט ונוח לשימוש.",
    website: "https://www.kakobuy.com",
    registrationSteps: [
      "פתחו את אתר KAKOBUY ולחצו על 'Register' בחלק העליון של העמוד.",
      "מלאו את הטופס עם פרטים אישיים, אימייל וסיסמה.",
      "אשרו את ההרשמה באמצעות קוד האימות שנשלח לאימייל.",
      "היכנסו לחשבונכם והשלימו את פרטי הפרופיל, כולל כתובת בישראל.",
      "הפקידו כסף לחשבון באמצעות אחת משיטות התשלום המוצעות."
    ],
    purchaseSteps: [
      "העתיקו את קישור המוצר מאתר סיני כמו Taobao או Weidian.",
      "היכנסו לאזור הרכישות באתר KAKOBUY והדביקו את הקישור.",
      "מלאו את כל הפרטים הנדרשים: מידה, צבע, כמות וכו'.",
      "הוסיפו את המוצר לסל ובדקו את כל הפרטים.",
      "השלימו את הרכישה על ידי תשלום מחיר המוצר + עמלת הסוכן.",
      "המתינו לאישור הרכישה ולהודעה על הגעת המוצר למחסן."
    ],
    shippingSteps: [
      "לאחר שכל המוצרים הרצויים הגיעו למחסן, בחרו אותם בממשק המחסן.",
      "בקשו תמונות איכות (QC) וודאו שהמוצרים תקינים ומתאימים לציפיותיכם.",
      "בחרו את שיטת המשלוח המועדפת מבין האפשרויות המוצעות.",
      "בחרו אפשרויות אריזה ושירותים נוספים לפי הצורך.",
      "שלמו את עלות המשלוח כפי שחושבה על ידי המערכת.",
      "קבלו מספר מעקב ועקבו אחר המשלוח עד הגעתו לישראל."
    ],
    pros: [
      "איכות צילום מעולה",
      "שירות לקוחות מהיר ואדיב",
      "ממשק ידידותי למשתמש",
      "מחירי משלוח הוגנים"
    ],
    cons: [
      "פחות מוכר ומבוסס מסוכנים ותיקים",
      "בסיס לקוחות קטן יותר",
      "זמני עיבוד לפעמים ארוכים יותר"
    ],
    tips: [
      "נצלו את שירות הצילום המצוין לבדיקת איכות מוצרים.",
      "בקשו לאחד מספר משלוחים למשלוח אחד לחיסכון בעלויות.",
      "התייעצו עם שירות הלקוחות לגבי אפשרויות המשלוח המומלצות.",
      "בקשו הערכת משקל מראש לתכנון תקציב המשלוח."
    ]
  },
  "basetao": {
    id: "basetao",
    name: "Basetao",
    logo: "https://www.basetao.com/style/index/img/logo.svg",
    description: "Basetao הוא סוכן ותיק ומכובד עם מוניטין מעולה בקהילה. הוא מציע שירות אמין, תמונות איכותיות ומבחר רחב של אפשרויות משלוח ותשלום.",
    website: "https://www.basetao.com",
    registrationSteps: [
      "גשו לאתר Basetao ולחצו על 'Register' בתפריט העליון.",
      "מלאו את הטופס עם שם משתמש, אימייל וסיסמה.",
      "אשרו את חשבונכם דרך האימייל שתקבלו.",
      "התחברו וגשו להגדרות החשבון להשלמת פרטי המשלוח לישראל.",
      "הפקידו כסף באמצעות PayPal, כרטיס אשראי, מטבע קריפטו או אפשרויות אחרות."
    ],
    purchaseSteps: [
      "לחצו על 'New Order' במערכת Basetao.",
      "הדביקו את הקישור למוצר מאתר סיני.",
      "מלאו את כל המידע הנדרש: צבע, מידה, כמות, הערות מיוחדות וכדומה.",
      "אשרו את ההזמנה והוסיפו לסל הקניות.",
      "שלמו על ההזמנה (מחיר המוצר + עמלת הסוכן של כ-5%).",
      "המתינו לעדכון כאשר המוצר מגיע למחסן של Basetao."
    ],
    shippingSteps: [
      "היכנסו לאזור 'My Warehouse' כאשר כל המוצרים הגיעו למחסן.",
      "סמנו את כל המוצרים שברצונכם לשלוח יחד.",
      "לחצו על 'Ship' ובחרו את שיטת המשלוח המועדפת.",
      "בחרו שירותים נוספים כמו אריזה, הסרת תיוג, ביטוח וכו'.",
      "אשרו את עלות המשלוח ובצעו את התשלום.",
      "עקבו אחר המשלוח באמצעות מספר המעקב שתקבלו."
    ],
    pros: [
      "שירות אמין ואיכותי",
      "אפשרויות תשלום מגוונות",
      "בדיקות איכות מפורטות",
      "אפשרויות אריזה מתקדמות"
    ],
    cons: [
      "עמלות גבוהות יחסית (כ-5-6%)",
      "ממשק משתמש פחות מודרני",
      "מחירי משלוח לעיתים גבוהים יותר"
    ],
    tips: [
      "השתמשו באפשרות 'Detailed Photos' לבדיקת איכות יסודית של המוצרים.",
      "בקשו אריזת 'Simple Packaging' לחיסכון במשקל ובעלויות.",
      "נצלו את האפשרות להעריך משקל לפני תשלום סופי.",
      "השוו בין אפשרויות המשלוח השונות לפני קבלת החלטה."
    ]
  }
};

const AgentGuide = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (agentId && agentsData[agentId]) {
      setAgent(agentsData[agentId]);
    }
    
    setLoading(false);
  }, [agentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">טוען...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">הסוכן המבוקש לא נמצא</h2>
        <Link to="/" className="flex items-center text-primary hover:underline">
          <ArrowLeft size={16} className="ml-1" />
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <div className="pt-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/" 
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6"
            >
              <ArrowRight size={16} className="ml-1" />
              חזרה לדף הבית
            </Link>
            
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2 ml-4">
                <img 
                  src={agent.logo} 
                  alt={`${agent.name} לוגו`} 
                  className="w-full h-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold heading-gradient">
                  מדריך {agent.name}
                </h1>
                <div className="flex items-center mt-2">
                  <a 
                    href={agent.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <ExternalLink size={14} className="ml-1" />
                    לאתר הרשמי
                  </a>
                </div>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground mb-8">{agent.description}</p>
            
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <Info size={20} className="text-primary mt-1 ml-3 flex-shrink-0" />
                <p className="text-sm">
                  מדריך זה מעודכן ומספק את כל המידע הדרוש לרכישה דרך {agent.name}. אם נתקלתם בשינויים או יש לכם עדכונים,
                  אנא צרו איתנו קשר.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Guide Sections */}
          <div className="mb-12">
            <GuideSection 
              title="הרשמה לאתר" 
              icon={<User size={20} />} 
              defaultOpen={true}
            >
              <ol className="list-decimal pr-5 space-y-4">
                {agent.registrationSteps.map((step, index) => (
                  <li key={index} className="text-foreground">{step}</li>
                ))}
              </ol>
            </GuideSection>
            
            <GuideSection 
              title="רכישת מוצרים" 
              icon={<ShoppingBag size={20} />}
            >
              <ol className="list-decimal pr-5 space-y-4">
                {agent.purchaseSteps.map((step, index) => (
                  <li key={index} className="text-foreground">{step}</li>
                ))}
              </ol>
            </GuideSection>
            
            <GuideSection 
              title="משלוח לישראל" 
              icon={<Truck size={20} />}
            >
              <ol className="list-decimal pr-5 space-y-4">
                {agent.shippingSteps.map((step, index) => (
                  <li key={index} className="text-foreground">{step}</li>
                ))}
              </ol>
              
              <div className="mt-6 bg-secondary/30 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center">
                  <AlertCircle size={18} className="ml-2 text-primary" />
                  דברים חשובים לדעת על משלוח לישראל
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>• חבילות מעל 75$ חייבות במע״מ ולעיתים במכס בהתאם לקטגוריית המוצר.</li>
                  <li>• זמני המשלוח משתנים בהתאם לשיטת המשלוח: EMS (10-20 ימים), DHL/FedEx (5-10 ימים).</li>
                  <li>• מומלץ להצהיר על ערך סביר ואמיתי של החבילה למניעת בעיות במכס.</li>
                  <li>• עקבו אחר המשלוח באמצעות מספר המעקב שקיבלתם מהסוכן.</li>
                </ul>
              </div>
            </GuideSection>
          </div>
          
          {/* Pros and Cons */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <CheckCircle size={20} className="ml-2 text-green-500" />
                יתרונות {agent.name}
              </h3>
              <ul className="space-y-3">
                {agent.pros.map((pro, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-500 ml-2 mt-0.5">
                      <CheckCircle size={12} />
                    </span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <AlertCircle size={20} className="ml-2 text-destructive" />
                חסרונות {agent.name}
              </h3>
              <ul className="space-y-3">
                {agent.cons.map((con, index) => (
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
          
          {/* Tips */}
          <div className="mb-12">
            <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-primary/5 to-primary/10">
              <h3 className="text-xl font-medium mb-4 flex items-center">
                <Info size={20} className="ml-2 text-primary" />
                טיפים לשימוש ב-{agent.name}
              </h3>
              <ul className="space-y-4">
                {agent.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary ml-2 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mb-12">
            <a
              href={agent.website}
              target="_blank"
              rel="noopener noreferrer"
              className="button-animation inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg"
            >
              <span>לביקור באתר {agent.name}</span>
              <ExternalLink size={18} className="mr-2" />
            </a>
          </div>
          
          {/* Navigation to other agents */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-medium mb-4 text-center">מדריכים לסוכנים נוספים</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.values(agentsData)
                .filter((a) => a.id !== agent.id)
                .map((otherAgent) => (
                  <Link
                    key={otherAgent.id}
                    to={`/agent/${otherAgent.id}`}
                    className="flex items-center px-5 py-2.5 bg-white hover:bg-primary/5 border border-border rounded-lg transition-colors"
                  >
                    <span className="font-medium">{otherAgent.name}</span>
                    <ArrowLeft size={16} className="mr-2" />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      
      <ShippingCosts />
      <Footer />
    </div>
  );
};

export default AgentGuide;
