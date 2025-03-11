
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SearchResultItem {
  id: string;
  title: string;
  image: string;
  price: number;
  source: string;
}

interface SearchResultsProps {
  isOpen: boolean;
  results: SearchResultItem[];
  onClose: () => void;
}

const SearchResults = ({ isOpen, results, onClose }: SearchResultsProps) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;
  
  const handleItemClick = (id: string) => {
    navigate(`/qc-post/${id}`);
    onClose();
  };
  
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleClickOutside}
    >
      <motion.div 
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Search Results</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        {results.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No matching QC posts found for this item
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {results.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleItemClick(item.id)}
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg truncate">{item.title}</CardTitle>
                  <CardDescription>{item.source}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="aspect-square rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <span className="font-bold text-primary">₪{item.price.toFixed(2)}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SearchResults;
