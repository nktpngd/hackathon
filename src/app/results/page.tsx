'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ResultsScreen from '../../components/ResultsScreen';

function ResultsContent() {
  const searchParams = useSearchParams();

  const dogName = searchParams.get('name') || '';
  const breed = searchParams.get('breed') || '';
  const gender = (searchParams.get('gender') as 'boy' | 'girl' | '') || '';
  const age = searchParams.get('age') || '';
  const behaviors = searchParams.get('behaviors')?.split(',') || [];

  return (
    <ResultsScreen
      dogName={dogName}
      breed={breed}
      gender={gender}
      age={age}
      behaviors={behaviors}
    />
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
