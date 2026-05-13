import { positions, getCategoryName, weaponTypes } from '../data/affixes';
import { categoryColors } from '../utils/styles';

export default function Database() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
        词条数据库
      </h1>

      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        各装备位置的调律词条池一览
      </p>

      {positions.map(position => {
        const totalAffixCount = position.affixes.length + (position.specialAffix ? 1 : 0);

        return (
          <div
            key={position.id}
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'var(--color-card)',
              borderRadius: '0.75rem',
            }}
          >
            <h2 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>
              {position.name}
            </h2>

            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              共 {totalAffixCount} 个词条
            </div>

            {/* 武器类型增伤说明 */}
            {position.specialAffix?.type === 'weaponDamage' && (
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
                marginBottom: '1rem',
                padding: '0.5rem 0.75rem',
                background: 'var(--color-bg)',
                borderRadius: '0.3rem',
                borderLeft: '3px solid var(--color-damage)',
              }}>
                武器增伤词条根据武器类型自动限定：{weaponTypes.map(wt => wt.damageAffixName).join('、')}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
                      {categoryAffixes.map(affix => {
                        return (
                          <span
                            key={affix.id}
                            style={{
                              padding: '0.35rem 0.75rem',
                              background: 'var(--color-bg)',
                              border: `1px solid ${categoryColors[category]}`,
                              borderRadius: '0.35rem',
                              fontSize: '0.85rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            {affix.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* 武器特殊词条 */}
              {position.specialAffix?.type === 'weaponDamage' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    color: categoryColors.damage,
                    marginBottom: '0.5rem',
                  }}>
                    武器类型增伤
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {weaponTypes.map(wt => {
                      return (
                        <span
                          key={wt.id}
                          style={{
                            padding: '0.35rem 0.75rem',
                            background: 'var(--color-bg)',
                            border: `1px solid ${categoryColors.damage}`,
                            borderRadius: '0.35rem',
                            fontSize: '0.85rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          {wt.damageAffixName}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}