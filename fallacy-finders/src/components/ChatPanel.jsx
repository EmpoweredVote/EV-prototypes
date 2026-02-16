import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGameStore from '../store/useGameStore'

/* Assign consistent colors to different senders */
const SENDER_COLORS = [
  '#59b0c4', // ev-light-blue
  '#fed12e', // ev-yellow
  '#ff5740', // ev-coral
  '#4CAF50', // green
  '#ce93d8', // lavender
  '#ffab40', // amber
]

function getSenderColor(sender, players) {
  const idx = players.findIndex((p) => p.name === sender)
  if (idx >= 0) return SENDER_COLORS[idx % SENDER_COLORS.length]
  return SENDER_COLORS[0]
}

function formatMessageTime(timestamp) {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const h = d.getHours()
  const m = d.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${m} ${ampm}`
}

export default function ChatPanel() {
  const {
    showChat,
    toggleChat,
    chatMessages,
    addChatMessage,
    players,
    lastEvent,
  } = useGameStore()
  const [inputValue, setInputValue] = useState('')
  const messagesRef = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [chatMessages.length])

  // Add system messages for game events
  useEffect(() => {
    if (lastEvent) {
      const player = players.find((p) => p.id === lastEvent.playerId)
      if (player) {
        if (lastEvent.type === 'hit') {
          addChatMessage({
            type: 'system',
            sender: 'SYSTEM',
            text: `${player.name} spotted a ${player.assignedFallacy?.name}! +150 XP`,
          })
        } else if (lastEvent.type === 'false_positive') {
          addChatMessage({
            type: 'system',
            sender: 'SYSTEM',
            text: `${player.name} fired but missed. -50 XP`,
          })
        }
      }
    }
  }, [lastEvent])

  const handleSend = () => {
    if (inputValue.trim()) {
      addChatMessage({
        type: 'user',
        sender: players[0]?.name || 'You',
        text: inputValue.trim(),
      })
      setInputValue('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  if (!showChat) return null

  const isCurrentUser = (sender) => sender === (players[0]?.name || 'You')

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute top-0 right-0 h-full w-72 z-20 flex flex-col"
      style={{
        background: 'rgba(10, 5, 30, 0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderLeft: '1px solid rgba(89, 176, 196, 0.12)',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          background: 'linear-gradient(90deg, rgba(74,44,138,0.1), rgba(89,176,196,0.1))',
          borderBottom: '1px solid rgba(89,176,196,0.15)',
        }}
      >
        <div className="flex items-center gap-3">
          {/* Chat icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(89,176,196,0.2), rgba(0,101,124,0.3))',
              border: '1px solid rgba(89,176,196,0.25)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H5L2 14V3Z" stroke="#59b0c4" strokeWidth="1.2" fill="none" />
              <circle cx="5.5" cy="6.5" r="0.8" fill="#59b0c4" opacity="0.6" />
              <circle cx="8" cy="6.5" r="0.8" fill="#59b0c4" opacity="0.6" />
              <circle cx="10.5" cy="6.5" r="0.8" fill="#59b0c4" opacity="0.6" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm leading-none">Team Chat</h3>
            <span className="text-white/30 text-[10px]">
              {players.length} player{players.length !== 1 ? 's' : ''} online
            </span>
          </div>
        </div>
        {/* Close button */}
        <button
          onClick={toggleChat}
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

      {/* Messages */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-12 gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(89,176,196,0.1)', border: '1px solid rgba(89,176,196,0.15)' }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M2 3C2 2.45 2.45 2 3 2H13C13.55 2 14 2.45 14 3V10C14 10.55 13.55 11 13 11H5L2 14V3Z" stroke="#59b0c4" strokeWidth="1" fill="none" opacity="0.4" />
              </svg>
            </div>
            <p className="text-white/25 text-xs text-center leading-relaxed px-4">
              Chat with your team during the debate...
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {msg.type === 'system' ? (
                /* System messages as notification pills */
                <div className="flex justify-center my-2">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: msg.text.includes('+')
                        ? 'rgba(76,175,80,0.12)'
                        : msg.text.includes('-')
                        ? 'rgba(244,67,54,0.12)'
                        : 'rgba(254,209,46,0.1)',
                      border: msg.text.includes('+')
                        ? '1px solid rgba(76,175,80,0.25)'
                        : msg.text.includes('-')
                        ? '1px solid rgba(244,67,54,0.25)'
                        : '1px solid rgba(254,209,46,0.2)',
                    }}
                  >
                    <span className="text-[10px]">
                      {msg.text.includes('+') ? '✦' : msg.text.includes('-') ? '!' : '~'}
                    </span>
                    <span
                      className="text-[11px] font-medium"
                      style={{
                        color: msg.text.includes('+')
                          ? '#4CAF50'
                          : msg.text.includes('-')
                          ? '#F44336'
                          : '#fed12e',
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                </div>
              ) : (
                /* User messages as chat bubbles */
                <div className={`flex flex-col ${isCurrentUser(msg.sender) ? 'items-end' : 'items-start'}`}>
                  {/* Sender name */}
                  <span
                    className="text-[10px] font-bold mb-0.5 px-2"
                    style={{ color: getSenderColor(msg.sender, players) }}
                  >
                    {msg.sender}
                  </span>
                  {/* Bubble */}
                  <div
                    className="max-w-[85%] px-3 py-2 text-xs text-white/90 leading-relaxed"
                    style={{
                      background: isCurrentUser(msg.sender)
                        ? 'linear-gradient(135deg, rgba(0,101,124,0.35), rgba(89,176,196,0.2))'
                        : 'rgba(255,255,255,0.06)',
                      border: isCurrentUser(msg.sender)
                        ? '1px solid rgba(89,176,196,0.2)'
                        : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: isCurrentUser(msg.sender)
                        ? '14px 14px 4px 14px'
                        : '14px 14px 14px 4px',
                    }}
                  >
                    {msg.text}
                  </div>
                  {/* Timestamp */}
                  <span className="text-[9px] text-white/20 mt-0.5 px-2">
                    {formatMessageTime(msg.timestamp || Date.now())}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator area (visual placeholder) */}
        <div className="h-4" />
      </div>

      {/* Input area */}
      <div
        className="p-3"
        style={{ borderTop: '1px solid rgba(89,176,196,0.1)' }}
      >
        <div
          className="flex items-center gap-2 px-1 py-1 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1.5 bg-transparent text-white text-xs
                       placeholder-white/30 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                       transition-all duration-200 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: inputValue.trim()
                ? 'linear-gradient(135deg, #00657c, #59b0c4)'
                : 'rgba(255,255,255,0.06)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M1.5 7H12.5M12.5 7L8 2.5M12.5 7L8 11.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
