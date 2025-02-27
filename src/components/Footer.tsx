
import { Link } from 'react-router-dom';
import { Heart, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/30 border-t border-border">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">רכישות מסין</h3>
            <p className="text-muted-foreground mb-4">
              מדריך מקיף לרכישות מסין באמצעות סוכנים, עם מידע מפורט על תהליך הרכישה והמשלוח לישראל.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a 
                href="#" 
                className="p-2 rounded-full bg-white text-foreground hover:text-primary transition-colors"
                aria-label="אינסטגרם"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white text-foreground hover:text-primary transition-colors"
                aria-label="טוויטר"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-full bg-white text-foreground hover:text-primary transition-colors"
                aria-label="לינקדאין"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">קישורים מהירים</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  דף הבית
                </Link>
              </li>
              <li>
                <Link 
                  to="/agents" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  סוכנים סיניים
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  מידע על משלוחים
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  אודות
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-serif font-bold mb-4">צור קשר</h3>
            <p className="text-muted-foreground mb-4">
              יש לך שאלות או הצעות לשיפור? נשמח לשמוע ממך!
            </p>
            <div className="flex items-center mb-4">
              <Mail size={18} className="text-primary ml-2" />
              <a 
                href="mailto:info@chinaimports.co.il" 
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                info@chinaimports.co.il
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p className="flex items-center justify-center">
            נבנה באהבה <Heart size={14} className="mx-1 text-primary" /> {currentYear} © כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
