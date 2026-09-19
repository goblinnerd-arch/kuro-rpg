export function calculateSecondary(attributes) {
  const tolerance = Number(attributes.tolerance ?? 0);
  const willpower = Number(attributes.willpower ?? 0);
  const dexterity = Number(attributes.dexterity ?? 0);
  const reflexes = Number(attributes.reflexes ?? 0);
  const perception = Number(attributes.perception ?? 0);
  const intelligence = Number(attributes.intelligence ?? 0);

  const healthMax = ((tolerance * 2) + willpower) * 5;
  const damageThreshold = Math.ceil(healthMax / 3);

  return {
    healthMax,
    damageThreshold,
    deathThreshold: -damageThreshold,
    defense: (dexterity + reflexes + perception) * 2,
    reaction: Math.ceil((reflexes + willpower + intelligence) / 2),
    actions: Math.ceil(reflexes / 2),
    movement: dexterity
  };
}

export function buildActionFormula(dicePool, bonus = 0) {
  const dice = Math.max(0, Math.trunc(Number(dicePool) || 0));
  const mod = Number(bonus) || 0;
  if (dice === 0) return `${mod}`;
  return `${dice}d6x6sf=4 + (${mod})`;
}

export function marginFrom(total, targetNumber) {
  if (targetNumber === null || targetNumber === undefined || targetNumber === "") return null;
  return Number(total) - Number(targetNumber);
}
