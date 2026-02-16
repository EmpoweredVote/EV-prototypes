import { AnimatePresence } from 'framer-motion'
import useGameStore, { PHASES } from './store/useGameStore'
import SplashScreen from './components/SplashScreen'
import HowToPlay from './components/HowToPlay'
import TeamSetup from './components/TeamSetup'
import FallacyAssignment from './components/FallacyAssignment'
import GameScreen from './components/GameScreen'
import GameOver from './components/GameOver'
import RoundRecap from './components/RoundRecap'

export default function App() {
  const phase = useGameStore((s) => s.phase)

  const renderPhase = () => {
    switch (phase) {
      case PHASES.SPLASH:
        return <SplashScreen key="splash" />
      case PHASES.HOW_TO_PLAY:
        return <HowToPlay key="howto" />
      case PHASES.TEAM_SETUP:
        return <TeamSetup key="team" />
      case PHASES.FALLACY_ASSIGNMENT:
        return <FallacyAssignment key="assign" />
      case PHASES.PLAYING:
        return <GameScreen key="game" />
      case PHASES.GAME_OVER:
        return <GameOver key="gameover" />
      case PHASES.ROUND_RECAP:
        return <RoundRecap key="recap" />
      default:
        return <SplashScreen key="splash" />
    }
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {renderPhase()}
      </AnimatePresence>
    </div>
  )
}
