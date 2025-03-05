
/**
 * Creates a URL-friendly slug from a title
 * Handles Hebrew characters by removing them and using fallback text if needed
 */
export const createSlug = (title: string): string => {
  if (!title) return 'post';
  
  // Extract only Latin characters
  const latinChars = title.replace(/[^\w\s-]/g, '');
  
  // If the title has only Hebrew characters, use a default slug
  if (!latinChars.trim()) {
    return 'post';
  }
  
  return latinChars
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Convert to lowercase
    .toLowerCase()
    // Limit to 50 characters to avoid overly long URLs
    .slice(0, 50)
    // Trim extra hyphens from start/end
    .replace(/^-+|-+$/g, '');
};

/**
 * Extracts a post ID from a slug-id combined string
 * Example: "cool-shirt-e38030e5-d81a-4989-b14d-90e4ef2f64e2" => "e38030e5-d81a-4989-b14d-90e4ef2f64e2"
 */
export const extractPostIdFromSlug = (slugWithId: string): string => {
  // UUID format: 8-4-4-4-12 characters
  const uuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = slugWithId.match(uuidPattern);
  
  if (match) {
    return match[0];
  }
  
  // Fallback: attempt to find the UUID anywhere in the string
  const anyUuidPattern = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const anyMatch = slugWithId.match(anyUuidPattern);
  
  if (anyMatch) {
    return anyMatch[0];
  }
  
  // If no UUID is found, return the original string
  return slugWithId;
};
