
import { User } from '@supabase/supabase-js';

export class SimpleUserService {
  static async verifyAge(user: User | null, birthYear: string) {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      const currentYear = new Date().getFullYear();
      const age = currentYear - parseInt(birthYear);
      
      if (age < 21) {
        return { success: false, message: 'You must be 21 or older to access this platform' };
      }

      console.log(`Age verification successful for user: ${user.email}, age: ${age}`);
      return { success: true, age };
    } catch (error) {
      console.error('Age verification error:', error);
      return { success: false, message: 'Invalid birth year provided' };
    }
  }
}
