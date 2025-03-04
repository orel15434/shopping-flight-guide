import { useState } from 'react';
import { Star, ExternalLink, Trash2, DollarSign, Scale, X, Share2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import he from 'date-fns/locale/he';
import { agents } from '../pages/Index';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { Button } from './ui/button';
import { InteractiveHoverButton } from './ui/interactive-hover-button';
import { Dialog, DialogContent } from './ui/dialog';
import { useIsMobile } from '../hooks/use-mobile';

export interface QCPostType {
  id: string;
  title: string;
  description: string;
  images: string[];
  product_link?: string;
  productLink?: string; // For backward compatibility
  agent: string;
  timestamp?: string;
  created_at?: string;
  rating: number;
  votes: number;
  user_ratings?: Record<string, number>;
  userRatings?: Record<string, number>; // For backward compatibility
  price?: number; // המחיר בדולרים
  weight?: number; // המשקל בגרמים
  category?: string; // קטגוריית המוצר
}

interface QCPostProps {
  post: QCPostType;
  onRate: (rating: number) => void;
  onDelete?: (postId: string) => void;
  showDeleteButton?: boolean;
}

const QCPost = ({ post, onRate, onDelete, showDeleteButton = false }: QCPostProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const getProductSite = (url: string): string => {
    if (!url) return 'אתר חיצוני';
    if (url.includes('taobao.com')) return 'Taobao';
    if (url.includes('weidian.com')) return 'Weidian';
    if (url.includes('1688.com')) return '1688';
    if (url.includes('alibaba.com')) return 'Alibaba';
    if (url.includes('aliexpress.com')) return 'AliExpress';
    return 'אתר חיצוני';
  };
  
  const productLink = post.product_link || post.productLink || '';
  const userRatings = post.user_ratings || post.userRatings || {};
  const timestamp = post.created_at || post.timestamp || new Date().toISOString();
  
  const handleRate = async (rating: number) => {
    if (!hasRated) {
      try {
        onRate(rating);
        
        const { error } = await supabase
          .from('qc_posts')
          .update({
            rating: ((post.rating * post.votes) + rating) / (post.votes + 1),
            votes: post.votes + 1
          })
          .eq('id', post.id);
          
        if (error) throw error;
        
        setHasRated(true);
      } catch (error: any) {
        console.error('Error rating post:', error);
        toast({
          variant: "destructive",
          description: "לא הצלחנו לשמור את הדירוג שלך",
        });
      }
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  const showImageInDialog = (index: number) => {
    setDialogImageIndex(index);
    setDialogOpen(true);
  };

  const nextDialogImage = () => {
    setDialogImageIndex((prev) => (prev + 1) % post.images.length);
  };

  const prevDialogImage = () => {
    setDialogImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };
  
  const formattedDate = format(new Date(timestamp), 'dd בMMMM yyyy', { locale: he });

  const agentInfo = agents.find(a => a.id === post.agent);
  
  const handleShare = () => {
    const postUrl = `${window.location.origin}/qc-post/${post.id}`;
    
    if (navigator.share && isMobile) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: postUrl,
      })
      .then(() => {
        console.log('Successfully shared');
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        copyToClipboard(postUrl);
      });
    } else {
      copyToClipboard(postUrl);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setShowShareTooltip(true);
        toast({
          description: "הקישור הועתק ללוח!",
          variant: "default",
        });
        
        setTimeout(() => {
          setShowShareTooltip(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          description: "לא הצלחנו להעתיק את הקישור",
          variant: "destructive",
        });
      });
  };
  
  return (
    <>
      <div className="glass-card rounded-xl overflow-hidden hover:shadow-lg transition-shadow relative">
        {showDeleteButton && onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full"
            onClick={() => onDelete(post.id)}
          >
            <Trash2 size={16} />
          </Button>
        )}
        
        {post.price && (
          <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full flex items-center font-bold shadow-lg">
            <DollarSign size={16} className="mr-1" />
            <span>{post.price}</span>
          </div>
        )}
        
        <div className="relative aspect-[4/3] bg-secondary/20 overflow-hidden">
          {post.images.length > 0 ? (
            <>
              <img 
                src={post.images[currentImageIndex]} 
                alt={post.title}
                className="w-full h-full object-cover cursor-pointer" 
                onClick={() => showImageInDialog(currentImageIndex)}
              />
              
              {post.images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <span>›</span>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <span>‹</span>
                  </button>
                  
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
        
        <div className="p-4">
          <h3 className="text-lg font-medium mb-2">{post.title}</h3>
          
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
          
          <div className="flex flex-wrap gap-3 mb-3">
            {post.price && (
              <div className="flex items-center text-sm text-muted-foreground bg-secondary/20 px-2 py-1 rounded">
                <DollarSign size={14} className="mr-1" />
                <span>מחיר: {post.price}$</span>
              </div>
            )}
            
            {post.weight && (
              <div className="flex items-center text-sm text-muted-foreground bg-secondary/20 px-2 py-1 rounded">
                <Scale size={14} className="mr-1" />
                <span>משקל: {post.weight}g</span>
              </div>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{post.description}</p>
          
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
          
          <div className="flex flex-col gap-2 mb-4">
            <InteractiveHoverButton 
              href={productLink}
            >
              <ExternalLink size={16} />
              <span>קנה ב{getProductSite(productLink)}</span>
            </InteractiveHoverButton>
            
            <InteractiveHoverButton
              onClick={handleShare}
              className="relative group"
            >
              <Share2 size={16} />
              <span>שתף</span>
              {showShareTooltip && (
                <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded">
                  הועתק ללוח!
                </div>
              )}
            </InteractiveHoverButton>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
          <div className="relative bg-black/90 rounded-lg overflow-hidden flex flex-col">
            <div className="absolute top-2 right-2 z-10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:bg-black/20 rounded-full"
                onClick={() => setDialogOpen(false)}
              >
                <X size={24} />
              </Button>
            </div>
            
            <div className="relative flex-1 flex items-center justify-center min-h-[50vh]">
              {post.images.length > 0 && (
                <img 
                  src={post.images[dialogImageIndex]} 
                  alt={post.title}
                  className="max-h-[80vh] max-w-full object-contain" 
                />
              )}

              {post.images.length > 1 && (
                <>
                  <button 
                    onClick={prevDialogImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <span className="text-xl">›</span>
                  </button>
                  <button 
                    onClick={nextDialogImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <span className="text-xl">‹</span>
                  </button>
                </>
              )}
            </div>
            
            {post.images.length > 1 && (
              <div className="bg-black/80 p-2 flex justify-center gap-2">
                {post.images.map((img, index) => (
                  <button 
                    key={index} 
                    className={`h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === dialogImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setDialogImageIndex(index)}
                  >
                    <img 
                      src={img} 
                      alt={`תמונה ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QCPost;
