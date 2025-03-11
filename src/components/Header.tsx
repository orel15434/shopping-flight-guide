
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, X, Search, Mic, LoaderCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SearchResults from "./SearchResults";
import { motion } from "framer-motion";

// Supported marketplaces
const SUPPORTED_MARKETPLACES = ['taobao', 'weidian', '1688', 'tmall'];

// Mock data for search results
const mockResults = [
  { 
    id: '1', 
    title: 'Nike Tech Fleece Hoodie', 
    image: '/placeholder.svg', 
    price: 250, 
    source: 'Weidian' 
  },
  { 
    id: '2', 
    title: 'Adidas Sweatpants', 
    image: '/placeholder.svg', 
    price: 180, 
    source: 'Taobao' 
  },
  { 
    id: '3', 
    title: 'Jordan 4 Retro', 
    image: '/placeholder.svg', 
    price: 380, 
    source: '1688' 
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState(mockResults);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (inputValue) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, [inputValue]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const isValidMarketplaceUrl = (url: string): boolean => {
    try {
      // Try to create URL object to validate it's a properly formatted URL
      const urlObj = new URL(url);
      // Check if the URL contains any of the supported marketplace domains
      return SUPPORTED_MARKETPLACES.some(marketplace => 
        urlObj.hostname.includes(marketplace)
      );
    } catch (e) {
      return false;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    if (isValidMarketplaceUrl(inputValue)) {
      // Simulate search with loading state
      setIsLoading(true);
      
      // Mock API call delay
      setTimeout(() => {
        setIsLoading(false);
        setShowResults(true);
        
        // Here we would normally fetch search results from the database
        // For now we'll just use mock data
      }, 1000);
    } else {
      toast.error("Please enter a valid URL from Taobao, Weidian, 1688 or TMall");
    }
  };
  
  const closeResults = () => {
    setShowResults(false);
    setInputValue("");
  };

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
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:block flex-grow mx-8 max-w-xl">
          <div className="relative">
            <Input
              className="peer pe-9 ps-9 w-full"
              placeholder="הכנס קישור מ-Taobao, Weidian, 1688, או TMall..."
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
              {isLoading ? (
                <LoaderCircle
                  className="animate-spin"
                  size={16}
                  strokeWidth={2}
                  role="status"
                  aria-label="Loading..."
                />
              ) : (
                <Search size={16} strokeWidth={2} aria-hidden="true" />
              )}
            </div>
            <button
              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Search"
              type="submit"
            >
              <Mic size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </form>
        
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
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background absolute top-full left-0 right-0 border-b border-border animate-fade-in">
          <div className="container py-4 flex flex-col space-y-4">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <Input
                  className="peer pe-9 ps-9 w-full"
                  placeholder="הכנס קישור מ-Taobao, Weidian, 1688, או TMall..."
                  type="search"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                  {isLoading ? (
                    <LoaderCircle
                      className="animate-spin"
                      size={16}
                      strokeWidth={2}
                      role="status"
                      aria-label="Loading..."
                    />
                  ) : (
                    <Search size={16} strokeWidth={2} aria-hidden="true" />
                  )}
                </div>
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Search"
                  type="submit"
                >
                  <Mic size={16} strokeWidth={2} aria-hidden="true" />
                </button>
              </div>
            </form>
            
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
      
      {/* Search Results Modal */}
      <SearchResults 
        isOpen={showResults} 
        results={searchResults} 
        onClose={closeResults} 
      />
    </header>
  );
};

export default Header;
