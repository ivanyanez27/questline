import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: 'fake-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'fake-refresh-token',
    });
  }),

  http.get('*/rest/v1/journeys', () => {
    return HttpResponse.json([
      {
        id: '123',
        title: 'Test Journey',
        description: 'Test Description',
        habit: 'Daily Exercise',
        duration: 30,
        theme: 'fantasy',
        created_at: '2024-01-01T00:00:00Z',
        started_at: '2024-01-01T00:00:00Z',
        current_day: 5,
        streak: 5,
        truth_score: 8,
      },
    ]);
  }),

  http.get('*/rest/v1/check_ins', () => {
    return HttpResponse.json([
      {
        id: '456',
        journey_id: '123',
        day: 1,
        reflection: 'Test reflection',
        truth_rating: 8,
        completed: true,
        created_at: '2024-01-01T00:00:00Z',
      },
    ]);
  }),

  http.get('*/rest/v1/achievements', () => {
    return HttpResponse.json([
      {
        id: '789',
        name: 'First Journey',
        description: 'Complete your first journey',
        criteria_type: 'journey_completed',
        criteria_value: 1,
        points_reward: 100,
      },
    ]);
  }),
];