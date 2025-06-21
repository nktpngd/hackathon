import { useState, useEffect } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
  dogName: string;
  onComplete: () => void;
}

export default function LoadingScreen({
  dogName,
  onComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className='text-center space-y-8'>
      {/* Circular Progress */}
      <div className='relative w-48 h-48 mx-auto'>
        <svg className='w-48 h-48 transform -rotate-90' viewBox='0 0 100 100'>
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
          <p className='text-gray-400 text-sm mb-2'>Analyzing</p>
          <p className='text-4xl font-bold text-gray-800'>{progress}%</p>
        </div>
      </div>

      {/* Status text */}
      <div className='space-y-2'>
        <h2 className='text-xl font-semibold text-gray-800'>
          Creating {dogName}&apos;s personalized training plan...
        </h2>
      </div>

      {/* Quote card */}
      <div className='bg-blue-50 rounded-2xl p-6 mx-auto max-w-md'>
        <div className='flex items-start space-x-3'>
          <div className='text-blue-400 text-2xl leading-none'>&ldquo;</div>
          <div className='flex-1'>
            <p className='text-gray-700 font-medium mb-3'>
              There are no bad dogs — only bad training
            </p>
            <div className='flex items-center space-x-2'>
              <Image
                src='/logo.svg'
                alt='Paw Champ'
                width={91}
                height={22}
                className='w-[91px] h-[22px]'
              />
              <span className='text-sm text-gray-600 font-medium'>team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
