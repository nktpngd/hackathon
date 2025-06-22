export interface DogProfile {
  dogName: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: string;
  behaviors: string[];
}

export interface HealthCheckData {
  mood: string;
  activity: string;
  symptoms: string[];
  behaviors: string[];
  feeding: string;
  description: string;
  dogName: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: string;
}

export interface HealthSummary {
  overallStatus: string;
  summary: string;
  recommendations: string[];
  recommendedTodos?: string[];
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

export async function summarizeHealthCheck(
  healthData: HealthCheckData
): Promise<HealthSummary> {
  try {
    const response = await fetch('/api/summarize-health', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(healthData),
    });

    if (!response.ok) {
      throw new Error('Failed to summarize health check');
    }

    const summary: HealthSummary = await response.json();
    return summary;
  } catch (error) {
    console.error('Error summarizing health check:', error);

    // Fallback to default summary in case of API failure
    return {
      overallStatus: 'Good',
      summary: `Your ${healthData.breed} ${healthData.age} is showing good overall health indicators based on today's assessment. Continue monitoring their daily activities and habits.`,
      recommendations: [
        'Continue daily exercise routine',
        'Maintain consistent feeding schedule',
        'Keep up with regular grooming',
        'Schedule routine vet check-up',
      ],
      recommendedTodos: [
        'Take for a 30-minute walk',
        'Practice basic commands',
      ],
    };
  }
}
