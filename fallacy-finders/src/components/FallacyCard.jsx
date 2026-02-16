import { motion } from 'framer-motion'

/* Tier-based top border colors */
const TIER_COLORS = {
  1: '#4CAF50', // green
  2: '#FF9800', // orange
  3: '#F44336', // red
  4: '#7c3aed', // purple
}

/* Lighter tier tints for icon background */
const TIER_BG = {
  1: 'rgba(76, 175, 80, 0.12)',
  2: 'rgba(255, 152, 0, 0.12)',
  3: 'rgba(244, 67, 54, 0.12)',
  4: 'rgba(124, 58, 237, 0.12)',
}

export default function FallacyCard({ fallacy, size = 'large', onClick, className = '' }) {
  if (!fallacy) return null

  const isSmall = size === 'small'
  const tierColor = TIER_COLORS[fallacy.tier] || TIER_COLORS[1]
  const tierBg = TIER_BG[fallacy.tier] || TIER_BG[1]

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onClick={onClick}
      className={`rounded-xl overflow-hidden
                  shadow-md hover:shadow-lg transition-shadow duration-300
                  ${onClick ? 'cursor-pointer' : ''}
                  ${className}`}
      style={{
        background: 'linear-gradient(180deg, #ffffff 0%, #f0fafb 100%)',
        border: '1px solid rgba(89, 176, 196, 0.2)',
        borderTop: `4px solid ${tierColor}`,
      }}
    >
      <div className={isSmall ? 'p-4' : 'p-8 md:p-10'}>
        {/* Icon in circular container */}
        <div className={`flex justify-center ${isSmall ? 'mb-3' : 'mb-5'}`}>
          <div
            className={`flex items-center justify-center rounded-full
                        ${isSmall ? 'w-10 h-10' : 'w-14 h-14'}`}
            style={{ backgroundColor: tierBg }}
          >
            <span className={isSmall ? 'text-xl' : 'text-3xl'}>{fallacy.icon}</span>
          </div>
        </div>

        {/* Name */}
        <h3
          className={`text-center font-extrabold text-ev-black tracking-tight break-words
                      ${isSmall ? 'text-sm mb-2 leading-tight' : 'text-xl mb-4'}`}
        >
          {fallacy.name}
        </h3>

        {/* Tier badge */}
        <div className="flex justify-center mb-4">
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
            style={{
              color: tierColor,
              backgroundColor: tierBg,
            }}
          >
            Tier {fallacy.tier}
          </span>
        </div>

        {/* Short description */}
        <p
          className={`text-center text-gray-600
                      ${isSmall ? 'text-xs leading-snug' : 'text-sm leading-relaxed mb-5'}`}
        >
          {fallacy.shortDesc}
        </p>

        {/* Teaching note (large only) — indented with left border */}
        {!isSmall && fallacy.teachingNote && (
          <div
            className="mt-4 pl-4 py-2 rounded-r-lg"
            style={{
              borderLeft: `3px solid ${tierColor}`,
              backgroundColor: tierBg,
            }}
          >
            <p className="text-ev-muted-blue text-sm leading-relaxed">
              {fallacy.teachingNote}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
