import { KURO, flattenSkills } from "../config.mjs";
import { buildActionFormula, marginFrom } from "../utils/rules.mjs";
import { escapeHTML } from "../utils/html.mjs";

const SKILLS = flattenSkills();

export class KuroRoll {
  static async attributeTest(actor, attributeKey, options = {}) {
    const attribute = KURO.attributes[attributeKey];
    if (!attribute) throw new Error(`KURO | Atributo inválido: ${attributeKey}`);

    const value = Number(actor.system.attributes[attributeKey] ?? 0);
    const wounds = Number(actor.system.seriousWounds ?? 0);
    return this._execute(actor, {
      label: `Teste de ${attribute.label}`,
      dicePool: Math.max(0, value - wounds),
      baseDice: value,
      woundPenalty: wounds,
      abilityBonus: value * 2,
      targetNumber: options.targetNumber,
      modifier: options.modifier ?? 0,
      attributeLabel: attribute.label,
      skillLabel: null
    });
  }

  static async skillTest(actor, skillKey, attributeKey, options = {}) {
    const attribute = KURO.attributes[attributeKey];
    const skillLabel = SKILLS[skillKey];
    if (!attribute || !skillLabel) throw new Error("KURO | Atributo ou Perícia inválidos.");

    const attributeValue = Number(actor.system.attributes[attributeKey] ?? 0);
    const skillValue = Number(actor.system.skills[skillKey] ?? 0);
    const wounds = Number(actor.system.seriousWounds ?? 0);

    return this._execute(actor, {
      label: `${attribute.label} + ${skillLabel}`,
      dicePool: Math.max(0, attributeValue - wounds),
      baseDice: attributeValue,
      woundPenalty: wounds,
      abilityBonus: skillValue,
      targetNumber: options.targetNumber,
      modifier: options.modifier ?? 0,
      attributeLabel: attribute.label,
      skillLabel
    });
  }

  static async specializationTest(actor, specialization, attributeKey, options = {}) {
    const attribute = KURO.attributes[attributeKey];
    if (!attribute) throw new Error(`KURO | Atributo inválido: ${attributeKey}`);

    const attributeValue = Number(actor.system.attributes[attributeKey] ?? 0);
    const wounds = Number(actor.system.seriousWounds ?? 0);
    const level = Number(specialization.system.level ?? 0);

    return this._execute(actor, {
      label: `${attribute.label} + ${specialization.name}`,
      dicePool: Math.max(0, attributeValue - wounds),
      baseDice: attributeValue,
      woundPenalty: wounds,
      abilityBonus: level,
      targetNumber: options.targetNumber,
      modifier: options.modifier ?? 0,
      attributeLabel: attribute.label,
      skillLabel: specialization.name,
      specialization
    });
  }

  static async _execute(actor, data) {
    const modifier = Number(data.modifier ?? 0);
    const bonus = Number(data.abilityBonus ?? 0) + modifier;
    const formula = buildActionFormula(data.dicePool, bonus);
    const roll = await (new Roll(formula)).evaluate({ async: true });
    const target = data.targetNumber === "" || data.targetNumber === null || data.targetNumber === undefined
      ? null
      : Number(data.targetNumber);
    const margin = marginFrom(roll.total, target);

    const resultClass = margin === null ? "neutral" : margin >= 0 ? "success" : "failure";
    const marginLabel = margin === null
      ? "Sem Número-Alvo"
      : margin >= 0
        ? `Margem de Sucesso +${margin}`
        : `Margem de Falha ${margin}`;

    const detail = [
      `<div class="kuro-roll-summary ${resultClass}">`,
      `<div class="kuro-roll-title">${escapeHTML(data.label)}</div>`,
      `<div class="kuro-roll-meta">${data.baseDice}D de atributo${data.woundPenalty ? ` − ${data.woundPenalty}D por Ferimentos Graves` : ""} · Bônus ${data.abilityBonus >= 0 ? "+" : ""}${data.abilityBonus}${modifier ? ` · Mod. ${modifier >= 0 ? "+" : ""}${modifier}` : ""}</div>`,
      target === null ? "" : `<div class="kuro-roll-target">NA ${target}</div>`,
      `<div class="kuro-roll-margin">${marginLabel}</div>`,
      `<div class="kuro-roll-rule">4 = 0 · 6 explode</div>`,
      `</div>`
    ].join("");

    const speaker = ChatMessage.getSpeaker({ actor });
    return roll.toMessage({ speaker, flavor: detail }, { rollMode: game.settings.get("core", "rollMode") });
  }
}
