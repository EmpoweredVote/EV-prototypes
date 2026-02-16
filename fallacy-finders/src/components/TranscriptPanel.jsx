import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import useGameStore from '../store/useGameStore'

/* Color map for speaker parties */
const PARTY_COLORS = {
  D: '#59b0c4',      // Democrat - light blue
  R: '#ff5740',      // Republican - coral
  I: '#fed12e',       // Independent - yellow
  Moderator: '#757575', // Moderator - gray
}

function getSpeakerColor(segment, clipSpeakers) {
  if (segment.speaker === 'Moderator') return PARTY_COLORS.Moderator
  // Try to match from the clip speakers array
  if (clipSpeakers) {
    const match = clipSpeakers.find(
      (s) => s.name === segment.speaker || segment.speaker?.includes(s.name)
    )
    if (match?.party) return PARTY_COLORS[match.party] || '#59b0c4'
  }
  // Fall back to party from segment
  if (segment.party) return PARTY_COLORS[segment.party] || '#59b0c4'
  return '#59b0c4'
}

export default function TranscriptPanel() {
  const { currentClip, currentTime, showTranscript, toggleTranscript } = useGameStore()
  const scrollRef = useRef(null)

  const transcript = currentClip?.transcript || []
  const clipSpeakers = currentClip?.speakers || []

  // Auto-scroll to current segment with smooth behavior
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentTime])

  if (!showTranscript) return null

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      className="absolute top-0 left-0 h-full w-80 z-20 flex flex-col"
      style={{
        background: 'rgba(10, 5, 30, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(89, 176, 196, 0.12)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(90deg, rgba(89,176,196,0.1), rgba(74,44,138,0.1))',
          borderBottom: '1px solid rgba(89,176,196,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Document icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(89,176,196,0.2), rgba(0,101,124,0.3))',
              border: '1px solid rgba(89,176,196,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 1H10L13 4V14C13 14.5 12.5 15 12 15H4C3.5 15 3 14.5 3 14V2C3 1.5 3.5 1 4 1Z" stroke="#59b0c4" strokeWidth="1.2" fill="none" />
              <path d="M10 1V4H13" stroke="#59b0c4" strokeWidth="1.2" fill="none" />
              <line x1="5.5" y1="7" x2="10.5" y2="7" stroke="#59b0c4" strokeWidth="0.8" opacity="0.6" />
              <line x1="5.5" y1="9.5" x2="10.5" y2="9.5" stroke="#59b0c4" strokeWidth="0.8" opacity="0.6" />
              <line x1="5.5" y1="12" x2="8.5" y2="12" stroke="#59b0c4" strokeWidth="0.8" opacity="0.6" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-none">Transcript</h3>
            <span className="text-white/30 text-[10px]">Live captions</span>
          </div>
        </div>
        {/* Close button - X in a circle */}
        <button
          onClick={toggleTranscript}
          className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer
                     transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,87,64,0.2)'
            e.currentTarget.style.borderColor = 'rgba(255,87,64,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Transcript Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        style={{ scrollBehavior: 'smooth' }}
      >
        {transcript.map((segment, i) => {
          const isActive = currentTime >= segment.time &&
            (i === transcript.length - 1 || currentTime < transcript[i + 1]?.time)
          const isPast = currentTime >= segment.time && !isActive
          const speakerColor = getSpeakerColor(segment, clipSpeakers)

          return (
            <motion.div
              key={i}
              data-active={isActive}
              initial={false}
              animate={{
                opacity: isActive ? 1 : isPast ? 0.45 : 0.25,
              }}
              transition={{ duration: 0.3 }}
              className="rounded-lg transition-all duration-300"
              style={{
                padding: '10px 12px',
                background: isActive
                  ? 'rgba(89, 176, 196, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                borderLeft: isActive
                  ? `3px solid ${speakerColor}`
                  : '3px solid transparent',
                boxShadow: isActive
                  ? `inset 3px 0 12px rgba(89,176,196,0.06), 0 1px 4px rgba(0,0,0,0.2)`
                  : 'none',
                border: isActive
                  ? undefined
                  : '1px solid rgba(255,255,255,0.03)',
                borderLeftWidth: '3px',
                borderLeftStyle: 'solid',
                borderLeftColor: isActive ? speakerColor : 'transparent',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {/* Timestamp badge/chip */}
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    background: 'rgba(254,209,46,0.12)',
                    color: '#fed12e',
                    border: '1px solid rgba(254,209,46,0.15)',
                  }}
                >
                  {formatTime(segment.time)}
                </span>
                {/* Speaker name - color coded */}
                <span
                  className="font-bold text-xs"
                  style={{ color: speakerColor }}
                >
                  {segment.speaker}
                  {segment.party ? ` (${segment.party})` : ''}
                </span>
              </div>
              <p className="text-white/85 text-sm leading-relaxed pl-0.5">
                {segment.text}
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
