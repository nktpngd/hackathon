interface BehaviorSelectionProps {
  selectedBehaviors: string[];
  onBehaviorToggle: (behavior: string) => void;
}

const behaviorOptions = [
  { id: 'energy', label: 'Excessive energy and lack of control', emoji: '🐕' },
  {
    id: 'aggression',
    label: 'Aggression towards people or other animals',
    emoji: '🐕',
  },
  { id: 'leash', label: 'Leash pulling', emoji: '🐕' },
  { id: 'separation', label: 'Separation anxiety', emoji: '🐕' },
  { id: 'barking', label: 'Excessive barking', emoji: '🐕' },
  { id: 'destructive', label: 'Destructive behavior', emoji: '🐕' },
  { id: 'house', label: 'House soiling', emoji: '🐕' },
];

export default function BehaviorSelection({
  selectedBehaviors,
  onBehaviorToggle,
}: BehaviorSelectionProps) {
  return (
    <div className='flex flex-col items-center space-y-6'>
      <h1 className='text-2xl font-semibold text-[#383C44] text-center'>
        Which of these behavioral issues or tendencies do you observe in your
        dog?
      </h1>
      <p className='text-sm text-[#383C44] opacity-70 text-center'>
        Choose all that apply:
      </p>
      <div className='space-y-3 w-full max-w-md'>
        {behaviorOptions.map(behavior => (
          <button
            key={behavior.id}
            onClick={() => onBehaviorToggle(behavior.label)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-colors flex items-center space-x-3 ${
              selectedBehaviors.includes(behavior.label)
                ? 'border-[#BCE6F8] bg-[#D3F2FF]'
                : 'border-[#DDDDDD] bg-[#F3F3F3] hover:border-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                selectedBehaviors.includes(behavior.label)
                  ? 'border-[#FF574C] bg-[#FF574C]'
                  : 'border-[#DDDDDD] bg-white'
              }`}
            >
              {selectedBehaviors.includes(behavior.label) && (
                <span className='text-white text-xs'>✓</span>
              )}
            </div>
            <div className='flex items-center space-x-3'>
              <div className='text-2xl'>{behavior.emoji}</div>
              <span className='text-sm font-medium text-[#383C44]'>
                {behavior.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
