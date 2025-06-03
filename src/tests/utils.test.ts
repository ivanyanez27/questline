import { describe, it, expect } from 'vitest';
import {
  formatDate,
  calculateJourneyProgress,
  isJourneyActive,
  canCheckInToday,
  generateJourneyNarrative,
  generateReflectionPrompt,
  cn,
} from '../lib/utils';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = '2024-01-01T00:00:00Z';
      expect(formatDate(date)).toBe('Jan 1, 2024');
    });
  });

  describe('calculateJourneyProgress', () => {
    it('calculates progress correctly', () => {
      expect(calculateJourneyProgress('2024-01-01T00:00:00Z', 5, 10)).toBe(50);
    });

    it('returns 0 when no start date', () => {
      expect(calculateJourneyProgress('', 5, 10)).toBe(0);
    });

    it('caps progress at 100%', () => {
      expect(calculateJourneyProgress('2024-01-01T00:00:00Z', 15, 10)).toBe(100);
    });
  });

  describe('isJourneyActive', () => {
    it('returns false when no start date', () => {
      expect(isJourneyActive(null, null)).toBe(false);
    });

    it('returns false when journey is completed', () => {
      expect(isJourneyActive('2024-01-01T00:00:00Z', '2024-01-31T00:00:00Z')).toBe(false);
    });

    it('returns true for active journey', () => {
      expect(isJourneyActive('2024-01-01T00:00:00Z', null)).toBe(true);
    });
  });

  describe('canCheckInToday', () => {
    const today = new Date().toISOString();
    
    it('returns false when no start date', () => {
      expect(canCheckInToday(null, 1, null)).toBe(false);
    });

    it('returns false when already checked in today', () => {
      expect(canCheckInToday(today, 1, today)).toBe(false);
    });

    it('returns true when can check in', () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      expect(canCheckInToday(yesterday, 1, yesterday)).toBe(true);
    });
  });

  describe('generateJourneyNarrative', () => {
    it('generates appropriate narrative based on progress', () => {
      const narrative = generateJourneyNarrative('fantasy', 5, 30);
      expect(narrative).toBeTruthy();
      expect(typeof narrative).toBe('string');
    });

    it('handles different themes', () => {
      const themes = ['fantasy', 'sci-fi', 'adventure', 'mystery'];
      themes.forEach(theme => {
        const narrative = generateJourneyNarrative(theme, 5, 30);
        expect(narrative).toBeTruthy();
        expect(typeof narrative).toBe('string');
      });
    });
  });

  describe('generateReflectionPrompt', () => {
    it('generates different prompts for different days', () => {
      const prompt1 = generateReflectionPrompt(1, 'fantasy');
      const prompt2 = generateReflectionPrompt(2, 'fantasy');
      expect(prompt1).not.toBe(prompt2);
    });

    it('cycles through prompts', () => {
      const prompt1 = generateReflectionPrompt(1, 'fantasy');
      const prompt11 = generateReflectionPrompt(11, 'fantasy');
      expect(prompt1).toBe(prompt11);
    });
  });

  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('p-4', { 'bg-red-500': true, 'bg-blue-500': false })).toBe('p-4 bg-red-500');
    });

    it('handles conditional classes', () => {
      const result = cn('base', { conditional: true, 'not-included': false });
      expect(result).toBe('base conditional');
    });
  });
});