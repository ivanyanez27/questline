import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useJourney } from '../contexts/JourneyContext';
import { JourneyCard } from '../components/JourneyCard';

export function JourneysPage() {
  const { journeys, loading } = useJourney();
  
  const activeJourneys = journeys.filter(j => j.started_at && !j.completed_at);
  const completedJourneys = journeys.filter(j => j.completed_at);
  const draftJourneys = journeys.filter(j => !j.started_at);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Journeys</h1>
        <Link to="/new-journey">
          <Button variant="primary" className="flex items-center">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Journey
          </Button>
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
        </div>
      ) : journeys.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-900 mb-4">No journeys yet</h3>
          <p className="text-gray-600 mb-6">
            Start your first habit journey and transform your daily practice into an epic quest.
          </p>
          <Link to="/new-journey">
            <Button variant="primary">
              Create Your First Journey
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {activeJourneys.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Journeys</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeJourneys.map(journey => (
                  <JourneyCard key={journey.id} journey={journey} />
                ))}
              </div>
            </div>
          )}
          
          {draftJourneys.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Draft Journeys</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {draftJourneys.map(journey => (
                  <JourneyCard key={journey.id} journey={journey} />
                ))}
              </div>
            </div>
          )}
          
          {completedJourneys.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Completed Journeys</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedJourneys.map(journey => (
                  <JourneyCard key={journey.id} journey={journey} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}