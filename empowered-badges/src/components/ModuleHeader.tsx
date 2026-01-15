import { Clock, Award, Calendar } from 'lucide-react';

interface ModuleHeaderProps {
  title: string;
  subtitle: string;
  level: string;
  estimatedTime: string;
  lastUpdated: string;
}

export function ModuleHeader({ title, subtitle, level, estimatedTime, lastUpdated }: ModuleHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-ev-muted-blue to-ev-light-blue rounded-xl p-6 md:p-10 text-white">
      {/* Badge Level */}
      <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium mb-4">
        <Award className="w-4 h-4" />
        <span>{level}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold mb-2">{title}</h1>
      <p className="text-lg md:text-xl text-white/90 mb-6">{subtitle}</p>

      {/* Meta Info */}
      <div className="flex flex-wrap gap-4 text-sm text-white/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{estimatedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Updated {lastUpdated}</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-sm text-white/70 italic">
          This badge focuses on shared facts, not values. You'll learn what is true, not what ought to be.
        </p>
      </div>
    </div>
  );
}
