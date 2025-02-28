
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QCPost, { QCPostType } from '../components/QCPost';
import AddQCPostForm from '../components/AddQCPostForm';
import { Button } from '../components/ui/button';
import { PlusCircle, X, Images } from 'lucide-react';

// נתונים לדוגמה
const initialPosts: QCPostType[] = [
  {
    id: '1',
    title: 'נעלי YEEZY 350 V2 Zebra',
    description: 'קיבלתי את הנעליים מהסוכן kakobuy - האיכות מעולה ואין הבדל מהתמונות באתר.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=1470&auto=format&fit=crop',
    ],
    productLink: 'https://weidian.com/item.html?itemID=58372653821',
    agent: 'kakobuy',
    timestamp: new Date().toISOString(),
    rating: 4.5,
    votes: 12,
    userRatings: {} // בהמשך, כאשר יש מערכת משתמשים, נשמור כאן את הדירוגים של משתמשים ספציפיים
  },
  {
    id: '2',
    title: 'חולצת ESSENTIALS',
    description: 'איכות הבד מעולה, הלוגו מדויק. ההזמנה הגיעה בזמן. הגודל מתאים לגמרי להנחיות המידות.',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1470&auto=format&fit=crop',
    ],
    productLink: 'https://item.taobao.com/item.htm?id=65422685432',
    agent: 'cssbuy',
    timestamp: new Date().toISOString(),
    rating: 4.8,
    votes: 8,
    userRatings: {}
  },
  {
    id: '3',
    title: 'תיק NIKE',
    description: 'תיק ספורט מעולה, תפרים מדויקים וחומר עמיד. הלוגו נראה מקורי לחלוטין.',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1470&auto=format&fit=crop',
    ],
    productLink: 'https://detail.1688.com/offer/675437215939.html',
    agent: 'ponybuy',
    timestamp: new Date().toISOString(),
    rating: 4.2,
    votes: 5,
    userRatings: {}
  },
];

const QCGallery = () => {
  const [posts, setPosts] = useState<QCPostType[]>(initialPosts);
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const addNewPost = (post: QCPostType) => {
    setPosts([post, ...posts]);
    setIsAddingPost(false);
  };
  
  const handleRatePost = (postId: string, rating: number) => {
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
          {filteredPosts.length === 0 && (
            <div className="text-center py-16 bg-secondary/20 rounded-xl mb-8">
              <div className="mb-4">
                <Images size={48} className="mx-auto text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-medium">אין תמונות QC להצגה</h3>
              <p className="text-muted-foreground mt-2">היה הראשון לשתף תמונות איכות מהסוכן!</p>
            </div>
          )}
          
          {/* רשימת הפוסטים */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map(post => (
              <QCPost 
                key={post.id} 
                post={post} 
                onRate={(rating) => handleRatePost(post.id, rating)}
              />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default QCGallery;
