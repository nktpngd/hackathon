'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { HealthSummary } from '@/services/planGenerator';
import { getDogProfile } from '@/utils/dogProfile';

interface HealthCheckDisplayData {
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
  const [healthData, setHealthData] = useState<HealthCheckDisplayData | null>(
    null
  );
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(
    null
  );
  const [recommendedTodos, setRecommendedTodos] = useState<string[]>([]);

  useEffect(() => {
    const loadHealthData = () => {
      const dogProfile = getDogProfile();

      // Get health check data from localStorage if available
      const savedHealthData = localStorage.getItem('healthCheckData');
      const savedHealthSummary = localStorage.getItem('healthSummary');

      if (savedHealthData) {
        try {
          const parsedData = JSON.parse(savedHealthData);
          const displayData: HealthCheckDisplayData = {
            date: new Date(parsedData.date)
              .toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              })
              .replace(/\//g, '.'),
            dogName: dogProfile.name,
            breed: dogProfile.breed,
            gender: dogProfile.gender,
            age: dogProfile.age,
            mood: parsedData.mood || 'Normal',
            activity: parsedData.activity || 'As usual',
            symptoms: parsedData.symptoms || ['No symptoms'],
            behaviors: parsedData.behaviors || [],
            feeding: parsedData.feeding || 'Good appetite',
            description: parsedData.description || '',
          };
          setHealthData(displayData);

          // Get health summary from localStorage (should be saved by the loading screen)
          if (savedHealthSummary) {
            try {
              const summary = JSON.parse(savedHealthSummary);
              setHealthSummary(summary);
              // Extract recommended todos from health summary if available
              if (
                summary.recommendedTodos &&
                Array.isArray(summary.recommendedTodos)
              ) {
                setRecommendedTodos(summary.recommendedTodos);
              } else {
                setMockTodos();
              }
            } catch (error) {
              console.error('Error parsing health summary:', error);
              setMockSummary(displayData);
              setMockTodos();
            }
          } else {
            setMockSummary(displayData);
            setMockTodos();
          }
        } catch (error) {
          console.error('Error parsing health check data:', error);
          // Fall back to mock data if parsing fails
          setMockData();
        }
      } else {
        // Fall back to mock data if no saved data
        setMockData();
      }
    };

    loadHealthData();
  }, []);

  const setMockTodos = () => {
    const mockTodos = ['Take for a 30-minute walk', 'Practice basic commands'];
    setRecommendedTodos(mockTodos);
  };

  const setMockSummary = (displayData: HealthCheckDisplayData) => {
    const mockSummary = {
      overallStatus: 'Good',
      summary: `Your ${displayData.breed} ${displayData.age} is showing good overall health indicators based on today's assessment.`,
      recommendations: [
        'Continue daily exercise routine',
        'Maintain consistent feeding schedule',
        'Keep up with regular grooming',
        'Schedule routine vet check-up',
      ],
    };
    setHealthSummary(mockSummary);
  };

  const setMockData = () => {
    const dogProfile = getDogProfile();

    const mockData: HealthCheckDisplayData = {
      date: '21.06.25',
      dogName: dogProfile.name,
      breed: dogProfile.breed,
      gender: dogProfile.gender,
      age: dogProfile.age,
      mood: 'Happy',
      activity: 'Playful',
      symptoms: ['No symptoms'],
      behaviors: [],
      feeding: 'Good appetite',
      description: 'Had a great day at the park',
    };
    setHealthData(mockData);

    // Set mock health summary
    setHealthSummary({
      overallStatus: 'Excellent',
      summary: `Your ${dogProfile.breed} ${dogProfile.age} is showing excellent health indicators today. ${dogProfile.name} appears to be in great spirits with no concerning symptoms and is maintaining good eating habits.`,
      recommendations: [
        'Continue daily exercise routine',
        'Maintain consistent feeding schedule',
        'Keep up with regular grooming',
        'Schedule routine vet check-up',
      ],
    });

    setMockTodos();
  };

  const getOverallHealthStatus = () => {
    return healthSummary?.overallStatus || 'Good';
  };

  const getHealthSummary = () => {
    return healthSummary?.summary || '';
  };

  const getRecommendations = () => {
    return healthSummary?.recommendations || [];
  };

  const handleAddToMyDailyPlan = () => {
    // Get existing tasks from localStorage
    const existingTasksJson = localStorage.getItem('generatedTasks');
    let existingTasks: string[] = [];

    if (existingTasksJson) {
      try {
        existingTasks = JSON.parse(existingTasksJson);
      } catch (error) {
        console.error('Error parsing existing tasks:', error);
      }
    }

    // Add recommended todos to existing tasks (avoid duplicates)
    const newTasks = [...existingTasks];
    recommendedTodos.forEach(todo => {
      if (!newTasks.includes(todo)) {
        newTasks.push(todo);
      }
    });

    // Save updated tasks back to localStorage
    localStorage.setItem('generatedTasks', JSON.stringify(newTasks));

    // Navigate back to home page to show the updated tasks
    router.push('/home');
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
                {healthData.dogName} - {getOverallHealthStatus()}
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

          {/* Recommended Tasks Section */}
          <div className='space-y-4 bg-[#E3FBEA] p-4 rounded-2xl'>
            <h3 className='text-2xl font-bold text-[#383C44]'>
              Recommended tasks to support {healthData.dogName}
            </h3>
            <p className='text-[#383C44] text-base'>
              Based on today&apos;s health check, we&apos;ve selected a few
              simple actions that can help improve your dog&apos;s well-being.
              Add them to your to-do list with one tap.
            </p>

            <div className='space-y-3'>
              {recommendedTodos.map((todo, index) => (
                <div
                  key={index}
                  className='bg-white rounded-2xl p-4 flex items-center space-x-3'
                >
                  <span className='flex-1 text-gray-800'>{todo}</span>
                  <div className='w-6 h-6 rounded-full  flex items-center justify-center'>
                    <Image src='/info.svg' alt='info' width={16} height={16} />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddToMyDailyPlan}
              className='w-full bg-[#BFEDCC] hover:bg-green-600 text-[#61C27D] font-medium py-4 px-6 rounded-2xl transition-colors flex items-center justify-center space-x-2'
            >
              <span>+ Add to my daily plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
