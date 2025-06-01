import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PenSquare, ThumbsUp } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { useJourney } from '../contexts/JourneyContext';
import { generateReflectionPrompt } from '../lib/utils';

type CheckInFormProps = {
  journeyId: string;
  day: number;
  theme: string;
  onComplete?: () => void;
};

export function CheckInForm({ journeyId, day, theme, onComplete }: CheckInFormProps) {
  const { createCheckIn } = useJourney();
  const [reflection, setReflection] = useState('');
  const [truthRating, setTruthRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  const reflectionPrompt = generateReflectionPrompt(day, theme);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createCheckIn({
        journey_id: journeyId,
        day,
        completed: true,
        reflection,
        truth_rating: truthRating,
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error creating check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit}>
        <Card className="border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center">
              <PenSquare className="w-5 h-5 mr-2 text-purple-600" />
              Day {day} Check-In
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {step === 1 ? (
              <div className="space-y-4">
                <p className="font-medium text-gray-700">{reflectionPrompt}</p>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="Share your thoughts and reflections..."
                  className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="font-medium text-gray-700 mb-2">
                    How truthful were you in your reflection today?
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Being honest with yourself is key to meaningful growth. Rate your truthfulness:
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Less truthful</span>
                    <span className="text-sm text-gray-500">Completely truthful</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTruthRating(value)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          truthRating === value
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-md">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Why this matters
                  </h4>
                  <p className="text-sm text-yellow-700">
                    Your "Truth Score" helps measure the quality of your journey. 
                    Being honest with yourself leads to more meaningful growth and authentic progress.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t border-gray-100 p-4">
            {step === 2 && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              className="ml-auto"
              disabled={isSubmitting || (step === 1 && reflection.trim().length < 5)}
            >
              {isSubmitting ? 'Saving...' : step === 1 ? 'Continue' : 'Complete Check-In'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  );
}