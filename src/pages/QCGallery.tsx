
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QCPost, { QCPostType } from '../components/QCPost';
import AddQCPostForm from '../components/AddQCPostForm';
import { Button } from '../components/ui/button';
import { PlusCircle, X, Images } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const QCGallery = () => {
  const [posts, setPosts] = useState<QCPostType[]>([]);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('qc_posts')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        // Convert the database response to QCPostType format
        const formattedPosts: QCPostType[] = data.map(post => ({
          id: post.id,
          title: post.title,
          description: post.description || '',
          images: post.images || [],
          productLink: post.product_link || '',
          agent: post.agent,
          rating: post.rating || 0,
          votes: post.votes || 0,
          userRatings: (post.user_ratings as unknown as Record<string, number>) || {},
          created_at: post.created_at
        }));
        
        setPosts(formattedPosts);
      }
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בטעינת המידע",
        description: "לא הצלחנו לטעון את הפוסטים מהשרת",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const addNewPost = async (post: QCPostType) => {
    try {
      console.log('Adding new post:', post);
      
      // Prepare data for insertion
      const newPost = {
        title: post.title,
        description: post.description,
        images: post.images, // These are now Supabase Storage URLs
        product_link: post.productLink,
        agent: post.agent,
        rating: 0,
        votes: 0,
        user_ratings: {}
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
      
      // Add the new post to the state with proper type conversion
      if (data) {
        const formattedPost: QCPostType = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          images: data.images || [],
          productLink: data.product_link || '',
          agent: data.agent,
          rating: data.rating || 0,
          votes: data.votes || 0,
          userRatings: (data.user_ratings as unknown as Record<string, number>) || {},
          created_at: data.created_at
        };
        
        setPosts([formattedPost, ...posts]);
      }
      
      setIsAddingPost(false);
      
      toast({
        title: "הפוסט נוסף בהצלחה",
        description: "תודה על השיתוף!",
      });
    } catch (error: any) {
      console.error('Error adding post:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהוספת הפוסט",
        description: error.message || "לא הצלחנו להוסיף את הפוסט",
      });
    }
  };
  
  const handleRatePost = async (postId: string, rating: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        // המתודה הזו היא פשוטה וזמנית. במערכת אמיתית עם התחברות,
        // הדירוג יהיה קשור למשתמש מסוים ויישמר בבסיס נתונים
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
    : posts.filter(post => post.agent === filter);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 heading-gradient">
              גלריית תמונות QC
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              כאן תוכלו לראות תמונות QC של מוצרים שקנו משתמשים אחרים, לקבל השראה ולשתף את התמונות שלכם.
            </p>
          </div>
          
          {/* סינון לפי סוכן */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              onClick={() => setFilter('all')}
              className="px-4 py-2 rounded-full text-sm"
            >
              הכל
            </Button>
            <Button 
              variant={filter === 'cssbuy' ? 'default' : 'outline'} 
              onClick={() => setFilter('cssbuy')}
              className="px-4 py-2 rounded-full text-sm"
            >
              CSSBUY
            </Button>
            <Button 
              variant={filter === 'ponybuy' ? 'default' : 'outline'} 
              onClick={() => setFilter('ponybuy')}
              className="px-4 py-2 rounded-full text-sm"
            >
              PONYBUY
            </Button>
            <Button 
              variant={filter === 'kakobuy' ? 'default' : 'outline'} 
              onClick={() => setFilter('kakobuy')}
              className="px-4 py-2 rounded-full text-sm"
            >
              KAKOBUY
            </Button>
            <Button 
              variant={filter === 'basetao' ? 'default' : 'outline'} 
              onClick={() => setFilter('basetao')}
              className="px-4 py-2 rounded-full text-sm"
            >
              Basetao
            </Button>
          </div>
          
          {/* כפתור הוספת פוסט */}
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
          
          {/* טופס להוספת פוסט */}
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
          
          {/* אם אין פוסטים */}
          {filteredPosts.length === 0 && !loading && (
            <div className="text-center py-16 bg-secondary/20 rounded-xl mb-8">
              <div className="mb-4">
                <Images size={48} className="mx-auto text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-medium">אין תמונות QC להצגה</h3>
              <p className="text-muted-foreground mt-2">היה הראשון לשתף תמונות איכות מהסוכן!</p>
            </div>
          )}
          
          {/* טוען... */}
          {loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-muted-foreground">טוען תמונות QC...</p>
            </div>
          )}
          
          {/* רשימת הפוסטים */}
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
