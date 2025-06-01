import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trophy, 
  BarChart3, 
  Flame,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressPath } from '../components/ui/ProgressPath';
import { CheckInForm } from '../components/CheckInForm';
import { ReflectionGateForm } from '../components/ReflectionGateForm';
import { useJourney } from '../contexts/JourneyContext';
import { 
  calculateJourneyProgress, 
  canCheckInToday, 
  formatDate, 
  generateJourneyNarrative 
} from '../lib/utils';

export function JourneyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { journeys, checkIns, reflectionGates, loading, fetchJourneys, fetchCurrentJourney } = useJourney();
  const [journey, setJourney] = useState<any>(null);
  
  useEffect(() => {
    fetchJourneys();
    fetchCurrentJourney();
  }, [id]);
  
  useEffect(() => {
    if (journeys.length > 0 && id) {
      const foundJourney = journeys.find(j => j.id === id);
      setJourney(foundJourney || null);
    }
  }, [journeys, id]);
  
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }
  
  if (!journey) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-900 mb-4">Journey not found</h3>
          <p className="text-gray-600 mb-6">
            The journey you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link to="/journeys">
            <Button variant="primary">
              Back to My Journeys
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const progress = calculateJourneyProgress(
    journey.started_at || journey.created_at,
    journey.current_day,
    journey.duration
  );
  
  const canCheckIn = canCheckInToday(
    journey.started_at,
    journey.current_day,
    checkIns.length > 0 ? checkIns[checkIns.length - 1].created_at : null
  );
  
  const todayGate = reflectionGates.find(
    gate => gate.day === journey.current_day && !gate.completed
  );
  
  const narrative = generateJourneyNarrative(
    journey.theme,
    journey.current_day,
    journey.duration
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link to="/journeys" className="inline-flex items-center text-purple-600 hover:text-purple-800">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Journeys
        </Link>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{journey.title}</h1>
          <div className="mt-2 sm:mt-0">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              journey.completed_at 
                ? 'bg-green-100 text-green-800' 
                : journey.started_at 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {journey.completed_at 
                ? 'Completed' 
                : journey.started_at 
                ? 'In Progress' 
                : 'Not Started'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Journey Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{journey.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-2">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    <span className="text-sm">Habit</span>
                  </div>
                  <p className="font-medium">{journey.habit}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <p className="font-medium">{journey.duration} days</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="text-sm">Started</span>
                  </div>
                  <p className="font-medium">
                    {journey.started_at ? formatDate(journey.started_at) : 'Not yet'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Trophy className="w-4 h-4 mr-1" />
                    <span className="text-sm">Theme</span>
                  </div>
                  <p className="font-medium capitalize">{journey.theme}</p>
                </div>
              </div>
              
              <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 mb-6">
                <h3 className="text-lg font-medium text-purple-800 mb-2">Your Journey Narrative</h3>
                <p className="text-purple-700 italic">{narrative}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Progress</h3>
                <ProgressPath 
                  progress={progress} 
                  theme={journey.theme}
                  className="mb-2" 
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Day 1</span>
                  <span>Day {journey.duration}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {todayGate ? (
            <ReflectionGateForm
              gateId={todayGate.id}
              day={todayGate.day}
              prompt={todayGate.prompt}
            />
          ) : canCheckIn ? (
            <CheckInForm
              journeyId={journey.id}
              day={journey.current_day}
              theme={journey.theme}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Check-In Status</CardTitle>
              </CardHeader>
              <CardContent>
                {journey.completed_at ? (
                  <div className="bg-green-50 p-4 rounded-md border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center">
                      <Trophy className="w-5 h-5 mr-2" />
                      Journey Completed!
                    </h3>
                    <p className="text-green-700">
                      Congratulations on completing your journey! You've built a powerful habit and gained valuable insights along the way.
                    </p>
                  </div>
                ) : journey.started_at ? (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <p className="text-blue-700">
                      You're all caught up with your check-ins. Return tomorrow to continue your journey.
                    </p>
                  </div>
                ) : (
                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                    <p className="text-yellow-700">
                      This journey hasn't started yet. Begin when you're ready to commit to your new habit.
                    </p>
                    <Button
                      variant="primary"
                      className="mt-4"
                      // This would need to update the journey to start it
                      onClick={() => {}}
                    >
                      Begin Journey Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Stats & Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 mb-2">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-500">Current Day</p>
                  <p className="text-2xl font-bold">{journey.current_day || 0}</p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-2">
                    <Flame className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-500">Streak</p>
                  <p className="text-2xl font-bold">{journey.streak || 0}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Truth Score</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{journey.truth_score || 0}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(journey.truth_score / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Your honesty rating based on daily reflections
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Completion Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className="bg-green-500 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>{progress}% Complete</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              {checkIns.length === 0 ? (
                <p className="text-gray-500 text-sm">No check-ins recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {checkIns.slice(-5).reverse().map((checkIn) => (
                    <div key={checkIn.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                          <span className="font-medium">Day {checkIn.day}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(checkIn.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {checkIn.reflection}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}