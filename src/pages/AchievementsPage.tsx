import React, { useEffect, useState } from 'react';
import { Trophy, Award, Star, Target } from 'lucide-react';
import { Achievement, UserAchievement, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { AchievementCard } from '../components/AchievementCard';

export function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch all achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .order('points_reward', { ascending: false });

        if (achievementsError) throw achievementsError;

        // Fetch user's earned achievements
        const { data: userAchievementsData, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select(`
            *,
            achievement:achievements(*)
          `)
          .eq('user_id', user.id);

        if (userAchievementsError) throw userAchievementsError;

        setAchievements(achievementsData || []);
        setUserAchievements(userAchievementsData || []);

        // Calculate total points
        const points = userAchievementsData?.reduce((total, ua) => {
          return total + (ua.achievement?.points_reward || 0);
        }, 0) || 0;
        setTotalPoints(points);

      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  const stats = [
    {
      icon: <Trophy className="w-6 h-6 text-purple-600" />,
      label: 'Total Points',
      value: totalPoints,
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      label: 'Achievements Earned',
      value: userAchievements.length,
    },
    {
      icon: <Star className="w-6 h-6 text-blue-600" />,
      label: 'Available Achievements',
      value: achievements.length,
    },
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      label: 'Completion Rate',
      value: `${Math.round((userAchievements.length / (achievements.length || 1)) * 100)}%`,
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Achievements</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Track your progress and earn rewards as you build better habits through your journeys.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm p-6 text-center"
          >
            <div className="flex justify-center mb-4">{stat.icon}</div>
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        {/* Earned Achievements */}
        {userAchievements.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Earned Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userAchievements.map((ua) => (
                <AchievementCard
                  key={ua.id}
                  achievement={ua.achievement as Achievement}
                  isEarned={true}
                  earnedAt={ua.earned_at}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Achievements */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Available Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements
              .filter((a) => !userAchievements.some((ua) => ua.achievement_id === a.id))
              .map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  isEarned={false}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}