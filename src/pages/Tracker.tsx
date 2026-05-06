import React, { useRef } from 'react';
import { useTracker } from '../hooks/useTracker';
import { getCategoryName, getWeaponDamageName } from '../data/affixes';
import { categoryColors } from '../utils/styles';

export default function Tracker() {
  const {
    positions,
    weaponTypes,
    state,
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
  } = useTracker();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file);
      e.target.value = '';
    }
  };

  const selectedEquip = currentEquipIndex;
  const isCurrentEquip = true;
  const hasHistory = !state.history.every(e => e.affixes.length === 0);

  const maxProbabilityInCategory = (category: string) => {
    return Math.max(...affixPool.filter(a => a.category === category && a.canAppear).map(a => a.probability), 0);
  };

  // Resolve weapon special affix display name for equipment cards
  const resolveAffixName = (affixId: string) => {
    if (affixId === 'weaponTypeDmg' && isWeaponPosition) {
      return getWeaponDamageName(state.weaponType);
    }
    const affix = affixPool.find(a => a.id === affixId);
    return affix?.name ?? '—';
  };

  const resolveAffixCategory = (affixId: string) => {
    if (affixId === 'weaponTypeDmg') return 'damage';
    const affix = affixPool.find(a => a.id === affixId);
    return affix?.category ?? 'attr';
  };

  return (
    <div className="tracker-page" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* 标题 + 位置选择同一行 */}
      <div className="tracker-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h1 className="tracker-title" style={{ fontSize: '1.8rem', color: 'var(--color-primary)' }}>
          调律追踪器
        </h1>
        <div className="position-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {positions.map(pos => (
            <button
              key={pos.id}
              className="position-tab"
              onClick={() => setPosition(pos.id)}
              style={{
                padding: '0.4rem 0.8rem',
                background: state.positionId === pos.id ? 'var(--color-primary)' : 'var(--color-card)',
                color: 'var(--color-text)',
                border: `1px solid ${state.positionId === pos.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '0.4rem',
                fontSize: '0.9rem',
                fontWeight: state.positionId === pos.id ? 'bold' : 'normal',
              }}
            >
              {pos.name}
            </button>
          ))}
        </div>
      </div>

      {/* 武器类型选择器 */}
      {isWeaponPosition && (
        <div className="weapon-type-row" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>武器类型</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {weaponTypes.map(wt => (
              <button
                key={wt.id}
                className="weapon-type-tab"
                onClick={() => setWeaponType(wt.id)}
                style={{
                  padding: '0.3rem 0.6rem',
                  background: state.weaponType === wt.id ? 'var(--color-damage)' : 'var(--color-card)',
                  color: state.weaponType === wt.id ? 'var(--color-text)' : 'var(--color-text-muted)',
                  border: `1px solid ${state.weaponType === wt.id ? 'var(--color-damage)' : 'var(--color-border)'}`,
                  borderRadius: '0.3rem',
                  fontSize: '0.8rem',
                  fontWeight: state.weaponType === wt.id ? 'bold' : 'normal',
                }}
              >
                {wt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 装备卡片横排 */}
      <div className="equipment-row" style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
        {state.history.map((equip, equipIdx) => {
          const isSelected = selectedEquip === equipIdx;
          const isActive = equipIdx === currentEquipIndex && equip.affixes.length < 4;

          return (
            <div
              key={equipIdx}
              className="equip-card"
              onClick={() => selectEquip(equipIdx)}
              style={{
                background: isSelected ? 'var(--color-secondary)' : 'var(--color-card)',
                border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                borderRadius: '0.75rem',
                padding: '0.75rem',
                cursor: 'pointer',
                minWidth: '160px',
              }}
            >
              <div style={{
                fontSize: '0.85rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isSelected ? 'bold' : 'normal',
                marginBottom: '0.5rem',
              }}>
                {isActive ? `第${equipIdx + 1}件 · 调律中` : `第${equipIdx + 1}件装备`}
              </div>

              {/* 首词条 */}
              <div style={{
                padding: '0.5rem 0.7rem',
                borderBottom: '1px solid var(--color-border)',
                fontSize: '0.8rem',
                color: equip.firstAffix
                  ? categoryColors[resolveAffixCategory(equip.firstAffix)]
                  : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>首词条</span>
                {equipIdx === currentEquipIndex ? (
                  <select
                    value={equip.firstAffix}
                    onChange={(e) => setFirstAffix(e.target.value)}
                    title="首词条"
                    style={{
                      background: 'var(--color-bg)',
                      color: equip.firstAffix ? 'var(--color-text)' : 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.3rem',
                      padding: '0.3rem',
                      fontSize: '0.8rem',
                      flex: 1,
                    }}
                  >
                    <option value="">—</option>
                    {firstAffixOptions.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                ) : (
                  <span>
                    {equip.firstAffix ? resolveAffixName(equip.firstAffix) : '—'}
                  </span>
                )}
              </div>

              {/* 调律词条 */}
              {[0, 1, 2, 3].map(index => {
                const affixId = equip.affixes[index];
                const isTarget = affixId && state.targetAffixes.includes(affixId);

                return (
                  <div key={index} style={{
                    padding: '0.5rem 0.7rem',
                    borderBottom: index < 3 ? '1px solid var(--color-border)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                      {index + 1}
                    </span>
                    {isTarget && <span style={{ color: 'var(--color-primary)', fontSize: '0.7rem' }}>★</span>}
                    <span style={{
                      fontSize: '0.85rem',
                      color: affixId ? categoryColors[resolveAffixCategory(affixId)] : 'var(--color-text-muted)',
                      fontWeight: isTarget ? 'bold' : 'normal',
                    }}>
                      {affixId ? resolveAffixName(affixId) : '—'}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* 新增装备 */}
        <button
          className="new-equip-button"
          onClick={startNewEquip}
          style={{
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            minWidth: '80px',
            textAlign: 'center',
          }}
        >
          + 新装备
        </button>
      </div>

      {/* 词条池大框 */}
      <div className="pool-card" style={{
        background: 'var(--color-card)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
      }}>
        {/* 池信息 */}
        <div className="stats-row" style={{
          display: 'flex',
          gap: '1.5rem',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '0.75rem',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
              {currentEquipIndex + 1}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>装备</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-survival)' }}>
              {totalPoolRemaining}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>池剩余</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-physAtk)' }}>
              {isCurrentEquip ? 4 - currentEquipAffixCount : 0}
            </div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>可调次数</div>
          </div>
          {state.targetAffixes.length > 0 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--color-damage)' }}>
                {targetProbability.toFixed(1)}%
              </div>
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>目标概率</div>
            </div>
          )}
        </div>

        {/* 目标概率条 */}
        {state.targetAffixes.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>目标词条总概率</span>
              <div style={{
                flex: 1,
                height: '6px',
                background: 'var(--color-border)',
                borderRadius: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.min(targetProbability, 100)}%`,
                  background: 'var(--color-damage)',
                  borderRadius: '3px',
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-damage)' }}>
                {targetProbability.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* 词条池 - 类别并列 */}
        <div className="affix-pool-grid" style={{ display: 'flex', gap: '0.75rem' }}>
          {(['physAtk', 'elemAtk', 'survival', 'rate', 'damage', 'attr'] as const).map(category => {
            const categoryAffixes = affixPool.filter(a => a.category === category);
            if (categoryAffixes.length === 0) return null;
            const maxProb = maxProbabilityInCategory(category);

            return (
              <div key={category} className="affix-category" style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: categoryColors[category],
                  marginBottom: '0.4rem',
                  borderBottom: `1px solid ${categoryColors[category]}`,
                  paddingBottom: '0.2rem',
                }}>
                  {getCategoryName(category)}
                </div>
                {categoryAffixes.map(a => {
                  const canClick = isCurrentEquip && a.canAppear && currentEquipAffixCount < 4;
                  const isTarget = state.targetAffixes.includes(a.id);

                  return (
                    <div
                      key={a.id}
                      className="affix-row"
                      onClick={canClick ? () => addHistory(a.id) : undefined}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.45rem 0.5rem',
                        borderLeft: `${isTarget ? 3 : 2}px solid ${isTarget ? 'var(--color-primary)' : categoryColors[category]}`,
                        marginBottom: '0.15rem',
                        fontSize: '0.8rem',
                        opacity: !a.canAppear ? 0.3 : 1,
                        cursor: canClick ? 'pointer' : 'default',
                        background: canClick ? 'var(--color-bg)' : 'transparent',
                        fontWeight: isTarget ? 'bold' : 'normal',
                        position: 'relative',
                      }}
                    >
                      {/* 星标 + 名称 */}
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleTarget(a.id); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: isTarget ? '0.75rem' : '0.65rem',
                            color: isTarget ? 'var(--color-primary)' : 'var(--color-text-muted)',
                            padding: 0,
                            lineHeight: 1,
                          }}
                        >
                          {isTarget ? '★' : '☆'}
                        </button>
                        {a.name}
                      </span>
                      {/* 剩余 + 概率 + 微型概率条 */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flex: '0 0 auto' }}>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                          {a.remainingCount}
                        </span>
                        <span style={{
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          color: canClick ? categoryColors[category] : 'var(--color-text-muted)',
                        }}>
                          {a.probability > 0 ? `${a.probability.toFixed(1)}%` : '—'}
                        </span>
                        {a.probability > 0 && maxProb > 0 && (
                          <div style={{
                            width: '24px',
                            height: '4px',
                            background: 'var(--color-border)',
                            borderRadius: '2px',
                            overflow: 'hidden',
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${(a.probability / maxProb) * 100}%`,
                              background: categoryColors[category],
                              borderRadius: '2px',
                            }} />
                          </div>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="actions-row" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={removeLastHistory}
          disabled={!hasHistory}
          style={{
            padding: '0.6rem 1.2rem',
            background: hasHistory ? 'var(--color-secondary)' : 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
            opacity: hasHistory ? 1 : 0.5,
          }}
        >
          撤销
        </button>
        <button
          onClick={reset}
          disabled={!hasHistory}
          style={{
            padding: '0.6rem 1.2rem',
            background: hasHistory ? 'var(--color-primary)' : 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
            opacity: hasHistory ? 1 : 0.5,
          }}
        >
          重置
        </button>
        <button
          onClick={exportData}
          disabled={!hasHistory}
          style={{
            padding: '0.6rem 1.2rem',
            background: hasHistory ? 'var(--color-secondary)' : 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
            opacity: hasHistory ? 1 : 0.5,
          }}
        >
          导出
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '0.6rem 1.2rem',
            background: 'var(--color-secondary)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
          }}
        >
          导入
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}