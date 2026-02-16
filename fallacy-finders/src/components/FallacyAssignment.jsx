import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore, { PHASES } from '../store/useGameStore'
import { FALLACIES } from '../data/fallacies'
import { CLIPS } from '../data/clips'
import FallacyCard from './FallacyCard'

/* Progress dots showing which players have been assigned */
function PlayerProgressDots({ total, current, revealed }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {Array.from({ length: total }).map((_, i) => {
        const isComplete = i < current || (i === current && revealed)
        const isCurrent = i === current
        return (
          <motion.div
            key={i}
            animate={{ scale: isCurrent ? 1.3 : 1 }}
            style={{ position: 'relative' }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '9999px',
                transition: 'all 0.3s',
                background: isComplete
                  ? 'linear-gradient(135deg, #59b0c4, #00657c)'
                  : isCurrent
                  ? 'rgba(89,176,196,0.3)'
                  : 'rgba(255,255,255,0.15)',
                boxShadow: isComplete
                  ? '0 0 8px rgba(89,176,196,0.5)'
                  : 'none',
                border: isCurrent && !isComplete
                  ? '1.5px solid rgba(89,176,196,0.6)'
                  : '1px solid transparent',
              }}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

export default function FallacyAssignment() {
  const {
    players,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    assignFallacies,
    setPhase,
    setCurrentClip,
  } = useGameStore()

  const [revealed, setRevealed] = useState(false)
  const [assigned, setAssigned] = useState(false)

  // Assign fallacies on mount
  useEffect(() => {
    if (!assigned) {
      assignFallacies(FALLACIES)
      setCurrentClip(CLIPS[0]) // Use first clip for prototype
      setAssigned(true)
    }
  }, [assigned, assignFallacies, setCurrentClip])

  const currentPlayer = players[currentPlayerIndex]

  const handleReveal = () => {
    setRevealed(true)
  }

  const handleNext = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1)
      setRevealed(false)
    } else {
      setPhase(PHASES.PLAYING)
    }
  }

  const handleBack = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1)
      setRevealed(true)
    } else {
      setPhase(PHASES.TEAM_SETUP)
    }
  }

  if (!currentPlayer) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="animated-gradient-bg"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Decorative floating orbs */}
      <div
        className="float-slow pointer-events-none"
        style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '256px',
          height: '256px',
          borderRadius: '9999px',
          opacity: 0.3,
          background: 'radial-gradient(circle, rgba(89,176,196,0.2), transparent 70%)',
        }}
      />
      <div
        className="float-alt pointer-events-none"
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '40px',
          width: '320px',
          height: '320px',
          borderRadius: '9999px',
          opacity: 0.2,
          background: 'radial-gradient(circle, rgba(74,44,138,0.3), transparent 70%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Player greeting */}
        <motion.h1
          key={currentPlayer.id + '-name'}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-extrabold text-center"
          style={{
            fontSize: 'clamp(1.75rem, 5vw, 3rem)',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #59b0c4 0%, #7cc5d6 50%, #59b0c4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Hey {currentPlayer.name}!
        </motion.h1>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center"
          style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '32px' }}
        >
          The system has randomly assigned you one of the core 24 logical fallacies.
        </motion.p>

        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-bold text-center glow-text-blue"
          style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '40px' }}
        >
          Your Fallacy for This Round is
        </motion.h2>

        {/* Fallacy Card or Mystery Card */}
        <div style={{ perspective: '1200px' }}>
          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div
                key="mystery"
                initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ rotateY: 90, opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0.3 }}
                onClick={handleReveal}
                className="shimmer-overlay group"
                style={{
                  width: '256px',
                  height: '288px',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a0a3e 0%, #2d1b69 50%, #1a0a3e 100%)',
                  border: '2px solid rgba(89,176,196,0.3)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(89,176,196,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Sparkle decorations */}
                <div className="float" style={{ position: 'absolute', top: '16px', left: '16px', color: 'rgba(254,209,46,0.4)', fontSize: '0.75rem' }}>+</div>
                <div className="float-alt float-delay-1" style={{ position: 'absolute', top: '32px', right: '24px', color: 'rgba(89,176,196,0.3)', fontSize: '0.875rem' }}>*</div>
                <div className="float-slow float-delay-2" style={{ position: 'absolute', bottom: '48px', left: '32px', color: 'rgba(254,209,46,0.3)', fontSize: '0.75rem' }}>+</div>
                <div className="float float-delay-3" style={{ position: 'absolute', bottom: '24px', right: '16px', color: 'rgba(89,176,196,0.4)', fontSize: '0.875rem' }}>*</div>

                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="glow-text-blue"
                  style={{ fontSize: '3.75rem', marginBottom: '16px', color: '#59b0c4' }}
                >
                  ?
                </motion.span>
                <p className="group-hover:text-white/80 transition-colors" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>
                  Tap to reveal your fallacy
                </p>

                {/* Hover glow overlay */}
                <div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '12px',
                    boxShadow: 'inset 0 0 30px rgba(89,176,196,0.15)',
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ rotateY: -90, opacity: 0, scale: 0.9 }}
                animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 80, damping: 12, duration: 0.8 }}
                style={{ width: '100%', maxWidth: '448px', position: 'relative', transformStyle: 'preserve-3d' }}
              >
                {/* Glow effect behind the card */}
                <div
                  className="pointer-events-none"
                  style={{
                    position: 'absolute',
                    inset: '-16px',
                    borderRadius: '16px',
                    background: 'radial-gradient(circle, rgba(89,176,196,0.2) 0%, transparent 70%)',
                    filter: 'blur(16px)',
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <FallacyCard fallacy={currentPlayer.assignedFallacy} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <PlayerProgressDots
            total={players.length}
            current={currentPlayerIndex}
            revealed={revealed}
          />
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
            Player {currentPlayerIndex + 1} of {players.length}
          </span>
        </div>

        {/* Navigation */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '56px',
            padding: '16px 24px',
            borderRadius: '12px',
            background: 'rgba(10, 5, 30, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(89,176,196,0.15)',
          }}
        >
          <button
            onClick={handleBack}
            className="font-medium cursor-pointer"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: '1.5px solid rgba(89,176,196,0.3)',
              color: 'rgba(89,176,196,0.9)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(89,176,196,0.6)'
              e.currentTarget.style.background = 'rgba(89,176,196,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(89,176,196,0.3)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12.5 7H1.5M1.5 7L6 2.5M1.5 7L6 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!revealed}
            className="font-bold cursor-pointer"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              opacity: revealed ? 1 : 0.3,
              cursor: revealed ? 'pointer' : 'not-allowed',
              background: revealed
                ? 'linear-gradient(135deg, #fed12e 0%, #e5b800 100%)'
                : 'rgba(255,255,255,0.08)',
              color: revealed ? '#1a0a3e' : 'rgba(255,255,255,0.3)',
              boxShadow: revealed
                ? '0 4px 16px rgba(254,209,46,0.3)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (revealed) {
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(254,209,46,0.5)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (revealed) {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(254,209,46,0.3)'
                e.currentTarget.style.transform = 'translateY(0px)'
              }
            }}
          >
            {currentPlayerIndex < players.length - 1 ? 'Next Player' : 'Start Game'}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 7H12.5M12.5 7L8 2.5M12.5 7L8 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
