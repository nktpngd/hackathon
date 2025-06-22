'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import HomeScreen from '../../components/HomeScreen';

function HomeContent() {
  const searchParams = useSearchParams();
  const dogName = searchParams.get('name') || 'Buddy';

  return <HomeScreen dogName={dogName} />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
