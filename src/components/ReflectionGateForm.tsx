import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, BookOpen } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { useJourney } from '../contexts/JourneyContext';

type ReflectionGateFormProps = {
  gateId: string;
  day: number;
  prompt: string;
  onComplete?: () => void;
};

export function ReflectionGateForm({ gateId, day, prompt, onComplete }: ReflectionGateFormProps) {
  const { completeReflectionGate } = useJourney();
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await completeReflectionGate(gateId, response);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error completing reflection gate:', error);
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
        <Card className="border-2 border-amber-200 overflow-hidden">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <CardTitle className="flex items-center text-amber-800">
              <KeyRound className="w-5 h-5 mr-2 text-amber-600" />
              Day {day} Reflection Gate
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="bg-white p-4 rounded-lg border border-amber-100">
              <div className="flex items-center mb-2">
                <BookOpen className="w-4 h-4 mr-2 text-amber-600" />
                <h4 className="font-medium text-gray-900">Reflection Prompt</h4>
              </div>
              <p className="text-gray-700">{prompt}</p>
            </div>
            
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-2">
                Your Reflection
              </label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Take your time to reflect deeply..."
                className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
              <p>
                <span className="font-medium">Why this matters:</span> Deeper reflections at key milestones help you gain valuable insights about your journey and yourself. These gates mark important transitions in your progress.
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t border-amber-100 p-4">
            <Button
              type="submit"
              variant="primary"
              className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
              disabled={isSubmitting || response.length < 20}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Reflection'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  );
}