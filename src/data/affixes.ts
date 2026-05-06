export interface Affix {
  id: string;
  name: string;
  category: 'physAtk' | 'elemAtk' | 'survival' | 'rate' | 'damage' | 'attr';
  weight: number;
}

export interface WeaponDamageAffix {
  id: 'weaponTypeDmg';
  weight: number;
  type: 'weaponDamage';
}

export interface Position {
  id: string;
  name: string;
  affixes: Affix[];
  specialAffix?: WeaponDamageAffix;
}

export interface WeaponType {
  id: string;
  name: string;
  damageAffixName: string;
}

export const weaponTypes: WeaponType[] = [
  { id: 'jian', name: '剑', damageAffixName: '剑武学增伤' },
  { id: 'qiang', name: '枪', damageAffixName: '枪武学增伤' },
  { id: 'hengDao', name: '横刀', damageAffixName: '横刀武学增伤' },
  { id: 'moDao', name: '陌刀', damageAffixName: '陌刀武学增伤' },
  { id: 'shuangDao', name: '双刀', damageAffixName: '双刀武学增伤' },
  { id: 'san', name: '伞', damageAffixName: '伞武学增伤' },
  { id: 'shan', name: '扇', damageAffixName: '扇武学增伤' },
  { id: 'shengBiao', name: '绳镖', damageAffixName: '绳镖武学增伤' },
  { id: 'shouJia', name: '手甲', damageAffixName: '手甲武学增伤' },
];

