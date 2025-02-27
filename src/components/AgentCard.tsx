
import { useState } from 'react';
import { ArrowRight, Globe, User, ShoppingBag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AgentInfo {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  website: string;
}

interface AgentCardProps {
  agent: AgentInfo;
  index: number;
}

const AgentCard = ({ agent, index }: AgentCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const animationDelay = `delay-${(index % 5) * 100}`;

  return (
    <div 
      className={`glass-card agent-card-gradient rounded-xl overflow-hidden transition-all duration-300 slide-up ${animationDelay}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center p-2">
            <img 
              src={agent.logo} 
              alt={`${agent.name} לוגו`} 
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="mr-4">
            <h3 className="text-xl font-bold font-serif">{agent.name}</h3>
            <a 
              href={agent.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary flex items-center hover:underline"
            >
              <Globe size={14} className="ml-1" />
              לאתר הרשמי
            </a>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-6">{agent.description}</p>
        
        <ul className="space-y-3 mb-6">
          {agent.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary mr-2 mt-0.5">
                {idx === 0 ? (
                  <User size={14} />
                ) : idx === 1 ? (
                  <ShoppingBag size={14} />
                ) : (
                  <Truck size={14} />
                )}
              </span>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <Link
            to={`/agent/${agent.id}`}
            className={`group flex items-center justify-between w-full p-3 rounded-lg ${
              isHovered 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-foreground'
            } transition-all duration-300`}
          >
            <span className="font-medium">למדריך מפורט</span>
            <ArrowRight 
              size={18} 
              className={`transform ${
                isHovered ? 'translate-x-0' : 'translate-x-1'
              } transition-transform duration-300`} 
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
