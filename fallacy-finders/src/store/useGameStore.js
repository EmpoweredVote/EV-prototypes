import { create } from 'zustand'

const PHASES = {
  SPLASH: 'splash',
  HOW_TO_PLAY: 'how_to_play',
  TEAM_SETUP: 'team_setup',
  FALLACY_ASSIGNMENT: 'fallacy_assignment',
  PLAYING: 'playing',
  GAME_OVER: 'game_over',
  ROUND_RECAP: 'round_recap'
}

const useGameStore = create((set, get) => ({
  // Game phase
  phase: PHASES.SPLASH,
  setPhase: (phase) => set({ phase }),

  // Team info
  teamName: '',
  setTeamName: (name) => set({ teamName: name }),

  // Players array: [{ id, name, assignedFallacy, hits: [], falsePositives: [], xp: 0 }]
  players: [],
  addPlayer: (name) => set((state) => ({
    players: [...state.players, {
      id: crypto.randomUUID(),
      name,
      assignedFallacy: null,
      hits: [],
      falsePositives: [],
      xp: 0
    }]
  })),
  removePlayer: (id) => set((state) => ({
    players: state.players.filter(p => p.id !== id)
  })),

  // Current active player (for assignment phase)
  currentPlayerIndex: 0,
  setCurrentPlayerIndex: (i) => set({ currentPlayerIndex: i }),

  // Assign fallacies to players from a given fallacy list
  // Each player gets a unique random fallacy
  assignFallacies: (fallacyList) => set((state) => {
    const shuffled = [...fallacyList].sort(() => Math.random() - 0.5)
    const updatedPlayers = state.players.map((player, i) => ({
      ...player,
      assignedFallacy: shuffled[i % shuffled.length]
    }))
    return { players: updatedPlayers }
  }),

  // Current clip
  currentClip: null,
  setCurrentClip: (clip) => set({ currentClip: clip }),

  // Video time tracking
  currentTime: 0,
  setCurrentTime: (t) => set({ currentTime: t }),
  isPlaying: false,
  setIsPlaying: (v) => set({ isPlaying: v }),

  // Record a button press (player spotted a fallacy)
  recordPress: (playerId, timestamp) => {
    const state = get()
    const clip = state.currentClip
    if (!clip) return

    const player = state.players.find(p => p.id === playerId)
    if (!player) return

    // Check if this press matches any fallacy instance within a +-3 second window
    const matchingFallacy = clip.fallacies.find(f =>
      f.type === player.assignedFallacy.id &&
      timestamp >= f.startTime - 3 &&
      timestamp <= f.endTime + 3 &&
      !player.hits.some(h => h.fallacyInstanceId === f.id)
    )

    if (matchingFallacy) {
      // Correct hit!
      set((state) => ({
        players: state.players.map(p =>
          p.id === playerId
            ? {
                ...p,
                hits: [...p.hits, { fallacyInstanceId: matchingFallacy.id, timestamp, xp: 150 }],
                xp: p.xp + 150
              }
            : p
        ),
        lastEvent: { type: 'hit', playerId, xp: 150, fallacy: matchingFallacy }
      }))
      return 'hit'
    } else {
      // False positive
      set((state) => ({
        players: state.players.map(p =>
          p.id === playerId
            ? {
                ...p,
                falsePositives: [...p.falsePositives, { timestamp, xp: -50 }],
                xp: p.xp - 50
              }
            : p
        ),
        lastEvent: { type: 'false_positive', playerId, xp: -50 }
      }))
      return 'false_positive'
    }
  },

  // Last event (for showing notifications)
  lastEvent: null,
  clearLastEvent: () => set({ lastEvent: null }),

  // Team total XP
  getTeamXP: () => {
    const state = get()
    return state.players.reduce((sum, p) => sum + Math.max(0, p.xp), 0)
  },

  // Panel visibility
  showTranscript: false,
  toggleTranscript: () => set((state) => ({ showTranscript: !state.showTranscript })),
  showChat: false,
  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  showFallacyInfo: false,
  toggleFallacyInfo: () => set((state) => ({ showFallacyInfo: !state.showFallacyInfo })),

  // Chat messages
  chatMessages: [],
  addChatMessage: (msg) => set((state) => ({
    chatMessages: [...state.chatMessages, { ...msg, id: crypto.randomUUID(), timestamp: Date.now() }]
  })),

  // Cross-verification tracking (when a player verifies another's finding)
  crossVerifications: 0,
  addCrossVerification: () => set((state) => ({ crossVerifications: state.crossVerifications + 1 })),

  // Recap tab
  recapTab: 'stats', // 'stats' or 'tutorial'
  setRecapTab: (tab) => set({ recapTab: tab }),

  // Selected tutorial segment (for video tutorial tab in recap)
  selectedSegment: null,
  setSelectedSegment: (seg) => set({ selectedSegment: seg }),

  // Reset game for replay
  resetGame: () => set({
    phase: PHASES.SPLASH,
    teamName: '',
    players: [],
    currentPlayerIndex: 0,
    currentClip: null,
    currentTime: 0,
    isPlaying: false,
    lastEvent: null,
    showTranscript: false,
    showChat: false,
    showFallacyInfo: false,
    chatMessages: [],
    crossVerifications: 0,
    recapTab: 'stats',
    selectedSegment: null
  }),

  // Start new round (keep team, reset scores)
  newRound: () => set((state) => ({
    phase: PHASES.FALLACY_ASSIGNMENT,
    players: state.players.map(p => ({
      ...p,
      assignedFallacy: null,
      hits: [],
      falsePositives: [],
      xp: 0
    })),
    currentPlayerIndex: 0,
    currentClip: null,
    currentTime: 0,
    isPlaying: false,
    lastEvent: null,
    showTranscript: false,
    showChat: false,
    showFallacyInfo: false,
    chatMessages: [],
    crossVerifications: 0,
    recapTab: 'stats',
    selectedSegment: null
  }))
}))

export { PHASES }
export default useGameStore
