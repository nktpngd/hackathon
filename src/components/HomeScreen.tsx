import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HomeScreenProps {
  dogName: string;
}

export default function HomeScreen({}: HomeScreenProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [healthCheckCompleted, setHealthCheckCompleted] = useState(false);
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Health check', completed: false },
  ]);

  // Load generated tasks and health check status when component mounts
  useEffect(() => {
    const loadTasksAndHealthCheck = () => {
      // Load generated tasks from localStorage
      const generatedTasksJson = localStorage.getItem('generatedTasks');
      let generatedTasks: string[] = [];

      if (generatedTasksJson) {
        try {
          generatedTasks = JSON.parse(generatedTasksJson);
        } catch (error) {
          console.error('Error parsing generated tasks:', error);
          // Use fallback tasks if parsing fails
          generatedTasks = [
            'Daily walks of 45 minutes',
            'Scent games / mental tasks',
            'Recommended course: "Sit, Stay, Come"',
            'Behavioral training sessions',
          ];
        }
      } else {
        // Use fallback tasks if no generated tasks found
        generatedTasks = [
          'Daily walks of 45 minutes',
          'Scent games / mental tasks',
          'Recommended course: "Sit, Stay, Come"',
          'Behavioral training sessions',
        ];
      }

      // Check health check status
      const completed = localStorage.getItem('healthCheckCompleted') === 'true';
      const checkDate = localStorage.getItem('healthCheckDate');
      const today = new Date().toDateString();

      // Only show as completed if it was done today
      const isCompletedToday = completed && checkDate === today;
      setHealthCheckCompleted(isCompletedToday);

      // Get existing task completion status from localStorage
      const taskCompletionJson = localStorage.getItem('taskCompletion');
      let taskCompletion: { [key: string]: boolean } = {};

      if (taskCompletionJson) {
        try {
          taskCompletion = JSON.parse(taskCompletionJson);
        } catch (error) {
          console.error('Error parsing task completion:', error);
        }
      }

      // Create the full task list with generated tasks + health check
      const allTasks = [
        ...generatedTasks.map((taskText, index) => ({
          id: index + 1,
          text: taskText,
          completed: taskCompletion[taskText] || false,
        })),
        {
          id: generatedTasks.length + 1,
          text: 'Health check',
          completed: isCompletedToday,
        },
      ];

      setTasks(allTasks);
    };

    loadTasksAndHealthCheck();

    // Listen for changes in localStorage (in case of updates from other tabs)
    window.addEventListener('storage', loadTasksAndHealthCheck);

    return () => {
      window.removeEventListener('storage', loadTasksAndHealthCheck);
    };
  }, []);

  const toggleTask = (id: number) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );

      // Save task completion status to localStorage (excluding health check)
      const taskCompletion: { [key: string]: boolean } = {};
      updatedTasks.forEach(task => {
        if (task.text !== 'Health check') {
          taskCompletion[task.text] = task.completed;
        }
      });

      localStorage.setItem('taskCompletion', JSON.stringify(taskCompletion));

      return updatedTasks;
    });
  };

  const handleDragStart = (clientY: number) => {
    setIsDragging(true);
    setDragStartY(clientY);
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging) return;

    const deltaY = dragStartY - clientY;
    const threshold = 30; // reduced threshold for easier interaction

    if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        // Dragging up - expand
        if (!isExpanded) {
          setIsExpanded(true);
          setIsDragging(false); // Stop dragging after state change
        }
      } else {
        // Dragging down - collapse
        if (isExpanded) {
          setIsExpanded(false);
          setIsDragging(false); // Stop dragging after state change
        }
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartY(0);
  };

  // Mouse events - only for drag handle
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events - only for drag handle
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Header area touch events (for expanding when collapsed)
  const handleHeaderTouchStart = (e: React.TouchEvent) => {
    if (isExpanded) return; // Only allow expand gesture when collapsed

    const target = e.target as HTMLElement;
    // Don't start drag on interactive elements
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('svg')
    ) {
      return;
    }
    handleDragStart(e.touches[0].clientY);
  };

  const handleHeaderTouchMove = (e: React.TouchEvent) => {
    if (isExpanded || !isDragging) return;
    e.preventDefault(); // Prevent scrolling during header drag
    handleDragMove(e.touches[0].clientY);
  };

  const weekDates = [17, 18, 19, 20, 21, 22, 23];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div
      className='bg-[#FF6B5A] bg-[url("/images/background.png")] bg-cover bg-center bg-no-repeat min-h-screen w-full max-w-full overflow-x-hidden flex flex-col'
      onMouseMove={isDragging ? handleMouseMove : undefined}
      onMouseUp={isDragging ? handleMouseUp : undefined}
      onMouseLeave={isDragging ? handleMouseUp : undefined}
    >
      {/* Header */}
      <div
        className={`px-6 py-6 flex-shrink-0 ${!isExpanded ? 'cursor-pointer' : ''}`}
        onTouchStart={handleHeaderTouchStart}
        onTouchMove={handleHeaderTouchMove}
        onTouchEnd={handleDragEnd}
        onClick={() => {
          if (!isExpanded) {
            setIsExpanded(true);
          }
        }}
      >
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-2'>
            <div className='rounded-2xl flex gap-[7px] items-center justify-center'>
              <Image
                src='/images/box-logo.png'
                alt='Pawchie'
                width={44}
                height={44}
                className='w-[44px] h-[44px]'
              />
              <div className='flex flex-col'>
                <p className='text-xs mt-1'>Hello, my little champion,</p>
                <div className='flex items-center space-x-2'>
                  <h1 className='text-2xl font-bold'>Pawchie</h1>
                  <svg
                    className='w-[15px] h-[15px]'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z' />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className='w-8 h-8 rounded-full flex items-center justify-center'>
            <Image
              src='/images/streak.png'
              alt='streak'
              width={32}
              height={32}
              className='w-full h-full'
            />
          </div>
        </div>
      </div>

      {/* Spacer that grows when collapsed */}
      {!isExpanded && <div className='flex-1'></div>}

      {/* Main Content - white section */}
      <div
        className={`bg-[#F3F3F3] rounded-t-3xl w-full flex-shrink-0 relative transition-all duration-500 ease-out ${
          isExpanded ? 'h-[calc(100vh-200px)]' : 'h-[450px]'
        }`}
        style={{
          transform: isExpanded ? 'translateY(0)' : 'translateY(0)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Drag Handle */}
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-20 h-8 flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-pointer hover:bg-gray-100'
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={
            isExpanded
              ? 'Tap or drag down to collapse content'
              : 'Tap or drag up to expand content'
          }
        >
          <div className='w-12 h-1 bg-gray-400 rounded-full' />
        </div>

        <div
          className={`px-6 space-y-4 transition-all duration-500 ease-out h-full overflow-y-auto ${
            isExpanded ? 'pb-6' : 'pb-4'
          }`}
          style={{
            paddingTop: '2rem',
            paddingBottom: isExpanded ? '2rem' : '1.5rem',
            opacity: isExpanded ? 1 : 0.95,
            transform: isExpanded ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Calendar */}
          <div className='rounded-2xl p-2'>
            <div className='flex items-center justify-between'>
              {dayNames.map((day, index) => (
                <div key={day} className='text-center'>
                  <p className='text-[#16191E] text-[10px] mb-[2px]'>{day}</p>
                  <div
                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-xs font-bold ${
                      weekDates[index] === 21
                        ? 'bg-[#FF574C] text-white'
                        : 'bg-white text-[#16191E]'
                    }`}
                  >
                    {weekDates[index]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Tasks */}
          <div>
            <div className='flex items-center space-x-2 mb-4'>
              <Image
                src='/todos.svg'
                alt='todos'
                width={28}
                height={28}
                className='w-[28px] h-[28px]'
              />
              <h3 className='text-2xl font-bold text-[#383C44]'>Daily tasks</h3>
              {tasks.every(task => task.completed) && (
                <div className='flex items-center bg-[#15CF7E] text-white px-3 py-1 rounded-full ml-auto'>
                  <svg
                    className='w-4 h-4 mr-1'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z' />
                  </svg>
                  <span className='text-sm font-medium'>COMPLETED</span>
                </div>
              )}
            </div>

            {/* Health Check Reviewed Section */}
            {healthCheckCompleted && (
              <div className='mb-4'>
                <div
                  className='bg-[#E8F5E8] rounded-2xl p-4 cursor-pointer hover:bg-[#D4F0D4] transition-colors'
                  onClick={() => router.push('/health-check/summary')}
                >
                  <div className='flex items-start space-x-3'>
                    <div className='w-6 h-6 rounded-full bg-[#15CF7E] text-white flex items-center justify-center flex-shrink-0 mt-1'>
                      <svg
                        className='w-4 h-4'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z' />
                      </svg>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-bold text-[#2D5A31] text-lg mb-1'>
                        Health check reviewed
                      </h4>
                      <p className='text-[#5A8A5E] text-sm mb-3'>
                        Some mild symptoms noted — we&apos;re keeping an eye on
                        things.
                      </p>
                      <div className='flex items-center text-[#5A8A5E] text-sm'>
                        <span>Open health summary</span>
                        <svg
                          className='w-4 h-4 ml-1'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='space-y-3'>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center space-x-3 bg-white p-4 rounded-2xl ${
                    task.text === 'Health check'
                      ? 'cursor-pointer hover:bg-gray-50 transition-colors'
                      : ''
                  }`}
                  onClick={() => {
                    if (task.text === 'Health check' && !healthCheckCompleted) {
                      router.push('/health-check');
                    }
                  }}
                >
                  <button
                    onClick={() => {
                      if (
                        task.text === 'Health check' &&
                        !healthCheckCompleted
                      ) {
                        router.push('/health-check');
                      } else if (task.text !== 'Health check') {
                        toggleTask(task.id);
                      }
                    }}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-[#A4A4A4]'
                    }`}
                  >
                    {task.completed && (
                      <svg
                        className='w-4 h-4 text-white'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z' />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 ${task.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}
                  >
                    {task.text}
                  </span>
                  <div className='flex items-center'>
                    <Image
                      src='/info.svg'
                      alt='info'
                      width={20}
                      height={20}
                      className='w-[20px] h-[20px]'
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Now static at bottom */}
      <div className='bg-white border-t border-gray-200 px-6 py-4 w-full max-w-full flex-shrink-0'>
        <div className='flex items-center justify-around'>
          <button className='flex flex-col items-center space-y-1'>
            <Image
              src='/icons/plan.svg'
              alt='plan'
              width={26}
              height={26}
              className='w-[26px] h-[26px]'
            />
            <span className='text-xs font-bold text-[#383C44]'>My Plan</span>
          </button>

          <button className='flex flex-col items-center space-y-1'>
            <Image
              src='/icons/library.svg'
              alt='library'
              width={26}
              height={26}
              className='w-[26px] h-[26px]'
            />
            <span className='text-xs text-[#A4A4A4]'>Library</span>
          </button>

          <button className='flex flex-col items-center space-y-1'>
            <Image
              src='/icons/commands.svg'
              alt='commands'
              width={26}
              height={26}
              className='w-[26px] h-[26px]'
            />
            <span className='text-xs text-[#A4A4A4]'>Training</span>
          </button>

          <button className='flex flex-col items-center space-y-1'>
            <Image
              src='/icons/experts.svg'
              alt='experts'
              width={26}
              height={26}
              className='w-[26px] h-[26px]'
            />
            <span className='text-xs text-[#A4A4A4]'>Experts</span>
          </button>
        </div>
      </div>
    </div>
  );
}
