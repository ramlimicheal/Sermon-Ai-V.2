import React, { useState } from 'react';
import { Lightbulb, Loader, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CoachFeedback {
  category: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

interface SermonCoachProps {
  sermonContent: string;
  scripture: string;
}

export const SermonCoach: React.FC<SermonCoachProps> = ({ sermonContent, scripture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<CoachFeedback[] | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!sermonContent.trim()) {
      setError('Please write some sermon content first');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      // Simulate AI analysis (in production, this would call a backend API)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockFeedback: CoachFeedback[] = [
        {
          category: 'Structure',
          score: 85,
          feedback: 'Your sermon has a clear beginning, middle, and end. Good job!',
          suggestions: [
            'Consider adding a transition statement between your main points',
            'Your conclusion could be stronger - try ending with a call to action',
          ],
        },
        {
          category: 'Engagement',
          score: 72,
          feedback: 'You have some engaging elements, but could improve interactivity.',
          suggestions: [
            'Add more rhetorical questions to engage your audience',
            'Include personal stories or illustrations to connect with listeners',
            'Consider adding interactive elements like polls or discussions',
          ],
        },
        {
          category: 'Biblical Accuracy',
          score: 90,
          feedback: 'Excellent biblical foundation and accurate interpretation.',
          suggestions: [
            'Consider adding more cross-references to strengthen your points',
          ],
        },
        {
          category: 'Clarity',
          score: 78,
          feedback: 'Your message is generally clear, but some sections could be simplified.',
          suggestions: [
            'Break down complex theological concepts into simpler terms',
            'Use more concrete examples instead of abstract ideas',
          ],
        },
        {
          category: 'Application',
          score: 80,
          feedback: 'Good practical applications for your audience.',
          suggestions: [
            'Add more specific action steps your congregation can take',
            'Consider different life situations your audience might be in',
          ],
        },
      ];

      setFeedback(mockFeedback);
    } catch (err) {
      setError('Failed to analyze sermon. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-orange-50';
  };

  const overallScore = feedback
    ? Math.round(feedback.reduce((sum, f) => sum + f.score, 0) / feedback.length)
    : 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Lightbulb className="h-3.5 w-3.5" />
        Sermon Coach
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-bible-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="font-semibold text-bible-900 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                AI Sermon Coach
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bible-500 hover:text-bible-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {!feedback ? (
                <>
                  <div className="bg-bible-50 p-4 rounded-lg border border-bible-200">
                    <h4 className="font-medium text-bible-900 mb-2">How it works</h4>
                    <ul className="text-sm text-bible-700 space-y-1">
                      <li>✓ Analyzes your sermon structure and flow</li>
                      <li>✓ Evaluates engagement and audience connection</li>
                      <li>✓ Checks biblical accuracy and interpretation</li>
                      <li>✓ Assesses clarity and practical application</li>
                      <li>✓ Provides actionable suggestions for improvement</li>
                    </ul>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                      {error}
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader className="h-3.5 w-3.5 mr-1 animate-spin" />
                        Analyzing Your Sermon...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-3.5 w-3.5 mr-1" />
                        Get Feedback
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  {/* Overall Score */}
                  <div className="bg-gradient-to-r from-bible-50 to-bible-100 p-6 rounded-lg border border-bible-200 text-center">
                    <p className="text-sm text-bible-600 mb-2">Overall Score</p>
                    <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>
                      {overallScore}%
                    </div>
                    <p className="text-sm text-bible-600 mt-2">
                      {overallScore >= 85
                        ? 'Excellent sermon!'
                        : overallScore >= 70
                        ? 'Good sermon with room for improvement'
                        : 'Consider the suggestions below'}
                    </p>
                  </div>

                  {/* Detailed Feedback */}
                  <div className="space-y-3">
                    {feedback.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border border-bible-200 ${getScoreBgColor(item.score)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-bible-900">{item.category}</h4>
                          <div className="flex items-center gap-2">
                            {item.score >= 80 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                            <span className={`font-semibold ${getScoreColor(item.score)}`}>
                              {item.score}%
                            </span>
                          </div>
                        </div>

                        <p className="text-sm text-bible-700 mb-2">{item.feedback}</p>

                        {item.suggestions.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-bible-600 mb-1">Suggestions:</p>
                            <ul className="text-xs text-bible-600 space-y-1">
                              {item.suggestions.map((suggestion, sidx) => (
                                <li key={sidx}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setFeedback(null)}
                    className="w-full"
                  >
                    Get New Analysis
                  </Button>
                </>
              )}
            </div>

            <div className="px-6 py-4 border-t border-bible-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
