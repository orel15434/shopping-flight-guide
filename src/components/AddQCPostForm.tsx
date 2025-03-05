import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Button } from './ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ImagePlus, Trash2, Check, Loader2, DollarSign, Scale, Plus, X } from 'lucide-react';
import { QCPostType } from './QCPost';
import { supabase } from '../integrations/supabase/client';
import { useToast } from '../hooks/use-toast';
import { createSlug } from '../utils/slugify';

interface AddQCPostFormProps {
  onSubmit: (post: QCPostType) => void;
  onCancel: () => void;
}

const ALLOWED_PRODUCT_SITES = [
  'taobao.com',
  'weidian.com',
  '1688.com',
  'alibaba.com',
  'aliexpress.com',
  'detail.tmall.com',
  'tmall.com'
];

const PRODUCT_CATEGORIES = [
  { id: 'clothing', name: 'בגדים' },
  { id: 'shoes', name: 'נעליים' },
  { id: 'underwear', name: 'הלבשה תחתונה' },
  { id: 'electronics', name: 'אלקטרוניקה' },
  { id: 'other', name: 'אחר' }
];

const NOTE_PLACEHOLDER = "לדוגמה פריט עבה, פריט דק, לקחת מידה מעל, לקיחת מידה מתחת.";

const AddQCPostForm = ({ onSubmit, onCancel }: AddQCPostFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [productLink, setProductLink] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notes, setNotes] = useState<string[]>(['', '']);
  const { toast } = useToast();

  const isValidProductLink = (link: string): boolean => {
    if (!link) return false;
    
    try {
      const url = new URL(link);
      return ALLOWED_PRODUCT_SITES.some(site => url.hostname.includes(site));
    } catch {
      return false;
    }
  };

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

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviewUrls];
    
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviewUrls(newPreviews);
  };

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

  const handleNoteChange = (index: number, value: string) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };

  const addNote = () => {
    if (notes.length < 5) {
      setNotes([...notes, '']);
    }
  };

  const removeNote = (index: number) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'נא להזין כותרת';
    }
    
    if (!category) {
      newErrors.category = 'נא לבחור קטגוריה';
    }
    
    if (!productLink) {
      newErrors.productLink = 'נא להזין קישור למוצר';
    } else if (!isValidProductLink(productLink)) {
      newErrors.productLink = 'קישור לא תקין. ניתן להזין קישורים מ-Taobao, Weidian, 1688, Tmall, Alibaba או AliExpress בלבד';
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
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        const uploadedImageUrls = [];
        const totalImages = imageFiles.length;
        
        for (let i = 0; i < imageFiles.length; i++) {
          setUploadProgress(Math.round((i / totalImages) * 100));
          
          const imageUrl = await uploadImageToStorage(imageFiles[i]);
          uploadedImageUrls.push(imageUrl);
        }
        
        setUploadProgress(100);
        
        const slug = createSlug(title);
        
        const filteredNotes = notes.filter(note => note.trim() !== '');
        
        const newPost: QCPostType = {
          id: nanoid(),
          title,
          description: description.trim(),
          images: uploadedImageUrls,
          productLink,
          agent: 'other',
          category,
          timestamp: new Date().toISOString(),
          rating: 0,
          votes: 0,
          userRatings: {},
          price: price,
          weight: weight,
          slug: slug,
          notes: filteredNotes.length > 0 ? filteredNotes : undefined
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
      <div>
        <label htmlFor="title" className="block mb-2 font-medium">
          כותרת <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ל��וגמה: נעלי NIKE Air Force 1"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>
      
      <div>
        <label htmlFor="category" className="block mb-2 font-medium">
          קטגוריה <span className="text-red-500">*</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.category ? 'border-red-500' : 'border-input'
          }`}
        >
          <option value="">בחר קטגוריה</option>
          {PRODUCT_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className="block mb-2 font-medium">
          תיאור <span className="text-xs text-muted-foreground">(אופציונלי)</span>
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תאר את המוצר, איכות, התאמה למידות, זמן הגעה, וכו'..."
          className="min-h-[100px]"
        />
      </div>

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
      
      <div>
        <label htmlFor="productLink" className="block mb-2 font-medium">
          קישור למוצר <span className="text-red-500">*</span>
        </label>
        <Input
          id="productLink"
          type="url"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          placeholder="הכנס קישור ל-Taobao, Weidian, 1688, Tmall, Alibaba או AliExpress"
          className={errors.productLink ? 'border-red-500' : ''}
        />
        {errors.productLink && <p className="mt-1 text-sm text-red-500">{errors.productLink}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          ניתן להוסיף קישורים מהאתרים: Taobao, Weidian, 1688, Tmall, Alibaba או AliExpress בלבד
        </p>
      </div>
      
      <div>
        <label className="block mb-2 font-medium">
          תמונות QC <span className="text-red-500">*</span> <span className="text-xs text-muted-foreground">(עד 3 תמונות)</span>
        </label>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
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
      
      <div>
        <label className="block mb-2 font-medium">
          הערות אישיות <span className="text-xs text-muted-foreground">(אופציונלי)</span>
        </label>
        
        <div className="space-y-3">
          {notes.map((note, index) => (
            <div key={index} className="flex items-start gap-2">
              <Textarea
                value={note}
                onChange={(e) => handleNoteChange(index, e.target.value)}
                placeholder={index < 2 ? "לדוגמה פריט עבה, פריט דק, לקחת מידה מעל, לקיחת מידה מתחת." : "הוסף הערה אישית..."}
                className="min-h-[60px]"
              />
              {notes.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeNote(index)}
                  className="mt-1"
                >
                  <X size={18} />
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {notes.length < 5 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addNote}
            className="mt-2 flex items-center gap-1"
          >
            <Plus size={16} />
            <span>הוסף הערה נוספת</span>
          </Button>
        )}
      </div>
      
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
