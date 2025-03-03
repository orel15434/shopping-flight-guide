
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import { Trash2, Shield, LogOut, Info, UserPlus } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';

const Admin = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123!');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [qcPosts, setQcPosts] = useState<any[]>([]);
  const [loginError, setLoginError] = useState('');
  const [createUserMode, setCreateUserMode] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is logged in and if they are an admin
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        console.log("User is authenticated:", session.user.email);
        
        // Check if the authenticated user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();
          
        if (adminData && !adminError) {
          console.log("User is admin:", adminData);
          setIsAdmin(true);
          // Load QC posts if admin
          fetchQCPosts();
        } else {
          console.error("Admin check failed:", adminError);
          toast({
            variant: "destructive",
            title: "אין הרשאות",
            description: "אין לך הרשאות גישה לעמוד זה",
          });
          navigate('/');
        }
      }
    };
    
    checkSession();
  }, [navigate, toast]);
  
  // Initial check for admin user in the database
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        // Check if the admin user exists in the admin_users table
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();
          
        console.log("Admin check result:", data, error);
        
        if (!data) {
          console.log("Admin user not found, creating...");
          
          // Insert the admin user
          const { data: insertData, error: insertError } = await supabase
            .from('admin_users')
            .insert([{ email, id: crypto.randomUUID() }])
            .select();
            
          if (insertError) {
            console.error("Error creating admin user:", insertError);
            setLoginError('שגיאה ביצירת משתמש מנהל. נסה שוב מאוחר יותר');
          } else {
            console.log("Admin user created successfully:", insertData);
            toast({
              title: "משתמש מנהל נוצר",
              description: "המשתמש נוצר בהצלחה. אנא נסה להתחבר.",
            });
          }
        } else {
          console.log("Admin user found in database:", data);
        }
      } catch (error) {
        console.error("Error checking admin user:", error);
      }
    };
    
    checkAdminExists();
  }, [email, toast]);
  
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
    
    console.log("Attempting login with:", email, password);
    
    try {
      // First, check if the user exists in the admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      console.log("Admin check result:", adminData, adminError);
        
      if (!adminData) {
        setLoginError('אימייל לא מורשה למערכת הניהול');
        toast({
          variant: "destructive",
          title: "אין הרשאות",
          description: "אימייל לא מורשה למערכת הניהול",
        });
        setLoading(false);
        return;
      }
      
      console.log("Admin user found in admin_users table:", adminData);
      
      // Now attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // If the error is about invalid credentials, check if we need to create the user
        if (error.message.includes("Invalid login credentials")) {
          // Show loading state for creating user
          setLoginError('יוצר משתמש אוטומטית במערכת...');
          toast({
            title: "יוצר משתמש אוטומטית",
            description: "מנסה ליצור משתמש חדש במערכת...",
          });
          
          // Try to create the user automatically
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { is_admin: true }
            }
          });
          
          if (signUpError) {
            console.error("Auto user creation error:", signUpError);
            setLoginError(`שגיאה ביצירת המשתמש: ${signUpError.message}`);
            throw signUpError;
          }
          
          if (signUpData.user) {
            console.log("User created automatically:", signUpData.user);
            toast({
              title: "משתמש נוצר בהצלחה",
              description: "המשתמש נוצר אוטומטית, מנסה להתחבר...",
            });
            
            // Try logging in again
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (loginError) {
              console.error("Login after auto-creation error:", loginError);
              throw loginError;
            }
            
            if (loginData.user) {
              console.log("Login successful after auto-creation:", loginData.user);
              setIsAdmin(true);
              setIsAuthenticated(true);
              toast({
                title: "התחברת בהצלחה",
                description: "ברוך הבא למערכת הניהול",
              });
              fetchQCPosts();
              setLoading(false);
              return;
            }
          }
          
          throw new Error("לא הצלחנו ליצור משתמש אוטומטית");
        }
        
        if (!createUserMode) {
          setLoginError('סיסמה שגויה, נסה שוב או צור משתמש חדש');
          setCreateUserMode(true);
          toast({
            variant: "destructive",
            title: "התחברות נכשלה",
            description: "סיסמה שגויה, נסה שוב או צור משתמש חדש",
          });
        } else {
          setLoginError(error.message);
        }
        
        throw error;
      }
      
      if (data.user) {
        console.log("Login successful:", data.user);
        setIsAdmin(true);
        setIsAuthenticated(true);
        toast({
          title: "התחברת בהצלחה",
          description: "ברוך הבא למערכת הניהול",
        });
        fetchQCPosts();
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    
    console.log("Creating new admin user with:", email, password);
    
    try {
      // Create the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/admin',
          data: {
            is_admin: true
          }
        }
      });
      
      if (error) {
        console.error("User creation error:", error);
        throw error;
      }
      
      if (data.user) {
        console.log("User created successfully:", data.user);
        toast({
          title: "משתמש נוצר בהצלחה",
          description: "כעת ניתן להתחבר עם המשתמש החדש",
        });
        setCreateUserMode(false);
        
        // Try to sign in immediately
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("Auto login after signup error:", signInError);
        } else if (signInData.user) {
          console.log("Auto login successful after signup:", signInData.user);
          setIsAdmin(true);
          setIsAuthenticated(true);
          toast({
            title: "התחברת בהצלחה",
            description: "ברוך הבא למערכת הניהול",
          });
          fetchQCPosts();
        }
      }
    } catch (error: any) {
      console.error("User creation error:", error);
      
      let errorMessage = "אירעה שגיאה ביצירת המשתמש";
      
      if (error.message.includes("already registered")) {
        errorMessage = "המייל כבר רשום במערכת - נסה להתחבר";
        setCreateUserMode(false);
      }
      
      setLoginError(errorMessage);
      toast({
        variant: "destructive",
        title: "יצירת משתמש נכשלה",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = window.confirm("האם אתה בטוח שברצונך למחוק פוסט זה?");
    
    if (confirmed) {
      try {
        const { error } = await supabase
          .from('qc_posts')
          .delete()
          .eq('id', postId);
          
        if (error) throw error;
        
        toast({
          title: "נמחק בהצלחה",
          description: "הפוסט נמחק בהצלחה",
        });
        
        // Refresh post list
        fetchQCPosts();
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "מחיקה נכשלה",
          description: error.message || "אירעה שגיאה בתהליך המחיקה",
        });
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast({
      title: "התנתקת בהצלחה",
    });
  };

  // Render login form if not authenticated
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
                  השתמש באימייל וסיסמה שהוזנו כברירת מחדל להתחברות
                </AlertDescription>
              </Alert>
              
              {loginError && (
                <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                  <AlertDescription>
                    {loginError}
                  </AlertDescription>
                </Alert>
              )}
              
              {!createUserMode ? (
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

                  {(loginError.includes('סיסמה שגויה') || loginError.includes('משתמש לא קיים')) && (
                    <Button 
                      type="button"
                      variant="outline"
                      className="w-full flex items-center gap-2 mt-2" 
                      onClick={() => setCreateUserMode(true)}
                    >
                      <UserPlus size={16} />
                      יצירת משתמש חדש
                    </Button>
                  )}
                </form>
              ) : (
                <form onSubmit={handleCreateUser} className="space-y-4">
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
                    className="w-full flex items-center gap-2" 
                    disabled={loading}
                  >
                    <UserPlus size={16} />
                    {loading ? 'יוצר משתמש...' : 'צור משתמש חדש'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full" 
                    onClick={() => setCreateUserMode(false)}
                  >
                    חזרה להתחברות
                  </Button>
                </form>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render admin dashboard if authenticated and admin
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
                      <th className="py-2 px-4 text-right">תאריך</th>
                      <th className="py-2 px-4 text-right">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qcPosts.map((post) => (
                      <tr key={post.id} className="border-b hover:bg-secondary/10">
                        <td className="py-3 px-4">{post.title}</td>
                        <td className="py-3 px-4">{post.agent}</td>
                        <td className="py-3 px-4">{post.rating.toFixed(1)} ({post.votes})</td>
                        <td className="py-3 px-4">
                          {new Date(post.created_at).toLocaleDateString('he-IL')}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
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
