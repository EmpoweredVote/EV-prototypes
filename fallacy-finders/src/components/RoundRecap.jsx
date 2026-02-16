import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef, useMemo } from 'react'
import useGameStore, { PHASES } from '../store/useGameStore'
import { FALLACIES } from '../data/fallacies'
import FallacyCard from './FallacyCard'

/* ── Animated counter hook ── */
function AnimatedNumber({ value, className, prefix = '', suffix = '' }) {
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (v) => Math.round(v))
  const ref = useRef(null)

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: 'easeOut',
    })
    return controls.stop
  }, [value, motionVal])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => {
      if (ref.current) ref.current.textContent = `${prefix}${v.toLocaleString()}${suffix}`
    })
    return unsubscribe
  }, [rounded, prefix, suffix])

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>
}

export default function RoundRecap() {
  const {
    teamName,
    players,
    getTeamXP,
    currentClip,
    recapTab,
    setRecapTab,
    selectedSegment,
    setSelectedSegment,
    resetGame,
    setPhase,
  } = useGameStore()

  const teamXP = getTeamXP()
  const clip = currentClip

  // Determine rank based on XP
  const getRank = () => {
    if (teamXP >= 1000) return { label: 'GOLD', color: '#FFD700', icon: '&#127942;' }
    if (teamXP >= 500) return { label: 'SILVER', color: '#C0C0C0', icon: '&#129352;' }
    return { label: 'BRONZE', color: '#CD7F32', icon: '&#129353;' }
  }
  const rank = getRank()

  // Get unique fallacy types found in clip for tutorial segments
  const fallacySegments = clip?.fallacies?.reduce((acc, f) => {
    if (!acc.find((s) => s.type === f.type)) {
      acc.push(f)
    }
    return acc
  }, []) || []

  const activeSegment = selectedSegment || fallacySegments[0] || null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #1a0a3e 0%, #2d1b69 50%, #1a0a3e 100%)',
      }}
    >
      {/* Title with gold gradient text */}
      <div className="text-center pt-8 pb-5 px-4">
        <h1
          className="font-extrabold text-2xl md:text-3xl tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #fed12e 0%, #e5b800 40%, #FFD700 70%, #fed12e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 8px rgba(254, 209, 46, 0.3))',
          }}
        >
          ROUND RECAP: {clip?.title?.toUpperCase() || 'DEBATE'}
        </h1>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex justify-center px-4 mb-6">
        <div className="relative inline-flex bg-white/8 rounded-full p-1">
          {/* Sliding pill indicator */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #2d1b69 0%, #4a2c8a 100%)',
              boxShadow: '0 2px 8px rgba(74, 44, 138, 0.5)',
            }}
            animate={{
              left: recapTab === 'stats' ? '4px' : '50%',
              width: 'calc(50% - 4px)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
          <button
            onClick={() => setRecapTab('stats')}
            className={`relative z-10 px-8 py-2.5 rounded-full font-bold text-sm
                       transition-colors duration-200 cursor-pointer
                       ${recapTab === 'stats' ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
          >
            STATS
          </button>
          <button
            onClick={() => setRecapTab('tutorial')}
            className={`relative z-10 px-8 py-2.5 rounded-full font-bold text-sm
                       transition-colors duration-200 cursor-pointer
                       ${recapTab === 'tutorial' ? 'text-white' : 'text-white/50 hover:text-white/70'}`}
          >
            VIDEO TUTORIAL
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {recapTab === 'stats' ? (
          <StatsTab
            teamName={teamName}
            teamXP={teamXP}
            rank={rank}
            players={players}
            clip={clip}
          />
        ) : (
          <TutorialTab
            clip={clip}
            fallacySegments={fallacySegments}
            activeSegment={activeSegment}
            setSelectedSegment={setSelectedSegment}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="border-t border-white/10 px-6 py-5 flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setPhase(PHASES.GAME_OVER)
          }}
          className="px-7 py-3 border-2 border-ev-yellow/40 rounded-xl text-ev-yellow font-bold
                     hover:bg-ev-yellow/10 transition-colors flex items-center gap-2 cursor-pointer"
        >
          &#9664; BACK
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetGame}
          className="px-8 py-3 rounded-xl font-bold text-ev-black
                     flex items-center gap-2 cursor-pointer shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #fed12e 0%, #e5b800 50%, #d4a800 100%)',
          }}
        >
          PLAY AGAIN &#9654;
        </motion.button>
      </div>
    </motion.div>
  )
}

function StatsTab({ teamName, teamXP, rank, players, clip }) {
  // Calculate individual stats
  const totalHits = players.reduce((sum, p) => sum + p.hits.length, 0)
  const totalFP = players.reduce((sum, p) => sum + p.falsePositives.length, 0)
  const totalPossible = clip?.fallacies?.length || 0

  // Find MVP (highest XP)
  const mvp = useMemo(() => {
    if (players.length === 0) return null
    return players.reduce((best, p) => (p.xp > best.xp ? p : best), players[0])
  }, [players])

  // Max XP for progress bars
  const maxXP = useMemo(() => {
    return Math.max(1, ...players.map((p) => Math.max(0, p.xp)))
  }, [players])

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {/* Team Stats */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-white/50 text-[10px] font-bold tracking-[0.2em] mb-6">TEAM STATS</h3>

        {/* Prominent team score */}
        <div className="text-center mb-6">
          <div className="text-white/40 text-xs font-semibold tracking-widest mb-1">TEAM SCORE</div>
          <div className="flex items-baseline justify-center gap-1">
            <AnimatedNumber
              value={teamXP}
              className="font-extrabold text-5xl glow-text-yellow text-ev-yellow"
            />
            <span className="text-ev-yellow/70 text-xl font-bold ml-1">XP</span>
          </div>
        </div>

        {/* Rank medallion */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center relative"
            style={{
              border: `3px solid ${rank.color}`,
              boxShadow: `0 0 20px ${rank.color}33, inset 0 0 15px ${rank.color}15`,
              background: `radial-gradient(circle, ${rank.color}15 0%, transparent 70%)`,
            }}
          >
            <div className="text-center">
              <span
                className="block text-2xl mb-0.5"
                dangerouslySetInnerHTML={{ __html: rank.icon }}
              />
              <span
                className="text-[10px] font-extrabold tracking-widest"
                style={{ color: rank.color }}
              >
                {rank.label}
              </span>
            </div>
          </div>
        </div>

        {/* Individual Scores Table */}
        <div>
          <h4 className="text-white/50 text-[10px] font-bold tracking-[0.2em] mb-3">
            INDIVIDUAL SCORES
          </h4>
          <div className="rounded-xl overflow-hidden border border-white/8">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 px-3 py-2 text-white/40 text-[10px] font-bold tracking-wider bg-white/5">
              <span>NAME</span>
              <span>FALLACY</span>
              <span className="text-center w-10">HITS</span>
              <span className="text-right w-14">XP</span>
            </div>
            {/* Rows with alternating backgrounds */}
            {players.map((player, idx) => {
              const isMVP = mvp && player.id === mvp.id && player.xp > 0
              const progressPct = maxXP > 0 ? (Math.max(0, player.xp) / maxXP) * 100 : 0
              return (
                <div
                  key={player.id}
                  className={`relative px-3 py-2.5 ${idx % 2 === 0 ? 'bg-white/3' : 'bg-transparent'}`}
                >
                  {/* MVP highlight */}
                  {isMVP && (
                    <div className="absolute inset-0 border border-ev-yellow/20 rounded-none bg-ev-yellow/5" />
                  )}
                  <div className="relative grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                    <span className="text-white text-sm truncate flex items-center gap-1.5">
                      {player.name}
                      {isMVP && (
                        <span className="text-[9px] font-extrabold tracking-wider text-ev-yellow bg-ev-yellow/15 px-1.5 py-0.5 rounded-full">
                          MVP
                        </span>
                      )}
                    </span>
                    <span className="text-ev-light-blue text-xs truncate">
                      {player.assignedFallacy?.name || '-'}
                    </span>
                    <span className="text-white text-sm text-center w-10">{player.hits.length}</span>
                    <span className={`text-sm text-right font-bold w-14 ${player.xp >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {player.xp >= 0 ? '+' : ''}{player.xp}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-1.5 h-1 rounded-full bg-white/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: isMVP
                          ? 'linear-gradient(90deg, #fed12e, #e5b800)'
                          : 'linear-gradient(90deg, #59b0c4, #00657c)',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 1, delay: 0.3 + idx * 0.15, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Round Summary */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass-dark rounded-2xl p-6"
      >
        <h3 className="text-white/50 text-[10px] font-bold tracking-[0.2em] mb-6">ROUND SUMMARY</h3>

        <div className="space-y-6">
          <StatBlock
            label="HITS"
            value={totalHits}
            description={`You correctly identified fallacies ${totalHits} time${totalHits !== 1 ? 's' : ''} within the detection window.`}
            color="text-green-400"
            delay={0.2}
          />
          <StatBlock
            label="FALSE POSITIVES"
            value={totalFP}
            description="You pressed the button where the logic was actually sound. This reduces the overall Score of the stats."
            color="text-red-400"
            delay={0.5}
          />
          <StatBlock
            label="CROSS-VERIFICATION"
            value={0}
            description="When teammates verify each other's findings, the team's Consensus Weight increases."
            color="text-ev-light-blue"
            delay={0.8}
          />
        </div>
      </motion.div>
    </div>
  )
}

function StatBlock({ label, value, description, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white/3 rounded-xl p-4 border border-white/5"
    >
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="text-white text-sm font-semibold">{label}</span>
        <AnimatedNumber
          value={value}
          className={`${color} font-bold text-3xl`}
        />
      </div>
      <p className="text-white/45 text-xs leading-relaxed">{description}</p>
    </motion.div>
  )
}

function TutorialTab({ clip, fallacySegments, activeSegment, setSelectedSegment }) {
  if (!clip) return null

  return (
    <div className="max-w-3xl mx-auto">
      {/* Video preview with timeline */}
      <div className="rounded-2xl overflow-hidden mb-5 border border-white/10 shadow-xl">
        {/* Simulated video preview with play icon overlay */}
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
          <div className="text-center relative z-10">
            <div className="bg-blue-700/80 px-4 py-1 rounded text-xs text-white/70 mb-2 backdrop-blur-sm">
              YOUR VOICE YOUR VOTE 2024
            </div>
            <div className="text-white font-bold text-lg">GUBERNATORIAL DEBATE</div>
          </div>
          {/* Play icon overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <svg
                viewBox="0 0 24 24"
                fill="white"
                className="w-7 h-7 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Fallacy segment pills (timeline chapters) */}
        <div className="flex flex-wrap gap-2 p-3 bg-black/30">
          {fallacySegments.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setSelectedSegment(seg)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold text-center
                         transition-all duration-200 cursor-pointer whitespace-nowrap
                         ${activeSegment?.id === seg.id
                           ? 'bg-ev-yellow text-ev-black shadow-md'
                           : 'bg-white/8 text-white/70 hover:bg-white/15 hover:text-white'
                         }`}
              style={activeSegment?.id === seg.id ? {
                boxShadow: '0 2px 12px rgba(254, 209, 46, 0.3)',
              } : {}}
            >
              {seg.type.replace(/_/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Timeline bar */}
        <div className="px-3 pb-2.5 bg-black/30">
          <div className="flex justify-between text-white/25 text-[10px] font-mono">
            <span>0:00</span>
            {fallacySegments.map((seg) => (
              <span key={seg.id}>{formatTime(seg.startTime)}</span>
            ))}
            <span>{formatTime(clip.duration)}</span>
          </div>
        </div>
      </div>

      <p className="text-white/40 text-xs text-center mb-5">
        Tap on the fallacy chapters to jump the video and get a detailed breakdown for each one.
      </p>

      {/* Current segment label */}
      {activeSegment && (
        <div className="text-center mb-5">
          <span
            className="text-sm font-bold px-4 py-1.5 rounded-full inline-block"
            style={{
              background: 'linear-gradient(135deg, rgba(254,209,46,0.15), rgba(254,209,46,0.05))',
              border: '1px solid rgba(254,209,46,0.25)',
              color: '#fed12e',
            }}
          >
            Current Segment: {activeSegment.type.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      )}

      {/* Explanation + Card */}
      {activeSegment && (
        <motion.div
          key={activeSegment.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid md:grid-cols-2 gap-5"
        >
          {/* Explanation card */}
          <div className="glass-dark rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-ev-yellow text-xs font-bold tracking-widest mb-2">
                Explanation:
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {activeSegment.explanation}
              </p>
            </div>
            <div>
              <h4 className="text-ev-yellow text-xs font-bold tracking-widest mb-2">
                Key Identification Tip:
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {activeSegment.teachingTip}
              </p>
            </div>
            {activeSegment.quote && (
              <div
                className="rounded-lg p-3"
                style={{
                  borderLeft: '3px solid #fed12e',
                  background: 'rgba(254, 209, 46, 0.06)',
                }}
              >
                <p className="text-white/70 text-sm italic">
                  &ldquo;{activeSegment.quote}&rdquo;
                </p>
                <span className="text-white/40 text-xs mt-1 inline-block">
                  &mdash; {activeSegment.speaker}
                </span>
              </div>
            )}
          </div>

          {/* Fallacy Card */}
          <div>
            <FallacyCardFromType type={activeSegment.type} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

function FallacyCardFromType({ type }) {
  const fallacy = FALLACIES.find((f) => f.id === type)
  if (!fallacy) return null
  return <FallacyCard fallacy={fallacy} size="small" />
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
