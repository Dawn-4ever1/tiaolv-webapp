import { useState, useCallback, useMemo } from 'react';
import { positions, getPosition, type Position, type Affix } from '../data/affixes';

export interface EquipRecord {
  firstAffix: string;
  affixes: string[];
}

export interface TrackerState {
  positionId: string;
  activeEquipIndex: number;
  history: EquipRecord[];
}

export interface AffixPoolEntry extends Affix {
  isSpecial: boolean;
  remainingCount: number;
  probability: number;
  canAppear: boolean;
}

// 判断词条是否属于属性攻击类
function isElementAttackAffix(affix: Affix): boolean {
  return affix.category === 'elemAtk';
}

// 判断词条是否属于增伤类
function isDamageAffix(affix: Affix): boolean {
  return affix.category === 'damage';
}

export function useTracker() {
  const [state, setState] = useState<TrackerState>({
    positionId: 'huan',
    activeEquipIndex: 0,
    history: [{ firstAffix: '', affixes: [] }],
  });

  const currentPosition = useMemo<Position | undefined>(() => {
    return getPosition(state.positionId);
  }, [state.positionId]);

  const currentEquipIndex = useMemo(() => {
    return Math.min(state.activeEquipIndex, state.history.length - 1);
  }, [state.activeEquipIndex, state.history.length]);

  const currentEquipAffixCount = useMemo(() => {
    return state.history[currentEquipIndex]?.affixes.length ?? 0;
  }, [state.history, currentEquipIndex]);

  // 当前装备已出的属性攻击词条数
  const currentElementAttackCount = useMemo(() => {
    const affixes = state.history[currentEquipIndex]?.affixes ?? [];
    return affixes.filter(id => {
      const affix = currentPosition?.affixes.find(a => a.id === id);
      return affix && isElementAttackAffix(affix);
    }).length;
  }, [state, currentEquipIndex, currentPosition]);

  // 当前装备已出的增伤词条数
  const currentDamageCount = useMemo(() => {
    const affixes = state.history[currentEquipIndex]?.affixes ?? [];
    return affixes.filter(id => {
      const affix = currentPosition?.affixes.find(a => a.id === id);
      const specialId = currentPosition?.specialAffix?.id;
      return (affix && isDamageAffix(affix)) || id === specialId;
    }).length;
  }, [state, currentEquipIndex, currentPosition]);

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

    // 判断每个词条能否出现（考虑约束）
    const entries: AffixPoolEntry[] = allAffixes.map(affix => {
      const remaining = supplementCount - (consumedCount[affix.id] ?? 0);
      const isAlreadyInEquip = currentEquipAffixes.includes(affix.id);

      let canAppear = !isAlreadyInEquip && remaining > 0;

      // 属性攻击约束：一件装备最多2条
      if (canAppear && isElementAttackAffix(affix)) {
        if (currentElementAttackCount >= 2) {
          canAppear = false;
        }
      }

      // 增伤类约束：一件装备最多1条
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

    // 大类初始比例（仅用于计算单个词条的基础权重）
    const categoryRatio: Record<string, number> = {
      damage: 5,
      survival: 15,
      physAtk: 20,
      elemAtk: 20,
      rate: 20,
      attr: 20,
    };

    // 每个大类的词条总数（用于计算单个词条权重）
    const affixesInCategory: Record<string, number> = {};
    for (const affix of allAffixes) {
      affixesInCategory[affix.category] = (affixesInCategory[affix.category] ?? 0) + 1;
    }

    // 单个词条的基础权重 = 大类比例 / 类内词条数
    const affixWeight: Record<string, number> = {};
    for (const affix of allAffixes) {
      affixWeight[affix.id] = categoryRatio[affix.category] / (affixesInCategory[affix.category] ?? 1);
    }

    // 计算概率：每个词条概率 = (权重 × 剩余数量) / 可出现词条总权重 × 100
    const totalAvailableWeight = entries.reduce((sum, entry) => {
      if (entry.canAppear) {
        return sum + affixWeight[entry.id] * entry.remainingCount;
      }
      return sum;
    }, 0);

    for (const entry of entries) {
      if (entry.canAppear && totalAvailableWeight > 0) {
        entry.probability = (affixWeight[entry.id] * entry.remainingCount) / totalAvailableWeight * 100;
      } else {
        entry.probability = 0;
      }
    }

    return entries;
  }, [currentPosition, state, currentEquipIndex, currentElementAttackCount, currentDamageCount]);

  const totalPoolRemaining = useMemo(() => {
    return affixPool.reduce((sum, a) => sum + a.remainingCount, 0);
  }, [affixPool]);

  const setPosition = useCallback((positionId: string) => {
    setState({ positionId, activeEquipIndex: 0, history: [{ firstAffix: '', affixes: [] }] });
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
    setState(prev => ({ ...prev, activeEquipIndex: 0, history: [{ firstAffix: '', affixes: [] }] }));
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
    affixPool,
    totalPoolRemaining,
    setPosition,
    selectEquip,
    setFirstAffix,
    addHistory,
    removeLastHistory,
    startNewEquip,
    reset,
    exportData,
    importData,
  };
}
