import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore, { PHASES } from '../store/useGameStore'
import ScoreBoard from './ScoreBoard'
import FallacyButtonBar from './FallacyButtonBar'
import TranscriptPanel from './TranscriptPanel'
import ChatPanel from './ChatPanel'
import FallacyCard from './FallacyCard'

const NEWS_TICKER_ITEMS = [
  'BREAKING: Candidates clash on education funding priorities',
  'POLL: 62% of viewers say debate is "most contentious" this cycle',
  'FACT CHECK TEAM standing by for real-time analysis',
  'SOCIAL MEDIA: #DebateNight trending nationwide',
  'ECONOMY: New jobs report expected to dominate next segment',
  'UP NEXT: Closing statements from all candidates',
]

export default function GameScreen() {
  const {
    currentClip,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    setPhase,
    showTranscript,
    toggleTranscript,
    showChat,
    toggleChat,
    showFallacyInfo,
    toggleFallacyInfo,
    players,
    lastEvent,
    clearLastEvent,
  } = useGameStore()

  const [notification, setNotification] = useState(null)
  const timerRef = useRef(null)
  const duration = currentClip?.duration || 120

  // Simulated video playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(useGameStore.getState().currentTime + 1)
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isPlaying, setCurrentTime])

  // Check if video ended
  useEffect(() => {
    if (currentTime >= duration) {
      setIsPlaying(false)
      clearInterval(timerRef.current)
      setPhase(PHASES.GAME_OVER)
    }
  }, [currentTime, duration, setIsPlaying, setPhase])

  // Auto-start playback
  useEffect(() => {
    const timer = setTimeout(() => setIsPlaying(true), 1500)
    return () => clearTimeout(timer)
  }, [setIsPlaying])

  // Show notification on events
  useEffect(() => {
    if (lastEvent) {
      const player = players.find((p) => p.id === lastEvent.playerId)
      if (lastEvent.type === 'hit') {
        setNotification({
          type: 'hit',
          text: `FALLACY FIRED! +${lastEvent.xp} XP`,
          playerName: player?.name,
        })
      } else {
        setNotification({
          type: 'miss',
          text: `Miss! ${lastEvent.xp} XP`,
          playerName: player?.name,
        })
      }
      const t = setTimeout(() => {
        setNotification(null)
        clearLastEvent()
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [lastEvent, players, clearLastEvent])

  // Get current speaker from timeline
  const getCurrentSpeaker = useCallback(() => {
    if (!currentClip?.speakerTimeline) return null
    return currentClip.speakerTimeline.find(
      (s) => currentTime >= s.start && currentTime < s.end
    )
  }, [currentClip, currentTime])

  const currentSpeaker = getCurrentSpeaker()
  const speakerInfo = currentClip?.speakers?.find((s) => s.id === currentSpeaker?.speaker)

  // Get the first player's assigned fallacy for the info panel
  const activeFallacy = players[0]?.assignedFallacy

  // Progress percentage
  const progressPct = (currentTime / duration) * 100

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Simulated Video Background - dark stage environment */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1225] to-[#060a14] overflow-hidden">

          {/* Stage lighting cones from above */}
          <div
            className="absolute top-0 left-[15%] w-[200px] h-[70%] opacity-[0.07] pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(89,176,196,0.8) 0%, transparent 100%)',
              clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
            }}
          />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[75%] opacity-[0.09] pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(254,209,46,0.7) 0%, transparent 100%)',
              clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
            }}
          />
          <div
            className="absolute top-0 right-[15%] w-[200px] h-[70%] opacity-[0.07] pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(89,176,196,0.8) 0%, transparent 100%)',
              clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
            }}
          />

          {/* Debate stage mockup */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-24">
            {/* Three podiums with silhouette figures */}
            <div className="flex items-end justify-center gap-8 md:gap-14 lg:gap-20 mb-0">
              {/* DEM podium (left) */}
              <div className="flex flex-col items-center">
                {/* Silhouette figure */}
                <div className="relative w-10 h-16 md:w-12 md:h-20 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-blue-800/60" />
                  <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 w-8 h-10 md:w-10 md:h-12 rounded-t-xl bg-blue-800/40" />
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#1a2a5e] to-[#0d1638] rounded-t border-t border-x border-blue-700/30 flex items-end justify-center pb-1">
                  <span className="text-blue-300/70 text-[10px] font-bold tracking-wider">DEM</span>
                </div>
                <div className="w-20 md:w-24 h-2 bg-blue-600/50 rounded-b" />
              </div>

              {/* LIB podium (center) */}
              <div className="flex flex-col items-center">
                <div className="relative w-10 h-16 md:w-12 md:h-20 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-yellow-800/50" />
                  <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 w-8 h-10 md:w-10 md:h-12 rounded-t-xl bg-yellow-800/30" />
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#3d3520] to-[#1f1a0e] rounded-t border-t border-x border-yellow-700/30 flex items-end justify-center pb-1">
                  <span className="text-yellow-300/70 text-[10px] font-bold tracking-wider">LIB</span>
                </div>
                <div className="w-20 md:w-24 h-2 bg-yellow-600/40 rounded-b" />
              </div>

              {/* REP podium (right) */}
              <div className="flex flex-col items-center">
                <div className="relative w-10 h-16 md:w-12 md:h-20 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-800/60" />
                  <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 w-8 h-10 md:w-10 md:h-12 rounded-t-xl bg-red-800/40" />
                </div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-[#4a1a1a] to-[#2a0e0e] rounded-t border-t border-x border-red-700/30 flex items-end justify-center pb-1">
                  <span className="text-red-300/70 text-[10px] font-bold tracking-wider">REP</span>
                </div>
                <div className="w-20 md:w-24 h-2 bg-red-600/50 rounded-b" />
              </div>
            </div>

            {/* Stage floor - dark reflective surface */}
            <div
              className="w-full h-16 md:h-20"
              style={{
                background: 'linear-gradient(180deg, #0a1025 0%, #040610 40%, #020308 100%)',
                boxShadow: 'inset 0 1px 0 rgba(89,176,196,0.08)',
              }}
            >
              {/* Floor reflection highlights */}
              <div className="w-full h-full relative overflow-hidden">
                <div className="absolute top-0 left-[12%] w-[18%] h-[2px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
                <div className="absolute top-0 left-[42%] w-[16%] h-[2px] bg-gradient-to-r from-transparent via-yellow-500/8 to-transparent" />
                <div className="absolute top-0 right-[12%] w-[18%] h-[2px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent" />
              </div>
            </div>
          </div>

          {/* Lower-third broadcast banner */}
          <div className="absolute bottom-16 left-0 right-0 z-[5]">
            <div className="relative mx-auto max-w-2xl">
              {/* Main banner with angled edges */}
              <div
                className="relative overflow-hidden"
                style={{
                  clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)',
                }}
              >
                {/* Dark blue banner body */}
                <div className="bg-gradient-to-r from-[#0a1e3d] via-[#0e2650] to-[#0a1e3d] px-8 py-2.5">
                  <div className="flex items-center gap-4">
                    {/* LIVE indicator with pulsing red dot */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                      </span>
                      <span className="text-red-400 text-xs font-black tracking-widest">LIVE</span>
                    </div>
                    {/* Vertical separator */}
                    <div className="w-px h-8 bg-white/20" />
                    {/* Debate title */}
                    <div className="flex-1 min-w-0">
                      <div className="text-ev-light-blue text-[10px] font-semibold tracking-[0.2em] uppercase">
                        Your Voice Your Vote 2024
                      </div>
                      <div className="text-white font-black text-lg md:text-xl tracking-wide leading-tight">
                        GUBERNATORIAL DEBATE
                      </div>
                    </div>
                    {/* Network bug */}
                    <div className="shrink-0 text-white/30 text-[10px] font-bold tracking-wider">
                      FFN
                    </div>
                  </div>
                </div>
                {/* Yellow accent bar at bottom of banner */}
                <div className="h-[3px] bg-gradient-to-r from-transparent via-ev-yellow to-transparent" />
              </div>
            </div>
          </div>

          {/* News crawl / ticker at bottom of video area */}
          <div className="absolute bottom-8 left-0 right-0 z-[5] overflow-hidden">
            <div className="bg-[#0a1530]/90 border-t border-b border-white/5 py-1">
              <div className="news-ticker-scroll flex whitespace-nowrap">
                {/* Double the items for seamless loop */}
                {[...NEWS_TICKER_ITEMS, ...NEWS_TICKER_ITEMS].map((item, i) => (
                  <span key={i} className="text-white/50 text-[11px] font-medium mx-6 inline-flex items-center gap-2">
                    <span className="text-ev-yellow text-[8px]">&#9670;</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar - thicker with glowing leading dot */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-[6]">
            <div
              className="h-full bg-gradient-to-r from-ev-yellow/80 to-ev-yellow transition-all duration-1000 relative"
              style={{ width: `${progressPct}%` }}
            >
              {/* Glowing leading dot */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                           w-3 h-3 rounded-full bg-ev-yellow"
                style={{
                  boxShadow: '0 0 8px 2px rgba(254,209,46,0.6), 0 0 16px 4px rgba(254,209,46,0.3)',
                }}
              />
            </div>
          </div>

          {/* Time display */}
          <div className="absolute bottom-5 right-3 z-[7] flex items-center gap-2
                          bg-black/70 backdrop-blur-sm rounded-md px-3 py-1.5 border border-white/10">
            <span className="text-ev-yellow font-mono text-sm font-bold">{formatTime(currentTime)}</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/50 font-mono text-sm">{formatTime(duration)}</span>
          </div>

          {/* Play/Pause overlay */}
          {!isPlaying && currentTime < duration && (
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-[8]"
            >
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center
                             backdrop-blur-md border border-white/20"
                   style={{ boxShadow: '0 0 30px rgba(255,255,255,0.1)' }}>
                <span className="text-white text-4xl ml-1.5">&#9654;</span>
              </div>
            </button>
          )}
        </div>

        {/* Scoreboard (top-left) */}
        <div className="absolute top-3 left-14 z-10">
          <ScoreBoard />
        </div>

        {/* Speaker Indicator (top-right) */}
        {speakerInfo && (
          <motion.div
            key={speakerInfo.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm
                       rounded-xl px-4 py-2 border border-white/10 flex items-center gap-3"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: speakerInfo.color }}
            >
              {speakerInfo.name[0]}
            </div>
            <div>
              <div className="text-white text-sm font-semibold flex items-center gap-2">
                {speakerInfo.name} is speaking
                <span className="text-green-400">&#9836;)</span>
              </div>
              <div className="text-white/50 text-xs">
                Click <kbd className="bg-white/20 px-1 rounded text-[10px]">ENTER</kbd> to reply
              </div>
            </div>
          </motion.div>
        )}

        {/* Fallacy Info Panel (right side) */}
        <AnimatePresence>
          {showFallacyInfo && activeFallacy && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute top-16 right-3 z-10 w-64"
            >
              <FallacyCard fallacy={activeFallacy} size="small" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transcript Panel */}
        <AnimatePresence>
          <TranscriptPanel />
        </AnimatePresence>

        {/* Chat Panel */}
        <AnimatePresence>
          <ChatPanel />
        </AnimatePresence>

        {/* FALLACY FIRED Notification */}
        <AnimatePresence>
          {notification && notification.type === 'hit' && (
            <motion.div
              initial={{ scale: 0.3, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.2, opacity: 0, y: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30"
            >
              {/* Starburst effect behind */}
              <div className="absolute inset-0 -m-8 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.5, 2] }}
                    transition={{ duration: 1.2, delay: i * 0.03 }}
                    className="absolute top-1/2 left-1/2 w-1 h-6 bg-ev-yellow/60 rounded-full origin-bottom"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                    }}
                  />
                ))}
              </div>
              {/* Main notification badge */}
              <div
                className="relative px-10 py-5 rounded-2xl font-black text-2xl md:text-3xl
                           text-ev-dark-purple tracking-wide border-2 border-ev-yellow"
                style={{
                  background: 'linear-gradient(135deg, #fed12e 0%, #ffb800 50%, #fed12e 100%)',
                  boxShadow: '0 0 40px rgba(254,209,46,0.5), 0 0 80px rgba(254,209,46,0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              >
                {notification.text}
              </div>
            </motion.div>
          )}
          {notification && notification.type === 'miss' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-30
                         px-8 py-4 rounded-xl font-bold text-xl
                         bg-red-900/70 text-red-300 border border-red-500/40
                         backdrop-blur-sm"
              style={{ boxShadow: '0 0 20px rgba(220,38,38,0.2)' }}
            >
              {notification.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel toggle buttons - vertical icon stack on left edge */}
        <div className="absolute top-3 left-2.5 z-10 flex flex-col gap-2">
          <button
            onClick={toggleTranscript}
            title="Transcript"
            className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all cursor-pointer
                       border backdrop-blur-sm
                       ${showTranscript
                         ? 'bg-ev-light-blue/90 text-white border-ev-light-blue shadow-[0_0_10px_rgba(89,176,196,0.4)]'
                         : 'bg-black/60 text-white/50 hover:text-white/80 border-white/15 hover:border-white/30'
                       }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 1H10L13 4V14C13 14.5 12.5 15 12 15H4C3.5 15 3 14.5 3 14V2C3 1.5 3.5 1 4 1Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M10 1V4H13" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <line x1="5.5" y1="7" x2="10.5" y2="7" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
              <line x1="5.5" y1="9.5" x2="10.5" y2="9.5" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
            </svg>
          </button>
          <button
            onClick={toggleChat}
            title="Chat"
            className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all cursor-pointer
                       border backdrop-blur-sm
                       ${showChat
                         ? 'bg-ev-light-blue/90 text-white border-ev-light-blue shadow-[0_0_10px_rgba(89,176,196,0.4)]'
                         : 'bg-black/60 text-white/50 hover:text-white/80 border-white/15 hover:border-white/30'
                       }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H5L2 14V3Z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
          <button
            onClick={toggleFallacyInfo}
            title="My Fallacy"
            className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-all cursor-pointer
                       border backdrop-blur-sm
                       ${showFallacyInfo
                         ? 'bg-ev-light-blue/90 text-white border-ev-light-blue shadow-[0_0_10px_rgba(89,176,196,0.4)]'
                         : 'bg-black/60 text-white/50 hover:text-white/80 border-white/15 hover:border-white/30'
                       }`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <line x1="8" y1="5" x2="8" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8" cy="8.5" r="0.5" fill="currentColor" />
              <path d="M4 12C4 10.5 5.8 9.5 8 9.5C10.2 9.5 12 10.5 12 12" stroke="currentColor" strokeWidth="1" fill="none" opacity="0" />
            </svg>
          </button>
        </div>
      </div>

      {/* Fallacy Button Bar */}
      <FallacyButtonBar />
    </div>
  )
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
