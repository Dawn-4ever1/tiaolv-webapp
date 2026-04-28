import { useTracker } from '../hooks/useTracker';
import { getCategoryName } from '../data/affixes';
import { useRef } from 'react';

export default function Tracker() {
  const {
    positions,
    state,
    affixesWithStats,
    appearedAffixes,
    remainingAffixes,
    setPosition,
    addHistory,
    removeLastHistory,
    reset,
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

  const categoryColors: Record<string, string> = {
    attack: 'var(--color-attack)',
    survival: 'var(--color-survival)',
    rate: 'var(--color-rate)',
    damage: 'var(--color-damage)',
    attr: 'var(--color-attr)',
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
        调律追踪器
      </h1>

      {/* 位置选择 */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
          选择装备位置
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {positions.map(pos => (
            <button
              key={pos.id}
              onClick={() => setPosition(pos.id)}
              style={{
                padding: '0.5rem 1rem',
                background: state.positionId === pos.id ? 'var(--color-primary)' : 'var(--color-card)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                fontWeight: state.positionId === pos.id ? 'bold' : 'normal',
              }}
            >
              {pos.name}
            </button>
          ))}
        </div>
      </div>

      {/* 添加词条 */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
          记录本次调律出现的词条
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {affixesWithStats.map(affix => (
            <button
              key={affix.id}
              onClick={() => addHistory(affix.id)}
              style={{
                padding: '0.5rem 0.75rem',
                background: affix.isAppeared ? 'var(--color-secondary)' : 'var(--color-bg)',
                color: 'var(--color-text)',
                border: `1px solid ${categoryColors[affix.category] || 'var(--color-border)'}`,
                borderRadius: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              {affix.name}
            </button>
          ))}
        </div>
      </div>

      {/* 统计面板 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ padding: '1rem', background: 'var(--color-card)', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
            {state.history.length}
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>已记录次数</div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--color-card)', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-survival)' }}>
            {remainingAffixes.length}
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>剩余未出现词条</div>
        </div>
        <div style={{ padding: '1rem', background: 'var(--color-card)', borderRadius: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-attack)' }}>
            {appearedAffixes.length}
          </div>
          <div style={{ color: 'var(--color-text-muted)' }}>已出现词条</div>
        </div>
      </div>

      {/* 已出现词条 */}
      {appearedAffixes.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            已出现词条
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {appearedAffixes.map(affix => (
              <div
                key={affix.id}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: 'var(--color-card)',
                  border: `1px solid ${categoryColors[affix.category] || 'var(--color-border)'}`,
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <span style={{ color: categoryColors[affix.category] }}>
                  [{getCategoryName(affix.category)}]
                </span>{' '}
                {affix.name}
                {affix.timesAppeared > 1 && (
                  <span style={{ color: 'var(--color-text-muted)' }}> x{affix.timesAppeared}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 剩余词条概率 */}
      {remainingAffixes.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            剩余未出现词条 — 本次出现概率
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {remainingAffixes
              .sort((a, b) => b.probability - a.probability)
              .map(affix => (
                <div
                  key={affix.id}
                  style={{
                    padding: '0.75rem',
                    background: 'var(--color-card)',
                    border: `1px solid ${categoryColors[affix.category] || 'var(--color-border)'}`,
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.85rem' }}>{affix.name}</span>
                  <span style={{
                    fontWeight: 'bold',
                    color: categoryColors[affix.category],
                  }}>
                    {affix.probability.toFixed(1)}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={removeLastHistory}
          disabled={state.history.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            background: state.history.length > 0 ? 'var(--color-secondary)' : 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            opacity: state.history.length === 0 ? 0.5 : 1,
          }}
        >
          撤销上次
        </button>
        <button
          onClick={reset}
          disabled={state.history.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            background: state.history.length > 0 ? 'var(--color-primary)' : 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            opacity: state.history.length === 0 ? 0.5 : 1,
          }}
        >
          重置记录
        </button>
        <button
          onClick={exportData}
          disabled={state.history.length === 0}
          style={{
            padding: '0.75rem 1.5rem',
            background: state.history.length > 0 ? 'var(--color-secondary)' : 'var(--color-bg)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            opacity: state.history.length === 0 ? 0.5 : 1,
          }}
        >
          导出数据
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--color-secondary)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
          }}
        >
          导入数据
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
