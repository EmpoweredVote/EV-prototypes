import { motion } from 'framer-motion'
import useGameStore from '../store/useGameStore'

/* Inline SVG shield crest with a colored flag stripe */
function ShieldCrest({ color = '#fed12e', accentColor = '#e5b800' }) {
  return (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 1L2 6V16C2 23 7 28.5 14 31C21 28.5 26 23 26 16V6L14 1Z"
        fill="rgba(0,0,0,0.5)"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M14 4L5 8V16C5 21.5 9 26 14 28C19 26 23 21.5 23 16V8L14 4Z"
        fill="rgba(0,0,0,0.3)"
      />
      {/* Flag stripe */}
      <rect x="10" y="9" width="8" height="4" rx="1" fill={color} />
      <rect x="10" y="15" width="8" height="4" rx="1" fill={accentColor} />
    </svg>
  )
}

/* Segmented XP progress bar with shine effect */
function SegmentedXPBar({ ratio, color, glowColor }) {
  const totalSegments = 20
  const filledSegments = Math.max(1, Math.round(ratio * totalSegments))
  const percentage = Math.max(5, ratio * 100)

  return (
    <div className="w-full h-4 bg-black/60 rounded-md overflow-hidden border border-white/10 relative">
      {/* Filled portion */}
      <motion.div
        className="h-full rounded-md relative overflow-hidden"
        style={{ background: `linear-gradient(90deg, ${color}, ${glowColor})` }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 15 }}
      >
        {/* Shimmer shine effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s ease-in-out infinite',
          }}
        />
      </motion.div>
      {/* Segment lines */}
      <div className="absolute inset-0 flex pointer-events-none">
        {Array.from({ length: totalSegments - 1 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-r border-black/40"
          />
        ))}
        <div className="flex-1" />
      </div>
    </div>
  )
}

export default function ScoreBoard() {
  const { teamName, players, getTeamXP } = useGameStore()
  const teamXP = getTeamXP()

  // Simulated opponent team
  const opponentXP = 23000
  const opponentName = 'Reasoning Renegades'

  const maxXP = Math.max(teamXP, opponentXP, 1)

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="rounded-xl w-72 overflow-hidden"
      style={{
        background: 'rgba(10, 5, 30, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Header bar */}
      <div
        className="px-3 py-1.5 flex items-center justify-center gap-1.5"
        style={{
          background: 'linear-gradient(90deg, rgba(254,209,46,0.15), rgba(89,176,196,0.15))',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon points="6,1 8,4.5 12,5 9,7.8 9.8,11 6,9.2 2.2,11 3,7.8 0,5 4,4.5" fill="#fed12e" />
        </svg>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
          Scoreboard
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon points="6,1 8,4.5 12,5 9,7.8 9.8,11 6,9.2 2.2,11 3,7.8 0,5 4,4.5" fill="#fed12e" />
        </svg>
      </div>

      <div className="p-3 space-y-3">
        {/* Team 1 (Player's team) - gold/yellow theme */}
        <div
          className="rounded-lg p-2.5"
          style={{
            border: '1px solid rgba(254,209,46,0.35)',
            background: 'linear-gradient(135deg, rgba(254,209,46,0.08), rgba(229,184,0,0.04))',
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCrest color="#fed12e" accentColor="#e5b800" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-ev-yellow text-xs font-extrabold uppercase tracking-wide truncate max-w-[110px]">
                  {teamName || 'Your Team'}
                </span>
                <motion.span
                  key={teamXP}
                  initial={{ scale: 1.3, color: '#fed12e' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.4 }}
                  className="text-white text-xs font-mono font-bold"
                >
                  {teamXP.toLocaleString()} XP
                </motion.span>
              </div>
              <SegmentedXPBar
                ratio={teamXP / maxXP}
                color="#e5b800"
                glowColor="#fed12e"
              />
            </div>
          </div>
        </div>

        {/* Divider with "VS" */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-extrabold tracking-widest text-white/25">VS</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Team 2 (Simulated opponent) - blue theme */}
        <div
          className="rounded-lg p-2.5"
          style={{
            border: '1px solid rgba(89,176,196,0.3)',
            background: 'linear-gradient(135deg, rgba(89,176,196,0.08), rgba(0,101,124,0.04))',
          }}
        >
          <div className="flex items-center gap-2">
            <ShieldCrest color="#59b0c4" accentColor="#00657c" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-ev-light-blue text-xs font-extrabold uppercase tracking-wide truncate max-w-[110px]">
                  {opponentName}
                </span>
                <span className="text-white text-xs font-mono font-bold">
                  {opponentXP.toLocaleString()} XP
                </span>
              </div>
              <SegmentedXPBar
                ratio={opponentXP / maxXP}
                color="#00657c"
                glowColor="#59b0c4"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
