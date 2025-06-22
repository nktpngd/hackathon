import Image from 'next/image';
import { useState, useEffect, useMemo, useRef } from 'react';
import {
  generatePersonalizedPlan,
  type GeneratedPlan,
} from '../services/planGenerator';
import { setDogProfile } from '@/utils/dogProfile';

interface ResultsScreenProps {
  dogName: string;
  breed: string;
  gender: 'boy' | 'girl' | '';
  age: string;
  behaviors: string[];
  onStartPlan?: () => void;
}

export default function ResultsScreen({
  dogName,
  breed,
  gender,
  age,
  behaviors,
  onStartPlan,
}: ResultsScreenProps) {
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Memoize behaviors array to prevent unnecessary re-renders
  const stableBehaviors = useMemo(() => behaviors, [behaviors.join(',')]);

  // Save dog profile data when component mounts
  useEffect(() => {
    // Save the user-entered dog data to the shared dog profile
    setDogProfile({
      name: dogName,
      breed,
      gender,
      age: age as 'puppy' | 'adolescent' | 'adult' | 'senior',
    });
  }, [dogName, breed, gender, age]);

  // Get age display text
  const getAgeDisplay = (age: string) => {
    switch (age) {
      case 'puppy':
        return 'Young (1-3 years)';
      case 'adolescent':
        return 'Adolescent (3-6 years)';
      case 'adult':
        return 'Adult (6-8 years)';
      case 'senior':
        return 'Senior (8+ years)';
      default:
        return age;
    }
  };

  // Load personalized plan on component mount
  useEffect(() => {
    // Prevent multiple calls if already loaded
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    // Check if we have a pre-generated plan from the loading screen
    const savedPlan = localStorage.getItem('generatedPlan');

    if (savedPlan) {
      try {
        const plan = JSON.parse(savedPlan);
        setGeneratedPlan(plan);
        setIsLoading(false);
      } catch (error) {
        console.error('Error parsing saved plan:', error);
        // If parsing fails, fall back to generating a new plan
        loadPlanFromAPI();
      }
    } else {
      // If no saved plan, generate a new one (fallback)
      loadPlanFromAPI();
    }

    async function loadPlanFromAPI() {
      setIsLoading(true);
      try {
        const plan = await generatePersonalizedPlan({
          dogName,
          breed,
          gender,
          age,
          behaviors: stableBehaviors,
        });
        setGeneratedPlan(plan);

        // Save the generated tasks to localStorage for use in HomeScreen
        const tasks = plan?.tasks || [
          'Daily walks of 45 minutes',
          'Scent games / mental tasks',
          'Recommended course: "Sit, Stay, Come"',
          'Behavioral training sessions',
        ];
        localStorage.setItem('generatedTasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to load personalized plan:', error);
        // Fallback plan will be handled by the service
        hasLoadedRef.current = false; // Reset on error to allow retry

        // Save fallback tasks to localStorage
        const fallbackTasks = [
          'Daily walks of 45 minutes',
          'Scent games / mental tasks',
          'Recommended course: "Sit, Stay, Come"',
          'Behavioral training sessions',
        ];
        localStorage.setItem('generatedTasks', JSON.stringify(fallbackTasks));
      } finally {
        setIsLoading(false);
      }
    }
  }, [dogName, breed, gender, age, stableBehaviors]);

  // Get dog image based on age
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

  // Generate summary from API or fallback
  const generateSummary = () => {
    if (generatedPlan?.summary) {
      return generatedPlan.summary;
    }

    // Fallback logic
    if (behaviors.includes('aggression')) {
      return `Your ${breed} ${age} is exhibiting early signs of aggression towards people or other animals. While puppies can sometimes display challenging behaviors as they adjust to new environments, it's important to address aggression early for proper social development and safety`;
    }
    if (behaviors.includes('barking')) {
      return `Your ${breed} ${age} is showing excessive barking behavior. This is common and can be effectively managed through consistent training and addressing the underlying causes of the barking.`;
    }
    if (behaviors.includes('destructive')) {
      return `Your ${breed} ${age} is exhibiting destructive behaviors. This often stems from boredom, anxiety, or excess energy and can be redirected through proper training and mental stimulation.`;
    }
    if (behaviors.includes('jump')) {
      return `Your ${breed} ${age} is jumping on people, which is a common behavior that can be corrected through consistent training and positive reinforcement techniques.`;
    }
    if (behaviors.includes('leash')) {
      return `Your ${breed} ${age} is having difficulty with leash walking. This is very trainable with patience and the right techniques to make walks enjoyable for both of you.`;
    }
    if (behaviors.includes('separation')) {
      return `Your ${breed} ${age} is experiencing separation anxiety. This is a common issue that can be addressed through gradual training and building confidence when alone.`;
    }
    if (behaviors.includes('soiling')) {
      return `Your ${breed} ${age} is having house training challenges. With consistent routine and positive reinforcement, house training can be successfully achieved.`;
    }

    return `Your ${breed} ${age} is showing great potential for training. Every dog can benefit from structured training to enhance their natural abilities and strengthen your bond together.`;
  };

  // Generate goal from API or fallback
  const generateGoal = () => {
    if (generatedPlan?.goal) {
      return generatedPlan.goal;
    }

    // Fallback logic
    if (behaviors.includes('aggression')) {
      return 'Promote positive socialization experiences and reduce aggressive behaviors through consistent training and early intervention.';
    }
    if (behaviors.includes('barking')) {
      return 'Reduce excessive barking and teach appropriate communication through positive reinforcement and environmental management.';
    }
    if (behaviors.includes('destructive')) {
      return 'Redirect destructive energy into positive activities and provide appropriate outlets for natural behaviors.';
    }
    if (behaviors.includes('jump')) {
      return 'Teach proper greeting behaviors and impulse control through consistent training and positive reinforcement.';
    }
    if (behaviors.includes('leash')) {
      return 'Develop loose leash walking skills and create enjoyable walking experiences for both dog and owner.';
    }
    if (behaviors.includes('separation')) {
      return 'Build confidence and independence while reducing anxiety when left alone through gradual training.';
    }
    if (behaviors.includes('soiling')) {
      return 'Establish reliable house training habits through consistent routine and positive reinforcement.';
    }

    return 'Build a strong foundation of obedience and enhance the human-dog bond through positive training methods.';
  };

  return (
    <div className='bg-[#FF6B5A] bg-[url("/images/background.png")] bg-cover bg-center bg-no-repeat min-h-screen'>
      {/* Header */}
      <div className='px-6 py-6 text-white'>
        <h1 className='text-white text-[26px] font-bold leading-tight'>
          {dogName} personalized
          <br />
          health & training plan is
          <br />
          ready!
        </h1>
      </div>

      {/* Main Content Card */}
      <div className='bg-white rounded-t-3xl pb-20'>
        <div className='px-6 py-6 space-y-6'>
          {/* Dog Info Card */}
          <div className='bg-[#F3F3F3] rounded-2xl p-4 flex items-center space-x-4'>
            <div className='w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0'>
              <Image
                src={getDogImage(age)}
                alt={dogName}
                width={80}
                height={80}
                className='w-full h-full object-cover'
              />
            </div>
            <div className='flex-1'>
              <h2 className='font-bold text-lg text-gray-800 mb-1'>
                {dogName}
              </h2>
              <div className='flex flex-wrap gap-2 text-sm'>
                <span className='text-[#1998CD] font-medium bg-[#E1F2F9] py-1 px-2 rounded-lg'>
                  {breed}
                </span>
                {gender && (
                  <span className='text-[#1998CD] bg-[#E1F2F9] font-medium rounded-lg py-1 px-2 '>
                    {gender === 'boy' ? 'Boy' : 'Girl'}
                  </span>
                )}
              </div>
              <p className='text-[#1998CD] bg-[#E1F2F9] w-fit text-sm font-medium mt-1 rounded-lg py-1 px-2 '>
                {getAgeDisplay(age)}
              </p>
            </div>
          </div>

          {/* Summary Section */}
          <div className='space-y-3'>
            <h3 className='text-2xl font-bold text-gray-800'>Summary</h3>
            {isLoading ? (
              <div className='space-y-2 animate-pulse'>
                <div className='h-4 bg-gray-300 rounded w-full'></div>
                <div className='h-4 bg-gray-300 rounded w-5/6'></div>
                <div className='h-4 bg-gray-300 rounded w-4/5'></div>
              </div>
            ) : (
              <p className='text-gray-600 leading-relaxed'>
                {generateSummary()}
              </p>
            )}
          </div>

          {/* Goal Section */}
          <div className='space-y-3'>
            <h3 className='text-2xl font-bold text-gray-800'>Goal</h3>
            {isLoading ? (
              <div className='bg-[#FFEDB4] rounded-2xl p-4 animate-pulse'>
                <div className='space-y-2'>
                  <div className='h-4 bg-[#D4B366] rounded w-full'></div>
                  <div className='h-4 bg-[#D4B366] rounded w-3/4'></div>
                </div>
              </div>
            ) : (
              <div className='bg-[#FFEDB4] rounded-2xl p-4'>
                <p className='text-[#B88933] leading-relaxed'>
                  {generateGoal()}
                </p>
              </div>
            )}
          </div>

          {/* What's Included Section */}
          <div className='space-y-4'>
            <h3 className='text-2xl font-bold text-gray-800'>
              What&apos;s included in the plan
            </h3>

            {isLoading ? (
              <div className='space-y-4'>
                <div className='bg-[#F3F3F3] rounded-xl px-4 py-3 animate-pulse'>
                  <div className='h-4 bg-gray-300 rounded w-3/4'></div>
                </div>
                <div className='bg-[#F3F3F3] rounded-xl px-4 py-3 animate-pulse'>
                  <div className='h-4 bg-gray-300 rounded w-2/3'></div>
                </div>
                <div className='bg-[#F3F3F3] rounded-xl px-4 py-3 animate-pulse'>
                  <div className='h-4 bg-gray-300 rounded w-4/5'></div>
                </div>
              </div>
            ) : (
              <div className='relative'>
                {/* Connecting line */}
                <div className='absolute left-4 top-8 bottom-8 w-0.5 bg-gray-300 z-0'></div>

                <div className='space-y-4 relative z-10'>
                  {(
                    generatedPlan?.tasks || [
                      'Daily walks of 45 minutes',
                      'Scent games / mental tasks',
                      'Recommended course: "Sit, Stay, Come"',
                      'Behavioral training sessions',
                    ]
                  ).map((task, index) => (
                    <div key={index} className='flex items-center space-x-4'>
                      <div className='w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center flex-shrink-0 relative z-10'>
                        <span className='text-sm font-medium text-gray-600'>
                          {index + 1}
                        </span>
                      </div>
                      <div className='flex-1 bg-[#F3F3F3] rounded-xl px-4 py-3'>
                        <p className='text-gray-800 font-medium'>{task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className='fixed bottom-6 left-4 right-4 z-50'>
          <button
            onClick={onStartPlan}
            className='w-full bg-[#15CF7E] hover:bg-green-600 text-white font-medium py-4 px-6 rounded-2xl transition-colors flex items-center justify-center space-x-2'
          >
            <span>Start my plan</span>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
