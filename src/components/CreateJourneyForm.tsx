import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, CalendarDays, MapPin, ScrollText } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { useJourney } from '../contexts/JourneyContext';
import { useNavigate } from 'react-router-dom';

export function CreateJourneyForm() {
  const { createJourney } = useJourney();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    habit: '',
    duration: 30,
    theme: 'fantasy' as 'fantasy' | 'sci-fi' | 'adventure' | 'mystery',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value, 10) || 30 : value,
    }));
  };
  
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      nextStep();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await createJourney({
        ...formData,
        started_at: new Date().toISOString(),
        current_day: 0,
        streak: 0,
        truth_score: 0,
      });
      
      if (error) throw error;
      
      if (data) {
        navigate(`/journey/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating journey:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const steps = [
    { icon: <Book className="w-5 h-5" />, label: 'Basics' },
    { icon: <CalendarDays className="w-5 h-5" />, label: 'Details' },
    { icon: <ScrollText className="w-5 h-5" />, label: 'Theme' },
  ];
  
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress steps */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
        
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center relative z-10 ${
              i + 1 <= step ? 'text-purple-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                i + 1 <= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.icon}
            </div>
            <span className="text-sm font-medium">{s.label}</span>
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Create Your Quest'}
              {step === 2 && 'Define Your Path'}
              {step === 3 && 'Choose Your Narrative'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Journey Title
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="E.g., Morning Meditation Quest"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="What do you hope to achieve with this journey?"
                      className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="habit" className="block text-sm font-medium text-gray-700 mb-1">
                      Habit to Track
                    </label>
                    <Input
                      id="habit"
                      name="habit"
                      value={formData.habit}
                      onChange={handleChange}
                      placeholder="E.g., 15 minutes of meditation"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Journey Duration (days)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        id="duration"
                        name="duration"
                        min="7"
                        max="90"
                        step="1"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="font-medium text-gray-700 min-w-[40px] text-center">
                        {formData.duration}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1 week</span>
                      <span>3 months</span>
                    </div>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Your Narrative Theme
                  </label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'fantasy', name: 'Fantasy Quest', description: 'A magical journey through enchanted realms' },
                      { id: 'sci-fi', name: 'Sci-Fi Mission', description: 'A high-tech adventure through digital frontiers' },
                      { id: 'adventure', name: 'Wilderness Adventure', description: 'An epic expedition through uncharted territory' },
                      { id: 'mystery', name: 'Mystery Investigation', description: 'A suspenseful case unfolding with each check-in' },
                    ].map((theme) => (
                      <div
                        key={theme.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          formData.theme === theme.id
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-purple-200'
                        }`}
                        onClick={() => setFormData((prev) => ({ ...prev, theme: theme.id as any }))}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            id={theme.id}
                            name="theme"
                            value={theme.id}
                            checked={formData.theme === theme.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border mr-2 ${
                              formData.theme === theme.id
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-300'
                            }`}
                          >
                            {formData.theme === theme.id && (
                              <div className="w-2 h-2 rounded-full bg-white m-0.5" />
                            )}
                          </div>
                          <label htmlFor={theme.id} className="font-medium">
                            {theme.name}
                          </label>
                        </div>
                        <p className="text-sm text-gray-500 ml-6">{theme.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || (step === 1 && (!formData.title || !formData.description))}
            >
              {isSubmitting
                ? 'Creating...'
                : step < 3
                ? 'Continue'
                : 'Begin Your Journey'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}