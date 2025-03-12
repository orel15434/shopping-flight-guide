
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DollarSign, Scale, ExternalLink, ShoppingBag, PackageCheck, Package } from 'lucide-react';
import { Button } from './ui/button';

interface SearchResultItem {
  id: string;
  title: string;
  image: string;
  price: number;
  weight?: number;
  source: string;
}

interface SearchResultsProps {
  isOpen: boolean;
  results: SearchResultItem[];
  onClose: () => void;
}

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Helper function to calculate shipping cost based on weight for KAKOBUY EUB
const calculateShipping = (weight: number): number => {
  if (!weight) return 0;
  
  // Complete price chart for KAKOBUY EUB shipping up to 3kg
  if (weight <= 100) return 7.33;
  if (weight <= 150) return 7.79;
  if (weight <= 200) return 8.26;
  if (weight <= 250) return 8.72;
  if (weight <= 300) return 9.18;
  if (weight <= 350) return 9.64;
  if (weight <= 400) return 10.11;
  if (weight <= 450) return 10.57;
  if (weight <= 500) return 11.17;
  if (weight <= 550) return 11.64;
  if (weight <= 600) return 12.10;
  if (weight <= 650) return 12.56;
  if (weight <= 700) return 13.02;
  if (weight <= 750) return 13.49;
  if (weight <= 800) return 13.95;
  if (weight <= 850) return 14.41;
  if (weight <= 900) return 14.87;
  if (weight <= 950) return 15.34;
  if (weight <= 1000) return 15.80;
  if (weight <= 1050) return 16.26;
  if (weight <= 1100) return 16.73;
  if (weight <= 1150) return 17.19;
  if (weight <= 1200) return 17.65;
  if (weight <= 1250) return 18.12;
  if (weight <= 1300) return 18.58;
  if (weight <= 1350) return 19.04;
  if (weight <= 1400) return 19.50;
  if (weight <= 1450) return 19.97;
  if (weight <= 1500) return 20.43;
  if (weight <= 1550) return 20.89;
  if (weight <= 1600) return 21.36;
  if (weight <= 1650) return 21.82;
  if (weight <= 1700) return 22.28;
  if (weight <= 1750) return 22.75;
  if (weight <= 1800) return 23.21;
  if (weight <= 1850) return 23.67;
  if (weight <= 1900) return 24.14;
  if (weight <= 1950) return 24.60;
  if (weight <= 2000) return 25.06;
  if (weight <= 2050) return 25.52;
  if (weight <= 2100) return 25.99;
  if (weight <= 2150) return 26.45;
  if (weight <= 2200) return 26.91;
  if (weight <= 2250) return 27.38;
  if (weight <= 2300) return 27.84;
  if (weight <= 2350) return 28.30;
  if (weight <= 2400) return 28.77;
  if (weight <= 2450) return 29.23;
  if (weight <= 2500) return 29.69;
  if (weight <= 2550) return 30.16;
  if (weight <= 2600) return 30.62;
  if (weight <= 2650) return 31.08;
  if (weight <= 2700) return 31.55;
  if (weight <= 2750) return 32.01;
  if (weight <= 2800) return 32.47;
  if (weight <= 2850) return 32.93;
  if (weight <= 2900) return 33.40;
  if (weight <= 2950) return 33.86;
  if (weight <= 3000) return 34.32;
  return -1; // Weight exceeds maximum or is not in our price chart
};

// Helper to get recommended shipping method based on weight
const getRecommendedShippingMethod = (weight: number): string => {
  if (weight <= 3000) return "EUB"; // EUB is recommended up to 3kg
  if (weight <= 5000) return "Aramex"; // Aramex for heavier items
  return "DHL"; // DHL for very heavy items
};

// Helper to convert USD to ILS (simplified)
const usdToIls = (usd: number): number => {
  const exchangeRate = 3.7; // Example exchange rate
  return usd * exchangeRate;
};

const SearchResults = ({ isOpen, results, onClose }: SearchResultsProps) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  const handleItemClick = (id: string) => {
    navigate(`/qc-post/${id}`);
    onClose();
  };
  
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={transition}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">תוצאות חיפוש</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          סגור חיפוש
        </button>
      </div>
      
      {results.length === 0 ? (
        <motion.div 
          className="p-8 text-center text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
        >
          לא נמצאו בדיקות QC תואמות לקישור זה
          <p className="mt-2 text-sm text-gray-400">
            אתה יכול להיות הראשון לפרסם בדיקת QC למוצר זה!
          </p>
        </motion.div>
      ) : (
        // Display only the first result
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          {results.length > 0 && (
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <div className="aspect-square">
                  <img 
                    src={results[0].image} 
                    alt={results[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-1/2 p-6 flex flex-col">
                <h3 className="text-xl font-bold mb-2">{results[0].title}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-xs">
                    {results[0].source}
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center">
                      <DollarSign size={18} className="mr-2 text-green-600" />
                      <span className="font-medium">מחיר המוצר:</span>
                    </div>
                    <span className="font-bold text-green-600">${results[0].price.toFixed(2)}</span>
                  </div>
                  
                  {results[0].weight && (
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center">
                        <Scale size={18} className="mr-2 text-blue-600" />
                        <span className="font-medium">משקל המוצר:</span>
                      </div>
                      <span>{results[0].weight}g</span>
                    </div>
                  )}
                  
                  {results[0].weight && (
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center">
                        <PackageCheck size={18} className="mr-2 text-purple-600" />
                        <span className="font-medium">שיטת משלוח מומלצת:</span>
                      </div>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-xs">
                        {getRecommendedShippingMethod(results[0].weight)}
                      </span>
                    </div>
                  )}
                  
                  {results[0].weight && (
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center">
                        <Package size={18} className="mr-2 text-indigo-600" />
                        <span className="font-medium">עלות משלוח מוערכת:</span>
                      </div>
                      <span>${calculateShipping(results[0].weight).toFixed(2)}</span>
                    </div>
                  )}
                  
                  {results[0].weight && (
                    <div className="flex items-center justify-between py-3 bg-gray-50 dark:bg-gray-800/50 px-4 rounded-lg mt-4">
                      <span className="font-bold">סה"כ עלות משוערת:</span>
                      <div className="text-end">
                        <div className="font-bold text-lg text-primary">
                          ${(results[0].price + calculateShipping(results[0].weight)).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ₪{(usdToIls(results[0].price + calculateShipping(results[0].weight))).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => handleItemClick(results[0].id)}
                  >
                    צפה בפרטי ה-QC המלאים
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => window.open(results[0].source, '_blank')}
                  >
                    <ExternalLink size={16} />
                    <span>פתח באתר המקור</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SearchResults;
