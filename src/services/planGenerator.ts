export interface DogProfile {
  dogName: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: string;
  behaviors: string[];
}

export interface GeneratedPlan {
  summary: string;
  goal: string;
  tasks: string[];
}

export async function generatePersonalizedPlan(
  dogProfile: DogProfile
): Promise<GeneratedPlan> {
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogProfile),
    });

    if (!response.ok) {
      throw new Error('Failed to generate plan');
    }

    const plan: GeneratedPlan = await response.json();
    return plan;
  } catch (error) {
    console.error('Error generating personalized plan:', error);

    // Fallback to default plan in case of API failure
    return {
      summary: `Your ${dogProfile.breed} ${dogProfile.age} is showing great potential for training. Every dog can benefit from structured training to enhance their natural abilities and strengthen your bond together.`,
      goal: 'Build a strong foundation of obedience and enhance the human-dog bond through positive training methods.',
      tasks: [
        'Daily walks of 45 minutes',
        'Scent games / mental tasks',
        'Recommended course: "Sit, Stay, Come"',
        'Behavioral training sessions',
      ],
    };
  }
}
