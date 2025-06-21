interface GenderSelectionProps {
  selectedGender: 'boy' | 'girl' | '';
  onGenderSelect: (gender: 'boy' | 'girl') => void;
}

export default function GenderSelection({
  selectedGender,
  onGenderSelect,
}: GenderSelectionProps) {
  return (
    <div className='flex flex-col items-center space-y-6'>
      <h1 className='text-[28px] font-bold text-[#383C44] text-center'>
        Your dog is:
      </h1>
      <div className='space-y-4 w-full max-w-sm'>
        <button
          onClick={() => onGenderSelect('girl')}
          className={`w-full p-4 rounded-2xl text-left transition-colors flex items-center space-x-3 h-[80px] ${
            selectedGender === 'girl'
              ? 'border-[#BCE6F8] bg-[#D3F2FF] border-1 '
              : 'border-[#DDDDDD] bg-[#F3F3F3] hover:border-gray-300'
          }`}
        >
          <div className='w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center'>
            <span className='text-pink-600 text-xl'>♀</span>
          </div>
          <span className='font-medium text-[#383C44]'>Girl</span>
        </button>
        <button
          onClick={() => onGenderSelect('boy')}
          className={`w-full p-4 rounded-2xl text-left transition-colors flex items-center space-x-3 h-[80px] ${
            selectedGender === 'boy'
              ? 'border-[#BCE6F8] bg-[#D3F2FF] border-1 '
              : 'border-[#DDDDDD] bg-[#F3F3F3] hover:border-gray-300'
          }`}
        >
          <div className='w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center'>
            <span className='text-blue-600 text-xl'>♂</span>
          </div>
          <span className='font-medium text-[#383C44]'>Boy</span>
        </button>
      </div>
    </div>
  );
}
