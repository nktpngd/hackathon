import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  summarizeHealthCheck,
  HealthCheckData,
} from '@/services/planGenerator';
import { getDogProfile } from '@/utils/dogProfile';

interface HealthCheckLoadingScreenWithAPIProps {
  healthCheckData: {
    mood: string;
    activity: string;
    symptoms: string[];
    behaviors: string[];
    feeding: string;
    description: string;
  };
}

export default function HealthCheckLoadingScreenWithAPI({
  healthCheckData,
}: HealthCheckLoadingScreenWithAPIProps) {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const makeAPICallAndNavigate = async () => {
      try {
        // Start with initial progress
        setProgress(10);

        // Get the actual dog profile data from localStorage
        const dogProfile = getDogProfile();

        // Prepare data for API call using actual dog data
        const apiData: HealthCheckData = {
          dogName: dogProfile.name,
          breed: dogProfile.breed,
          gender: dogProfile.gender,
          age: dogProfile.age,
          mood: healthCheckData.mood,
          activity: healthCheckData.activity,
          symptoms: healthCheckData.symptoms,
          behaviors: healthCheckData.behaviors,
          feeding: healthCheckData.feeding,
          description: healthCheckData.description,
        };

        // Make the API call
        const summary = await summarizeHealthCheck(apiData);

        setProgress(90);

        // Save the summary to localStorage
        localStorage.setItem('healthSummary', JSON.stringify(summary));

        // Complete the progress
        setProgress(100);
        setIsGenerating(false);

        // Navigate after a brief pause
        setTimeout(() => {
          router.replace('/health-check/summary');
        }, 1000);
      } catch (error) {
        console.error('Error getting health summary:', error);

        // Get dog profile for fallback summary too
        const dogProfile = getDogProfile();

        // Save fallback summary
        const fallbackSummary = {
          overallStatus: 'Good',
          summary: `Your ${dogProfile.breed} ${dogProfile.age} is showing good overall health indicators based on today&apos;s assessment.`,
          recommendations: [
            'Continue daily exercise routine',
            'Maintain consistent feeding schedule',
            'Keep up with regular grooming',
            'Schedule routine vet check-up',
          ],
        };
        localStorage.setItem('healthSummary', JSON.stringify(fallbackSummary));

        // Even on error, complete the flow with fallback
        setProgress(100);
        setIsGenerating(false);

        setTimeout(() => {
          router.replace('/health-check/summary');
        }, 1000);
      }
    };

    makeAPICallAndNavigate();
  }, [healthCheckData, router]);

  // Simulate progress animation while API is loading
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        // Don't go beyond 80% while still generating
        if (prev >= 80) return prev;
        return prev + 5;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Header */}
      <header className='flex items-center justify-center py-6'>
        <div className='flex items-center space-x-2'>
          <Image
            src='/logo.svg'
            alt='Paw Champ'
            width={137}
            height={32}
            className='w-[137px] h-[32px]'
          />
        </div>
      </header>

      {/* Main Content */}
      <div className='flex-1 flex mt-4 justify-center'>
        <div className='text-center space-y-6 px-6 max-w-md mx-auto'>
          {/* Main heading */}
          <h1 className='text-[28px] font-bold text-[#383C44] leading-tight text-center'>
            Great job — today&apos;s checkup is saved!
          </h1>

          {/* Subheading */}
          <p className='text-lg text-gray-600 text-center'>
            Analyzing your pet's health data and generating personalized
            recommendations.
          </p>

          {/* Circular Progress */}
          <div className='relative w-[176px] h-[176px] mx-auto mb-4'>
            <svg
              className='w-[176px] h-[176px] transform -rotate-90'
              viewBox='0 0 100 100'
            >
              {/* Background circle */}
              <circle
                cx='50'
                cy='50'
                r='40'
                stroke='#E5E7EB'
                strokeWidth='8'
                fill='none'
              />
              {/* Progress circle */}
              <circle
                cx='50'
                cy='50'
                r='40'
                stroke='#3B82F6'
                strokeWidth='8'
                fill='none'
                strokeLinecap='round'
                strokeDasharray='251.2'
                strokeDashoffset={251.2 - (progress / 100) * 251.2}
                className='transition-all duration-300 ease-out'
              />
            </svg>

            {/* Progress content */}
            <div className='absolute inset-0 flex flex-col items-center justify-center'>
              <p className='text-gray-400 text-sm mb-2'>
                {isGenerating ? 'Analyzing' : 'Complete'}
              </p>
              <p className='text-4xl font-bold text-gray-800'>{progress}%</p>
            </div>
          </div>

          {/* Status text */}
          <p className='text-lg text-gray-600 mb-8'>
            {progress < 90
              ? 'Saving your check-in...'
              : 'Creating personalized health insights...'}
          </p>

          {/* Quote card */}
          <div className='bg-[#D3F2FF] rounded-2xl p-6 max-w-md mx-auto relative'>
            <Image
              src='/images/quote.png'
              alt='Quote decoration'
              width={40}
              height={40}
              className='w-10 h-10 absolute top-[-20px] left-4'
            />
            <div className='text-left flex flex-col gap-4'>
              <p className='text-[#1E1E1E] font-bold text-2xl'>
                Consistency makes all the difference — you&apos;re doing
                amazing!
              </p>
              <div className='h-[1px] bg-[#BCE6F8] w-full' />
              <div className='flex items-center gap-2 justify-start'>
                <Image
                  src='/logo.svg'
                  alt='Paw Champ'
                  width={91}
                  height={22}
                  className='w-[91px] h-[22px]'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
