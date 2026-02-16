import { motion } from 'framer-motion'
import { useMemo } from 'react'
import useGameStore, { PHASES } from '../store/useGameStore'

/* ── Confetti particle config ── */
const PARTICLE_COLORS = ['#fed12e', '#ff5740', '#59b0c4', '#4a2c8a', '#ffffff', '#e5b800']
const PARTICLE_COUNT = 28

function generateParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,             // start % from left
    size: Math.random() * 8 + 4,         // 4–12px
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: Math.random() * 2,            // 0–2s stagger
    duration: Math.random() * 3 + 4,     // 4–7s fall
    rotation: Math.random() * 360,
    shape: i % 3 === 0 ? 'square' : 'circle',
  }))
}

export default function GameOver() {
  const setPhase = useGameStore((s) => s.setPhase)
  const getTeamXP = useGameStore((s) => s.getTeamXP)
  const teamXP = getTeamXP()

  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Animated radial gradient background: dark to light reveal */}
      <motion.div
        className="absolute inset-0"
        initial={{
          background:
            'radial-gradient(circle at 50% 50%, #1a0a3e 0%, #1a0a3e 100%)',
        }}
        animate={{
          background:
            'radial-gradient(circle at 50% 50%, #2d1b69 0%, #1a0a3e 60%, #0d0520 100%)',
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* Secondary glow pulse behind the title */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(254,209,46,0.12) 0%, rgba(254,209,46,0) 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating confetti particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            opacity: 0,
          }}
          animate={{
            y: [0, window.innerHeight + 40],
            rotate: [0, p.rotation + 360],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* "Game Over!" with dramatic scale-up entrance and glow */}
        <motion.h1
          initial={{ scale: 2.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
          className="text-6xl md:text-8xl font-extrabold text-ev-yellow glow-text-yellow text-center"
        >
          Game Over!
        </motion.h1>

        {/* Team XP preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-white/50 text-sm font-semibold tracking-widest uppercase">
            Team Score
          </span>
          <span className="text-4xl md:text-5xl font-extrabold text-white glow-text-white">
            {teamXP.toLocaleString()}
            <span className="text-ev-yellow/80 text-2xl ml-1">XP</span>
          </span>
        </motion.div>

        {/* Pulsing "SEE SCORES" button with yellow-gold gradient and glow */}
        <motion.button
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setPhase(PHASES.ROUND_RECAP)}
          className="relative px-12 py-4 rounded-2xl font-bold text-xl text-ev-black
                     cursor-pointer flex items-center gap-3 shadow-xl
                     border-2 border-ev-yellow-dark/50 pulse-glow"
          style={{
            background: 'linear-gradient(135deg, #fed12e 0%, #e5b800 50%, #d4a800 100%)',
          }}
        >
          {/* Shimmer overlay on button */}
          <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <span
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2.5s ease-in-out infinite',
              }}
            />
          </span>
          <span className="relative z-10 flex items-center gap-2">
            SEE SCORES <span>&#9654;</span>
          </span>
        </motion.button>
      </div>
    </motion.div>
  )
}
