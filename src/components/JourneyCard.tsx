import { ChevronRight, BookOpen, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { ProgressPath } from './ui/ProgressPath';
import { Journey } from '../lib/supabase';
import { calculateJourneyProgress, isJourneyActive } from '../lib/utils';

type JourneyCardProps = {
  journey: Journey;
  compact?: boolean;
};

export function JourneyCard({ journey, compact = false }: JourneyCardProps) {
  const progress = calculateJourneyProgress(
    journey.started_at || journey.created_at,
    journey.current_day,
    journey.duration
  );
  
  const isActive = isJourneyActive(journey.started_at, journey.completed_at);
  
  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg">
      <CardHeader className={compact ? 'p-4' : 'p-6'}>
        <div className="flex justify-between items-start">
          <CardTitle className={compact ? 'text-lg' : 'text-2xl'}>
            {journey.title}
          </CardTitle>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive ? 'Active' : journey.completed_at ? 'Completed' : 'Not Started'}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className={compact ? 'p-4 pt-0' : 'p-6 pt-0'}>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{journey.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium">{journey.habit}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm">{journey.duration} days</span>
            </div>
          </div>
        </div>
        
        {!compact && (
          <>
            <ProgressPath 
              progress={progress} 
              theme={journey.theme} 
            />
            
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="text-center">
                <p className="text-sm text-gray-500">Current Day</p>
                <p className="font-bold text-lg">{journey.current_day || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Streak</p>
                <p className="font-bold text-lg">{journey.streak || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Truth Score</p>
                <p className="font-bold text-lg">{journey.truth_score || 0}/10</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className={compact ? 'p-4 pt-0' : 'p-6 pt-0'}>
        <Link to={`/journey/${journey.id}`} className="w-full">
          <Button 
            variant="primary" 
            className="w-full flex justify-between items-center"
          >
            {isActive ? 'Continue Journey' : journey.completed_at ? 'View Summary' : 'Begin Journey'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}