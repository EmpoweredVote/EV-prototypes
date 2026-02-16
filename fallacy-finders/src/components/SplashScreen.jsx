import { motion } from 'framer-motion'
import useGameStore, { PHASES } from '../store/useGameStore'

/* ------------------------------------------------------------------ */
/*  Floating decorative shapes data                                    */
/* ------------------------------------------------------------------ */
const floatingShapes = [
  { shape: 'circle', size: 80, x: '12%', y: '15%', color: '#59b0c4', blur: 30, opacity: 0.15, duration: 18, delay: 0 },
  { shape: 'square', size: 50, x: '80%', y: '10%', color: '#ff5740', blur: 24, opacity: 0.12, duration: 22, delay: 2 },
  { shape: 'circle', size: 120, x: '85%', y: '70%', color: '#4a2c8a', blur: 40, opacity: 0.18, duration: 20, delay: 1 },
  { shape: 'square', size: 60, x: '8%', y: '75%', color: '#fed12e', blur: 28, opacity: 0.1, duration: 24, delay: 3 },
  { shape: 'circle', size: 40, x: '50%', y: '85%', color: '#59b0c4', blur: 20, opacity: 0.12, duration: 16, delay: 4 },
  { shape: 'square', size: 90, x: '30%', y: '5%', color: '#00657c', blur: 35, opacity: 0.1, duration: 26, delay: 1.5 },
  { shape: 'circle', size: 55, x: '65%', y: '40%', color: '#ff5740', blur: 22, opacity: 0.08, duration: 19, delay: 2.5 },
  { shape: 'square', size: 35, x: '20%', y: '50%', color: '#fed12e', blur: 18, opacity: 0.1, duration: 21, delay: 0.5 },
]

/* ------------------------------------------------------------------ */
/*  Framer-motion variant helpers                                      */
/* ------------------------------------------------------------------ */
const driftVariant = (i) => ({
  initial: { x: 0, y: 0, rotate: 0 },
  animate: {
    x: [0, 25, -15, 20, -10, 0],
    y: [0, -20, 15, -25, 10, 0],
    rotate: [0, 8, -6, 10, -4, 0],
    transition: {
      duration: floatingShapes[i].duration,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut',
      delay: floatingShapes[i].delay,
    },
  },
})

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const riseUp = {
  initial: { y: 40, opacity: 0, filter: 'blur(8px)' },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const dropIn = {
  initial: { y: -50, opacity: 0, scale: 0.8 },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 120, damping: 14, delay: 0.1 },
  },
}

const buttonPop = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 16, delay: 1 },
  },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function SplashScreen() {
  const setPhase = useGameStore((s) => s.setPhase)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
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
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(10, 4, 28, 0.55) 100%)',
        }}
      />

      {/* Floating decorative shapes */}
      {floatingShapes.map((s, i) => (
        <motion.div
          key={i}
          variants={driftVariant(i)}
          initial="initial"
          animate="animate"
          className="absolute pointer-events-none"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            borderRadius: s.shape === 'circle' ? '50%' : '18%',
            background: s.color,
            opacity: s.opacity,
            filter: `blur(${s.blur}px)`,
          }}
        />
      ))}

      {/* Content layer */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: '600px',
          width: '100%',
        }}
      >
        {/* EV Logo */}
        <motion.div variants={dropIn} style={{ marginBottom: '48px', position: 'relative' }}>
          {/* Glow backdrop behind logo */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              background: 'radial-gradient(circle, rgba(89,176,196,0.35) 0%, transparent 70%)',
              transform: 'scale(2.2)',
            }}
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <img
            src="./EVLogo.svg"
            alt="Empowered Vote"
            className="relative drop-shadow-lg"
            style={{ width: 'clamp(12rem, 20vw, 16rem)', height: 'auto' }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={riseUp}
          className="font-extrabold text-center select-none"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            marginBottom: '24px',
            background: 'linear-gradient(135deg, #ffffff 30%, #59b0c4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Fallacy Finders
        </motion.h1>

        {/* Secondary tagline */}
        <motion.p
          variants={riseUp}
          className="italic text-center tracking-wide"
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            marginBottom: '32px',
          }}
        >
          Build herd immunity to manipulative rhetoric
        </motion.p>

        {/* Description */}
        <motion.p
          variants={riseUp}
          className="text-center leading-relaxed"
          style={{
            color: 'rgba(255,255,255,0.75)',
            maxWidth: '28rem',
            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
            marginBottom: '56px',
          }}
        >
          A fun, social game built to help citizens identify logical fallacies in real
          time. Transform critical thinking into a skill-based group experience!
        </motion.p>

        {/* Play button */}
        <motion.div variants={buttonPop} style={{ position: 'relative' }}>
          {/* Pulsing glow ring */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              background:
                'linear-gradient(135deg, rgba(254,209,46,0.4), rgba(229,184,0,0.2))',
              filter: 'blur(18px)',
              transform: 'scale(1.35)',
            }}
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1.3, 1.5, 1.3],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 40px rgba(254,209,46,0.5)' }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setPhase(PHASES.HOW_TO_PLAY)}
            className="font-extrabold cursor-pointer"
            style={{
              position: 'relative',
              padding: '20px 80px',
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              borderRadius: '9999px',
              border: 'none',
              color: '#1c1c1c',
              background: 'linear-gradient(135deg, #fed12e 0%, #e5b800 60%, #d4a800 100%)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              letterSpacing: '0.05em',
              whiteSpace: 'nowrap',
            }}
          >
            PLAY
            <span style={{ fontSize: '0.9em' }}>&#9654;</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
