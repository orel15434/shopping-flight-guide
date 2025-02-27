
import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GuideSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

const GuideSection = ({ title, icon, children, defaultOpen = false }: GuideSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="glass-card rounded-xl overflow-hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-5 text-right transition-colors ${
          isOpen ? 'bg-primary/5' : 'bg-white'
        }`}
      >
        <div className="flex items-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary ml-3">
            {icon}
          </div>
          <h3 className="text-xl font-medium">{title}</h3>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="text-primary" size={20} />
          ) : (
            <ChevronDown className="text-muted-foreground" size={20} />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="p-5 animate-accordion-down">
          {children}
        </div>
      )}
    </div>
  );
};

export default GuideSection;
