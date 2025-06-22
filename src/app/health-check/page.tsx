'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HealthCheckPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedBehaviors, setSelectedBehaviors] = useState<string[]>([]);
  const [selectedFeeding, setSelectedFeeding] = useState<string>('');
  const [description, setDescription] = useState('');

  const moodOptions = ['Angry', 'Stressed', 'Sad', 'Normal', 'Happy'];
  const activityOptions = [
    'Playful',
    'As usual',
    'Sleeping beauty',
    'Sluggish',
    'Hyperactive',
  ];
  const symptomOptions = [
    'Coughing',
    'Sneezing',
    'Fever',
    'Runny eyes',
    'Gagging',
    'Vomiting',
    'Diarrhea',
    'Constipation',
    'Excessive thirst',
    'Red gums',
    'Allergy',
    'Itches badly',
    'Dirty ears',
    'Hiccup',
    'Blood in stool',
    'Blood in urine',
    'Drooling',
    'Abnormal heart rate',
    'Abnormal breathing',
    'Tick bite',
    'No symptoms',
  ];
  const behaviorOptions = [
    'Pacing',
    'Aggression',
    'Chewing',
    'Trembling',
    'Eating poop',
    'Digging',
  ];
  const feedingOptions = [
    'Good appetite',
    'Glutton',
    'No appetite',
    'Eats nothing',
    'Guarding food',
  ];

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleBehaviorToggle = (behavior: string) => {
    setSelectedBehaviors(prev =>
      prev.includes(behavior)
        ? prev.filter(b => b !== behavior)
        : [...prev, behavior]
    );
  };

  const handleSubmit = () => {
    // Handle form submission here
    console.log({
      mood: selectedMood,
      activity: selectedActivity,
      symptoms: selectedSymptoms,
      behaviors: selectedBehaviors,
      feeding: selectedFeeding,
      description,
    });
    router.push('/home');
  };

  const OptionButton = ({
    option,
    isSelected,
    onClick,
  }: {
    option: string;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-3 py-2 rounded text-sm transition-all ${
        isSelected
          ? 'bg-[#FF574C] text-white'
          : 'bg-[#FFEBEB] text-[#404751] hover:bg-gray-200'
      }`}
    >
      {option}
      {isSelected && (
        <span className='ml-1 flex items-center justify-center'>
          <Image src='/icons/close.svg' alt='close' width={12} height={12} />
        </span>
      )}
    </button>
  );

  return (
    <div className='min-h-screen' style={{ backgroundColor: '#F3F3F3' }}>
      {/* Header */}
      <div className='flex items-center justify-between p-4'>
        <span className='bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium'>
          21.06.25
        </span>
        <button
          onClick={() => router.back()}
          className='w-6 h-6 flex items-center justify-center rounded-full'
        >
          <Image src='/icons/cross.svg' alt='cross' width={24} height={24} />
        </button>
      </div>

      <div className='p-6 pb-32 space-y-6'>
        {/* Title and Description */}
        <div>
          <h1 className='text-2xl font-bold text-[#383C44] mb-2'>
            Health check
          </h1>
          <input
            type='text'
            placeholder='Tap to add description'
            value={description}
            onChange={e => setDescription(e.target.value)}
            className='w-full text-gray-500 bg-transparent border-none outline-none'
          />
        </div>

        {/* Mood Section */}
        <div
          className='p-6 rounded-2xl'
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 24px 4px #0000000A',
          }}
        >
          <h2 className='text-lg font-bold text-[#383C44] mb-4'>Mood</h2>
          <div className='flex flex-wrap gap-2'>
            {moodOptions.map(mood => (
              <OptionButton
                key={mood}
                option={mood}
                isSelected={selectedMood === mood}
                onClick={() =>
                  setSelectedMood(selectedMood === mood ? '' : mood)
                }
              />
            ))}
          </div>
        </div>

        {/* Activity Section */}
        <div
          className='p-6 rounded-2xl'
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 24px 4px #0000000A',
          }}
        >
          <h2 className='text-lg font-bold text-[#383C44] mb-4'>Activity</h2>
          <div className='flex flex-wrap gap-2'>
            {activityOptions.map(activity => (
              <OptionButton
                key={activity}
                option={activity}
                isSelected={selectedActivity === activity}
                onClick={() =>
                  setSelectedActivity(
                    selectedActivity === activity ? '' : activity
                  )
                }
              />
            ))}
          </div>
        </div>

        {/* Symptoms Section */}
        <div
          className='p-6 rounded-2xl'
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 24px 4px #0000000A',
          }}
        >
          <h2 className='text-lg font-bold text-[#383C44] mb-4'>Symptoms</h2>
          <div className='flex flex-wrap gap-2'>
            {symptomOptions.map(symptom => (
              <OptionButton
                key={symptom}
                option={symptom}
                isSelected={selectedSymptoms.includes(symptom)}
                onClick={() => handleSymptomToggle(symptom)}
              />
            ))}
          </div>
        </div>

        {/* Strange behavior Section */}
        <div
          className='p-6 rounded-2xl'
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 24px 4px #0000000A',
          }}
        >
          <h2 className='text-lg font-bold text-[#383C44] mb-4'>
            Strange behavior
          </h2>
          <div className='flex flex-wrap gap-2'>
            {behaviorOptions.map(behavior => (
              <OptionButton
                key={behavior}
                option={behavior}
                isSelected={selectedBehaviors.includes(behavior)}
                onClick={() => handleBehaviorToggle(behavior)}
              />
            ))}
          </div>
        </div>

        {/* Feeding Section */}
        <div
          className='p-6 rounded-2xl'
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 8px 24px 4px #0000000A',
          }}
        >
          <h2 className='text-lg font-bold text-[#383C44] mb-4'>Feeding</h2>
          <div className='flex flex-wrap gap-2'>
            {feedingOptions.map(feeding => (
              <OptionButton
                key={feeding}
                option={feeding}
                isSelected={selectedFeeding === feeding}
                onClick={() =>
                  setSelectedFeeding(selectedFeeding === feeding ? '' : feeding)
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className='fixed bottom-6 left-6 right-6'>
        <button
          onClick={handleSubmit}
          className='w-full bg-[#15CF7E] text-white py-4 rounded-2xl font-semibold text-lg flex items-center justify-center relative hover:bg-green-600 transition-colors'
        >
          Submit
          <span className='absolute right-4'>
            <Image
              src='/icons/right.svg'
              alt='arrow-right'
              width={24}
              height={24}
            />
          </span>
        </button>
      </div>
    </div>
  );
}
