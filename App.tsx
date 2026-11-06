/**
 * LetterCogRings - the state machine only. No gameplay lives here and
 * no react-navigation: screens are rendered conditionally.
 */
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MachineRunningScreen } from './src/screens/MachineRunningScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { PlateCollectionScreen } from './src/screens/PlateCollectionScreen';
import { TOTAL_MACHINES } from './src/constants/config';
import type { Plate } from './src/constants/plates';
import { theme } from './src/constants/theme';
import type { SolveResult } from './src/game/types';
import { useProgress } from './src/hooks/useProgress';

type Screen = 'loader' | 'menu' | 'game' | 'result' | 'plates';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [machineId, setMachineId] = useState(0);
  const [result, setResult] = useState<SolveResult | null>(null);

  const {
    progress,
    parRate,
    recordBonusWord,
    completeMachine,
    buyPlate,
    setMachineIndex,
  } = useProgress();

  const handleStart = useCallback(() => {
    setMachineId(progress.machineIndex);
    setScreen('game');
  }, [progress.machineIndex]);

  const handleSolved = useCallback(
    (solved: SolveResult) => {
      setResult(solved);
      completeMachine(machineId, solved);
      setScreen('result');
    },
    [completeMachine, machineId],
  );

  const handleSolveAgain = useCallback(() => {
    const next = Math.min(TOTAL_MACHINES - 1, machineId + 1);
    setMachineId(next);
    setMachineIndex(next);
    setResult(null);
    setScreen('game');
  }, [machineId, setMachineIndex]);

  const handleMenu = useCallback(() => {
    setResult(null);
    setScreen('menu');
  }, []);

  const handleBuyPlate = useCallback(
    (plate: Plate) => {
      buyPlate(plate.id, plate.cost);
    },
    [buyPlate],
  );

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {screen === 'loader' ? (
        <LoaderScreen onDone={() => setScreen('menu')} />
      ) : null}

      {screen === 'menu' ? (
        <MenuScreen
          progress={progress}
          parRate={parRate}
          onStart={handleStart}
          onPlates={() => setScreen('plates')}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={'machine-' + String(machineId)}
          machineId={machineId}
          onBonusWord={recordBonusWord}
          onSolved={handleSolved}
          onHome={handleMenu}
        />
      ) : null}

      {screen === 'result' && result ? (
        <MachineRunningScreen
          result={result}
          tokens={progress.tokens}
          onPlayAgain={handleSolveAgain}
          onMenu={handleMenu}
        />
      ) : null}

      {screen === 'plates' ? (
        <PlateCollectionScreen
          tokens={progress.tokens}
          ownedPlates={progress.ownedPlates}
          onBuy={handleBuyPlate}
          onBack={handleMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.deep },
});

export default App;
