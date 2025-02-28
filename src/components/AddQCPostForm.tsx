
import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Button } from './ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ImagePlus, Trash2, Check, Loader2 } from 'lucide-react';
import { QCPostType } from './QCPost';
import { agents } from '../pages/Index';

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
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // הוספת תמונה (במקרה אמיתי היינו מעלים קבצים לשרת)
  const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (images.length >= 3) {
        setErrors({...errors, images: 'ניתן להעלות עד 3 תמונות בלבד'});
        return;
      }
      
      // בפרויקט אמיתי כאן היינו מעלים את הקובץ לשרת
      // לצורך ההדגמה, נשתמש ב-URL.createObjectURL
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImages([...images, imageUrl]);
      setErrors({...errors, images: ''});
    }
  };

  // מחיקת תמונה
  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  // טיפול בשליחת הטופס
  const handleSubmit = (e: React.FormEvent) => {
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
    
    if (images.length === 0) {
      newErrors.images = 'נא להעלות לפחות תמונה אחת';
    }
    
    setErrors(newErrors);
    
    // אם אין שגיאות, שולחים את הטופס
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // יצירת פוסט חדש
      const newPost: QCPostType = {
        id: nanoid(),
        title,
        description,
        images,
        productLink,
        agent,
        timestamp: new Date().toISOString(),
        rating: 0,
        votes: 0,
        userRatings: {}
      };
      
      // סימולציה של זמן טעינה
      setTimeout(() => {
        onSubmit(newPost);
        setIsSubmitting(false);
      }, 1000);
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
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
              <img src={image} alt={`תמונה ${index + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 left-1 bg-black/70 text-white p-1 rounded-full hover:bg-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {/* כפתור להוספת תמונה */}
          {images.length < 3 && (
            <label className="cursor-pointer aspect-square flex items-center justify-center border border-dashed rounded-md hover:bg-secondary/20">
              <div className="text-center">
                <ImagePlus size={24} className="mx-auto mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">הוסף תמונה</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={addImage}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        {errors.images && <p className="mt-1 text-sm text-red-500">{errors.images}</p>}
      </div>
      
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
