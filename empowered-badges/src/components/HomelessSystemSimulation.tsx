import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Users,
  ArrowRight,
  Building2,
  Heart,
  Clock,
  Zap,
  HelpCircle,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

// Types for the simulation
interface ProgramType {
  id: string;
  name: string;
  shortName: string;
  description: string;
  slots: number;
  color: string;
  icon: React.ReactNode;
  throughput: 'high' | 'medium' | 'low' | 'very-low';
  bestFor: 'clear' | 'red' | 'both';
}

// Future: Full simulation state for more complex interactions
// interface SimulationState {
//   round: number;
//   programs: {
//     [key: string]: {
//       redBeads: number;
//       clearBeads: number;
//     };
//   };
//   marketHousing: number;
//   unsheltered: number;
// }

// Program definitions based on the physical game
const PROGRAMS: ProgramType[] = [
  {
    id: 'intake',
    name: 'Coordinated Intake',
    shortName: 'Intake',
    description: 'The entry point where people experiencing homelessness are assessed and connected to appropriate programs.',
    slots: 6,
    color: 'bg-amber-400',
    icon: <Users className="w-5 h-5" />,
    throughput: 'high',
    bestFor: 'both',
  },
  {
    id: 'emergency-shelter',
    name: 'Emergency Shelter',
    shortName: 'Shelter',
    description: 'Short-term crisis housing. High turnover but many exits are not to permanent housing.',
    slots: 25,
    color: 'bg-sky-400',
    icon: <Building2 className="w-5 h-5" />,
    throughput: 'medium',
    bestFor: 'both',
  },
  {
    id: 'rapid-rehousing',
    name: 'Rapid Re-Housing',
    shortName: 'RRH',
    description: 'Short-term rental assistance and services to quickly move people into permanent housing. Most effective for people without major barriers.',
    slots: 10,
    color: 'bg-rose-500',
    icon: <Zap className="w-5 h-5" />,
    throughput: 'high',
    bestFor: 'clear',
  },
  {
    id: 'transitional',
    name: 'Transitional Housing',
    shortName: 'TH',
    description: 'Temporary housing with services for up to 24 months. Slow movement and housing is not permanent.',
    slots: 20,
    color: 'bg-lime-500',
    icon: <Clock className="w-5 h-5" />,
    throughput: 'very-low',
    bestFor: 'both',
  },
  {
    id: 'psh',
    name: 'Permanent Supportive Housing',
    shortName: 'PSH',
    description: 'Long-term housing with wraparound services for people with disabilities. Very low turnover but highly effective for high-barrier individuals.',
    slots: 20,
    color: 'bg-indigo-500',
    icon: <Heart className="w-5 h-5" />,
    throughput: 'very-low',
    bestFor: 'red',
  },
  {
    id: 'outreach',
    name: 'Street Outreach',
    shortName: 'Outreach',
    description: 'Teams that connect with people living unsheltered and help them access services and housing.',
    slots: 10,
    color: 'bg-violet-500',
    icon: <Users className="w-5 h-5" />,
    throughput: 'medium',
    bestFor: 'both',
  },
];

// Animated Bead type
interface AnimatedBead {
  id: string;
  type: 'red' | 'clear';
  stage: 'intake' | 'program' | 'outcome';
  programId?: string;
  outcome?: 'housed' | 'unsheltered';
}

