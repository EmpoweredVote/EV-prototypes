import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadRankStore, type Quote } from '../store/useReadRankStore';
import { DiamondBadge, GoldBadge } from './BadgeIcons';

interface CompactQuoteCardProps {
  quote: Quote;
  index: number;
  diamondQuoteId: string | null;
  goldQuoteId: string | null;
  onAssignBadge: (quoteId: string, badge: 'diamond' | 'gold') => void;
}

const CompactQuoteCard: React.FC<CompactQuoteCardProps> = ({
  quote,
  index,
  diamondQuoteId,
  goldQuoteId,
  onAssignBadge,
}) => {
  const hasDiamond = diamondQuoteId === quote.id;
  const hasGold = goldQuoteId === quote.id;
  const hasBadge = hasDiamond || hasGold;

  // Diamond is disabled if another card has it, or this card has gold
  const diamondDisabled = (diamondQuoteId !== null && !hasDiamond) || hasGold;
  // Gold is disabled if another card has it, or this card has diamond
  const goldDisabled = (goldQuoteId !== null && !hasGold) || hasDiamond;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      transition={{
        layout: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
        opacity: { duration: 0.3 },
        x: { duration: 0.4, ease: 'easeOut' },
        delay: index * 0.05,
      }}
      className="relative"
    >
      <div
        className={`
          sidebar-quote-card relative overflow-visible
          transition-all duration-300
          ${hasBadge
            ? hasDiamond
              ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20'
              : 'ring-2 ring-amber-400 shadow-lg shadow-amber-500/20'
            : ''
          }
        `}
      >
        {/* Badge indicator in corner */}
        <AnimatePresence>
          {hasBadge && (
            <motion.div
              className="absolute -top-2 -left-2 z-10"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <div
                className={`
                  w-8 h-8 rounded-full
                  flex items-center justify-center
                  shadow-md ring-2 ring-white
                  ${hasDiamond
                    ? 'bg-gradient-to-br from-cyan-400 to-blue-600'
                    : 'bg-gradient-to-br from-yellow-400 to-amber-600'
                  }
                `}
              >
                {hasDiamond ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 9L12 22L20 9L12 2Z" fill="#E0F7FF" stroke="#0E7490" strokeWidth="0.5"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="14" r="8" fill="#FEF3C7" stroke="#92400E" strokeWidth="0.5"/>
                    <path d="M12 10L13.09 12.26L15.5 12.63L13.75 14.34L14.18 16.73L12 15.58L9.82 16.73L10.25 14.34L8.5 12.63L10.91 12.26L12 10Z" fill="#FFFBEB" stroke="#B45309" strokeWidth="0.3"/>
                  </svg>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quote content */}
        <div className={hasBadge ? 'pl-6' : ''}>
          {/* Status label */}
          <div className="flex items-center justify-between mb-2">
            <AnimatePresence mode="wait">
              {hasBadge ? (
                <motion.span
                  key="badge-label"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`
                    font-manrope font-bold text-[10px] px-1.5 py-0.5 rounded-full
                    ${hasDiamond
                      ? 'bg-cyan-100 text-cyan-700'
                      : 'bg-amber-100 text-amber-700'
                    }
                  `}
                >
                  {hasDiamond ? 'Top Pick' : 'Runner Up'}
                </motion.span>
              ) : (
                <motion.span
                  key="default-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-manrope text-[10px] text-white/50"
                >
                  Agreed
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Quote Text - full text visible */}
          <div className="font-manrope font-medium text-sm leading-relaxed">
            {quote.text}
          </div>

          {/* Badge selection */}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center justify-between">
            <span className="text-xs text-white/50">Assign badge:</span>
            <div className="flex items-center gap-2">
              <DiamondBadge
                isActive={hasDiamond}
                isDisabled={diamondDisabled}
                onClick={() => onAssignBadge(quote.id, 'diamond')}
                size={24}
              />
              <GoldBadge
                isActive={hasGold}
                isDisabled={goldDisabled}
                onClick={() => onAssignBadge(quote.id, 'gold')}
                size={24}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const AgreedQuotesSidebar: React.FC = () => {
  const {
    agreedQuotes,
    badgeAssignments,
    assignBadge,
    quotesToEvaluate,
    currentQuoteIndex,
  } = useReadRankStore();

  const handleAssignBadge = (quoteId: string, badge: 'diamond' | 'gold') => {
    assignBadge(quoteId, badge);
  };

  const remainingQuotes = quotesToEvaluate.length - currentQuoteIndex;
  const isComplete = currentQuoteIndex >= quotesToEvaluate.length;

  return (
    <div className="agreed-quotes-sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <h3 className="font-manrope font-bold text-sm text-gray-700">
          Agreed Quotes
        </h3>
        <span className="font-manrope text-xs text-gray-500">
          {agreedQuotes.length} selected
        </span>
      </div>

      {/* Badge status */}
      <div className="sidebar-badge-status">
        <div className={`badge-status-item ${badgeAssignments.diamond ? 'active' : ''}`}>
          <div className={`status-dot ${badgeAssignments.diamond ? 'bg-cyan-400' : 'bg-gray-300'}`} />
          <span className="text-[10px]">
            Diamond {badgeAssignments.diamond ? '✓' : ''}
          </span>
        </div>
        <div className={`badge-status-item ${badgeAssignments.gold ? 'active' : ''}`}>
          <div className={`status-dot ${badgeAssignments.gold ? 'bg-amber-400' : 'bg-gray-300'}`} />
          <span className="text-[10px]">
            Gold {badgeAssignments.gold ? '✓' : ''}
          </span>
        </div>
      </div>

      {/* Quote list */}
      <div className="sidebar-quotes-list">
        <AnimatePresence>
          {agreedQuotes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="sidebar-empty-state"
            >
              <p className="text-xs text-gray-400 text-center">
                Quotes you agree with will appear here
              </p>
            </motion.div>
          ) : (
            agreedQuotes.map((quote, index) => (
              <CompactQuoteCard
                key={quote.id}
                quote={quote}
                index={index}
                diamondQuoteId={badgeAssignments.diamond}
                goldQuoteId={badgeAssignments.gold}
                onAssignBadge={handleAssignBadge}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicator */}
      {!isComplete && (
        <div className="sidebar-progress">
          <span className="text-[10px] text-gray-500">
            {remainingQuotes} quote{remainingQuotes !== 1 ? 's' : ''} remaining
          </span>
        </div>
      )}
    </div>
  );
};
