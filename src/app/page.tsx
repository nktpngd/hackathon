'use client';

import { useState } from 'react';
import Image from 'next/image';
import AgeSelection from '../components/AgeSelection';
import NameInput from '../components/NameInput';
import BreedSelection from '../components/BreedSelection';
import GenderSelection from '../components/GenderSelection';
import BehaviorSelection from '../components/BehaviorSelection';
import LoadingScreen from '../components/LoadingScreen';

interface QuizData {
  age: string;
  name: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  behaviors: string[];
}

const initialQuizData: QuizData = {
  age: '',
  name: '',
  breed: '',
  gender: '',
  behaviors: [],
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>(initialQuizData);
  const [customBreed, setCustomBreed] = useState('');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      setCurrentStep(6); // Skip step 5, go directly to loading screen
    } else {
      // Submit quiz data
      console.log('Quiz completed:', quizData);
    }
  };

  const updateQuizData = (field: keyof QuizData, value: any) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const toggleBehavior = (behavior: string) => {
    setQuizData(prev => ({
      ...prev,
      behaviors: prev.behaviors.includes(behavior)
        ? prev.behaviors.filter(b => b !== behavior)
        : [...prev.behaviors, behavior],
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return quizData.age !== '';
      case 1:
        return quizData.name.trim() !== '';
      case 2:
        return quizData.breed !== '' || customBreed.trim() !== '';
      case 3:
        return quizData.gender !== '';
      case 4:
      case 6:
        return true; // Behaviors are optional, loading screen doesn't need validation
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AgeSelection
            selectedAge={quizData.age}
            onAgeSelect={age => updateQuizData('age', age)}
          />
        );

      case 1:
        return (
          <NameInput
            name={quizData.name}
            onNameChange={name => updateQuizData('name', name)}
          />
        );

      case 2:
        return (
          <BreedSelection
            selectedBreed={quizData.breed}
            customBreed={customBreed}
            onBreedSelect={breed => updateQuizData('breed', breed)}
            onCustomBreedChange={setCustomBreed}
          />
        );

      case 3:
        return (
          <GenderSelection
            selectedGender={quizData.gender}
            onGenderSelect={gender => updateQuizData('gender', gender)}
          />
        );

      case 4:
        return (
          <BehaviorSelection
            selectedBehaviors={quizData.behaviors}
            onBehaviorToggle={toggleBehavior}
          />
        );

      case 6:
        return (
          <LoadingScreen
            dogName={quizData.name}
            onComplete={() => {
              // Submit quiz data
              console.log('Quiz completed:', quizData);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className='min-h-screen bg-white flex flex-col'
      suppressHydrationWarning
    >
      {/* Header */}
      <header className='flex items-center justify-center py-6 border-b border-gray-200'>
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

      {/* Progress Bar */}
      <div className='w-full bg-gray-200 h-1'>
        <div
          className='bg-[#FF574C] h-1 transition-all duration-300'
          style={{
            width: `${((currentStep >= 6 ? 6 : currentStep + 1) / 6) * 100}%`,
          }}
        />
      </div>

      {/* Main Content - flex-1 to take remaining space */}
      <main className='flex-1 flex flex-col items-center px-4 py-6'>
        <div className='w-full max-w-lg'>{renderStep()}</div>
      </main>

      {/* Fixed Bottom Section with Navigation */}
      {currentStep < 6 && (
        <div className='bg-white px-6 py-4'>
          {/* Main Navigation Button */}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`w-full py-4 px-8 rounded-2xl font-medium transition-all bg-gradient-to-r from-[#FF765A] to-[#FF4040] text-white ${
              canProceed()
                ? 'hover:opacity-90 opacity-100'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            {currentStep === 4 ? 'Let’s Start!' : 'Next step'}
          </button>
        </div>
      )}
    </div>
  );
}
