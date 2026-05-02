import { Suspense } from 'react';
import { GameScreen } from '../../components/game/GameScreen';

export default function PlayPage() {
  return (
    <main>
      <Suspense fallback={<div className="w-full h-screen bg-slate-950 flex items-center justify-center text-white font-bold">Carregando Sistema Solar...</div>}>
        <GameScreen />
      </Suspense>
    </main>
  );
}
