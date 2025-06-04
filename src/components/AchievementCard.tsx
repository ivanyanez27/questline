import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { Achievement } from '../lib/supabase';

type AchievementCardProps = {
  achievement: Achievement;
  isEarned?: boolean;
  earnedAt?: string;
};

export function AchievementCard({ achievement, isEarned, earnedAt }: AchievementCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`relative overflow-hidden ${isEarned ? 'border-purple-500' : 'border-gray-200'}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${
          isEarned 
            ? 'from-purple-500/10 to-blue-500/10' 
            : 'from-gray-100 to-gray-50'
        }`} />
        
        <CardContent className="relative p-6">
          <div className="flex items-start space-x-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              isEarned ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              {achievement.image_url ? (
                <img
                  src={achievement.image_url}
                  alt={achievement.name}
                  className="w-8 h-8 object-cover rounded"
                />
              ) : (
                <Award className={`w-6 h-6 ${isEarned ? 'text-purple-600' : 'text-gray-400'}`} />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-1 ${isEarned ? 'text-purple-900' : 'text-gray-700'}`}>
                {achievement.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${isEarned ? 'text-purple-600' : 'text-gray-500'}`}>
                    +{achievement.points_reward} points
                  </span>
                </div>
                
                {isEarned && (
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">
                      Earned {new Date(earnedAt!).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {!isEarned && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Progress towards achievement:</span>
                <span>0/{achievement.criteria_value}</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}