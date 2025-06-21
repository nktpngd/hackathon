interface AgeSelectionProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const ageOptions = [
  {
    id: 'puppy',
    label: 'Puppy',
    description: 'Less than 6 months',
    emoji: '🐶',
  },
  {
    id: 'adolescent',
    label: 'Adolescent dog',
    description: '6-18 months',
    emoji: '🐕',
  },
  { id: 'adult', label: 'Adult dog', description: '1-7 years', emoji: '🐕' },
  {
    id: 'senior',
    label: 'Senior dog',
    description: 'Above 7 years',
    emoji: '🐕‍🦺',
  },
];

export default function AgeSelection({
  selectedAge,
  onAgeSelect,
}: AgeSelectionProps) {
  return (
    <div className='flex flex-col items-center space-y-6'>
      <h1 className='text-2xl font-semibold text-[#383C44] text-center'>
        What is your dog&apos;s age?
      </h1>
      <div className='space-y-4 w-full max-w-sm'>
        {ageOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onAgeSelect(option.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
              selectedAge === option.id
                ? 'border-[#BCE6F8] bg-[#D3F2FF]'
                : 'border-[#DDDDDD] bg-[#F3F3F3] hover:border-gray-300'
            }`}
          >
            <div className='flex items-center space-x-3'>
              <div className='text-3xl'>{option.emoji}</div>
              <div>
                <div className='font-medium text-[#383C44]'>{option.label}</div>
                <div className='text-sm text-[#383C44] opacity-70'>
                  {option.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
