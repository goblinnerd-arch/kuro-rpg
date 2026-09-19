import { KuroRoll } from "../dice/kuro-roll.mjs";

export class KuroActor extends Actor {
  async rollAttribute(attributeKey, options = {}) {
    return KuroRoll.attributeTest(this, attributeKey, options);
  }

  async rollSkill(skillKey, attributeKey, options = {}) {
    return KuroRoll.skillTest(this, skillKey, attributeKey, options);
  }

  async rollSpecialization(itemId, attributeKey, options = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "specialization") {
      ui.notifications.error("KURO | Especialização não encontrada.");
      return null;
    }
    return KuroRoll.specializationTest(this, item, attributeKey, options);
  }
}
