import { useState, useEffect } from 'react';
import { supabase, fetchQCPosts, deleteQCPost } from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QCPost, { QCPostType } from '../components/QCPost';
import AddQCPostForm from '../components/AddQCPostForm';
import { Button } from '../components/ui/button';
import { PlusCircle, X, Images, Shirt, ShoppingBag, Monitor } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { AnimatedCategoryBar } from '../components/ui/animated-category-bar';
import { AnimatedTextCycle } from '../components/ui/animated-text-cycle';
import { useIsMobile, useIsVerySmallScreen, useIsExtraSmallScreen } from '../hooks/use-mobile';
import { cn } from '../lib/utils';

const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'הכל', icon: ShoppingBag },
  { id: 'clothing', name: 'בגדים', icon: Shirt },
  { id: 'shoes', name: 'נעליים', icon: ShoppingBag },
  { id: 'electronics', name: 'אלקטרוניקה', icon: Monitor },
  { id: 'other', name: 'אחר', icon: Images }
];

const ANIMATED_TEXTS = [
  { content: "שתף את ה-QC שלך", color: "text-blue-500" },
  { content: "דרג בקלות", color: "text-orange-500" },
  { content: "קנה בקלות", color: "text-sky-500" }
];

const QCGallery = () => {
  const [posts, setPosts] = useState<QCPostType[]>([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isVerySmallScreen = useIsVerySmallScreen();
  const isExtraSmallScreen = useIsExtraSmallScreen();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await fetchQCPosts();
        
      if (error) throw error;
      
      if (data) {
        const formattedPosts: QCPostType[] = data.map(post => ({
          id: post.id,
          title: post.title,
          description: post.description || '',
          images: post.images || [],
          productLink: post.product_link || '',
          agent: post.agent,
          rating: post.rating || 0,
          votes: post.votes || 0,
          userRatings: post.user_ratings ? 
            (typeof post.user_ratings === 'object' ? 
              post.user_ratings as Record<string, number> : 
              {}
            ) : {},
          created_at: post.created_at,
          price: typeof post.price === 'number' ? post.price : undefined,
          weight: typeof post.weight === 'number' ? post.weight : undefined,
          category: post.category || 'other'
        }));
        
        setPosts(formattedPosts);
        console.log("Setting posts in state:", formattedPosts.length, "posts");
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        description: "לא הצלחנו לטעון את הפוסטים מהשרת",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewPost = async (post: QCPostType) => {
    try {
      console.log('Adding new post:', post);
      
      const newPost = {
        title: post.title,
        description: post.description,
        images: post.images,
        product_link: post.productLink,
        agent: post.agent,
        category: post.category || 'other',
        rating: 0,
        votes: 0,
        user_ratings: {},
        price: post.price,
        weight: post.weight
      };
      
      console.log('Prepared post for insertion:', newPost);
      
      const { data, error } = await supabase
        .from('qc_posts')
        .insert(newPost)
        .select()
        .single();
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Post added successfully:', data);
      
      if (data) {
        const formattedPost: QCPostType = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          images: data.images || [],
          productLink: data.product_link || '',
          agent: data.agent,
          category: data.category || 'other',
          rating: data.rating || 0,
          votes: data.votes || 0,
          userRatings: data.user_ratings ? 
            (typeof data.user_ratings === 'object' ? 
              data.user_ratings as Record<string, number> : 
              {}
            ) : {},
          created_at: data.created_at,
          price: data.price,
          weight: data.weight
        };
        
        setPosts([formattedPost, ...posts]);
      }
      
      setIsAddingPost(false);
      
      toast({
        description: "תודה על השיתוף!",
        variant: "default",
      });
    } catch (error: any) {
      console.error('Error adding post:', error);
      toast({
        description: error.message || "לא הצלחנו להוסיף את הפוסט",
        variant: "destructive",
      });
    }
  };

  const handleRatePost = async (postId: string, rating: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newVotes = post.votes + 1;
        const newRating = ((post.rating * post.votes) + rating) / newVotes;
        
        return {
          ...post,
          rating: parseFloat(newRating.toFixed(1)),
          votes: newVotes
        };
      }
      return post;
    }));
  };

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(post => post.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
              <AnimatedTextCycle 
                texts={ANIMATED_TEXTS} 
                interval={4000} // 4 seconds per text for a slower transition
                className="min-h-[1.5em]"
              />
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              כאן תוכלו לראות תמונות QC של מוצרים שקנו משתמשים אחרים, לקבל השראה ולשתף את התמונות שלכם.
            </p>
          </div>
          
          <div className="flex justify-center mb-8 w-full">
            <div className="w-full max-w-[550px]">
              <AnimatedCategoryBar 
                items={PRODUCT_CATEGORIES}
                activeItem={filter}
                onItemClick={setFilter}
                className="w-full"
              />
            </div>
          </div>
          
          {!isAddingPost && (
            <div className="text-center mb-10">
              <Button 
                onClick={() => setIsAddingPost(true)}
                className="button-animation bg-primary text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
              >
                <PlusCircle size={20} />
                <span>שתף תמונות QC</span>
              </Button>
            </div>
          )}
          
          {isAddingPost && (
            <div className="mb-10 glass-card p-6 rounded-xl relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute left-4 top-4"
                onClick={() => setIsAddingPost(false)}
              >
                <X size={20} />
              </Button>
              <h2 className="text-2xl font-medium mb-6 text-center">שתף תמונות QC</h2>
              <AddQCPostForm onSubmit={addNewPost} onCancel={() => setIsAddingPost(false)} />
            </div>
          )}
          
          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-16 bg-secondary/20 rounded-xl mb-8">
              <div className="mb-4">
                <Images size={48} className="mx-auto text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-medium">אין תמונות QC להצגה</h3>
              <p className="text-muted-foreground mt-2">היה הראשון לשתף תמונות איכות מהקטגוריה הזו!</p>
            </div>
          )}
          
          {loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">טוען תמונות QC...</p>
            </div>
          )}
          
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <QCPost 
                  key={post.id} 
                  post={post} 
                  onRate={(rating) => handleRatePost(post.id, rating)} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QCGallery;
