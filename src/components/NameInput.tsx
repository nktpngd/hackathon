interface NameInputProps {
  name: string;
  onNameChange: (name: string) => void;
}

export default function NameInput({ name, onNameChange }: NameInputProps) {
  return (
    <div className='flex flex-col items-center space-y-6'>
      <h1 className='text-2xl font-semibold text-[#383C44] text-center'>
        Your dog&apos;s name is...
      </h1>
      <div className='w-full max-w-sm'>
        <label className='block text-sm font-medium text-[#383C44] mb-2'>
          Name:
        </label>
        <input
          type='text'
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder='e.g., Buddy'
          className='w-full p-3 border-2 border-[#DDDDDD] bg-[#F3F3F3] rounded-lg focus:border-[#FF574C] focus:outline-none text-[#383C44] placeholder-[#383C44] placeholder-opacity-50'
        />
      </div>
    </div>
  );
}
