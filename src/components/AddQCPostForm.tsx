
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Button } from './ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ImagePlus, Trash2, Check, Loader2, DollarSign, Scale } from 'lucide-react';
import { QCPostType } from './QCPost';
import { agents } from '../pages/Index';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';

interface AddQCPostFormProps {
  onSubmit: (post: QCPostType) => void;
  onCancel: () => void;
}

// רשימת סוגי הקישורים המורשים
const ALLOWED_PRODUCT_SITES = [
  'taobao.com',
  'weidian.com',
  '1688.com',
  'alibaba.com',
  'aliexpress.com'
];

const AddQCPostForm = ({ onSubmit, onCancel }: AddQCPostFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productLink, setProductLink] = useState('');
  const [agent, setAgent] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // בדיקה האם הקישור תקין
  const isValidProductLink = (link: string): boolean => {
    if (!link) return false;
    
    try {
      const url = new URL(link);
      return ALLOWED_PRODUCT_SITES.some(site => url.hostname.includes(site));
    } catch {
      return false;
    }
  };

  // העלאת תמונות לסופאבייס
  const uploadImageToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from('qc_images')
      .upload(filePath, file);

    if (error) {
      throw new Error(`שגיאה בהעלאת תמונה: ${error.message}`);
    }

    const { data: publicUrl } = supabase.storage
      .from('qc_images')
      .getPublicUrl(filePath);

    return publicUrl.publicUrl;
  };

  // הוספת תמונה 
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (imageFiles.length >= 3) {
        setErrors({...errors, images: 'ניתן להעלות עד 3 תמונות בלבד'});
        return;
      }
      
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      setImageFiles([...imageFiles, file]);
      setImagePreviewUrls([...imagePreviewUrls, previewUrl]);
      setErrors({...errors, images: ''});
    }
  };

  // מחיקת תמונה
  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviewUrls];
    
    // Release blob URL to prevent memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviewUrls(newPreviews);
  };

  // טיפול בשינוי מחיר - ומרה למספר
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setPrice(undefined);
      return;
    }
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setPrice(numericValue);
    }
  };

  // טיפול בשינוי משקל - המרה למספר
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setWeight(undefined);
      return;
    }
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      setWeight(numericValue);
    }
  };

  // טיפול בשליחת הטופס
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // אימות שדות
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'נא להזין כותרת';
    }
    
    if (!description.trim()) {
      newErrors.description = 'נא להזין תיאור';
    }
    
    if (!agent) {
      newErrors.agent = 'נא לבחור סוכן';
    }
    
    if (!productLink) {
      newErrors.productLink = 'נא להזין קישור למוצר';
    } else if (!isValidProductLink(productLink)) {
      newErrors.productLink = 'קישור לא תקין. ניתן להזין קישורים מ-Taobao, Weidian, 1688, Alibaba או AliExpress בלבד';
    }
    
    if (price === undefined) {
      newErrors.price = 'נא להזין מחיר';
    } else if (isNaN(price) || price <= 0) {
      newErrors.price = 'נא להזין מחיר חיובי';
    }
    
    if (imageFiles.length === 0) {
      newErrors.images = 'נא להעלות לפחות תמונה אחת';
    }
    
    setErrors(newErrors);
    
    // אם אין שגיאות, שולחים את הטופס
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // העלאת כל התמונות לסטוראג'
        const uploadedImageUrls = [];
        const totalImages = imageFiles.length;
        
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadProgress(Math.round((i / totalImages) * 100));
          
          // העלאת התמונה לסטוראג'
          const imageUrl = await uploadImageToStorage(imageFiles[i]);
          uploadedImageUrls.push(imageUrl);
        }
        
        setUploadProgress(100);
        
        // יצירת פוסט חדש
        const newPost: QCPostType = {
          id: nanoid(),
          title,
          description,
          images: uploadedImageUrls,
          productLink,
          agent,
          timestamp: new Date().toISOString(),
          rating: 0,
          votes: 0,
          userRatings: {},
          price: price,
          weight: weight
        };
        
        onSubmit(newPost);
      } catch (error: any) {
        console.error('שגיאה בהעלאת תמונות:', error);
        toast({
          variant: "destructive",
          title: "שגיאה בהעלאת תמונות",
          description: error.message || "לא הצלחנו להעלות את התמונות",
        });
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* כותרת */}
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          כותרת <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="לדוגמה: נעלי NIKE Air Force 1"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>
      
      {/* תיאור */}
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          תיאור <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תאר את המוצר, איכות, התאמה למידות, זמן הגעה, וכו'..."
          className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* מחיר */}
      <div>
        <label htmlFor="price" className="block mb-2 font-medium">
          מחיר (בדולרים) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={price === undefined ? '' : price}
            onChange={handlePriceChange}
            placeholder="הזן את מחיר המוצר בדולרים"
            className={`pl-8 ${errors.price ? 'border-red-500' : ''}`}
          />
          <DollarSign size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
      </div>
      
      {/* משקל (אופציונלי) */}
      <div>
        <label htmlFor="weight" className="block mb-2 font-medium">
          משקל (גרמים) <span className="text-xs text-muted-foreground">(אופציונלי)</span>
        </label>
        <div className="relative">
          <Input
            id="weight"
            type="number"
            min="1"
            value={weight === undefined ? '' : weight}
            onChange={handleWeightChange}
            placeholder="הזן את משקל המוצר בגרמים"
          />
          <Scale size={16} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      
      {/* סוכן */}
      <div>
        <label htmlFor="agent" className="block mb-2 font-medium">
          סוכן <span className="text-red-500">*</span>
        </label>
        <select
          id="agent"
          value={agent}
          onChange={(e) => setAgent(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.agent ? 'border-red-500' : 'border-input'
          }`}
        >
          <option value="">בחר סוכן</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name}</option>
          ))}
        </select>
        {errors.agent && <p className="mt-1 text-sm text-red-500">{errors.agent}</p>}
      </div>
      
      {/* קישור למוצר */}
      <div>
        <label htmlFor="productLink" className="block mb-2 font-medium">
          קישור למוצר <span className="text-red-500">*</span>
        </label>
        <Input
          id="productLink"
          type="url"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          placeholder="הכנס קישור ל-Taobao, Weidian, 1688, Alibaba או AliExpress"
          className={errors.productLink ? 'border-red-500' : ''}
        />
        {errors.productLink && <p className="mt-1 text-sm text-red-500">{errors.productLink}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          ניתן להוסיף קישורים מהאתרים: Taobao, Weidian, 1688, Alibaba או AliExpress בלבד
        </p>
      </div>
      
      {/* העלאת תמונות */}
      <div>
        <label className="block mb-2 font-medium">
          תמונות QC <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(עד 3 תמונות)</span>
        </label>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* תמונות שהועלו */}
          {imagePreviewUrls.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
              <img src={image} alt={`תמונה ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 left-1 bg-black/70 text-white p-1 rounded-full hover:bg-red-500"
                disabled={isSubmitting}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {/* כפתור להוספת תמונה */}
          {imagePreviewUrls.length < 3 && (
            <label className={`cursor-pointer aspect-square flex items-center justify-center border border-dashed rounded-md hover:bg-secondary/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <div className="text-center">
                <ImagePlus size={24} className="mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">הוסף תמונה</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={addImage}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          )}
        </div>
        
        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
      </div>
      
      {/* סטטוס העלאה */}
      {isSubmitting && uploadProgress > 0 && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-1 text-muted-foreground">
            מעלה תמונות... {uploadProgress}%
          </p>
        </div>
      )}
      
      {/* כפתורי פעולה */}
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          ביטול
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="ml-2 animate-spin" />
              <span>שולח...</span>
            </>
          ) : (
            <>
              <Check size={16} className="ml-2" />
              <span>פרסם</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddQCPostForm;
