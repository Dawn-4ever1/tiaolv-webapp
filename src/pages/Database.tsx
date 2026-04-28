import { positions, getCategoryName } from '../data/affixes';

export default function Database() {
  const categoryColors: Record<string, string> = {
    physAtk: 'var(--color-physAtk)',
    elemAtk: 'var(--color-elemAtk)',
    survival: 'var(--color-survival)',
    rate: 'var(--color-rate)',
    damage: 'var(--color-damage)',
    attr: 'var(--color-attr)',
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
        词条数据库
      </h1>

      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        各装备位置的调律词条池一览
      </p>

      {positions.map(position => (
        <div
          key={position.id}
          style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--color-card)',
            borderRadius: '0.75rem',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            {position.name}
          </h2>

          <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
            共 {position.affixes.length + (position.specialAffix ? 1 : 0)} 个词条
            {position.specialAffix && (
              <span style={{ color: 'var(--color-damage)' }}>
                （含特殊词条：{position.specialAffix.name}，出现概率 1/{position.specialAffix.weight}）
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* 按类别分组 */}
            {(['physAtk', 'elemAtk', 'survival', 'rate', 'damage', 'attr'] as const).map(category => {
              const categoryAffixes = position.affixes.filter(a => a.category === category);
              if (categoryAffixes.length === 0) return null;

              return (
                <div key={category}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: categoryColors[category],
                    marginBottom: '0.5rem',
                  }}>
                    {getCategoryName(category)}（{categoryAffixes.length}个）
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {categoryAffixes.map(affix => (
                      <span
                        key={affix.id}
                        style={{
                          padding: '0.35rem 0.75rem',
                          background: 'var(--color-bg)',
                          border: `1px solid ${categoryColors[category]}`,
                          borderRadius: '0.35rem',
                          fontSize: '0.85rem',
                        }}
                      >
                        {affix.name}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 特殊词条 */}
            {position.specialAffix && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                  color: categoryColors.damage,
                  marginBottom: '0.5rem',
                }}>
                  特殊词条
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span
                    style={{
                      padding: '0.35rem 0.75rem',
                      background: 'var(--color-bg)',
                      border: `1px solid ${categoryColors.damage}`,
                      borderRadius: '0.35rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    {position.specialAffix.name}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
