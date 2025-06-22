'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface HealthCheckData {
  date: string;
  dogName: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: string;
  mood: string;
  activity: string;
  symptoms: string[];
  behaviors: string[];
  feeding: string;
  description: string;
}

export default function HealthCheckSummaryPage() {
  const router = useRouter();
  const [healthData, setHealthData] = useState<HealthCheckData | null>(null);

  useEffect(() => {
    // In a real app, you'd get this data from props, URL params, or global state
    // For now, using mock data based on the health check form
    const mockData: HealthCheckData = {
      date: '21.06.25',
      dogName: 'Buddy', // This would come from user's dog profile
      breed: 'Golden Retriever', // This would come from user's dog profile
      gender: 'boy', // This would come from user's dog profile
      age: 'puppy', // This would come from user's dog profile
      mood: 'Happy',
      activity: 'Playful',
      symptoms: ['No symptoms'],
      behaviors: [],
      feeding: 'Good appetite',
      description: 'Had a great day at the park',
    };
    setHealthData(mockData);
  }, []);

  const getOverallHealthStatus = () => {
    if (!healthData) return 'Analyzing...';

    const hasSymptoms =
      healthData.symptoms.length > 0 &&
      !healthData.symptoms.includes('No symptoms');
    const hasBehaviorIssues = healthData.behaviors.length > 0;
    const hasGoodFeeding =
      healthData.feeding === 'Good appetite' ||
      healthData.feeding === 'Glutton';
    const hasPositiveMood =
      healthData.mood === 'Happy' || healthData.mood === 'Normal';

    if (
      !hasSymptoms &&
      !hasBehaviorIssues &&
      hasGoodFeeding &&
      hasPositiveMood
    ) {
      return 'Excellent';
    } else if (hasSymptoms || hasBehaviorIssues) {
      return 'Needs attention';
    } else {
      return 'Good';
    }
  };

  const getHealthSummary = () => {
    if (!healthData) return '';

    const status = getOverallHealthStatus();
    const dogInfo = `${healthData.breed} ${healthData.age}`;

    if (status === 'Excellent') {
      return `Your ${dogInfo} is showing excellent health indicators today. ${healthData.dogName} appears to be in great spirits with no concerning symptoms and is maintaining good eating habits.`;
    } else if (status === 'Needs attention') {
      const concerns = [];
      if (
        healthData.symptoms.length > 0 &&
        !healthData.symptoms.includes('No symptoms')
      ) {
        concerns.push('showing some symptoms that should be monitored');
      }
      if (healthData.behaviors.length > 0) {
        concerns.push('exhibiting behavioral changes');
      }
      return `Your ${dogInfo} is ${concerns.join(' and ')}. While these may be temporary, it's important to keep tracking these patterns and consult with a veterinarian if they persist.`;
    } else {
      return `Your ${dogInfo} is showing good overall health indicators. Continue monitoring ${healthData.dogName}'s daily activities and habits to maintain this positive trend.`;
    }
  };

  const getRecommendations = () => {
    if (!healthData) return [];

    const recommendations = [];

    // Based on symptoms
    if (
      healthData.symptoms.includes('Coughing') ||
      healthData.symptoms.includes('Sneezing')
    ) {
      recommendations.push(
        'Monitor respiratory symptoms and ensure good air quality'
      );
    }
    if (
      healthData.symptoms.includes('Vomiting') ||
      healthData.symptoms.includes('Diarrhea')
    ) {
      recommendations.push(
        'Maintain hydration and consider bland diet if symptoms persist'
      );
    }
    if (healthData.symptoms.includes('Excessive thirst')) {
      recommendations.push(
        'Ensure fresh water availability and monitor water intake'
      );
    }

    // Based on behaviors
    if (healthData.behaviors.includes('Aggression')) {
      recommendations.push(
        'Practice calm training exercises and avoid stressful situations'
      );
    }
    if (
      healthData.behaviors.includes('Pacing') ||
      healthData.behaviors.includes('Trembling')
    ) {
      recommendations.push(
        'Create a calm environment and consider anxiety-reducing activities'
      );
    }

    // Based on feeding
    if (
      healthData.feeding === 'No appetite' ||
      healthData.feeding === 'Eats nothing'
    ) {
      recommendations.push(
        "Try offering small, appetizing meals and consult vet if appetite doesn't improve"
      );
    }

    // Default recommendations if all is well
    if (recommendations.length === 0) {
      recommendations.push('Continue daily exercise routine');
      recommendations.push('Maintain consistent feeding schedule');
      recommendations.push('Keep up with regular grooming');
      recommendations.push('Schedule routine vet check-up');
    }

    return recommendations;
  };

  // Get dog image based on age (reusing from ResultsScreen)
  const getDogImage = (age: string) => {
    switch (age) {
      case 'puppy':
        return '/images/puppy.png';
      case 'adolescent':
        return '/images/adolescent.png';
      case 'adult':
        return '/images/adult.png';
      case 'senior':
        return '/images/senior.png';
      default:
        return '/images/adult.png';
    }
  };

  if (!healthData) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-2 text-gray-600'>Loading health summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Header */}
      <header className='flex items-center justify-between p-6'>
        <div className='flex items-center space-x-2'>
          <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
            {healthData.date}
          </span>
        </div>
        <button
          onClick={() => router.push('/home')}
          className='w-6 h-6 flex items-center justify-center'
        >
          <Image src='/icons/cross.svg' alt='close' width={24} height={24} />
        </button>
      </header>

      {/* Main Content */}
      <div className='flex-1 px-6 pb-6'>
        <div className='space-y-6'>
          {/* Title */}
          <h1 className='text-[28px] font-bold text-[#383C44]'>
            Overall health
          </h1>

          {/* Dog Info Card */}
          <div className='bg-[#F3F3F3] rounded-2xl p-4 flex items-center space-x-4'>
            <div className='w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0'>
              <Image
                src={getDogImage(healthData.age)}
                alt={healthData.dogName}
                width={80}
                height={80}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='flex-1'>
              <h2 className='font-bold text-base text-[#383C44] mb-1'>
                {healthData.dogName} - [{getOverallHealthStatus()}]
              </h2>
              <div className='flex flex-wrap gap-2 text-sm'>
                <span className='text-[#1998CD] font-medium bg-[#E1F2F9] py-1 px-2 rounded-lg'>
                  {healthData.breed}
                </span>
                {healthData.gender && (
                  <span className='text-[#1998CD] bg-[#E1F2F9] font-medium rounded-lg py-1 px-2'>
                    {healthData.gender === 'boy' ? 'Boy' : 'Girl'}
                  </span>
                )}
              </div>
              <p className='text-[#1998CD] bg-[#E1F2F9] w-fit text-sm font-medium mt-1 rounded-lg py-1 px-2'>
                Young (1-3 years)
              </p>
            </div>
          </div>

          {/* Summary Section */}
          <div className='space-y-3'>
            <h3 className='text-2xl font-bold text-[#383C44]'>Summary</h3>
            <p className='text-gray-600 leading-relaxed'>
              {getHealthSummary()}
            </p>
          </div>

          {/* Recommendations Section */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold text-[#383C44]'>
              Recommendations
            </h3>
            <div className='bg-[#FFEDB4] rounded-2xl p-4'>
              <div className='space-y-3'>
                {getRecommendations().map((recommendation, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <div className='w-6 h-6 rounded-full bg-[#B88933] text-white flex items-center justify-center flex-shrink-0 text-sm font-medium mt-0.5'>
                      {index + 1}
                    </div>
                    <p className='text-[#B88933] leading-relaxed'>
                      {recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