export const positions: Position[] = [
  {
    id: 'leftWeapon',
    name: '左武器',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 16 / 14 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 16 / 14 },
      { id: 'maxWuXiangAtk', name: '最大无相攻击', category: 'elemAtk', weight: 16 / 14 },
      { id: 'minWuXiangAtk', name: '最小无相攻击', category: 'elemAtk', weight: 16 / 14 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 16 / 14 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 16 / 14 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 16 / 14 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 16 / 14 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 16 / 14 },
      { id: 'jing', name: '劲', category: 'attr', weight: 16 / 14 },
      { id: 'shi', name: '势', category: 'attr', weight: 16 / 14 },
      { id: 'min', name: '敏', category: 'attr', weight: 16 / 14 },
      { id: 'ti', name: '体', category: 'attr', weight: 16 / 14 },
      { id: 'yu', name: '御', category: 'attr', weight: 16 / 14 },
    ],
    specialAffix: { id: 'weaponTypeDmg', weight: 1, type: 'weaponDamage' },
  },
  {
    id: 'rightWeapon',
    name: '右武器',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 16 / 14 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 16 / 14 },
      { id: 'maxWuXiangAtk', name: '最大无相攻击', category: 'elemAtk', weight: 16 / 14 },
      { id: 'minWuXiangAtk', name: '最小无相攻击', category: 'elemAtk', weight: 16 / 14 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 16 / 14 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 16 / 14 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 16 / 14 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 16 / 14 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 16 / 14 },
      { id: 'jing', name: '劲', category: 'attr', weight: 16 / 14 },
      { id: 'shi', name: '势', category: 'attr', weight: 16 / 14 },
      { id: 'min', name: '敏', category: 'attr', weight: 16 / 14 },
      { id: 'ti', name: '体', category: 'attr', weight: 16 / 14 },
      { id: 'yu', name: '御', category: 'attr', weight: 16 / 14 },
    ],
    specialAffix: { id: 'weaponTypeDmg', weight: 1, type: 'weaponDamage' },
  },
  {
    id: 'huan',
    name: '环',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 1 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 1 },
      { id: 'maxMingJinAtk', name: '最大鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'minMingJinAtk', name: '最小鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxQianSiAtk', name: '最大牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'minQianSiAtk', name: '最小牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxLieShiAtk', name: '最大裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'minLieShiAtk', name: '最小裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxPoZhuAtk', name: '最大破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'minPoZhuAtk', name: '最小破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 1 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 1 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 1 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 1 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 1 },
      { id: 'quanWuXueZengShang', name: '全武学增伤', category: 'damage', weight: 1 },
      { id: 'jing', name: '劲', category: 'attr', weight: 1 },
      { id: 'shi', name: '势', category: 'attr', weight: 1 },
      { id: 'min', name: '敏', category: 'attr', weight: 1 },
      { id: 'ti', name: '体', category: 'attr', weight: 1 },
      { id: 'yu', name: '御', category: 'attr', weight: 1 },
    ],
  },
  {
    id: 'pei',
    name: '佩',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 1 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 1 },
      { id: 'maxMingJinAtk', name: '最大鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'minMingJinAtk', name: '最小鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxQianSiAtk', name: '最大牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'minQianSiAtk', name: '最小牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxLieShiAtk', name: '最大裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'minLieShiAtk', name: '最小裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxPoZhuAtk', name: '最大破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'minPoZhuAtk', name: '最小破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 1 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 1 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 1 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 1 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 1 },
      { id: 'quanWuXueZengShang', name: '全武学增伤', category: 'damage', weight: 1 },
      { id: 'jing', name: '劲', category: 'attr', weight: 1 },
      { id: 'shi', name: '势', category: 'attr', weight: 1 },
      { id: 'min', name: '敏', category: 'attr', weight: 1 },
      { id: 'ti', name: '体', category: 'attr', weight: 1 },
      { id: 'yu', name: '御', category: 'attr', weight: 1 },
    ],
  },
  {
    id: 'guanZhou',
    name: '冠胄',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 1 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 1 },
      { id: 'maxMingJinAtk', name: '最大鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'minMingJinAtk', name: '最小鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxQianSiAtk', name: '最大牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'minQianSiAtk', name: '最小牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxLieShiAtk', name: '最大裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'minLieShiAtk', name: '最小裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxPoZhuAtk', name: '最大破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'minPoZhuAtk', name: '最小破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 1 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 1 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 1 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 1 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 1 },
      { id: 'danTiQiShuZengShang', name: '单体奇术增伤', category: 'damage', weight: 1 },
      { id: 'qunTiQiShuZengShang', name: '群体奇术增伤', category: 'damage', weight: 1 },
      { id: 'jing', name: '劲', category: 'attr', weight: 1 },
      { id: 'shi', name: '势', category: 'attr', weight: 1 },
      { id: 'min', name: '敏', category: 'attr', weight: 1 },
      { id: 'ti', name: '体', category: 'attr', weight: 1 },
      { id: 'yu', name: '御', category: 'attr', weight: 1 },
    ],
  },
  {
    id: 'xiongJia',
    name: '胸甲',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 1 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 1 },
      { id: 'maxMingJinAtk', name: '最大鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'minMingJinAtk', name: '最小鸣金攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxQianSiAtk', name: '最大牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'minQianSiAtk', name: '最小牵丝攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxLieShiAtk', name: '最大裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'minLieShiAtk', name: '最小裂石攻击', category: 'elemAtk', weight: 1 },
      { id: 'maxPoZhuAtk', name: '最大破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'minPoZhuAtk', name: '最小破竹攻击', category: 'elemAtk', weight: 1 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 1 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 1 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 1 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 1 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 1 },
      { id: 'danTiQiShuZengShang', name: '单体奇术增伤', category: 'damage', weight: 1 },
      { id: 'qunTiQiShuZengShang', name: '群体奇术增伤', category: 'damage', weight: 1 },
      { id: 'jing', name: '劲', category: 'attr', weight: 1 },
      { id: 'shi', name: '势', category: 'attr', weight: 1 },
      { id: 'min', name: '敏', category: 'attr', weight: 1 },
      { id: 'ti', name: '体', category: 'attr', weight: 1 },
      { id: 'yu', name: '御', category: 'attr', weight: 1 },
    ],
  },
  {
    id: 'jingJia',
    name: '胫甲',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 1.15 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 1.15 },
      { id: 'maxMingJinAtk', name: '最大鸣金攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minMingJinAtk', name: '最小鸣金攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'maxQianSiAtk', name: '最大牵丝攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minQianSiAtk', name: '最小牵丝攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'maxLieShiAtk', name: '最大裂石攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minLieShiAtk', name: '最小裂石攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'maxPoZhuAtk', name: '最大破竹攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minPoZhuAtk', name: '最小破竹攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 1.15 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 1.15 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 1.15 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 1.15 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 1.15 },
      { id: 'duiShouLingDanWeiZengShang', name: '对首领单位增伤', category: 'damage', weight: 1 },
      { id: 'duiWanJiaDanWeiZengXiao', name: '对玩家单位增效', category: 'damage', weight: 1 },
      { id: 'jing', name: '劲', category: 'attr', weight: 1.15 },
      { id: 'shi', name: '势', category: 'attr', weight: 1.15 },
      { id: 'min', name: '敏', category: 'attr', weight: 1.15 },
      { id: 'ti', name: '体', category: 'attr', weight: 1.15 },
      { id: 'yu', name: '御', category: 'attr', weight: 1.15 },
    ],
  },
  {
    id: 'wanJia',
    name: '腕甲',
    affixes: [
      { id: 'maxPhysAtk', name: '最大外功攻击', category: 'physAtk', weight: 1.15 },
      { id: 'minPhysAtk', name: '最小外功攻击', category: 'physAtk', weight: 1.15 },
      { id: 'maxMingJinAtk', name: '最大鸣金攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minMingJinAtk', name: '最小鸣金攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'maxQianSiAtk', name: '最大牵丝攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minQianSiAtk', name: '最小牵丝攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'maxLieShiAtk', name: '最大裂石攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minLieShiAtk', name: '最小裂石攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'maxPoZhuAtk', name: '最大破竹攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'minPoZhuAtk', name: '最小破竹攻击', category: 'elemAtk', weight: 1.15 },
      { id: 'qiXue', name: '气血', category: 'survival', weight: 1.15 },
      { id: 'waiGongFangYu', name: '外功防御', category: 'survival', weight: 1.15 },
      { id: 'jingZhunLv', name: '精准率', category: 'rate', weight: 1.15 },
      { id: 'huiXinLv', name: '会心率', category: 'rate', weight: 1.15 },
      { id: 'huiYiLv', name: '会意率', category: 'rate', weight: 1.15 },
      { id: 'duiShouLingDanWeiZengShang', name: '对首领单位增伤', category: 'damage', weight: 1 },
      { id: 'duiWanJiaDanWeiZengXiao', name: '对玩家单位增效', category: 'damage', weight: 1 },
      { id: 'jing', name: '劲', category: 'attr', weight: 1.15 },
      { id: 'shi', name: '势', category: 'attr', weight: 1.15 },
      { id: 'min', name: '敏', category: 'attr', weight: 1.15 },
      { id: 'ti', name: '体', category: 'attr', weight: 1.15 },
      { id: 'yu', name: '御', category: 'attr', weight: 1.15 },
    ],
  },
];

export function getPosition(id: string): Position | undefined {
  return positions.find(p => p.id === id);
}

export function getWeaponDamageName(weaponTypeId: string): string {
  const wt = weaponTypes.find(w => w.id === weaponTypeId);
  return wt?.damageAffixName ?? '对应武学增伤';
}

export function getCategoryName(category: Affix['category']): string {
  const names: Record<Affix['category'], string> = {
    physAtk: '外功攻击',
    elemAtk: '属性攻击',
    survival: '生存类',
    rate: '三率类',
    damage: '增伤类',
    attr: '五维属性',
  };
  return names[category];
}

export function getWeightScheme(positionId: string): { type: 'equal' | 'weighted'; description: string } {
  if (positionId === 'leftWeapon' || positionId === 'rightWeapon') {
    return { type: 'weighted', description: '增伤类权重 1，其余词条权重 ≈1.143（增伤占比 ≈5.9%，其余 ≈6.7%）' };
  }
  if (positionId === 'jingJia' || positionId === 'wanJia') {
    return { type: 'weighted', description: '增伤类权重 1，其余词条权重 1.15（增伤占比 ≈4%，其余 ≈4.6%）' };
  }
  return { type: 'equal', description: '所有词条等概率出现' };
}