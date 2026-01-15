import { useState } from 'react';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

interface KnowledgeCheckProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  onComplete: () => void;
  isCompleted: boolean;
}

export function KnowledgeCheck({
  question,
  options,
  correctAnswer,
  explanation,
  onComplete,
  isCompleted,
}: KnowledgeCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnsweredCorrectly, setHasAnsweredCorrectly] = useState(isCompleted);

  const handleAnswer = (index: number) => {
    if (showResult || hasAnsweredCorrectly) return;
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);

    if (selectedAnswer === correctAnswer) {
      setHasAnsweredCorrectly(true);
      onComplete();
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className={`
      mt-6 rounded-xl border-2 p-6
      ${hasAnsweredCorrectly
        ? 'border-green-200 bg-green-50'
        : showResult && !isCorrect
          ? 'border-red-200 bg-red-50'
          : 'border-ev-light-blue/50 bg-ev-light-blue/5'
      }
    `}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className={`w-5 h-5 ${hasAnsweredCorrectly ? 'text-green-600' : 'text-ev-muted-blue'}`} />
        <span className={`font-semibold ${hasAnsweredCorrectly ? 'text-green-700' : 'text-ev-muted-blue'}`}>
          {hasAnsweredCorrectly ? 'Knowledge Check - Completed!' : 'Knowledge Check'}
        </span>
      </div>

      {/* Question */}
      <p className="text-ev-black font-medium mb-4">{question}</p>

      {/* Options */}
      <div className="space-y-2 mb-4">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === correctAnswer;

          let optionClass = 'border-gray-200 bg-white hover:border-ev-light-blue';

          if (hasAnsweredCorrectly) {
            if (isCorrectAnswer) {
              optionClass = 'border-green-500 bg-green-100';
            } else {
              optionClass = 'border-gray-200 bg-gray-50 opacity-60';
            }
          } else if (showResult) {
            if (isCorrectAnswer) {
              optionClass = 'border-green-500 bg-green-100';
            } else if (isSelected && !isCorrectAnswer) {
              optionClass = 'border-red-500 bg-red-100';
            } else {
              optionClass = 'border-gray-200 bg-gray-50 opacity-60';
            }
          } else if (isSelected) {
            optionClass = 'border-ev-muted-blue bg-ev-light-blue/10';
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult || hasAnsweredCorrectly}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${optionClass}
                ${(showResult || hasAnsweredCorrectly) ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <span className="flex items-center gap-3">
                <span className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0
                  ${isSelected && !showResult && !hasAnsweredCorrectly
                    ? 'border-ev-muted-blue bg-ev-muted-blue text-white'
                    : showResult || hasAnsweredCorrectly
                      ? isCorrectAnswer
                        ? 'border-green-500 bg-green-500 text-white'
                        : isSelected
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 text-gray-400'
                      : 'border-gray-300 text-gray-500'
                  }
                `}>
                  {(showResult || hasAnsweredCorrectly) && isCorrectAnswer ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (showResult && isSelected && !isCorrectAnswer) ? (
                    <XCircle className="w-4 h-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className="text-gray-700">{option}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Action Button / Result */}
      {!hasAnsweredCorrectly && !showResult && (
        <button
          onClick={handleCheck}
          disabled={selectedAnswer === null}
          className={`
            w-full py-3 rounded-lg font-semibold transition-all
            ${selectedAnswer !== null
              ? 'bg-ev-muted-blue text-white hover:bg-ev-muted-blue/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Check Answer
        </button>
      )}

      {showResult && !isCorrect && (
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-100 rounded-lg">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Not quite right</p>
              <p className="text-sm text-red-700 mt-1">{explanation}</p>
            </div>
          </div>
          <button
            onClick={handleTryAgain}
            className="w-full py-3 bg-ev-muted-blue text-white rounded-lg font-semibold hover:bg-ev-muted-blue/90 transition-all"
          >
            Try Again
          </button>
        </div>
      )}

      {(showResult && isCorrect) || (hasAnsweredCorrectly && !showResult) ? (
        <div className="flex items-start gap-3 p-4 bg-green-100 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Correct!</p>
            <p className="text-sm text-green-700 mt-1">{explanation}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
