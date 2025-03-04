
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-2 bg-white/90 backdrop-blur-sm shadow-sm' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link 
          to="/" 
          className="font-poppins text-foreground text-2xl font-bold tracking-tight"
        >
          <span className="bg-gradient-to-r from-blue-700 to-blue-400 bg-clip-text text-transparent">
            PoPobuyIL
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            דף הבית
          </Link>
          <Link 
            to="/agents" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            סוכנים
          </Link>
          <Link 
            to="/shipping" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            משלוחים
          </Link>
          <Link 
            to="/about" 
            className="text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            אודות
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md text-foreground"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background absolute top-full left-0 right-0 border-b border-border animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              דף הבית
            </Link>
            <Link 
              to="/agents" 
              className="text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              סוכנים
            </Link>
            <Link 
              to="/shipping" 
              className="text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              משלוחים
            </Link>
            <Link 
              to="/about" 
              className="text-foreground hover:text-primary transition-colors py-2 font-medium"
            >
              אודות
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
