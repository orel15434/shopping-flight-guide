
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ADMIN_EMAIL, 
  ADMIN_PASSWORD, 
  checkIsAdmin, 
  adminLogin, 
  getAdminSession,
  adminLogout 
} from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea'; 
import { useToast } from '../hooks/use-toast';
import { Trash2, Shield, LogOut, Info, Pencil, X, Image, Plus, Minus } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { supabase } from '../integrations/supabase/client';

const Admin = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [qcPosts, setQcPosts] = useState<any[]>([]);
  const [loginError, setLoginError] = useState('');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = getAdminSession();
        
        if (data.session) {
          setIsAuthenticated(true);
          console.log("User is authenticated:", data.session.user.email);
          
          const { isAdmin, adminData, error } = await checkIsAdmin(data.session.user.email || '');
            
          if (isAdmin && adminData) {
            console.log("User is admin:", adminData);
            setIsAdmin(true);
            fetchQCPosts();
          } else {
            console.error("Admin check failed:", error);
            toast({
              variant: "destructive",
              title: "אין הרשאות",
              description: "אין לך הרשאות גישה לעמוד זה",
            });
            navigate('/');
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [navigate, toast]);
  
  const fetchQCPosts = async () => {
    const { data, error } = await supabase
      .from('qc_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && !error) {
      setQcPosts(data);
    } else {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    try {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        console.log("Credentials match, logging in as admin");
        
        const { data, error } = await adminLogin();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          localStorage.setItem('admin_logged_in', 'true');
          setIsAuthenticated(true);
          setIsAdmin(true);
          
          toast({
            title: "התחברת בהצלחה",
            description: "ברוך הבא למערכת הניהול",
          });
          
          fetchQCPosts();
        }
      } else {
        setLoginError('פרטי ההתחברות שגויים');
        toast({
          variant: "destructive",
          title: "התחברות נכשלה",
          description: "פרטי ההתחברות שגויים",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      setLoginError(error.message || 'אירעה שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק פוסט זה?");
    
    if (confirmed) {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('qc_posts')
          .delete()
          .eq('id', postId);
          
        if (error) throw error;
        
        toast({
          title: "נמחק בהצלחה",
          description: "הפוסט נמחק בהצלחה",
        });
        
        // Update the local state to reflect the deletion
        setQcPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch (error: any) {
        console.error('Delete error:', error);
        toast({
          variant: "destructive",
          title: "מחיקה נכשלה",
          description: error.message || "אירעה שגיאה בתהליך המחיקה",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartEdit = (post: any) => {
    setEditingPost({
      id: post.id,
      title: post.title,
      description: post.description || '',
      agent: post.agent,
      product_link: post.product_link || '',
      images: post.images || []
    });
    setImageUrls(post.images || []);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setImageUrls([]);
    setNewImageUrl('');
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;
    
    try {
      setLoading(true);
      console.log("Updating post:", editingPost);
      console.log("With images:", imageUrls);
      
      const { error } = await supabase
        .from('qc_posts')
        .update({
          title: editingPost.title,
          description: editingPost.description,
          agent: editingPost.agent,
          product_link: editingPost.product_link,
          images: imageUrls
        })
        .eq('id', editingPost.id);
        
      if (error) throw error;
      
      toast({
        title: "עודכן בהצלחה",
        description: "הפוסט עודכן בהצלחה",
      });
      
      // Update the post in the local state
      setQcPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === editingPost.id ? {
            ...post,
            title: editingPost.title,
            description: editingPost.description,
            agent: editingPost.agent,
            product_link: editingPost.product_link,
            images: imageUrls
          } : post
        )
      );
      
      handleCancelEdit();
      fetchQCPosts(); // Refresh posts to ensure we have the latest data
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        variant: "destructive",
        title: "עדכון נכשל",
        description: error.message || "אירעה שגיאה בתהליך העדכון",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...imageUrls];
    updatedImages.splice(index, 1);
    setImageUrls(updatedImages);
  };

  const handleLogout = async () => {
    await adminLogout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast({
      title: "התנתקת בהצלחה",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-padding">
          <div className="container max-w-md mx-auto">
            <div className="glass-card p-6 rounded-xl">
              <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                <Shield className="h-6 w-6" />
                כניסת מנהל
              </h1>
              
              <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  המשתמש {ADMIN_EMAIL} הוא היחיד המורשה להתחבר למערכת הניהול (הסיסמה היא {ADMIN_PASSWORD})
                </AlertDescription>
              </Alert>
              
              {loginError && (
                <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    אימייל
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="הזן אימייל"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">
                    סיסמה
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הזן סיסמה"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'מתחבר...' : 'התחבר'}
                </Button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-padding">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              פאנל ניהול
            </h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              התנתק
            </Button>
          </div>

          {editingPost && (
            <div className="glass-card p-6 rounded-xl mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">עריכת פוסט</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleCancelEdit}
                >
                  <X size={20} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">כותרת</label>
                  <Input 
                    value={editingPost.title} 
                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">תיאור</label>
                  <Textarea 
                    value={editingPost.description} 
                    onChange={(e) => setEditingPost({...editingPost, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">סוכן</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md" 
                    value={editingPost.agent}
                    onChange={(e) => setEditingPost({...editingPost, agent: e.target.value})}
                  >
                    <option value="cssbuy">CSSBUY</option>
                    <option value="ponybuy">PONYBUY</option>
                    <option value="kakobuy">KAKOBUY</option>
                    <option value="basetao">Basetao</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">קישור למוצר</label>
                  <Input 
                    value={editingPost.product_link || ''} 
                    onChange={(e) => setEditingPost({...editingPost, product_link: e.target.value})}
                    placeholder="הזן URL למוצר (אופציונלי)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">תמונות</label>
                  <div className="space-y-2 mb-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={url} readOnly />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Minus size={16} />
                        </Button>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Image size={20} className="text-blue-500" />
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      value={newImageUrl} 
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="הזן URL לתמונה חדשה"
                    />
                    <Button 
                      onClick={handleAddImage}
                      className="flex items-center gap-1"
                    >
                      <Plus size={16} />
                      הוסף
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={handleCancelEdit}>ביטול</Button>
                  <Button 
                    onClick={handleUpdatePost}
                    disabled={loading}
                  >
                    {loading ? 'שומר...' : 'שמור שינויים'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">ניהול פוסטים בגלריית QC</h2>
            
            {qcPosts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">לא נמצאו פוסטים</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-4 text-right">כותרת</th>
                      <th className="py-2 px-4 text-right">סוכן</th>
                      <th className="py-2 px-4 text-right">דירוג</th>
                      <th className="py-2 px-4 text-right">תמונות</th>
                      <th className="py-2 px-4 text-right">תאריך</th>
                      <th className="py-2 px-4 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qcPosts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-secondary/10">
                        <td className="py-3 px-4">{post.title}</td>
                        <td className="py-3 px-4">{post.agent}</td>
                        <td className="py-3 px-4">{post.rating?.toFixed(1) || '0.0'} ({post.votes || 0})</td>
                        <td className="py-3 px-4">{post.images?.length || 0}</td>
                        <td className="py-3 px-4">
                          {new Date(post.created_at).toLocaleDateString('he-IL')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStartEdit(post)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil size={16} />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
