import { CheckCircle } from 'lucide-react';

export interface ContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'stat' | 'definition' | 'callout';
  content?: string;
  items?: string[];
  label?: string;
  value?: string;
  term?: string;
  definition?: string;
  variant?: 'info' | 'warning' | 'note';
}

interface ContentSectionProps {
  moduleNumber: number;
  title: string;
  content: ContentBlock[];
  isCompleted: boolean;
}

export function ContentSection({ moduleNumber, title, content, isCompleted }: ContentSectionProps) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Module Header */}
      <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-3">
          <span className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${isCompleted ? 'bg-green-500 text-white' : 'bg-ev-muted-blue text-white'}
          `}>
            {isCompleted ? <CheckCircle className="w-5 h-5" /> : moduleNumber}
          </span>
          <h2 className="text-lg font-bold text-ev-black">{title}</h2>
        </div>
        {isCompleted && (
          <span className="text-sm text-green-600 font-medium">Completed</span>
        )}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-6">
        {content.map((block, index) => renderContentBlock(block, index))}
      </div>
    </section>
  );
}

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p key={index} className="text-gray-600 leading-relaxed">
          {block.content}
        </p>
      );

    case 'heading':
      return (
        <h3 key={index} className="text-lg font-semibold text-ev-black mt-6 first:mt-0">
          {block.content}
        </h3>
      );

    case 'list':
      return (
        <ul key={index} className="space-y-2 ml-4">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600">
              <span className="w-1.5 h-1.5 bg-ev-muted-blue rounded-full mt-2 flex-shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      );

    case 'stat':
      return (
        <div key={index} className="bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg p-4 flex items-center gap-4">
          <div className="text-3xl font-bold text-ev-muted-blue">{block.value}</div>
          <div>
            {block.label && <div className="text-sm text-gray-500 uppercase tracking-wide">{block.label}</div>}
            <div className="text-gray-700 font-medium">{block.content}</div>
          </div>
        </div>
      );

    case 'definition':
      return (
        <div key={index} className="bg-gray-50 border-l-4 border-ev-muted-blue rounded-r-lg p-4">
          <div className="font-semibold text-ev-black mb-1">{block.term}</div>
          <div className="text-gray-600 text-sm">{block.definition}</div>
        </div>
      );

    case 'callout':
      const variants = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        note: 'bg-gray-50 border-gray-200 text-gray-700',
      };
      return (
        <div key={index} className={`border rounded-lg p-4 ${variants[block.variant || 'note']}`}>
          <p className="text-sm leading-relaxed">{block.content}</p>
        </div>
      );

    default:
      return null;
  }
}
