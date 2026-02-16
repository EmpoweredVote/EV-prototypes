import { motion } from 'framer-motion'
import useGameStore, { PHASES } from '../store/useGameStore'

const steps = [
  {
    number: 1,
    title: 'Create & Assign',
    description:
      'Form your team and get your randomized personal fallacy assignment from the core 24 set. Teams rotate assignments between rounds.',
  },
  {
    number: 2,
    title: 'Watch & Spot',
    description:
      "Your team watches a selected real-world civic content clip (debates, interviews, speeches). When you spot your assigned fallacy, hit the corresponding button quickly to score points for your team.",
  },
  {
    number: 3,
    title: 'Retro & Rank',
    description:
      "At the round's end, a retro screen shows what your team caught and what was missed. Earn XP for correct ID's to level up, unlocking new abilities and platform roles.",
  },
]

export default function HowToPlay() {
  const setPhase = useGameStore((s) => s.setPhase)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(170deg, #ffffff 0%, #eef5f7 40%, #f0f4f8 100%)',
        padding: '48px 24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Decorative Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ marginBottom: '32px' }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #00657c 0%, #59b0c4 100%)',
              boxShadow: '0 4px 12px rgba(0,101,124,0.3)',
            }}
          >
            <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
              <circle cx="20" cy="20" r="10" stroke="white" strokeWidth="2.5" fill="none" />
              <line x1="27.5" y1="27.5" x2="36" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              <path
                d="M16 22c0-2.5 1.2-4 3-4.5.5-1.5 2-2.5 3.5-2.5s2.5 1 3 2c1.5.5 2.5 2 2.5 3.5 0 1.5-1 2.8-2 3.5-.2 1.5-1.5 2.5-3 2.5-1 0-2-.5-2.5-1.2-.8.7-2 1.2-3 .7-1.2-.5-1.5-2-1.5-4z"
                fill="rgba(255,255,255,0.9)"
              />
              <path d="M20.5 16v8" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
            </svg>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-extrabold text-ev-muted-blue text-center"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '16px' }}
        >
          Ready to Find Fallacies?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-500 text-center leading-relaxed"
          style={{ maxWidth: '28rem', marginBottom: '48px' }}
        >
          Fallacy Finders is structured like a team trivia game, pitting teams against each other as they
          watch real-world civic content.
        </motion.p>

        {/* Steps */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              style={{
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                padding: '24px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 1px 8px rgba(0,101,124,0.08)',
              }}
            >
              <div
                className="text-white font-extrabold"
                style={{
                  flexShrink: 0,
                  width: '54px',
                  height: '54px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  background: 'linear-gradient(135deg, #00657c 0%, #59b0c4 100%)',
                  boxShadow: '0 2px 8px rgba(0,101,124,0.25)',
                }}
              >
                {step.number}
              </div>
              <div style={{ paddingTop: '4px' }}>
                <h3 className="text-ev-black font-bold" style={{ fontSize: '1.125rem', marginBottom: '6px' }}>
                  {step.title}
                </h3>
                <p className="text-gray-500 leading-relaxed" style={{ fontSize: '0.875rem' }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '64px',
            padding: '16px 24px',
            borderRadius: '12px',
            border: '1px solid rgba(209,213,219,0.6)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <button
            onClick={() => setPhase(PHASES.SPLASH)}
            className="font-medium cursor-pointer"
            style={{
              padding: '10px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              color: '#4b5563',
              background: 'transparent',
            }}
          >
            &larr; Back
          </button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setPhase(PHASES.TEAM_SETUP)}
            className="font-bold cursor-pointer"
            style={{
              padding: '10px 32px',
              borderRadius: '12px',
              border: 'none',
              color: '#1c1c1c',
              background: 'linear-gradient(135deg, #fed12e 0%, #e5b800 100%)',
              boxShadow: '0 2px 10px rgba(254,209,46,0.35), 0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            Next &rarr;
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
