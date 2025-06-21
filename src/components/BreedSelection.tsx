interface BreedSelectionProps {
  selectedBreed: string;
  customBreed: string;
  onBreedSelect: (breed: string) => void;
  onCustomBreedChange: (breed: string) => void;
}

const breedOptions = [
  'Mixed breed',
  'Labrador',
  'American Pit Bull Terrier',
  'German Shepherd',
  'Cocker Spaniel',
  'French Bulldog',
  'Chihuahua',
  'Cockapoo',
  'Staffordshire Bull Terrier',
];

export default function BreedSelection({
  selectedBreed,
  customBreed,
  onBreedSelect,
  onCustomBreedChange,
}: BreedSelectionProps) {
  return (
    <div className='flex flex-col items-center space-y-6'>
      <h1 className='text-[28px] font-bold text-[#383C44] text-center'>
        Choose your dog&apos;s breed
      </h1>
      <div className='flex flex-wrap gap-3 items-center justify-center w-full max-w-md'>
        {breedOptions.map(breed => (
          <button
            key={breed}
            onClick={() => {
              onBreedSelect(breed);
              onCustomBreedChange('');
            }}
            className={`p-2 rounded-lg border-1 text-sm transition-colors ${
              selectedBreed === breed
                ? 'border-[#383C44] bg-[#383C44] text-white'
                : 'border-[#383C44] text-[#383C44] hover:border-gray-300'
            }`}
          >
            {breed}
          </button>
        ))}
      </div>
      <div className='w-full max-w-md'>
        <label className='block text-sm font-medium text-[#383C44] mb-2'>
          Another breed:
        </label>
        <input
          type='text'
          value={customBreed}
          onChange={e => {
            onCustomBreedChange(e.target.value);
            onBreedSelect(e.target.value);
          }}
          placeholder='e.g., Goldendoodle'
          className='w-full p-3 border-1 border-[#DDDDDD] bg-[#F3F3F3] rounded-2xl focus:border-[#FF574C] focus:outline-none text-[#383C44] placeholder-[#383C44] placeholder-opacity-50'
        />
      </div>
    </div>
  );
}
