import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface LoadingScreenProps {
  dogName: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: string;
  behaviors: string[];
  onComplete: () => void;
}

export default function LoadingScreen({
  dogName,
  breed,
  gender,
  age,
  behaviors,
  onComplete,
}: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Navigate to results page with query parameters
            const params = new URLSearchParams({
              name: dogName,
              breed,
              gender,
              age,
              behaviors: behaviors.join(','),
            });
            router.push(`/results?${params.toString()}`);
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
      <div className='bg-[#D3F2FF] rounded-2xl p-4 max-w-md relative'>
        <Image
          src='/images/quote.png'
          alt='Quote decoration'
          width={40}
          height={40}
          className='w-10 h-10 absolute top-[-26] left-4'
        />
        <div className='text-left flex flex-col gap-4'>
          <p className='text-[#1E1E1E] font-bold text-2xl text-left'>
            There are no bad dogs — only bad training
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
            <span className='text-sm text-[#16191E] font-medium'>team</span>
          </div>
        </div>
      </div>
    </div>
  );
}
