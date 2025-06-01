import React from 'react';
import { CreateJourneyForm } from '../components/CreateJourneyForm';

export function NewJourneyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Create a New Journey</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Design your habit quest with a compelling narrative and reflective milestones.
        </p>
      </div>
      
      <CreateJourneyForm />
    </div>
  );
}