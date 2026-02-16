import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../store/useGameStore'
import { FALLACIES } from '../data/fallacies'

export default function FallacyButtonBar() {
  const { players, currentTime, recordPress } = useGameStore()
  const [feedback, setFeedback] = useState({}) // { playerId: { type, xp } }
  const [pressedId, setPressedId] = useState(null) // tracks which button just got pressed for flash
  const emojiRefs = useRef({})

  const handlePress = useCallback((player) => {
    const result = recordPress(player.id, currentTime)
    if (result) {
      const xp = result === 'hit' ? '+150' : '-50'
      setFeedback((prev) => ({
        ...prev,
        [player.id]: { type: result, xp },
      }))

      // Trigger press flash + emoji pop
      setPressedId(player.id)
      const emojiEl = emojiRefs.current[player.id]
      if (emojiEl) {
        emojiEl.classList.remove('emoji-pop')
        // Force reflow to restart animation
        void emojiEl.offsetWidth
        emojiEl.classList.add('emoji-pop')
      }
      setTimeout(() => setPressedId(null), 400)

      setTimeout(() => {
        setFeedback((prev) => {
          const next = { ...prev }
          delete next[player.id]
          return next
        })
      }, 1500)
    }
  }, [recordPress, currentTime])

  return (
    <div className="w-full bg-gradient-to-t from-black via-black/95 to-black/85 backdrop-blur-sm
                    border-t border-white/8">
      {/* Player fallacy buttons */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
          {players.map((player) => {
            const fallacy = player.assignedFallacy
            if (!fallacy) return null

            const fb = feedback[player.id]
            const isFlashing = pressedId === player.id

            return (
              <div key={player.id} className="relative flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handlePress(player)}
                  className={`relative flex flex-col items-center justify-center
                             w-24 h-24 md:w-28 md:h-28 rounded-2xl
                             border-2 transition-all cursor-pointer overflow-hidden
                             ${!fb ? 'pulse-glow' : ''}
                             ${fb?.type === 'hit'
                               ? 'border-green-400 bg-green-500/20'
                               : fb?.type === 'false_positive'
                               ? 'shake border-red-400 bg-red-500/15'
                               : 'border-ev-yellow bg-white/5 hover:bg-white/10'
                             }`}
                  style={{
                    boxShadow: fb?.type === 'hit'
                      ? '0 0 20px rgba(74,222,128,0.3)'
                      : fb?.type === 'false_positive'
                      ? '0 0 15px rgba(248,113,113,0.3)'
                      : undefined,
                  }}
                >
                  {/* Press flash overlay */}
                  {isFlashing && (
                    <div className="absolute inset-0 press-flash rounded-2xl pointer-events-none z-10" />
                  )}

                  {/* XP counter badge (top-right corner) */}
                  <div
                    className="absolute top-1 right-1 z-10 min-w-[24px] h-[18px] px-1 rounded-full
                               bg-ev-dark-purple/80 border border-ev-light-blue/30
                               flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-ev-yellow text-[8px] font-bold whitespace-nowrap">
                      {player.xp}
                    </span>
                  </div>

                  {/* Fallacy emoji */}
                  <span
                    ref={(el) => { emojiRefs.current[player.id] = el }}
                    className="text-2xl md:text-3xl select-none leading-none"
                  >
                    {fallacy.icon}
                  </span>

                  {/* Fallacy short name */}
                  <span className="text-white/50 text-[7px] mt-0.5 leading-tight text-center px-1.5 line-clamp-2 w-full overflow-hidden">
                    {fallacy.name}
                  </span>
                </motion.button>

                {/* Player name label below button */}
                <span className="text-white text-[10px] md:text-xs font-semibold mt-1 tracking-wide truncate max-w-24 text-center block">
                  {player.name}
                </span>

                {/* XP Float */}
                <AnimatePresence>
                  {fb && (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -60, scale: 1.1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 font-black text-xl z-20
                                  ${fb.type === 'hit'
                                    ? 'text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.5)]'
                                    : 'text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.5)]'
                                  }`}
                    >
                      {fb.xp} XP
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* Separator between player buttons and full icon row */}
      <div className="mx-6 flex items-center gap-3 py-0.5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-white/20 text-[9px] font-medium tracking-widest uppercase shrink-0">
          All Fallacies
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Full fallacy icon row (decorative - shows all 24) - more compact and dimmer */}
      <div className="px-2 pb-2 pt-0.5 overflow-x-auto">
        <div className="flex gap-0.5 justify-center min-w-max">
          {FALLACIES.map((f) => {
            const isAssigned = players.some((p) => p.assignedFallacy?.id === f.id)
            return (
              <div
                key={f.id}
                className={`w-6 h-6 md:w-7 md:h-7 rounded flex items-center justify-center
                           text-[11px] md:text-xs transition-all
                           ${isAssigned
                             ? 'bg-ev-yellow/10 ring-1 ring-ev-yellow/40'
                             : 'bg-white/[0.02] opacity-20'
                           }`}
                title={f.name}
              >
                {f.icon}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
