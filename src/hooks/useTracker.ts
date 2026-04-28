import { useState, useCallback, useMemo } from 'react';
import { positions, getPosition, type Position, type Affix } from '../data/affixes';

export interface EquipRecord {
  firstAffix: string;
  affixes: string[];
}

export interface TrackerState {
  positionId: string;
  history: EquipRecord[];
}

export interface AffixPoolEntry extends Affix {
  isSpecial: boolean;
  remainingCount: number;
  probability: number;
}

export function useTracker() {
  const [state, setState] = useState<TrackerState>({
    positionId: 'huan',
    history: [{ firstAffix: '', affixes: [] }],
  });

  const currentPosition = useMemo<Position | undefined>(() => {
    return getPosition(state.positionId);
  }, [state.positionId]);

  const currentEquipIndex = useMemo(() => {
    return state.history.length - 1;
  }, [state.history]);

  const currentEquipAffixCount = useMemo(() => {
    return state.history[currentEquipIndex]?.affixes.length ?? 0;
  }, [state.history, currentEquipIndex]);

  const currentEquipFirstAffix = useMemo(() => {
    return state.history[currentEquipIndex]?.firstAffix ?? '';
  }, [state.history, currentEquipIndex]);

  const affixPool = useMemo<AffixPoolEntry[]>(() => {
    if (!currentPosition) return [];

    const allAffixes: (Affix & { isSpecial: boolean })[] = currentPosition.affixes.map(a => ({
      ...a,
      isSpecial: false,
    }));
    if (currentPosition.specialAffix) {
      allAffixes.push({
        id: currentPosition.specialAffix.id,
        name: currentPosition.specialAffix.name,
        category: 'damage',
        isSpecial: true,
      });
    }

    const supplementCount = state.history.length;

    const consumedCount: Record<string, number> = {};
    for (const equip of state.history) {
      for (const affixId of equip.affixes) {
        consumedCount[affixId] = (consumedCount[affixId] ?? 0) + 1;
      }
    }

    const currentEquipAffixes = state.history[currentEquipIndex]?.affixes ?? [];

    let totalRemaining = 0;
    const entries: AffixPoolEntry[] = allAffixes.map(affix => {
      const remaining = supplementCount - (consumedCount[affix.id] ?? 0);
      const isAvailable = !currentEquipAffixes.includes(affix.id);
      const effectiveRemaining = isAvailable ? remaining : 0;
      totalRemaining += effectiveRemaining;

      return {
        ...affix,
        remainingCount: remaining,
        probability: 0,
      };
    });

    for (const entry of entries) {
      const isAvailable = !currentEquipAffixes.includes(entry.id);
      entry.probability = isAvailable && totalRemaining > 0
        ? (entry.remainingCount / totalRemaining) * 100
        : 0;
    }

    return entries;
  }, [currentPosition, state, currentEquipIndex]);

  const totalPoolRemaining = useMemo(() => {
    return affixPool.reduce((sum, a) => sum + a.remainingCount, 0);
  }, [affixPool]);

  const setPosition = useCallback((positionId: string) => {
    setState({ positionId, history: [{ firstAffix: '', affixes: [] }] });
  }, []);

  const setFirstAffix = useCallback((affixId: string) => {
    setState(prev => {
      const newHistory = [...prev.history];
      newHistory[currentEquipIndex] = {
        ...newHistory[currentEquipIndex],
        firstAffix: affixId,
      };
      return { ...prev, history: newHistory };
    });
  }, [currentEquipIndex]);

  const addHistory = useCallback((affixId: string) => {
    setState(prev => {
      const newHistory = [...prev.history];
      const currentEquip = newHistory[currentEquipIndex];
      const newAffixes = [...currentEquip.affixes, affixId];
      newHistory[currentEquipIndex] = { ...currentEquip, affixes: newAffixes };

      if (newAffixes.length >= 4) {
        newHistory.push({ firstAffix: '', affixes: [] });
      }

      return { ...prev, history: newHistory };
    });
  }, [currentEquipIndex]);

  const removeLastHistory = useCallback(() => {
    setState(prev => {
      const newHistory = [...prev.history];
      const currentEquip = newHistory[currentEquipIndex];

      if (currentEquip.affixes.length === 0 && currentEquipIndex > 0) {
        newHistory.pop();
        const prevEquip = newHistory[newHistory.length - 1];
        if (prevEquip.affixes.length > 0) {
          newHistory[newHistory.length - 1] = {
            ...prevEquip,
            affixes: prevEquip.affixes.slice(0, -1),
          };
        }
      } else if (currentEquip.affixes.length > 0) {
        newHistory[currentEquipIndex] = {
          ...currentEquip,
          affixes: currentEquip.affixes.slice(0, -1),
        };
      }

      return { ...prev, history: newHistory };
    });
  }, [currentEquipIndex]);

  const startNewEquip = useCallback(() => {
    setState(prev => {
      const currentEquip = prev.history[prev.history.length - 1];
      if (currentEquip.affixes.length > 0 && currentEquip.affixes.length < 4) {
        const newHistory = [...prev.history];
        newHistory.push({ firstAffix: '', affixes: [] });
        return { ...prev, history: newHistory };
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({ ...prev, history: [{ firstAffix: '', affixes: [] }] }));
  }, []);

  const exportData = useCallback(() => {
    const data = {
      positionId: state.positionId,
      history: state.history,
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
          // 兼容旧格式（string[][]）和新格式（EquipRecord[]）
          const history: EquipRecord[] = data.history.map((item: string[] | EquipRecord) => {
            if (Array.isArray(item)) {
              return { firstAffix: '', affixes: item };
            }
            return item;
          });
          setState({
            positionId: data.positionId,
            history,
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
    currentEquipIndex,
    currentEquipAffixCount,
    currentEquipFirstAffix,
    affixPool,
    totalPoolRemaining,
    setPosition,
    setFirstAffix,
    addHistory,
    removeLastHistory,
    startNewEquip,
    reset,
    exportData,
    importData,
  };
}