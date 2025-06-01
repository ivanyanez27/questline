import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Compass, BookOpen, Award } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useJourney } from '../contexts/JourneyContext';
import { JourneyCard } from '../components/JourneyCard';
import { CheckInForm } from '../components/CheckInForm';
import { ReflectionGateForm } from '../components/ReflectionGateForm';
import { canCheckInToday, generateJourneyNarrative } from '../lib/utils';

export function HomePage() {
  const { user } = useAuth();
  const { currentJourney, checkIns, reflectionGates, loading } = useJourney();
  
  const canCheckIn = currentJourney && canCheckInToday(
    currentJourney.started_at,
    currentJourney.current_day,
    checkIns.length > 0 ? checkIns[checkIns.length - 1].created_at : null
  );
  
  // Find today's reflection gate if there is one
  const todayGate = currentJourney && reflectionGates.find(
    gate => gate.day === currentJourney.current_day && !gate.completed
  );
  
  const narrative = currentJourney ? generateJourneyNarrative(
    currentJourney.theme,
    currentJourney.current_day,
    currentJourney.duration
  ) : '';
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <LandingSection />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Your Journey
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transform your habits into meaningful quests. Build consistency through narrative and reflection.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
            </div>
          ) : !currentJourney ? (
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
              <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Begin Your First Quest</h2>
              <p className="text-gray-600 mb-6">
                You don't have any active journeys yet. Start your first habit quest and transform your daily practice into an epic adventure.
              </p>
              <Link to="/new-journey">
                <Button variant="primary" size="lg">
                  Create New Journey
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentJourney.title}</h2>
                    <p className="text-gray-600 mb-4">{currentJourney.description}</p>
                    <div className="bg-purple-50 p-4 rounded-md border border-purple-100 mb-4">
                      <p className="text-purple-800 italic">{narrative}</p>
                    </div>
                  </div>
                </div>
                
                {todayGate ? (
                  <ReflectionGateForm
                    gateId={todayGate.id}
                    day={todayGate.day}
                    prompt={todayGate.prompt}
                  />
                ) : canCheckIn ? (
                  <CheckInForm
                    journeyId={currentJourney.id}
                    day={currentJourney.current_day}
                    theme={currentJourney.theme}
                  />
                ) : (
                  <div className="bg-green-50 rounded-lg shadow-sm p-6 border border-green-100">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-green-800">All caught up!</h3>
                        <div className="mt-2 text-green-700">
                          <p>You've completed today's check-in. Return tomorrow to continue your journey.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <div className="bg-purple-600 px-6 py-4">
                    <h3 className="text-lg font-medium text-white">Journey Progress</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Current Day</p>
                        <p className="text-3xl font-bold text-gray-900">{currentJourney.current_day}</p>
                        <p className="text-xs text-gray-500">of {currentJourney.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Streak</p>
                        <p className="text-3xl font-bold text-purple-600">{currentJourney.streak}</p>
                        <p className="text-xs text-gray-500">days</p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">Truth Score</span>
                        <span className="text-sm font-medium text-gray-700">{currentJourney.truth_score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${(currentJourney.truth_score / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Link to={`/journey/${currentJourney.id}`} className="block">
                      <Button variant="outline" className="w-full">
                        View Full Journey Details
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg shadow-md overflow-hidden text-white">
                  <div className="p-6">
                    <h3 className="text-xl font-medium mb-2">Ready for a New Quest?</h3>
                    <p className="text-white/80 mb-4">
                      You can manage multiple journeys at once to build different habits simultaneously.
                    </p>
                    <Link to="/new-journey">
                      <Button variant="outline" className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20">
                        Create Another Journey
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LandingSection() {
  return (
    <div>
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <svg
              className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>
            
            <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Transform habits into</span>
                  <span className="block text-purple-600">meaningful journeys</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Questline turns your habit goals into narrative adventures. Build consistency through storytelling, reflection, and visual progress.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link to="/signup">
                      <Button
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        Begin Your Journey
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link to="/login">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Person hiking on a mountain path"
          />
        </div>
      </div>
      
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How Questline Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Turn everyday habits into epic quests with narrative, reflection, and visual progress.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg">
                        <Compass className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Define Your Quest
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Choose a habit, set your timeline, and select a narrative theme that resonates with you — fantasy, sci-fi, adventure, or mystery.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg">
                        <BookOpen className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Daily Reflections
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Check in daily to mark your progress, reflect on your experience, and read the next chapter of your personalized narrative.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-md h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-purple-600 rounded-md shadow-lg">
                        <Award className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Complete Your Journey
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Reach your goal and earn a shareable achievement card showcasing your consistency, reflections, and personal growth.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}