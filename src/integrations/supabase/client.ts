
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://szpbqcvzuksaqrtihbea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGJxY3Z6dWtzYXFydGloYmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDkzODYsImV4cCI6MjA1NjQyNTM4Nn0.xgZsANt3xKvkKke1aHJXMSfZvzXOQ53Xsl_iWBs5DGs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// המידע הקבוע של המנהל
export const ADMIN_EMAIL = 'orelgame156@gmail.com';
export const ADMIN_PASSWORD = 'Admin123!';

// פונקציית עזר לבדיקת מנהל
export const checkIsAdmin = async (email: string) => {
  try {
    // בדיקה האם האימייל שווה לאימייל הקבוע של המנהל
    const isAdmin = email === ADMIN_EMAIL;
    return { isAdmin, error: null, adminData: isAdmin ? { email } : null };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false, error, adminData: null };
  }
};

// פונקצית התחברות מותאמת
export const adminLogin = async () => {
  try {
    // נדמה התחברות מוצלחת
    return {
      data: {
        user: {
          id: '1',
          email: ADMIN_EMAIL,
        },
        session: {
          access_token: 'admin_token',
          user: {
            id: '1',
            email: ADMIN_EMAIL,
          }
        }
      },
      error: null
    };
  } catch (error) {
    console.error("Error in admin login:", error);
    return { data: null, error };
  }
};

// פונקצית בדיקת חיבור
export const getAdminSession = () => {
  // נבדוק אם יש מידע בלוקל סטורג'
  const isLoggedIn = localStorage.getItem('admin_logged_in');
  if (isLoggedIn === 'true') {
    return {
      data: {
        session: {
          user: {
            email: ADMIN_EMAIL
          }
        }
      }
    };
  }
  return { data: { session: null } };
};

// פונקצית התנתקות
export const adminLogout = () => {
  localStorage.removeItem('admin_logged_in');
  return { error: null };
};
