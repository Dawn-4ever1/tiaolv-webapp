import { useState, useCallback, useMemo } from 'react';
import { positions, getPosition, weaponTypes, getWeaponDamageName, type Position, type Affix } from '../data/affixes';

export interface EquipRecord {
  firstAffix: string;
  affixes: string[];
}

export interface TrackerState {
  positionId: string;
  activeEquipIndex: number;
  history: EquipRecord[];
  weaponType: string;
  targetAffixes: string[];
}

export interface AffixPoolEntry extends Affix {
  isSpecial: boolean;
  remainingCount: number;
  probability: number;
  canAppear: boolean;
}

function isElementAttackAffix(affix: Affix): boolean {
  return affix.category === 'elemAtk';
}

function isDamageAffix(affix: Affix): boolean {
  return affix.category === 'damage';
}

function canBeFirstAffix(positionId: string, affix: Affix, isWeaponSpecial: boolean): boolean {
  if (positionId === 'leftWeapon' || positionId === 'rightWeapon') {
    if (isWeaponSpecial) return false;
    return ['maxPhysAtk', 'minPhysAtk', 'maxWuXiangAtk', 'minWuXiangAtk', 'shi', 'min'].includes(affix.id);
  }

  if (positionId === 'huan' || positionId === 'pei') {
    return affix.id === 'maxPhysAtk' || affix.id === 'minPhysAtk';
  }

  if (positionId === 'guanZhou' || positionId === 'xiongJia') {
    return affix.category === 'rate' || affix.category === 'survival';
  }

  if (positionId === 'jingJia' || positionId === 'wanJia') {
    return affix.category === 'rate' || affix.category === 'survival' || ['jing', 'ti', 'yu'].includes(affix.id);
  }

  return true;
}

const defaultState: TrackerState = {
  positionId: 'huan',
  activeEquipIndex: 0,
  history: [{ firstAffix: '', affixes: [] }],
  weaponType: weaponTypes[0].id,
  targetAffixes: [],
};

