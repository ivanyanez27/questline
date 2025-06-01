import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PenSquare, Upload, ThumbsUp, AlertCircle } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { useJourney } from '../contexts/JourneyContext';
import { generateReflectionPrompt } from '../lib/utils';
import toast from 'react-hot-toast';

type CheckInFormProps = {
  journeyId: string;
  day: number;
  theme: string;
  onComplete?: () => void;
};

export function CheckInForm({ journeyId, day, theme, onComplete }: CheckInFormProps) {
  const { createCheckIn } = useJourney();
  const [textInput, setTextInput] = useState('');
  const [numericInput, setNumericInput] = useState('');
  const [reflection, setReflection] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const reflectionPrompt = generateReflectionPrompt(day, theme);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPG and PNG files are allowed');
        return;
      }
      setSelectedFile(file);
    }
  };
  
  const isFormValid = () => {
    return (
      (textInput.trim() || numericInput || selectedFile) &&
      reflection.length >= 50
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsSubmitting(true);
    
    try {
      let mediaUrl = '';
      if (selectedFile) {
        // Handle file upload here
        // Implementation will depend on your storage solution
      }
      
      const checkInData = {
        journey_id: journeyId,
        day,
        completed: true,
        text_input: textInput,
        numeric_input: numericInput ? parseFloat(numericInput) : undefined,
        reflection,
        media_url: mediaUrl,
        truth_rating: 5, // Default truth rating
      };
      
      const { error } = await createCheckIn(checkInData);
      
      if (error) throw error;
      
      toast.success('Check-in completed successfully!');
      if (onComplete) onComplete();
      
    } catch (error) {
      console.error('Error creating check-in:', error);
      toast.error('Failed to save check-in');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="form"
      aria-label="Daily Check-in Form"
    >
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PenSquare className="w-5 h-5 mr-2 text-purple-600" />
              Day {day} Check-In
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Text Input
                </label>
                <Input
                  id="textInput"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value.slice(0, 500))}
                  placeholder="Share your thoughts (max 500 characters)"
                  maxLength={500}
                  aria-describedby="textInputHelp"
                />
                <p id="textInputHelp" className="mt-1 text-sm text-gray-500">
                  {textInput.length}/500 characters
                </p>
              </div>
              
              <div>
                <label htmlFor="numericInput" className="block text-sm font-medium text-gray-700 mb-1">
                  Numeric Input
                </label>
                <Input
                  id="numericInput"
                  type="number"
                  min="0"
                  step="any"
                  value={numericInput}
                  onChange={(e) => setNumericInput(e.target.value)}
                  placeholder="Enter a positive number"
                  aria-describedby="numericInputHelp"
                />
                <p id="numericInputHelp" className="mt-1 text-sm text-gray-500">
                  Enter any positive number
                </p>
              </div>
              
              <div>
                <label htmlFor="photoUpload" className="block text-sm font-medium text-gray-700 mb-1">
                  Photo Upload
                </label>
                <div className="mt-1 flex items-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center"
                    aria-label="Choose photo"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="photoUpload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    aria-describedby="photoUploadHelp"
                  />
                  {selectedFile && (
                    <span className="ml-3 text-sm text-gray-500">
                      {selectedFile.name}
                    </span>
                  )}
                </div>
                <p id="photoUploadHelp" className="mt-1 text-sm text-gray-500">
                  Max size: 5MB. Formats: JPG, PNG
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reflection" className="block text-sm font-medium text-gray-700">
                Daily Reflection
              </label>
              <p className="text-sm text-gray-600 italic mb-2">{reflectionPrompt}</p>
              <textarea
                id="reflection"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Take a moment to reflect on your journey today... (minimum 50 characters)"
                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
                aria-describedby="reflectionHelp"
              />
              <p id="reflectionHelp" className="text-sm text-gray-500">
                {reflection.length}/50 characters minimum
              </p>
            </div>
            
            {reflection.length > 0 && reflection.length < 50 && (
              <div className="flex items-start text-amber-600">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Please provide a more detailed reflection (at least 50 characters)
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!isFormValid() || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <motion.div
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Complete Check-in
                </span>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  );
}