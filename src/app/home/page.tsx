'use client';

import { Suspense } from 'react';
import HomeScreen from '../../components/HomeScreen';

function HomeContent() {
  return <HomeScreen />;
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
