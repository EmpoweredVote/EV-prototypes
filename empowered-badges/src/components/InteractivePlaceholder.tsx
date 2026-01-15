import { Sparkles, Monitor } from 'lucide-react';

interface InteractivePlaceholderProps {
  title: string;
  description: string;
}

export function InteractivePlaceholder({ title, description }: InteractivePlaceholderProps) {
  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-ev-yellow bg-ev-yellow/10 p-6 md:p-8">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-ev-yellow/30 rounded-full flex items-center justify-center mb-4">
          <Monitor className="w-8 h-8 text-ev-muted-blue" />
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-ev-coral" />
          <h3 className="text-lg font-bold text-ev-black">{title}</h3>
          <Sparkles className="w-5 h-5 text-ev-coral" />
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm max-w-lg mb-4">{description}</p>

        {/* Coming Soon Badge */}
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-ev-muted-blue/10 text-ev-muted-blue rounded-full text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ev-coral opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-ev-coral"></span>
          </span>
          Interactive Coming Soon
        </span>
      </div>
    </div>
  );
}
