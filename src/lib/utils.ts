import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addDays, format, isAfter, isBefore, isToday } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function calculateJourneyProgress(
  startDate: string,
  currentDay: number,
  totalDays: number
): number {
  if (!startDate) return 0;
  return Math.min(Math.round((currentDay / totalDays) * 100), 100);
}

export function isJourneyActive(
  startDate: string | null,
  endDate: string | null
): boolean {
  if (!startDate) return false;
  if (endDate) return false;
  
  const start = new Date(startDate);
  const now = new Date();
  
  return isAfter(now, start);
}

export function canCheckInToday(
  startDate: string | null,
  currentDay: number,
  lastCheckIn: string | null
): boolean {
  if (!startDate) return false;
  
  const start = new Date(startDate);
  const today = new Date();
  const dayToCheck = addDays(start, currentDay);
  
  if (lastCheckIn && isToday(new Date(lastCheckIn))) {
    return false;
  }
  
  return isToday(dayToCheck) || isBefore(dayToCheck, today);
}

export function generateJourneyNarrative(
  theme: string,
  currentDay: number,
  totalDays: number
): string {
  const progress = Math.floor((currentDay / totalDays) * 100);
  
  const narratives = {
    fantasy: [
      "Your journey begins in a mystical forest. The path ahead is shrouded in mist, but you feel a calling to move forward.",
      "You've discovered an ancient map leading to a forgotten temple. Your daily practice is like a torch illuminating the way.",
      "The village elder has recognized your dedication. Your quest gains momentum as you master new skills.",
      "Halfway through your quest, you've earned the respect of the woodland creatures. They guide you through shortcuts unknown to common travelers.",
      "The enchanted forest opens to reveal vistas beyond imagination. Your journey's end is in sight, but the greatest challenges await.",
      "You stand victorious! The habit you've mastered has transformed you into a legendary hero of your own tale."
    ],
    "sci-fi": [
      "System initialization complete. Your neural enhancement program has begun. Each practice strengthens your connection.",
      "Upgrades detected in cognitive systems. Your consistent efforts are optimizing performance beyond expected parameters.",
      "You've reached Level 2 clearance. Advanced techniques are now available as your neural pathways strengthen.",
      "The AI core recognizes your dedication. You're halfway to full system integration with your new habit protocol.",
      "Your consistency has unlocked hidden subroutines. The full potential of your habit enhancement is becoming clear.",
      "Mission accomplished! Your habit is now fully integrated into your operating system. You've evolved beyond your former limitations."
    ],
    adventure: [
      "Your backpack is packed and your boots are laced. The journey of a thousand miles begins with this single step.",
      "You've crossed the first mountain range. The view from here shows how far you've come already.",
      "Local villagers speak of your determination. Your reputation as an adventurer grows with each consistent day.",
      "The halfway mark! You've adapted to the challenges of the trail, moving with newfound confidence.",
      "Seasoned travelers nod with respect as you pass. Your journey is inspiring others to begin their own.",
      "Summit reached! Standing atop the peak, you can see both where you began and the endless horizons now open to you."
    ],
    mystery: [
      "A mysterious letter has set you on this path. Each practice uncovers a new clue to the greater puzzle.",
      "Strange symbols begin to make sense. Your consistent investigation is yielding results.",
      "The plot thickens! Your dedication has revealed connections previously hidden from view.",
      "Halfway through the investigation, key witnesses are coming forward. Your reputation for thoroughness precedes you.",
      "The final pieces of the puzzle are within reach. Your persistence has unraveled most of the mystery.",
      "Case closed! Your methodical approach has solved what others thought unsolvable. This habit has transformed you."
    ]
  };

  const themeNarratives = narratives[theme as keyof typeof narratives] || narratives.adventure;
  
  if (progress >= 100) return themeNarratives[5];
  if (progress >= 80) return themeNarratives[4];
  if (progress >= 50) return themeNarratives[3];
  if (progress >= 30) return themeNarratives[2];
  if (progress >= 10) return themeNarratives[1];
  return themeNarratives[0];
}

export function generateReflectionPrompt(day: number, theme: string): string {
  const reflectionPrompts = [
    "How has this practice affected your energy levels today?",
    "What obstacles did you overcome to maintain your habit today?",
    "How does this habit connect to your larger goals?",
    "What would make tomorrow's practice even better?",
    "How has your perspective changed since beginning this journey?",
    "What unexpected benefits have you noticed from this habit?",
    "How does this habit make you feel about yourself?",
    "What would you tell someone just starting this same habit?",
    "How has this practice affected your relationships with others?",
    "What have you learned about yourself through this practice?"
  ];
  
  // Return a prompt based on the day number (cycling through the list)
  return reflectionPrompts[day % reflectionPrompts.length];
}