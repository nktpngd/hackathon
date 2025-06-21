import Image from 'next/image';

interface AgeSelectionProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

const ageOptions = [
  {
    id: 'puppy',
    label: 'Puppy',
    description: 'Less than 6 months',
    image: '/images/puppy.png',
  },
  {
    id: 'adolescent',
    label: 'Adolescent dog',
    description: '6-18 months',
    image: '/images/adolescent.png',
  },
  {
    id: 'adult',
    label: 'Adult dog',
    description: '1-7 years',
    image: '/images/adult.png',
  },
  {
    id: 'senior',
    label: 'Senior dog',
    description: 'Above 7 years',
    image: '/images/senior.png',
  },
];

export default function AgeSelection({
  selectedAge,
  onAgeSelect,
}: AgeSelectionProps) {
  return (
    <div className='flex flex-col items-center space-y-6'>
      <div className='text-center mb-2'>
        <p className='text-sm text-[#383C44]'>
          Let&apos;s create a personalized training <br /> plan for your dog
        </p>
      </div>
      <h1 className='text-[28px] font-bold text-[#383C44] text-center'>
        What is your dog&apos;s age?
      </h1>
      <div className='space-y-4 w-full max-w-sm'>
        {ageOptions.map(option => (
          <button
            key={option.id}
            onClick={() => onAgeSelect(option.id)}
            className={`w-full h-20 rounded-2xl text-left transition-colors ${
              selectedAge === option.id
                ? 'border-[#BCE6F8] bg-[#D3F2FF] border-1'
                : 'border-[#DDDDDD] bg-[#F3F3F3] hover:border-gray-300'
            }`}
          >
            <div className='flex items-center space-x-3 h-full'>
              <div className='w-20 h-20 relative flex-shrink-0'>
                <Image
                  src={option.image}
                  alt={option.label}
                  className='object-contain'
                  width={80}
                  height={80}
                />
              </div>
              <div className='flex-1 pr-4'>
                <div className='font-bold text-[#383C44] text-xl'>
                  {option.label}
                </div>
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
