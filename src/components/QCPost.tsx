
import { useState } from 'react';
import { Star, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import he from 'date-fns/locale/he';
import { AgentInfo } from './AgentCard';
import { agents } from '../pages/Index';

export interface QCPostType {
  id: string;
  title: string;
  description: string;
  images: string[];
  productLink: string;
  agent: string;
  timestamp: string;
  rating: number;
  votes: number;
  userRatings: Record<string, number>;
}

interface QCPostProps {
  post: QCPostType;
  onRate: (rating: number) => void;
}

const QCPost = ({ post, onRate }: QCPostProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  
  // בדיקת סוג אתר מהקישור
  const getProductSite = (url: string): string => {
    if (url.includes('taobao.com')) return 'Taobao';
    if (url.includes('weidian.com')) return 'Weidian';
    if (url.includes('1688.com')) return '1688';
    if (url.includes('alibaba.com')) return 'Alibaba';
    if (url.includes('aliexpress.com')) return 'AliExpress';
    return 'אתר חיצוני';
  };
  
  const handleRate = (rating: number) => {
    if (!hasRated) {
      onRate(rating);
      setHasRated(true);
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };
  
  // הפוך את מחרוזת התאריך לאובייקט Date ואז לפורמט הדרוש עם תרגום לעברית
  const formattedDate = format(new Date(post.timestamp), 'dd בMMMM yyyy', { locale: he });

  // מצא את מידע הסוכן המתאים
  const agentInfo = agents.find(a => a.id === post.agent);
  
  return (
    <div className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
      {/* גלריית תמונות */}
      <div className="relative aspect-[4/3] bg-secondary/20 overflow-hidden">
        {post.images.length > 0 ? (
          <>
            <img 
              src={post.images[currentImageIndex]} 
              alt={post.title}
              className="w-full h-full object-cover" 
            />
            
            {post.images.length > 1 && (
              <>
                {/* כפתורי ניווט בתמונות */}
                <button 
                  onClick={prevImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <span>›</span>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <span>‹</span>
                </button>
                
                {/* אינדיקטור תמונות */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {post.images.map((_, index) => (
                    <span 
                      key={index}
                      className={`block w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            אין תמונה זמינה
          </div>
        )}
      </div>
      
      {/* תוכן הפוסט */}
      <div className="p-4">
        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
        
        {/* לוגו ושם הסוכן */}
        {agentInfo && (
          <div className="flex items-center mb-3 text-sm">
            <img 
              src={agentInfo.logo} 
              alt={agentInfo.name} 
              className="w-5 h-5 rounded-full mr-2" 
            />
            <span>{agentInfo.name}</span>
          </div>
        )}
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.description}</p>
        
        {/* דירוג כוכבים */}
        <div className="mb-4">
          <div className="flex items-center mb-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={cn(
                    "cursor-pointer transition-colors",
                    (hoverRating || post.rating) >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  )}
                  onMouseEnter={() => !hasRated && setHoverRating(star)}
                  onMouseLeave={() => !hasRated && setHoverRating(0)}
                  onClick={() => !hasRated && handleRate(star)}
                />
              ))}
            </div>
            <span className="mr-2 text-sm">
              {post.rating.toFixed(1)} ({post.votes})
            </span>
          </div>
          
          {!hasRated ? (
            <p className="text-xs text-muted-foreground">לחץ על הכוכבים כדי לדרג</p>
          ) : (
            <p className="text-xs text-green-600">תודה על הדירוג!</p>
          )}
        </div>
        
        {/* קישור למוצר */}
        <div className="flex justify-between items-center">
          <a
            href={post.productLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary text-sm hover:underline"
          >
            <ExternalLink size={14} className="ml-1" />
            <span>קנה ב{getProductSite(post.productLink)}</span>
          </a>
          
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default QCPost;
