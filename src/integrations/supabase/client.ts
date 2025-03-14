import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { createSlug } from '../../utils/slugify';

const supabaseUrl = 'https://szpbqcvzuksaqrtihbea.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6cGJxY3Z6dWtzYXFydGloYmVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NDkzODYsImV4cCI6MjA1NjQyNTM4Nn0.xgZsANt3xKvkKke1aHJXMSfZvzXOQ53Xsl_iWBs5DGs';

// Create a single instance of the Supabase client that we'll export
// This avoids multiple instance warning
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// אימייל למנהל
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

// פונקצית התחברות מותאמת - משתמשת ב-supabase auth כעת
export const adminLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error("Error in admin login:", error);
    return { data: null, error };
  }
};

// פונקצית בדיקת חיבור - מעודכנת לבדיקת סשן אמיתי
export const getAdminSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return { data: { session: null } };
    }
    return { data };
  } catch (error) {
    console.error("Error getting session:", error);
    return { data: { session: null } };
  }
};

// פונקצית התנתקות - עם sign out אמיתי
export const adminLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('admin_logged_in');
    return { error: null };
  } catch (error) {
    console.error("Error in admin logout:", error);
    return { error };
  }
};

// Helper functions for QC Posts management
export const deleteQCPost = async (postId: string) => {
  try {
    console.log(`Attempting to delete post with ID: ${postId}`);
    
    // בדיקה שה-ID תקין לפני המחיקה
    if (!postId || typeof postId !== 'string' || postId.trim() === '') {
      throw new Error('Invalid post ID provided');
    }
    
    // Delete the post and don't try to check afterward
    const { error } = await supabase
      .from('qc_posts')
      .delete()
      .eq('id', postId);
      
    if (error) {
      console.error(`Database error when deleting post ${postId}:`, error);
      throw error;
    }
    
    // If we get here with no error, consider the operation successful
    console.log(`Successfully deleted post with ID: ${postId}`);
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
    
    // If the title is being updated, regenerate the slug
    if (updateData.title) {
      updateData.slug = createSlug(updateData.title);
    }
    
    // Skip unnecessary existence check for performance
    
    // ביצוע העדכון
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

export const rateQCPost = async (postId: string, rating: number) => {
  try {
    console.log(`Rating post ${postId} with rating ${rating}`);
    
    // Fetch the current post data
    const { data: post, error: fetchError } = await supabase
      .from('qc_posts')
      .select('rating, votes')
      .eq('id', postId)
      .single();
      
    if (fetchError) {
      console.error(`Error fetching post ${postId}:`, fetchError);
      throw fetchError;
    }
    
    if (!post) {
      throw new Error(`No post found with ID: ${postId}`);
    }
    
    // Calculate the new rating and votes
    const currentVotes = post.votes || 0;
    const currentRating = post.rating || 0;
    const newVotes = currentVotes + 1;
    const newRating = ((currentRating * currentVotes) + rating) / newVotes;
    
    console.log(`Updating post ${postId} from rating ${currentRating} (${currentVotes} votes) to ${newRating} (${newVotes} votes)`);
    
    // Update the post with the new rating and votes
    const { data, error } = await supabase
      .from('qc_posts')
      .update({
        rating: newRating,
        votes: newVotes
      })
      .eq('id', postId)
      .select();
      
    if (error) {
      console.error(`Error updating post ${postId} rating:`, error);
      throw error;
    }
    
    console.log(`Successfully rated post ${postId}:`, data);
    return { data, error: null };
  } catch (error) {
    console.error(`Error rating post ${postId}:`, error);
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
