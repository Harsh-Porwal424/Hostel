export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Preference {
  userId: string;
  hometown: string;
  hobbies: string[];
  mealType: 'Vegetarian' | 'Non-Vegetarian';
}

export interface Match {
  userId: string;
  name: string;
  matchPercentage: number;
  preferences: Preference;
}