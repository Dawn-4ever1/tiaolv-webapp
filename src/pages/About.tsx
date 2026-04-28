export default function About() {
  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
        使用说明
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            什么是调律？
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            调律是燕云十六声中提升装备词条的重要方式。通过调律，你可以为装备添加或替换词条，从而优化角色的属性。
          </p>
        </section>

        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            什么是垫子调律法？
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            垫子调律法是一种优化调律效率的策略。其核心原理是：
          </p>
          <ol style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
            <li>每次调律时，系统会从词条池中随机抽取词条</li>
            <li>不想要的词条先在"垫子"（不需要的装备）上"过掉"</li>
            <li>当好词条大概率要出现时，再调律你需要的好装备</li>
          </ol>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginTop: '0.75rem' }}>
            这个工具帮你追踪已出现的词条，计算剩余词条的概率，让你能更好地判断什么时候该上好装备。
          </p>
        </section>

        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            如何使用
          </h2>
          <ol style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, paddingLeft: '1.5rem' }}>
            <li><strong>选择装备位置</strong> — 根据你要追踪的垫子选择对应的位置</li>
            <li><strong>记录调律结果</strong> — 每次调律后，点击出现的词条进行记录</li>
            <li><strong>观察概率变化</strong> — 工具会实时计算未出现词条的剩余概率</li>
            <li><strong>决定行动</strong> — 当目标词条概率升高时，决定是继续垫还是上好装备</li>
          </ol>
        </section>

        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            数据管理
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            工具不会自动保存你的数据。如果需要保存追踪进度，可以使用<strong>导出数据</strong>功能将进度保存为文件，下次使用时通过<strong>导入数据</strong>继续。
          </p>
        </section>

        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            关于概率计算
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            工具中的概率基于玩家社区的统计数据计算，实际概率可能有所偏差。另外，每次调律都是独立随机事件，过往记录不影响下一次的结果，概率仅供参考。
          </p>
        </section>
      </div>
    </div>
  );
}
