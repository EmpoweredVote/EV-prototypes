import { Link } from 'react-router-dom';
import { Award, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';

interface BadgeData {
  title: string;
  level: string;
  earnedDate: string;
  summary: string[];
  resources: Array<{
    title: string;
    url: string;
  }>;
  falseBalanceWarnings: Array<{
    falseStatement: string;
    truth: string;
  }>;
  relatedBadges: Array<{
    title: string;
    status: 'available' | 'coming-soon';
  }>;
}

interface BadgeEarnedProps {
  badgeData: BadgeData;
}

export function BadgeEarned({ badgeData }: BadgeEarnedProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-ev-muted-blue/5 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-ev-muted-blue hover:text-ev-coral transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Badges
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Celebration Hero */}
        <div className="text-center mb-12">
          {/* Badge Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-ev-yellow to-ev-coral rounded-full flex items-center justify-center shadow-lg">
              <Award className="w-16 h-16 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-ev-black mb-2">
            Congratulations!
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            You've earned the <span className="font-semibold text-ev-muted-blue">{badgeData.title}</span> Badge
          </p>

          {/* Meta */}
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="bg-ev-light-blue/20 text-ev-muted-blue px-3 py-1 rounded-full font-medium">
              {badgeData.level}
            </span>
            <span>Earned {currentDate}</span>
          </div>
        </div>

        {/* What You Now Understand */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-ev-black mb-6">What You Now Understand</h2>
          <div className="grid gap-4">
            {badgeData.summary.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Avoiding False Balance */}
        <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-ev-black mb-2">Avoiding the False Balance Fallacy</h2>
          <p className="text-gray-600 mb-6">
            This topic can be subject to misleading "both sides" framing. Here's what the data actually shows:
          </p>
          <div className="space-y-6">
            {badgeData.falseBalanceWarnings.map((warning, index) => (
              <div key={index} className="bg-white rounded-lg p-5 border border-amber-200">
                <div className="mb-3">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Not False Balance:</span>
                  <p className="text-gray-500 italic mt-1">"{warning.falseStatement}"</p>
                </div>
                <div>
                  <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">What's Actually True:</span>
                  <p className="text-gray-700 mt-1">{warning.truth}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-ev-black mb-4">Stay Informed</h2>
          <p className="text-gray-600 mb-6">
            For the most current information, consult these official sources:
          </p>
          <div className="grid gap-3">
            {badgeData.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-ev-light-blue/10 transition-colors group"
              >
                <span className="text-gray-700 group-hover:text-ev-muted-blue font-medium">
                  {resource.title}
                </span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-ev-muted-blue" />
              </a>
            ))}
          </div>
        </section>

        {/* Related Badges */}
        <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-ev-black mb-4">Related Badges</h2>
          <div className="grid gap-3">
            {badgeData.relatedBadges.map((badge, index) => (
              <div
                key={index}
                className={`
                  flex items-center justify-between p-4 rounded-lg
                  ${badge.status === 'available'
                    ? 'bg-ev-light-blue/10 border border-ev-light-blue/30'
                    : 'bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <span className={badge.status === 'available' ? 'text-ev-muted-blue font-medium' : 'text-gray-500'}>
                  {badge.title}
                </span>
                <span className={`
                  text-xs font-medium px-3 py-1 rounded-full
                  ${badge.status === 'available'
                    ? 'bg-ev-muted-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {badge.status === 'available' ? 'Available' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-ev-muted-blue text-white rounded-lg font-semibold hover:bg-ev-muted-blue/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Badges
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-12 italic">
          This badge was designed to establish shared factual understanding, not to prescribe policy solutions.
          Users are equipped to engage in informed civic discussion with accurate data on this complex local challenge.
        </p>
      </main>
    </div>
  );
}
