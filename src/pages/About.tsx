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
            调律是燕云十六声中提升装备词条的重要方式。通过调律，你可以为装备添加词条，从而优化角色的属性。调律不关心词条数值大小和品质颜色，只关心词条本身对不对 — 品质可以后期通过承音提升。
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
            <li><strong>选择武器类型</strong>（仅武器位置） — 武器增伤词条会根据武器类型自动限定</li>
            <li><strong>记录调律结果</strong> — 每次调律后，点击出现的词条进行记录</li>
            <li><strong>标记目标词条</strong> — 点击词条旁的 ☆ 星标，标记你想要的词条，查看目标总概率</li>
            <li><strong>观察概率变化</strong> — 工具会实时计算未出现词条的剩余概率</li>
            <li><strong>决定行动</strong> — 当目标词条概率升高时，决定是继续垫还是上好装备</li>
          </ol>
        </section>

        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            目标词条功能
          </h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            点击词条池中每个词条旁的 ☆ 按钮，可以将该词条标记为目标词条。标记后：
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
            <li>词条边框变为红色加粗，显示 ★ 标记</li>
            <li>统计区新增"目标概率"指标，显示所有目标词条的总概率</li>
            <li>装备卡片中目标词条也会显示 ★ 标记</li>
            <li>切换装备位置时目标标记自动清除</li>
          </ul>
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
            各位置的概率基于游戏内实际权重计算：
          </p>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, marginTop: '0.75rem', paddingLeft: '1.5rem' }}>
            <li><strong>左/右武器</strong>：增伤类权重 1（≈5.9%），其余14词权重 ≈1.143（≈6.7%）</li>
            <li><strong>环/佩</strong>：21词条等概率，每个 ≈4.76%</li>
            <li><strong>冠胄/胸甲</strong>：22词条等概率，每个 ≈4.55%</li>
            <li><strong>胫甲/腕甲</strong>：增伤类权重 1（≈4%），其余20词权重 1.15（≈4.6%）</li>
          </ul>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginTop: '0.75rem' }}>
            工具中的概率基于以上权重和已出现词条的剩余数量动态计算。每次调律都是独立随机事件，过往记录不影响下一次的结果，概率仅供参考。
          </p>
        </section>

        <section style={{ padding: '1.5rem', background: 'var(--color-card)', borderRadius: '0.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--color-text)' }}>
            词条约束规则
          </h2>
          <ul style={{ color: 'var(--color-text-muted)', lineHeight: 1.9, paddingLeft: '1.5rem' }}>
            <li>一件装备最多出现 <strong>2条</strong> 属性攻击类词条</li>
            <li>一件装备最多出现 <strong>1条</strong> 增伤类词条（含武器类型增伤/全武学增伤/奇术增伤/对首领/对玩家）</li>
            <li>同一词条不会在同一件装备上重复出现</li>
            <li>武器增伤词条根据武器类型自动限定（如剑武器只出剑武学增伤）</li>
          </ul>
        </section>
      </div>
    </div>
  );
}