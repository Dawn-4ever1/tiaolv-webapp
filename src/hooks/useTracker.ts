import { useState, useCallback, useMemo } from 'react';
import { positions, getPosition, type Position, type Affix } from '../data/affixes';

export interface TrackerState {
  positionId: string;
  history: string[];
  specialAffixUsed: boolean;
}

export interface AffixWithProbability extends Affix {
  probability: number;
  isAppeared: boolean;
  timesAppeared: number;
}

export function useTracker() {
  const [state, setState] = useState<TrackerState>({
    positionId: 'huan',
    history: [],
    specialAffixUsed: false,
  });

  const currentPosition = useMemo<Position | undefined>(() => {
    return getPosition(state.positionId);
  }, [state.positionId]);

  const allAffixes = useMemo(() => {
    if (!currentPosition) return [];
    const affixes: (Affix & { isSpecial?: boolean })[] = [...currentPosition.affixes];
    if (currentPosition.specialAffix) {
      affixes.push({
        id: currentPosition.specialAffix.id,
        name: currentPosition.specialAffix.name,
        category: 'damage',
        isSpecial: true,
      });
    }
    return affixes;
  }, [currentPosition]);

  const affixesWithStats = useMemo<AffixWithProbability[]>(() => {
    if (!currentPosition) return [];

    const totalWeight = allAffixes.reduce((sum, affix) => {
      if ('isSpecial' in affix && affix.isSpecial && currentPosition.specialAffix) {
        return sum + 1 / currentPosition.specialAffix.weight;
      }
      if (currentPosition.specialAffix) {
        return sum + (16 / 17) / (allAffixes.length - 1);
      }
      return sum + 1 / allAffixes.length;
    }, 0);

    return allAffixes.map(affix => {
      let weight: number;

      if ('isSpecial' in affix && affix.isSpecial && currentPosition.specialAffix) {
        weight = 1 / currentPosition.specialAffix.weight;
      } else if (currentPosition.specialAffix) {
        weight = (16 / 17) / (allAffixes.length - 1);
      } else {
        weight = 1 / allAffixes.length;
      }

      const timesAppeared = state.history.filter(id => id === affix.id).length;

      return {
        ...affix,
        probability: weight / totalWeight * 100,
        isAppeared: timesAppeared > 0,
        timesAppeared,
      };
    });
  }, [allAffixes, currentPosition, state.history]);

  const appearedAffixes = useMemo(() => {
    return affixesWithStats.filter(a => a.isAppeared);
  }, [affixesWithStats]);

  const remainingAffixes = useMemo(() => {
    return affixesWithStats.filter(a => !a.isAppeared);
  }, [affixesWithStats]);

  const setPosition = useCallback((positionId: string) => {
    setState(prev => ({ ...prev, positionId, history: [], specialAffixUsed: false }));
  }, []);

  const addHistory = useCallback((affixId: string) => {
    setState(prev => {
      if (currentPosition?.specialAffix && affixId === currentPosition.specialAffix.id) {
        return { ...prev, history: [...prev.history, affixId], specialAffixUsed: true };
      }
      return { ...prev, history: [...prev.history, affixId] };
    });
  }, [currentPosition]);

  const removeLastHistory = useCallback(() => {
    setState(prev => {
      if (prev.history.length === 0) return prev;
      const lastId = prev.history[prev.history.length - 1];
      const newHistory = prev.history.slice(0, -1);
      let newSpecialAffixUsed = prev.specialAffixUsed;
      if (currentPosition?.specialAffix && lastId === currentPosition.specialAffix.id) {
        newSpecialAffixUsed = false;
      }
      return { ...prev, history: newHistory, specialAffixUsed: newSpecialAffixUsed };
    });
  }, [currentPosition]);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, history: [], specialAffixUsed: false }));
  }, []);

  const exportData = useCallback(() => {
    const data = {
      positionId: state.positionId,
      history: state.history,
      specialAffixUsed: state.specialAffixUsed,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiaolv-${state.positionId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.positionId && data.history) {
          setState({
            positionId: data.positionId,
            history: data.history,
            specialAffixUsed: data.specialAffixUsed || false,
          });
        }
      } catch {
        alert('导入失败：文件格式错误');
      }
    };
    reader.readAsText(file);
  }, []);

  return {
    positions,
    state,
    currentPosition,
    allAffixes,
    affixesWithStats,
    appearedAffixes,
    remainingAffixes,
    setPosition,
    addHistory,
    removeLastHistory,
    reset,
    exportData,
    importData,
  };
}
