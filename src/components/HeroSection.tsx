
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const scrollToContent = () => {
    const contentElement = document.getElementById('main-content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1583475020839-101b10f1c3d7?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      </div>

      {/* Floating items */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="container relative h-full">
          <div className="absolute top-1/3 right-[15%] animate-float delay-200">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-lg shadow-lg opacity-70 rotate-12"></div>
          </div>
          <div className="absolute top-1/4 left-[20%] animate-float delay-300">
            <div className="w-12 h-12 md:w-20 md:h-20 bg-primary/20 rounded-lg shadow-lg rotate-45"></div>
          </div>
          <div className="absolute bottom-1/4 right-[25%] animate-float delay-100">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-secondary rounded-lg shadow-lg -rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="container relative z-20">
        <div className="max-w-4xl mx-auto text-center slide-up">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary">
            המדריך המושלם לרכישה מסין
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 heading-gradient">
            רכישות מסין ישירות לביתך
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            מדריך מפורט לרכישה באמצעות סוכנים סיניים מובילים כמו CSSBUY, PONYBUY, 
            KAKOBUY ו-Basetao, עם כל המידע הדרוש לשילוח לישראל
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button
              onClick={() => document.getElementById('agents')?.scrollIntoView({ behavior: 'smooth' })}
              className="button-animation px-8 py-3 bg-primary text-white rounded-lg font-medium shadow-md hover:shadow-lg"
            >
              התחל עכשיו
            </button>
            <button
              onClick={() => document.getElementById('shipping-costs')?.scrollIntoView({ behavior: 'smooth' })}
              className="button-animation px-8 py-3 bg-white text-foreground border border-border rounded-lg font-medium shadow-sm hover:bg-secondary/50"
            >
              מחירי משלוח
            </button>
          </div>
        </div>
      </div>

      {/* Scroll down indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <button
          onClick={scrollToContent}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-md backdrop-blur-sm"
          aria-label="גלול למטה"
        >
          <ArrowDown size={20} className="text-primary" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
