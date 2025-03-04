
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QCPost, { QCPostType } from '../components/QCPost';
import { Button } from '../components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { extractPostIdFromSlug } from '../utils/slugify';

const QCPostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<QCPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (!postId) {
          throw new Error("מזהה פוסט חסר");
        }
        
        // Extract the actual UUID from the URL parameter which might include a slug
        const actualPostId = extractPostIdFromSlug(postId);
        
        const { data, error } = await supabase
          .from('qc_posts')
          .select('*')
          .eq('id', actualPostId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const userRatings = data.user_ratings ? 
            (typeof data.user_ratings === 'object' ? 
              data.user_ratings as Record<string, number> : 
              {}
            ) : {};
            
          const formattedPost: QCPostType = {
            id: data.id,
            title: data.title,
            description: data.description || '',
            images: data.images || [],
            productLink: data.product_link || '',
            product_link: data.product_link || '',
            agent: data.agent,
            rating: data.rating || 0,
            votes: data.votes || 0,
            userRatings: userRatings,
            user_ratings: userRatings,
            created_at: data.created_at,
            price: typeof data.price === 'number' ? data.price : undefined,
            weight: typeof data.weight === 'number' ? data.weight : undefined,
            category: data.category || 'other',
            slug: data.slug || ''
          };
          
          setPost(formattedPost);
        } else {
          throw new Error("הפוסט לא נמצא");
        }
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || "שגיאה בטעינת הפוסט");
        toast({
          description: "לא הצלחנו לטעון את הפוסט",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, toast]);

  const handleRatePost = async (rating: number) => {
    if (!post) return;
    
    try {
      const newVotes = post.votes + 1;
      const newRating = ((post.rating * post.votes) + rating) / newVotes;
      
      setPost({
        ...post,
        rating: parseFloat(newRating.toFixed(1)),
        votes: newVotes
      });
      
      // The actual API update is handled in the QCPost component
    } catch (err) {
      console.error('Error updating rating:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post ? `${post.title} | PoPobuyIL` : 'טוען פוסט | PoPobuyIL'}</title>
        <meta name="description" content={post?.description || 'תמונות QC של מוצרים'} />
        {post?.images && post.images.length > 0 && (
          <meta property="og:image" content={post.images[0]} />
        )}
      </Helmet>
      
      <Header />
      
      <main className="section-padding">
        <div className="container">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
              onClick={() => navigate('/qc-gallery')}
            >
              <ChevronRight size={20} />
              <span>חזרה לגלריה</span>
            </Button>
          </div>
          
          {loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">טוען פוסט...</p>
            </div>
          )}
          
          {!loading && error && (
            <div className="text-center py-16 bg-secondary/20 rounded-xl">
              <h2 className="text-xl font-medium mb-2">שגיאה</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/qc-gallery')}
              >
                חזרה לגלריה
              </Button>
            </div>
          )}
          
          {!loading && post && (
            <div className="max-w-xl mx-auto">
              <QCPost 
                post={post} 
                onRate={handleRatePost} 
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QCPostDetail;
