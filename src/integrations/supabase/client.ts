
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://szpbqcvzuksaqrtihbea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGJxY3Z6dWtzYXFydGloYmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDkzODYsImV4cCI6MjA1NjQyNTM4Nn0.xgZsANt3xKvkKke1aHJXMSfZvzXOQ53Xsl_iWBs5DGs';

// Create a single instance of the Supabase client that we'll export
// This avoids multiple instance warning
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

// Helper functions for QC Posts management
export const deleteQCPost = async (postId: string) => {
  try {
    console.log(`Attempting to delete post with ID: ${postId}`);
    
    // בדיקה שה-ID תקין לפני המחיקה
    if (!postId || typeof postId !== 'string' || postId.trim() === '') {
      throw new Error('Invalid post ID provided');
    }
    
    // מבצע את המחיקה - חשוב להשתמש בdelete עם single ולא reselect
    const { error } = await supabase
      .from('qc_posts')
      .delete()
      .eq('id', postId);
      
    if (error) {
      console.error(`Database error when deleting post ${postId}:`, error);
      throw error;
    }
    
    // וידוא שהפעולה הצליחה
    console.log(`Successfully deleted post with ID: ${postId}`);
    
    // בדיקה שהפוסט באמת נמחק
    const { data: checkData } = await supabase
      .from('qc_posts')
      .select('id')
      .eq('id', postId)
      .single();
      
    if (checkData) {
      console.error(`Post ${postId} still exists after delete operation`);
      throw new Error('Post was not deleted successfully');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return { success: false, error };
  }
};

export const updateQCPost = async (postId: string, updateData: any) => {
  try {
    console.log(`Attempting to update post with ID: ${postId}`, updateData);
    
    // וידוא שה-ID ונתוני העדכון תקינים
    if (!postId || typeof postId !== 'string' || postId.trim() === '') {
      throw new Error('Invalid post ID provided');
    }
    
    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid update data provided');
    }
    
    // חשוב שהעדכון יחזיר את הנתונים המעודכנים
    const { data, error } = await supabase
      .from('qc_posts')
      .update(updateData)
      .eq('id', postId)
      .select();
      
    if (error) {
      console.error(`Database error when updating post ${postId}:`, error);
      throw error;
    }
    
    // בדיקה שהתקבלו נתונים
    if (!data || data.length === 0) {
      throw new Error(`No post found with ID: ${postId}`);
    }
    
    console.log(`Successfully updated post with ID: ${postId}`, data[0]);
    return { data: data[0], error: null };
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    return { data: null, error };
  }
};

export const fetchQCPosts = async () => {
  try {
    console.log("Fetching QC posts...");
    
    // נשתמש בorder כדי להציג את הפוסטים העדכניים ביותר קודם
    const { data, error } = await supabase
      .from('qc_posts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Database error when fetching QC posts:", error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data?.length || 0} QC posts`);
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching QC posts:", error);
    return { data: null, error };
  }
};