export function useTracker() {
  const [state, setState] = useState<TrackerState>(defaultState);

  const currentPosition = useMemo<Position | undefined>(() => {
    return getPosition(state.positionId);
  }, [state.positionId]);

  const currentEquipIndex = useMemo(() => {
    return Math.min(state.activeEquipIndex, state.history.length - 1);
  }, [state.activeEquipIndex, state.history.length]);

  const currentEquipAffixCount = useMemo(() => {
    return state.history[currentEquipIndex]?.affixes.length ?? 0;
  }, [state.history, currentEquipIndex]);

  const isWeaponPosition = useMemo(() => {
    return state.positionId === 'leftWeapon' || state.positionId === 'rightWeapon';
  }, [state.positionId]);

  const firstAffixOptions = useMemo<Affix[]>(() => {
    if (!currentPosition) return [];
    return currentPosition.affixes.filter(affix => canBeFirstAffix(state.positionId, affix, false));
  }, [currentPosition, state.positionId]);

  const currentElementAttackCount = useMemo(() => {
    const affixes = state.history[currentEquipIndex]?.affixes ?? [];
    return affixes.filter(id => {
      const affix = currentPosition?.affixes.find(a => a.id === id);
      return affix && isElementAttackAffix(affix);
    }).length;
  }, [state, currentEquipIndex, currentPosition]);

  const currentDamageCount = useMemo(() => {
    const affixes = state.history[currentEquipIndex]?.affixes ?? [];
    return affixes.filter(id => {
      const affix = currentPosition?.affixes.find(a => a.id === id);
      const isWeaponSpecial = isWeaponPosition && id === 'weaponTypeDmg';
      return (affix && isDamageAffix(affix)) || isWeaponSpecial;
    }).length;
  }, [state, currentEquipIndex, currentPosition, isWeaponPosition]);

  const affixPool = useMemo<AffixPoolEntry[]>(() => {
    if (!currentPosition) return [];

    const allAffixes: (Affix & { isSpecial: boolean })[] = currentPosition.affixes.map(a => ({
      ...a,
      isSpecial: false,
    }));
    if (currentPosition.specialAffix) {
      allAffixes.push({
        id: currentPosition.specialAffix.id,
        name: isWeaponPosition ? getWeaponDamageName(state.weaponType) : '',
        category: 'damage',
        weight: currentPosition.specialAffix.weight,
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

    const entries: AffixPoolEntry[] = allAffixes.map(affix => {
      const remaining = supplementCount - (consumedCount[affix.id] ?? 0);
      const isAlreadyInEquip = currentEquipAffixes.includes(affix.id);

      let canAppear = !isAlreadyInEquip && remaining > 0;

      if (canAppear && isElementAttackAffix(affix)) {
        if (currentElementAttackCount >= 2) {
          canAppear = false;
        }
      }

      if (canAppear && isDamageAffix(affix)) {
        if (currentDamageCount >= 1) {
          canAppear = false;
        }
      }

      return {
        ...affix,
        remainingCount: remaining,
        probability: 0,
        canAppear,
      };
    });

    const totalAvailableWeight = entries.reduce((sum, entry) => {
      if (entry.canAppear) {
        return sum + entry.weight * entry.remainingCount;
      }
      return sum;
    }, 0);

    for (const entry of entries) {
      if (entry.canAppear && totalAvailableWeight > 0) {
        entry.probability = (entry.weight * entry.remainingCount) / totalAvailableWeight * 100;
      } else {
        entry.probability = 0;
      }
    }

    return entries;
  }, [currentPosition, state, currentEquipIndex, currentElementAttackCount, currentDamageCount, isWeaponPosition]);

  const totalPoolRemaining = useMemo(() => {
    return affixPool.reduce((sum, a) => sum + a.remainingCount, 0);
  }, [affixPool]);

  const targetProbability = useMemo(() => {
    return affixPool
      .filter(a => state.targetAffixes.includes(a.id) && a.canAppear)
      .reduce((sum, a) => sum + a.probability, 0);
  }, [affixPool, state.targetAffixes]);

  const setPosition = useCallback((positionId: string) => {
    setState({
      positionId,
      activeEquipIndex: 0,
      history: [{ firstAffix: '', affixes: [] }],
      weaponType: weaponTypes[0].id,
      targetAffixes: [],
    });
  }, []);

  const setWeaponType = useCallback((weaponTypeId: string) => {
    setState(prev => ({ ...prev, weaponType: weaponTypeId }));
  }, []);

  const selectEquip = useCallback((equipIndex: number) => {
    setState(prev => {
      if (equipIndex < 0 || equipIndex >= prev.history.length) {
        return prev;
      }
      return { ...prev, activeEquipIndex: equipIndex };
    });
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
        return { ...prev, activeEquipIndex: newHistory.length - 1, history: newHistory };
      }

      return { ...prev, history: newHistory };
    });
  }, [currentEquipIndex]);

  const removeLastHistory = useCallback(() => {
    setState(prev => {
      const newHistory = [...prev.history];
      const currentEquip = newHistory[currentEquipIndex];
      if (!currentEquip) {
        return prev;
      }

      if (currentEquip.affixes.length === 0 && currentEquipIndex > 0) {
        newHistory.splice(currentEquipIndex, 1);
        const nextActiveIndex = Math.min(currentEquipIndex - 1, newHistory.length - 1);
        const prevEquip = newHistory[nextActiveIndex];
        if (prevEquip.affixes.length > 0) {
          newHistory[nextActiveIndex] = {
            ...prevEquip,
            affixes: prevEquip.affixes.slice(0, -1),
          };
        }
        return { ...prev, activeEquipIndex: nextActiveIndex, history: newHistory };
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
        return { ...prev, activeEquipIndex: newHistory.length - 1, history: newHistory };
      }
      return prev;
    });
  }, []);

  const reset = useCallback(() => {
    setState({ ...defaultState });
  }, []);

  const toggleTarget = useCallback((affixId: string) => {
    setState(prev => {
      const targets = prev.targetAffixes.includes(affixId)
        ? prev.targetAffixes.filter(id => id !== affixId)
        : [...prev.targetAffixes, affixId];
      return { ...prev, targetAffixes: targets };
    });
  }, []);

  const exportData = useCallback(() => {
    const data = {
      positionId: state.positionId,
      weaponType: state.weaponType,
      targetAffixes: state.targetAffixes,
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
          const history: EquipRecord[] = data.history.map((item: string[] | EquipRecord) => {
            if (Array.isArray(item)) {
              return { firstAffix: '', affixes: item };
            }
            return item;
          });
          const safeHistory = history.length > 0 ? history : [{ firstAffix: '', affixes: [] }];
          setState({
            positionId: data.positionId,
            activeEquipIndex: Math.max(0, safeHistory.length - 1),
            history: safeHistory,
            weaponType: data.weaponType ?? weaponTypes[0].id,
            targetAffixes: data.targetAffixes ?? [],
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
    weaponTypes,
    state,
    currentPosition,
    currentEquipIndex,
    currentEquipAffixCount,
    isWeaponPosition,
    firstAffixOptions,
    affixPool,
    totalPoolRemaining,
    targetProbability,
    setPosition,
    setWeaponType,
    selectEquip,
    setFirstAffix,
    addHistory,
    removeLastHistory,
    startNewEquip,
    reset,
    toggleTarget,
    exportData,
    importData,
  };
}