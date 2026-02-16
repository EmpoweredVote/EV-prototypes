import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore, { PHASES } from '../store/useGameStore'

const avatarColors = ['#00657c', '#59b0c4', '#ff5740', '#2d1b69', '#e5b800']

export default function TeamSetup() {
  const { teamName, setTeamName, players, addPlayer, removePlayer, setPhase } = useGameStore()
  const [newPlayerName, setNewPlayerName] = useState('')

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      addPlayer(newPlayerName.trim())
      setNewPlayerName('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddPlayer()
  }

  const canProceed = teamName.trim() && players.length >= 1

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
          gap: '0px',
        }}
      >
        {/* Title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-extrabold text-ev-muted-blue text-center"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '16px' }}
        >
          Recruit Your Squad
        </motion.h1>

        <motion.p
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-center leading-relaxed"
          style={{ maxWidth: '28rem', marginBottom: '48px' }}
        >
          Every player is on a team (either digital or physical) to compete. Team scores are compared to
          other teams watching the same clip.
        </motion.p>

        {/* Team Name */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ width: '100%', marginBottom: '40px' }}
        >
          <label
            className="text-ev-muted-blue font-semibold text-sm tracking-wide uppercase"
            style={{ display: 'block', marginBottom: '10px' }}
          >
            Team Name
          </label>
          <div style={{ position: 'relative' }}>
            <div
              className="text-ev-light-blue pointer-events-none"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Red Herring Catchers"
              className="text-ev-black bg-white placeholder:text-gray-400"
              style={{
                width: '100%',
                paddingLeft: '48px',
                paddingRight: '16px',
                paddingTop: '14px',
                paddingBottom: '14px',
                border: '2px solid rgba(89,176,196,0.3)',
                borderRadius: '12px',
                fontSize: '1.125rem',
                outline: 'none',
                boxShadow: '0 1px 4px rgba(0,101,124,0.06)',
              }}
            />
          </div>
        </motion.div>

        {/* Add Members */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ width: '100%', marginBottom: '32px' }}
        >
          <label
            className="text-ev-muted-blue font-semibold text-sm tracking-wide uppercase"
            style={{ display: 'block', marginBottom: '10px' }}
          >
            Add Members
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <div
                className="text-ev-light-blue pointer-events-none"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Player name"
                className="text-ev-black bg-white placeholder:text-gray-400"
                style={{
                  width: '100%',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  paddingTop: '14px',
                  paddingBottom: '14px',
                  border: '2px solid rgba(89,176,196,0.3)',
                  borderRadius: '12px',
                  outline: 'none',
                  boxShadow: '0 1px 4px rgba(0,101,124,0.06)',
                }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleAddPlayer}
              disabled={!newPlayerName.trim()}
              className="font-bold cursor-pointer"
              style={{
                width: '48px',
                height: '48px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                fontSize: '1.5rem',
                border: 'none',
                background: newPlayerName.trim()
                  ? 'linear-gradient(135deg, #fed12e 0%, #e5b800 100%)'
                  : '#e5e7eb',
                boxShadow: newPlayerName.trim() ? '0 2px 8px rgba(254,209,46,0.35)' : 'none',
                color: newPlayerName.trim() ? '#1c1c1c' : '#9ca3af',
              }}
            >
              +
            </motion.button>
          </div>
        </motion.div>

        {/* Player List */}
        <AnimatePresence>
          {players.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <label className="text-ev-muted-blue font-semibold text-sm tracking-wide uppercase">
                  Players
                </label>
                <span
                  className="text-xs font-bold text-white"
                  style={{
                    padding: '2px 10px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #00657c 0%, #59b0c4 100%)',
                  }}
                >
                  {players.length} {players.length === 1 ? 'player' : 'players'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AnimatePresence>
                  {players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ x: -30, opacity: 0, scale: 0.9 }}
                      animate={{ x: 0, opacity: 1, scale: 1 }}
                      exit={{ x: 30, opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: index * 0.03 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.7)',
                        backdropFilter: 'blur(4px)',
                        border: '1px solid rgba(255,255,255,0.6)',
                        boxShadow: '0 1px 6px rgba(0,101,124,0.07)',
                      }}
                    >
                      <div
                        className="text-white font-bold text-xs"
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: 'linear-gradient(135deg, #00657c 0%, #59b0c4 100%)',
                        }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="text-white font-bold text-sm"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '9999px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          background: avatarColors[index % avatarColors.length],
                        }}
                      >
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-ev-black font-medium" style={{ flex: 1 }}>
                        {player.name}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removePlayer(player.id)}
                        className="cursor-pointer"
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: '#f3f4f6',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#9ca3af',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
            onClick={() => setPhase(PHASES.HOW_TO_PLAY)}
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
            whileHover={canProceed ? { scale: 1.03, y: -1 } : {}}
            whileTap={canProceed ? { scale: 0.97 } : {}}
            onClick={() => setPhase(PHASES.FALLACY_ASSIGNMENT)}
            disabled={!canProceed}
            className="font-bold cursor-pointer"
            style={{
              padding: '10px 32px',
              borderRadius: '12px',
              border: 'none',
              background: canProceed
                ? 'linear-gradient(135deg, #fed12e 0%, #e5b800 100%)'
                : '#e5e7eb',
              boxShadow: canProceed
                ? '0 2px 10px rgba(254,209,46,0.35), 0 1px 3px rgba(0,0,0,0.1)'
                : 'none',
              color: canProceed ? '#1c1c1c' : '#9ca3af',
            }}
          >
            Next &rarr;
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