// BeadFlow component - shows animated beads flowing through the system
function BeadFlowOverlay({ isActive }: { isActive: boolean }) {
  const [beads, setBeads] = useState<AnimatedBead[]>([]);
  const [beadCounter, setBeadCounter] = useState(0);

  // Spawn beads periodically when active
  useEffect(() => {
    if (!isActive) {
      setBeads([]);
      return;
    }

    const spawnBead = () => {
      const newBead: AnimatedBead = {
        id: `bead-${beadCounter}`,
        type: Math.random() > 0.3 ? 'clear' : 'red',
        stage: 'intake',
      };
      setBeads(prev => [...prev.slice(-12), newBead]); // Keep max 12 beads
      setBeadCounter(prev => prev + 1);
    };

    // Spawn initial beads
    spawnBead();
    const interval = setInterval(spawnBead, 1200);

    return () => clearInterval(interval);
  }, [isActive, beadCounter]);

  // Progress beads through stages
  useEffect(() => {
    if (!isActive || beads.length === 0) return;

    const progressInterval = setInterval(() => {
      setBeads(prev => prev.map(bead => {
        if (bead.stage === 'intake') {
          // Move to a random program
          const programs = ['emergency-shelter', 'rapid-rehousing', 'transitional', 'psh', 'outreach'];
          const targetProgram = bead.type === 'red'
            ? (Math.random() > 0.4 ? 'psh' : programs[Math.floor(Math.random() * programs.length)])
            : (Math.random() > 0.3 ? 'rapid-rehousing' : programs[Math.floor(Math.random() * programs.length)]);
          return { ...bead, stage: 'program' as const, programId: targetProgram };
        } else if (bead.stage === 'program') {
          // Move to outcome based on match quality
          const isGoodMatch = (bead.type === 'red' && bead.programId === 'psh') ||
                             (bead.type === 'clear' && bead.programId === 'rapid-rehousing');
          const outcome = isGoodMatch || Math.random() > 0.3 ? 'housed' : 'unsheltered';
          return { ...bead, stage: 'outcome' as const, outcome: outcome as 'housed' | 'unsheltered' };
        }
        return bead;
      }).filter(bead => {
        // Remove beads that have been in outcome stage (they'll animate out)
        return bead.stage !== 'outcome' || Math.random() > 0.1;
      }));
    }, 1800);

    return () => clearInterval(progressInterval);
  }, [isActive, beads.length]);

  // Position calculations for beads at each stage
  const getBeadPosition = useCallback((bead: AnimatedBead, index: number) => {
    const jitter = (index % 3 - 1) * 8;

    if (bead.stage === 'intake') {
      return { x: 60 + jitter, y: 50 };
    } else if (bead.stage === 'program') {
      const programPositions: Record<string, number> = {
        'emergency-shelter': 0,
        'rapid-rehousing': 1,
        'transitional': 2,
        'psh': 3,
        'outreach': 4,
      };
      const programIndex = programPositions[bead.programId || 'emergency-shelter'] || 0;
      return { x: 220 + programIndex * 72 + jitter, y: 50 + (index % 2) * 20 };
    } else {
      const outcomeX = bead.outcome === 'housed' ? 600 : 680;
      return { x: outcomeX + jitter, y: 50 };
    }
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {beads.map((bead, index) => {
          const pos = getBeadPosition(bead, index);
          return (
            <motion.div
              key={bead.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: pos.y }}
              animate={{
                opacity: bead.stage === 'outcome' ? 0.6 : 1,
                scale: 1,
                x: pos.x,
                y: pos.y
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 15,
                duration: 0.8
              }}
              className={`absolute w-3 h-3 rounded-full ${
                bead.type === 'red'
                  ? 'bg-red-500 shadow-red-500/50'
                  : 'bg-gray-300 border border-gray-400 shadow-gray-400/50'
              } shadow-lg`}
              style={{ top: '40%' }}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Section components
function SectionWrapper({
  children,
  id,
  className = ''
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-16 border-b border-gray-200 last:border-b-0 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  number,
  title,
  subtitle
}: {
  number: number;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-8 h-8 bg-ev-muted-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </span>
        <h2 className="text-2xl font-bold text-ev-black">{title}</h2>
      </div>
      <p className="text-gray-600 ml-11">{subtitle}</p>
    </div>
  );
}

// Section 1: System Overview
function SystemOverviewSection() {
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
  const [showBeadFlow, setShowBeadFlow] = useState(false);
  const hoveredProgramData = PROGRAMS.find(p => p.id === hoveredProgram);

  return (
    <SectionWrapper id="overview">
      <SectionHeader
        number={1}
        title="The Homelessness System at a Glance"
        subtitle="Homelessness isn't random chaos—it's a system of interconnected programs designed to help people return to permanent housing."
      />

      <div className="ml-11">
        <p className="text-gray-600 mb-8 max-w-2xl">
          When someone experiences homelessness, they don't just disappear. They enter a <strong>coordinated system</strong> of
          programs, each designed to serve different needs. Hover over each program to learn what it does.
        </p>

        {/* System Flow Diagram */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 relative">
          {/* Bead Flow Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowBeadFlow(!showBeadFlow)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                showBeadFlow
                  ? 'bg-ev-muted-blue text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:border-ev-muted-blue'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showBeadFlow ? 'bg-white animate-pulse' : 'bg-red-500'}`} />
              {showBeadFlow ? 'Stop Flow' : 'Watch People Flow'}
            </button>
          </div>

          {/* Animated Bead Overlay */}
          <BeadFlowOverlay isActive={showBeadFlow} />

          {/* Bead Legend - shows when flow is active */}
          <AnimatePresence>
            {showBeadFlow && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex justify-center gap-6 mb-4 text-xs text-gray-600"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                  <span>High barriers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-gray-300 border border-gray-400 rounded-full shadow-sm" />
                  <span>Lower barriers</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
            {/* Entry */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-2">Entry</div>
              <div
                className={`w-20 h-20 rounded-lg ${PROGRAMS[0].color} flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${hoveredProgram === 'intake' ? 'ring-4 ring-ev-muted-blue ring-offset-2' : ''}`}
                onMouseEnter={() => setHoveredProgram('intake')}
                onMouseLeave={() => setHoveredProgram(null)}
              >
                <div className="text-white text-center">
                  {PROGRAMS[0].icon}
                  <div className="text-xs mt-1 font-medium">Intake</div>
                </div>
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />

            {/* Programs */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-2">Programs</div>
              <div className="flex flex-wrap justify-center gap-2">
                {PROGRAMS.slice(1, 6).map((program) => (
                  <div
                    key={program.id}
                    className={`w-16 h-16 rounded-lg ${program.color} flex items-center justify-center cursor-pointer transition-transform hover:scale-110 ${hoveredProgram === program.id ? 'ring-4 ring-ev-muted-blue ring-offset-2' : ''}`}
                    onMouseEnter={() => setHoveredProgram(program.id)}
                    onMouseLeave={() => setHoveredProgram(null)}
                  >
                    <div className="text-white text-center">
                      {program.icon}
                      <div className="text-[10px] mt-0.5 font-medium">{program.shortName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400 rotate-90 md:rotate-0" />

            {/* Outcomes */}
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-500 mb-2">Outcomes</div>
              <div className="flex gap-2">
                <div className="w-16 h-16 rounded-lg bg-green-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Home className="w-5 h-5 mx-auto" />
                    <div className="text-[10px] mt-0.5 font-medium">Housed</div>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-lg bg-gray-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <HelpCircle className="w-5 h-5 mx-auto" />
                    <div className="text-[10px] mt-0.5 font-medium">Unsheltered</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Info Panel */}
        <div className={`bg-white border-2 rounded-xl p-4 min-h-[120px] transition-all ${hoveredProgram ? 'border-ev-muted-blue' : 'border-gray-200'}`}>
          {hoveredProgramData ? (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 rounded ${hoveredProgramData.color} flex items-center justify-center text-white`}>
                  {hoveredProgramData.icon}
                </div>
                <h3 className="font-bold text-ev-black">{hoveredProgramData.name}</h3>
              </div>
              <p className="text-gray-600 text-sm">{hoveredProgramData.description}</p>
              <div className="mt-3 flex gap-4 text-xs">
                <span className="text-gray-500">
                  <strong>Capacity:</strong> {hoveredProgramData.slots} slots
                </span>
                <span className="text-gray-500">
                  <strong>Throughput:</strong> {hoveredProgramData.throughput}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span>Hover over a program to learn more</span>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Key insight:</strong> The goal is to move people from entry (left) to permanent housing (right) as
            efficiently as possible. But not all programs work at the same speed...
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

// Section 2: Program Flow Comparison
function ProgramFlowSection() {
  const [yearsElapsed, setYearsElapsed] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simplified throughput rates (people housed per year per 10 slots)
  const throughputRates: { [key: string]: number } = {
    'rapid-rehousing': 30,      // High turnover, most exits to housing
    'emergency-shelter': 15,    // High turnover but many don't exit to housing
    'transitional': 5,          // Very slow movement
    'psh': 2,                   // Almost no turnover (which is actually good for stability)
  };

  const programsToCompare = PROGRAMS.filter(p =>
    ['rapid-rehousing', 'emergency-shelter', 'transitional', 'psh'].includes(p.id)
  );

  const handleAdvanceYear = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setYearsElapsed(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleReset = () => {
    setYearsElapsed(0);
  };

  return (
    <SectionWrapper id="flow">
      <SectionHeader
        number={2}
        title="Not All Programs Move at the Same Speed"
        subtitle="Different programs have vastly different 'throughput'—how many people they can help reach permanent housing over time."
      />

      <div className="ml-11">
        <p className="text-gray-600 mb-8 max-w-2xl">
          Imagine each program has <strong>10 slots</strong>. Over time, how many people does each program
          help reach permanent housing? Click the button to watch a year pass.
        </p>

        {/* Flow Comparison Visualization */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {programsToCompare.map((program) => {
              const housed = Math.round(throughputRates[program.id] * yearsElapsed);
              return (
                <div key={program.id} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-6 h-6 rounded ${program.color} flex items-center justify-center text-white`}>
                      {program.icon}
                    </div>
                    <span className="font-medium text-sm text-ev-black">{program.shortName}</span>
                  </div>

                  {/* Visual "pipe" */}
                  <div className="h-24 bg-gray-100 rounded relative overflow-hidden mb-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min((housed / 100) * 100, 100)}%` }}
                      transition={{
                        type: 'spring',
                        stiffness: 50,
                        damping: 15,
                        duration: 0.8
                      }}
                      className={`absolute bottom-0 left-0 right-0 ${program.color}`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        key={housed}
                        initial={{ scale: 1.3, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-bold text-gray-800 drop-shadow-sm"
                      >
                        {housed}
                      </motion.span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center">people housed</div>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleAdvanceYear}
              disabled={isAnimating || yearsElapsed >= 5}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                yearsElapsed >= 5
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-ev-muted-blue text-white hover:bg-ev-muted-blue/90'
              }`}
            >
              <Clock className="w-4 h-4" />
              {yearsElapsed >= 5 ? 'Simulation Complete' : 'Advance 1 Year'}
            </button>
            {yearsElapsed > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Year: <strong>{yearsElapsed}</strong> of 5
          </div>
        </div>

        {/* Insight */}
        {yearsElapsed >= 3 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg animate-fadeIn">
            <p className="text-sm text-green-800">
              <strong>Notice something?</strong> Rapid Re-Housing (RRH) houses significantly more people than
              Transitional Housing, even with the same number of slots. This is why many communities are
              <strong> converting</strong> transitional housing programs to rapid re-housing.
            </p>
          </div>
        )}

        {yearsElapsed === 0 && (
          <div className="p-4 bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Try it:</strong> Click "Advance 1 Year" to see how many people each program type
              helps reach permanent housing over time.
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// Section 3: Red vs Clear Beads
function BeadMatchingSection() {
  const [selectedBead, setSelectedBead] = useState<'red' | 'clear' | null>(null);
  const [placedBeads, setPlacedBeads] = useState<{ program: string; bead: 'red' | 'clear'; result: 'success' | 'struggle' }[]>([]);

  const targetPrograms = ['rapid-rehousing', 'psh', 'transitional'];
  const relevantPrograms = PROGRAMS.filter(p => targetPrograms.includes(p.id));

  const getOutcome = (bead: 'red' | 'clear', programId: string): 'success' | 'struggle' => {
    if (bead === 'red') {
      return programId === 'psh' ? 'success' : 'struggle';
    } else {
      return programId === 'rapid-rehousing' ? 'success' : 'struggle';
    }
  };

  const handlePlaceBead = (programId: string) => {
    if (!selectedBead) return;

    const result = getOutcome(selectedBead, programId);
    setPlacedBeads(prev => [...prev, { program: programId, bead: selectedBead, result }]);
    setSelectedBead(null);
  };

  const handleReset = () => {
    setPlacedBeads([]);
    setSelectedBead(null);
  };

  const successCount = placedBeads.filter(p => p.result === 'success').length;

  return (
    <SectionWrapper id="matching">
      <SectionHeader
        number={3}
        title="The Right Program for the Right Person"
        subtitle="Not everyone experiencing homelessness has the same needs. Different programs work better for different situations."
      />

      <div className="ml-11">
        <p className="text-gray-600 mb-6 max-w-2xl">
          In the simulation, <span className="inline-flex items-center"><span className="w-4 h-4 bg-red-500 rounded-full inline-block mx-1"></span> red beads</span> represent
          people with <strong>high barriers</strong> (disabilities, chronic homelessness), while
          <span className="inline-flex items-center"><span className="w-4 h-4 bg-gray-300 rounded-full inline-block mx-1 border border-gray-400"></span> clear beads</span> represent
          people with <strong>lower barriers</strong> who mainly need short-term help.
        </p>

        <p className="text-gray-600 mb-8 max-w-2xl">
          <strong>Try it:</strong> Select a bead type, then click a program to place them. See which combinations lead to success.
        </p>

        {/* Bead Selection */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="text-sm text-gray-500 mb-3">1. Select a person type:</div>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedBead('red')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedBead === 'red'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-red-300'
              }`}
            >
              <span className="w-6 h-6 bg-red-500 rounded-full"></span>
              <div className="text-left">
                <div className="font-medium text-ev-black">High Barriers</div>
                <div className="text-xs text-gray-500">Disability, chronic homelessness</div>
              </div>
            </button>
            <button
              onClick={() => setSelectedBead('clear')}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                selectedBead === 'clear'
                  ? 'border-gray-500 bg-gray-100'
                  : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              <span className="w-6 h-6 bg-gray-300 rounded-full border-2 border-gray-400"></span>
              <div className="text-left">
                <div className="font-medium text-ev-black">Lower Barriers</div>
                <div className="text-xs text-gray-500">Needs short-term assistance</div>
              </div>
            </button>
          </div>

          {/* Program Targets */}
          <div className="text-sm text-gray-500 mb-3">2. Place them in a program:</div>
          <div className="grid grid-cols-3 gap-4">
            {relevantPrograms.map((program) => {
              const placed = placedBeads.filter(p => p.program === program.id);
              return (
                <button
                  key={program.id}
                  onClick={() => handlePlaceBead(program.id)}
                  disabled={!selectedBead}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedBead
                      ? 'border-gray-300 hover:border-ev-muted-blue cursor-pointer'
                      : 'border-gray-200 cursor-not-allowed opacity-60'
                  } bg-white`}
                >
                  <div className={`w-10 h-10 rounded-lg ${program.color} flex items-center justify-center text-white mx-auto mb-2`}>
                    {program.icon}
                  </div>
                  <div className="font-medium text-sm text-ev-black">{program.shortName}</div>
                  <div className="text-xs text-gray-500 mt-1">{program.name}</div>

                  {/* Placed beads */}
                  {placed.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {placed.map((p, i) => (
                        <div
                          key={i}
                          className={`w-5 h-5 rounded-full ${p.bead === 'red' ? 'bg-red-500' : 'bg-gray-300 border border-gray-400'} flex items-center justify-center`}
                        >
                          <span className={`text-[10px] ${p.result === 'success' ? 'text-white' : 'text-gray-600'}`}>
                            {p.result === 'success' ? '✓' : '✗'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {placedBeads.length > 0 && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm text-gray-600 hover:text-ev-muted-blue transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset and try again
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {placedBeads.length >= 2 && (
          <div className={`p-4 rounded-lg animate-fadeIn ${successCount >= 2 ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
            <p className="text-sm">
              {successCount >= 2 ? (
                <span className="text-green-800">
                  <strong>You found the pattern!</strong> People with high barriers (red) thrive in <strong>Permanent Supportive Housing</strong>,
                  which provides long-term stability and services. People with lower barriers (clear) succeed in <strong>Rapid Re-Housing</strong>,
                  which provides the short-term boost they need.
                </span>
              ) : (
                <span className="text-amber-800">
                  <strong>Keep experimenting!</strong> Try matching high-barrier individuals with programs that offer
                  long-term support, and lower-barrier individuals with short-term assistance programs.
                </span>
              )}
            </p>
          </div>
        )}

        {placedBeads.length === 0 && (
          <div className="p-4 bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Hint:</strong> Think about what each person type needs. Someone with a disability needs
              ongoing support. Someone who just lost their job might just need a few months of help.
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// Animated beads cluster for bottleneck visualization
function BeadCluster({ count, maxCount, type }: { count: number; maxCount: number; type: 'intake' | 'shelter' | 'rrh' | 'housed' | 'unsheltered' }) {
  const displayCount = Math.min(count, 12); // Show max 12 visual beads
  const beadColor = type === 'unsheltered' ? 'bg-gray-600' : type === 'housed' ? 'bg-green-300' : 'bg-white/80';

  return (
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-0.5 max-w-16">
      <AnimatePresence>
        {Array.from({ length: displayCount }).map((_, i) => (
          <motion.div
            key={`${type}-bead-${i}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: i * 0.03
            }}
            className={`w-2 h-2 rounded-full ${beadColor} ${count >= maxCount ? 'animate-pulse' : ''}`}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Section 4: Bottleneck Visualization
function BottleneckSection() {
  const [round, setRound] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simplified system state for visualization
  const systemStates = [
    { intake: 5, shelter: 20, rrh: 10, unsheltered: 0, housed: 0 },
    { intake: 8, shelter: 25, rrh: 10, unsheltered: 3, housed: 6 },
    { intake: 6, shelter: 25, rrh: 10, unsheltered: 8, housed: 12 },
    { intake: 9, shelter: 25, rrh: 10, unsheltered: 15, housed: 18 },
    { intake: 7, shelter: 25, rrh: 10, unsheltered: 22, housed: 25 },
  ];

  const currentState = systemStates[round];

  const handleNextRound = () => {
    if (isAnimating || round >= 4) return;
    setIsAnimating(true);
    setRound(prev => prev + 1);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleReset = () => {
    setRound(0);
  };

  return (
    <SectionWrapper id="bottleneck">
      <SectionHeader
        number={4}
        title="Where Does the System Get Stuck?"
        subtitle="When programs fill up faster than they can move people out, bottlenecks form—and people end up unsheltered."
      />

      <div className="ml-11">
        <p className="text-gray-600 mb-8 max-w-2xl">
          Watch what happens when new people enter the system each round, but programs don't have enough
          capacity. The <span className="text-gray-700 font-medium">unsheltered count</span> grows when
          there's nowhere for people to go.
        </p>

        {/* Simplified Flow Diagram */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {/* Intake */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-400 rounded-lg flex items-center justify-center mb-2 mx-auto relative">
                <Users className="w-8 h-8 text-white" />
                <motion.div
                  key={currentState.intake}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-ev-black text-white rounded-full text-xs flex items-center justify-center font-bold"
                >
                  {currentState.intake}
                </motion.div>
                <BeadCluster count={currentState.intake} maxCount={10} type="intake" />
              </div>
              <div className="text-sm font-medium text-gray-700">Intake</div>
            </div>

            <motion.div
              animate={{ x: isAnimating ? [0, 5, 0] : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-6 h-6 text-gray-400 rotate-[-90deg]" />
            </motion.div>

            {/* Shelter */}
            <div className="text-center">
              <motion.div
                animate={{
                  scale: currentState.shelter >= 25 ? [1, 1.02, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: currentState.shelter >= 25 ? Infinity : 0, repeatDelay: 1 }}
                className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto relative transition-colors ${currentState.shelter >= 25 ? 'bg-red-500' : 'bg-sky-400'}`}
              >
                <Building2 className="w-8 h-8 text-white" />
                <motion.div
                  key={currentState.shelter}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-ev-black text-white rounded-full text-xs flex items-center justify-center font-bold"
                >
                  {currentState.shelter}
                </motion.div>
                <BeadCluster count={Math.round(currentState.shelter / 2)} maxCount={13} type="shelter" />
              </motion.div>
              <div className="text-sm font-medium text-gray-700">Shelter</div>
              <div className="text-xs text-gray-500">(25 max)</div>
            </div>

            <motion.div
              animate={{ x: isAnimating ? [0, 5, 0] : 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <ChevronDown className="w-6 h-6 text-gray-400 rotate-[-90deg]" />
            </motion.div>

            {/* RRH */}
            <div className="text-center">
              <motion.div
                animate={{
                  scale: currentState.rrh >= 10 ? [1, 1.02, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: currentState.rrh >= 10 ? Infinity : 0, repeatDelay: 1 }}
                className={`w-20 h-20 rounded-lg flex items-center justify-center mb-2 mx-auto relative transition-colors ${currentState.rrh >= 10 ? 'bg-red-500' : 'bg-rose-500'}`}
              >
                <Zap className="w-8 h-8 text-white" />
                <motion.div
                  key={currentState.rrh}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-ev-black text-white rounded-full text-xs flex items-center justify-center font-bold"
                >
                  {currentState.rrh}
                </motion.div>
                <BeadCluster count={currentState.rrh} maxCount={10} type="rrh" />
              </motion.div>
              <div className="text-sm font-medium text-gray-700">RRH</div>
              <div className="text-xs text-gray-500">(10 max)</div>
            </div>

            <motion.div
              animate={{ x: isAnimating ? [0, 5, 0] : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ChevronDown className="w-6 h-6 text-gray-400 rotate-[-90deg]" />
            </motion.div>

            {/* Outcomes */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2 mx-auto relative">
                  <Home className="w-6 h-6 text-white" />
                  <motion.div
                    key={currentState.housed}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-ev-black text-white rounded-full text-xs flex items-center justify-center font-bold"
                  >
                    {currentState.housed}
                  </motion.div>
                  <BeadCluster count={Math.min(currentState.housed / 3, 8)} maxCount={30} type="housed" />
                </div>
                <div className="text-sm font-medium text-green-700">Housed</div>
              </div>
              <div className="text-center">
                <motion.div
                  animate={{
                    scale: currentState.unsheltered > 10 ? [1, 1.03, 1] : 1,
                  }}
                  transition={{ duration: 0.4, repeat: currentState.unsheltered > 10 ? Infinity : 0, repeatDelay: 0.8 }}
                  className={`w-16 h-16 rounded-lg flex items-center justify-center mb-2 mx-auto relative transition-colors ${currentState.unsheltered > 10 ? 'bg-red-700' : 'bg-gray-700'}`}
                >
                  <HelpCircle className="w-6 h-6 text-white" />
                  <motion.div
                    key={currentState.unsheltered}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-ev-black text-white rounded-full text-xs flex items-center justify-center font-bold"
                  >
                    {currentState.unsheltered}
                  </motion.div>
                  <BeadCluster count={Math.min(currentState.unsheltered / 2, 10)} maxCount={30} type="unsheltered" />
                </motion.div>
                <div className="text-sm font-medium text-gray-700">Unsheltered</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleNextRound}
              disabled={isAnimating || round >= 4}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                round >= 4
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-ev-muted-blue text-white hover:bg-ev-muted-blue/90'
              }`}
            >
              Next Round
            </button>
            {round > 0 && (
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Round: <strong>{round + 1}</strong> of 5
          </div>
        </div>

        {/* Dynamic Insight */}
        {round >= 2 && currentState.shelter >= 25 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg animate-fadeIn mb-4">
            <p className="text-sm text-amber-800">
              <strong>Bottleneck forming!</strong> The shelter is at capacity. New people entering the system
              have nowhere to go, so unsheltered homelessness increases.
            </p>
          </div>
        )}

        {round >= 4 && (
          <div className="p-4 bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg animate-fadeIn">
            <p className="text-sm text-gray-700">
              <strong>The core problem:</strong> When programs can't move people to permanent housing fast enough,
              the system backs up. The next section explores what system planners can do about it.
            </p>
          </div>
        )}

        {round === 0 && (
          <div className="p-4 bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Watch carefully:</strong> Click "Next Round" to see how the numbers change.
              Pay attention to where the system gets stuck.
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// Section 5: System Decisions
function SystemDecisionSection() {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showOutcome, setShowOutcome] = useState(false);

  const choices = [
    {
      id: 'diversion',
      title: 'Open Diversion Program',
      description: 'Help people find alternatives before they enter shelter (stay with family, mediation, one-time assistance)',
      outcome: 'Reduces inflow by ~20%. Fewer people need shelter in the first place.',
      effectiveness: 'good',
      score: -15,
    },
    {
      id: 'convert',
      title: 'Convert TH → Rapid Re-Housing',
      description: 'Transform 20 Transitional Housing slots into 20 Rapid Re-Housing slots',
      outcome: 'Dramatically increases throughput. Same capacity, but 5x more people housed per year.',
      effectiveness: 'best',
      score: -40,
    },
    {
      id: 'add-shelter',
      title: 'Add More Shelter Beds',
      description: 'Build 20 more emergency shelter beds',
      outcome: 'Addresses immediate need but doesn\'t fix the bottleneck. People still can\'t exit to housing.',
      effectiveness: 'limited',
      score: -5,
    },
  ];

  const handleSelectChoice = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowOutcome(false);
  };

  const handleConfirm = () => {
    setShowOutcome(true);
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setShowOutcome(false);
  };

  const selectedChoiceData = choices.find(c => c.id === selectedChoice);

  return (
    <SectionWrapper id="decisions">
      <SectionHeader
        number={5}
        title="You're the System Planner"
        subtitle="Communities have limited resources. If you could make ONE change to reduce homelessness, what would you choose?"
      />

      <div className="ml-11">
        <p className="text-gray-600 mb-8 max-w-2xl">
          Based on what you've learned, make a decision. Each choice has trade-offs, but some are
          more effective than others.
        </p>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleSelectChoice(choice.id)}
              disabled={showOutcome}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                selectedChoice === choice.id
                  ? 'border-ev-muted-blue bg-ev-light-blue/10'
                  : showOutcome
                    ? 'border-gray-200 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-ev-light-blue cursor-pointer'
              }`}
            >
              <h3 className="font-bold text-ev-black mb-2">{choice.title}</h3>
              <p className="text-sm text-gray-600">{choice.description}</p>
            </button>
          ))}
        </div>

        {/* Confirm Button */}
        {selectedChoice && !showOutcome && (
          <div className="flex justify-center mb-6">
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-ev-muted-blue text-white rounded-lg font-semibold hover:bg-ev-muted-blue/90 transition-all"
            >
              Confirm Decision
            </button>
          </div>
        )}

        {/* Outcome */}
        {showOutcome && selectedChoiceData && (
          <div className={`p-6 rounded-xl animate-fadeIn mb-6 ${
            selectedChoiceData.effectiveness === 'best'
              ? 'bg-green-50 border-2 border-green-300'
              : selectedChoiceData.effectiveness === 'good'
                ? 'bg-blue-50 border-2 border-blue-300'
                : 'bg-amber-50 border-2 border-amber-300'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedChoiceData.effectiveness === 'best'
                  ? 'bg-green-500 text-white'
                  : selectedChoiceData.effectiveness === 'good'
                    ? 'bg-blue-500 text-white'
                    : 'bg-amber-500 text-white'
              }`}>
                {selectedChoiceData.effectiveness === 'best' ? '★' : selectedChoiceData.effectiveness === 'good' ? '✓' : '~'}
              </div>
              <div>
                <h3 className="font-bold text-lg text-ev-black mb-1">
                  {selectedChoiceData.effectiveness === 'best' && 'Most Effective Choice!'}
                  {selectedChoiceData.effectiveness === 'good' && 'Good Choice!'}
                  {selectedChoiceData.effectiveness === 'limited' && 'Limited Impact'}
                </h3>
                <p className="text-gray-700 mb-3">{selectedChoiceData.outcome}</p>
                <p className="text-sm text-gray-500">
                  Projected score impact: <strong>{selectedChoiceData.score}</strong> points (lower is better)
                </p>
              </div>
            </div>
          </div>
        )}

        {showOutcome && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-ev-muted-blue hover:underline flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try a different choice
            </button>
          </div>
        )}

        {/* Final Insight */}
        {showOutcome && selectedChoiceData?.effectiveness === 'best' && (
          <div className="mt-6 p-4 bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Real-world validation:</strong> Communities that convert programs to Rapid Re-Housing
              consistently see the best outcomes. This is why "Housing First" approaches have become the
              evidence-based standard across the country.
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

// Section 6: Reflection
function ReflectionSection() {
  return (
    <SectionWrapper id="reflection" className="bg-gradient-to-b from-white to-ev-light-blue/10">
      <SectionHeader
        number={6}
        title="Bringing It Home"
        subtitle="You've just experienced a simplified version of how homelessness system planning works."
      />

      <div className="ml-11">
        <div className="max-w-2xl">
          <h3 className="font-bold text-ev-black mb-3">What You've Learned:</h3>
          <ul className="space-y-3 mb-8">
            {[
              'Homelessness is a system with interconnected programs, not random chaos',
              'Different programs have different throughput rates—some help more people faster',
              'People with high barriers need different interventions than those with low barriers',
              'Bottlenecks form when programs can\'t move people fast enough',
              'Strategic system changes (like converting to RRH) can dramatically improve outcomes',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="w-6 h-6 bg-ev-muted-blue text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="p-6 bg-white rounded-xl border border-gray-200 mb-8">
            <h3 className="font-bold text-ev-black mb-3">In Bloomington, Indiana:</h3>
            <p className="text-gray-600 mb-4">
              The local Continuum of Care uses these same principles to coordinate services across
              organizations like Beacon, Inc., Shalom Center, and the Housing Authority.
            </p>
            <p className="text-gray-600">
              Understanding this system helps you engage more meaningfully in community conversations
              about housing policy and homelessness solutions.
            </p>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Remember:</strong> This simulation is simplified. Real systems involve many more
              variables—funding constraints, zoning laws, individual circumstances, and political dynamics.
              But the core principles you've learned here apply to real-world system planning.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// Navigation dots
function SectionNav({ activeSection }: { activeSection: string }) {
  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'flow', label: 'Flow' },
    { id: 'matching', label: 'Matching' },
    { id: 'bottleneck', label: 'Bottleneck' },
    { id: 'decisions', label: 'Decisions' },
    { id: 'reflection', label: 'Reflection' },
  ];

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-gray-200">
        <div className="flex flex-col gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSection === section.id
                  ? 'bg-ev-muted-blue scale-125'
                  : 'bg-gray-300 hover:bg-ev-light-blue'
              }`}
              title={section.label}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}

// Main Component
export function HomelessSystemSimulation() {
  const [activeSection] = useState('overview');

  // TODO: Track active section on scroll using IntersectionObserver

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-ev-muted-blue to-ev-light-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-sm uppercase tracking-wide text-white/80 mb-2">
            Interactive Explainer
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            How the Homelessness System Works
          </h1>
          <p className="text-lg text-white/90 max-w-2xl">
            An interactive exploration of how communities coordinate programs to help people
            experiencing homelessness find permanent housing.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-white/80">
            <span>~15 minutes</span>
            <span>•</span>
            <span>6 interactive sections</span>
            <span>•</span>
            <span>Based on real system data</span>
          </div>
        </div>
      </header>

      {/* Section Navigation */}
      <SectionNav activeSection={activeSection} />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4">
        <SystemOverviewSection />
        <ProgramFlowSection />
        <BeadMatchingSection />
        <BottleneckSection />
        <SystemDecisionSection />
        <ReflectionSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-500 mb-2">
            This interactive is inspired by the{' '}
            <a
              href="https://endhomelessness.org/resources/toolkits-and-training-materials/homeless-system-simulation/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ev-muted-blue hover:underline"
            >
              Homeless System Simulation Game
            </a>{' '}
            by the National Alliance to End Homelessness.
          </p>
          <p className="text-xs text-gray-400">
            Adapted for single-player, self-paced learning as part of the Empowered Badges project.
          </p>
        </div>
      </footer>
    </div>
  );
}
