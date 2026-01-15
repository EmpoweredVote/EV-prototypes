import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Award } from 'lucide-react';
import { ModuleHeader } from './ModuleHeader';
import { ContentSection } from './ContentSection';
import { KnowledgeCheck } from './KnowledgeCheck';
import { InteractivePlaceholder } from './InteractivePlaceholder';
import { BadgeEarned } from './BadgeEarned';
import { moduleData } from '../data/housingModuleData';

type ModuleState = 'learning' | 'assessment' | 'completed';

export function HousingModule() {
  const [moduleState, setModuleState] = useState<ModuleState>('learning');
  const [completedModules, setCompletedModules] = useState<Set<number>>(new Set());
  const [assessmentScore, setAssessmentScore] = useState<number>(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Map<number, number>>(new Map());
  const [showAssessmentResults, setShowAssessmentResults] = useState(false);

  const totalModules = moduleData.modules.length;
  const allModulesComplete = completedModules.size === totalModules;

  const handleModuleComplete = (moduleIndex: number) => {
    setCompletedModules(prev => new Set([...prev, moduleIndex]));
  };

  const handleStartAssessment = () => {
    setModuleState('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentAnswer = (questionIndex: number, answerIndex: number) => {
    setAssessmentAnswers(prev => new Map(prev).set(questionIndex, answerIndex));
  };

  const handleSubmitAssessment = () => {
    let score = 0;
    moduleData.assessment.questions.forEach((q, i) => {
      if (assessmentAnswers.get(i) === q.correctAnswer) {
        score++;
      }
    });
    setAssessmentScore(score);
    setShowAssessmentResults(true);

    if (score >= moduleData.assessment.passingScore) {
      setModuleState('completed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRetryAssessment = () => {
    setAssessmentAnswers(new Map());
    setShowAssessmentResults(false);
    setAssessmentScore(0);
  };

  if (moduleState === 'completed') {
    return <BadgeEarned badgeData={moduleData.badge} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-ev-muted-blue hover:text-ev-coral transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Badges
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {completedModules.size}/{totalModules} modules
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ev-muted-blue transition-all duration-500 rounded-full"
                  style={{ width: `${(completedModules.size / totalModules) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {moduleState === 'learning' && (
          <>
            {/* Module Header / Title Page */}
            <ModuleHeader
              title={moduleData.title}
              subtitle={moduleData.subtitle}
              level={moduleData.level}
              estimatedTime={moduleData.estimatedTime}
              lastUpdated={moduleData.lastUpdated}
            />

            {/* Orientation Section */}
            <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-ev-black mb-4">What You'll Learn</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {moduleData.orientation.whatYoullLearn}
              </p>

              <h3 className="text-lg font-semibold text-ev-black mb-3">Why It Matters</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {moduleData.orientation.whyItMatters}
              </p>

              <div className="bg-ev-light-blue/10 border border-ev-light-blue/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-ev-muted-blue mb-2">What This Badge Is NOT</h3>
                <p className="text-gray-600 leading-relaxed">
                  {moduleData.orientation.whatItIsNot}
                </p>
              </div>
            </section>

            {/* Learning Modules */}
            {moduleData.modules.map((module, index) => (
              <div key={index} className="mt-8">
                <ContentSection
                  moduleNumber={index + 1}
                  title={module.title}
                  content={module.content}
                  isCompleted={completedModules.has(index)}
                />

                {/* Interactive Placeholder */}
                {module.interactive && (
                  <InteractivePlaceholder
                    title={module.interactive.title}
                    description={module.interactive.description}
                  />
                )}

                {/* Knowledge Check */}
                <KnowledgeCheck
                  question={module.knowledgeCheck.question}
                  options={module.knowledgeCheck.options}
                  correctAnswer={module.knowledgeCheck.correctAnswer}
                  explanation={module.knowledgeCheck.explanation}
                  onComplete={() => handleModuleComplete(index)}
                  isCompleted={completedModules.has(index)}
                />
              </div>
            ))}

            {/* Proceed to Assessment */}
            <section className="mt-12 bg-gradient-to-br from-ev-muted-blue to-ev-light-blue rounded-xl p-6 md:p-8 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">Ready for Your Badge?</h2>
                  <p className="text-white/90 mb-4">
                    Complete the final assessment to earn your Housing and Homelessness badge.
                    You need to answer {moduleData.assessment.passingScore} out of {moduleData.assessment.questions.length} questions correctly.
                  </p>
                  {!allModulesComplete && (
                    <p className="text-white/80 text-sm mb-4">
                      Complete all module knowledge checks first ({completedModules.size}/{totalModules} done)
                    </p>
                  )}
                  <button
                    onClick={handleStartAssessment}
                    disabled={!allModulesComplete}
                    className={`
                      px-6 py-3 rounded-lg font-semibold transition-all
                      ${allModulesComplete
                        ? 'bg-white text-ev-muted-blue hover:bg-gray-100'
                        : 'bg-white/30 text-white/70 cursor-not-allowed'
                      }
                    `}
                  >
                    {allModulesComplete ? 'Start Assessment' : 'Complete All Modules First'}
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {moduleState === 'assessment' && (
          <section className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-ev-black mb-2">Final Assessment</h1>
              <p className="text-gray-600">
                Answer {moduleData.assessment.passingScore} or more correctly to earn your badge
              </p>
            </div>

            <div className="space-y-8">
              {moduleData.assessment.questions.map((question, qIndex) => (
                <div
                  key={qIndex}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    showAssessmentResults
                      ? assessmentAnswers.get(qIndex) === question.correctAnswer
                        ? 'border-green-300 bg-green-50'
                        : assessmentAnswers.has(qIndex)
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <p className="font-semibold text-ev-black mb-4">
                    {qIndex + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <button
                        key={oIndex}
                        onClick={() => !showAssessmentResults && handleAssessmentAnswer(qIndex, oIndex)}
                        disabled={showAssessmentResults}
                        className={`
                          w-full text-left p-4 rounded-lg border-2 transition-all
                          ${assessmentAnswers.get(qIndex) === oIndex
                            ? showAssessmentResults
                              ? oIndex === question.correctAnswer
                                ? 'border-green-500 bg-green-100'
                                : 'border-red-500 bg-red-100'
                              : 'border-ev-muted-blue bg-ev-light-blue/10'
                            : showAssessmentResults && oIndex === question.correctAnswer
                              ? 'border-green-500 bg-green-100'
                              : 'border-gray-200 bg-white hover:border-ev-light-blue'
                          }
                          ${showAssessmentResults ? 'cursor-default' : 'cursor-pointer'}
                        `}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium
                            ${assessmentAnswers.get(qIndex) === oIndex
                              ? 'border-ev-muted-blue bg-ev-muted-blue text-white'
                              : 'border-gray-300 text-gray-500'
                            }
                          `}>
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="text-gray-700">{option}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                  {showAssessmentResults && (
                    <p className={`mt-4 text-sm ${
                      assessmentAnswers.get(qIndex) === question.correctAnswer
                        ? 'text-green-700'
                        : 'text-red-700'
                    }`}>
                      {question.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Assessment Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {!showAssessmentResults ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">
                    {assessmentAnswers.size}/{moduleData.assessment.questions.length} answered
                  </span>
                  <button
                    onClick={handleSubmitAssessment}
                    disabled={assessmentAnswers.size < moduleData.assessment.questions.length}
                    className={`
                      px-6 py-3 rounded-lg font-semibold transition-all
                      ${assessmentAnswers.size === moduleData.assessment.questions.length
                        ? 'bg-ev-muted-blue text-white hover:bg-ev-muted-blue/90'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Submit Assessment
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-full mb-4
                    ${assessmentScore >= moduleData.assessment.passingScore
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {assessmentScore >= moduleData.assessment.passingScore ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">
                          You passed! {assessmentScore}/{moduleData.assessment.questions.length} correct
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold">
                          {assessmentScore}/{moduleData.assessment.questions.length} correct - Need {moduleData.assessment.passingScore} to pass
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex justify-center gap-4">
                    {assessmentScore >= moduleData.assessment.passingScore ? (
                      <button
                        onClick={() => setModuleState('completed')}
                        className="px-6 py-3 bg-ev-muted-blue text-white rounded-lg font-semibold hover:bg-ev-muted-blue/90 transition-all"
                      >
                        Claim Your Badge
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setModuleState('learning')}
                          className="px-6 py-3 border-2 border-ev-muted-blue text-ev-muted-blue rounded-lg font-semibold hover:bg-ev-light-blue/10 transition-all"
                        >
                          Review Content
                        </button>
                        <button
                          onClick={handleRetryAssessment}
                          className="px-6 py-3 bg-ev-muted-blue text-white rounded-lg font-semibold hover:bg-ev-muted-blue/90 transition-all"
                        >
                          Try Again
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
