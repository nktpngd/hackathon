export interface DogProfile {
  name: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: 'puppy' | 'adolescent' | 'adult' | 'senior';
}

const DEFAULT_DOG_PROFILE: DogProfile = {
  name: 'Pawchie',
  breed: 'Golden Retriever',
  gender: 'boy',
  age: 'puppy',
};

export const getDogProfile = (): DogProfile => {
  if (typeof window === 'undefined') {
    return DEFAULT_DOG_PROFILE; // Server-side fallback
  }

  const savedProfile = localStorage.getItem('dogProfile');
  if (savedProfile) {
    try {
      const profile = JSON.parse(savedProfile);
      // Validate the profile has all required fields
      if (profile.name && profile.breed && profile.age) {
        return profile;
      }
    } catch (error) {
      console.error('Error parsing dog profile:', error);
    }
  }

  // Save default profile to localStorage if none exists or is invalid
  localStorage.setItem('dogProfile', JSON.stringify(DEFAULT_DOG_PROFILE));
  return DEFAULT_DOG_PROFILE;
};

export const setDogProfile = (profile: DogProfile): void => {
  if (typeof window === 'undefined') {
    return; // Server-side, can't access localStorage
  }

  localStorage.setItem('dogProfile', JSON.stringify(profile));
};

export const updateDogProfile = (updates: Partial<DogProfile>): DogProfile => {
  const currentProfile = getDogProfile();
  const updatedProfile = { ...currentProfile, ...updates };
  setDogProfile(updatedProfile);
  return updatedProfile;
};
