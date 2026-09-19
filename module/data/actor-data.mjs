import { KURO } from "../config.mjs";
import { calculateSecondary } from "../utils/rules.mjs";

const { SchemaField, NumberField, StringField } = foundry.data.fields;

function attributeSchema() {
  const fields = {};
  for (const key of Object.keys(KURO.attributes)) {
    fields[key] = new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 1 });
  }
  return new SchemaField(fields);
}

function skillSchema() {
  const fields = {};
  for (const group of Object.values(KURO.skillGroups)) {
    for (const key of Object.keys(group.skills)) {
      fields[key] = new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 });
    }
  }
  return new SchemaField(fields);
}

class KuroActorBaseData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      details: new SchemaField({
        age: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 25 }),
        sex: new StringField({ required: true, nullable: false, initial: "" }),
        profession: new StringField({ required: true, nullable: false, initial: "" }),
        kaiso: new NumberField({ required: true, nullable: false, integer: true, min: 0, max: 6, initial: 2 }),
        size: new StringField({ required: true, nullable: false, initial: "" }),
        weight: new StringField({ required: true, nullable: false, initial: "" }),
        eyes: new StringField({ required: true, nullable: false, initial: "" }),
        hair: new StringField({ required: true, nullable: false, initial: "" })
      }),
      attributes: attributeSchema(),
      health: new SchemaField({
        value: new NumberField({ required: true, nullable: false, integer: true, initial: 25 }),
        max: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 25 })
      }),
      seriousWounds: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
      secondary: new SchemaField({
        damageThreshold: new NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
        deathThreshold: new NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
        defense: new NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
        reaction: new NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
        actions: new NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
        movement: new NumberField({ required: true, nullable: false, integer: true, initial: 0 })
      }),
      skills: skillSchema(),
      notes: new StringField({ required: true, nullable: false, initial: "" })
    };
  }

  prepareDerivedData() {
    super.prepareDerivedData();
    const derived = calculateSecondary(this.attributes);

    this.health.max = derived.healthMax;
    if (this.health.value > this.health.max) this.health.value = this.health.max;

    this.secondary.damageThreshold = derived.damageThreshold;
    this.secondary.deathThreshold = derived.deathThreshold;
    this.secondary.defense = derived.defense;
    this.secondary.reaction = derived.reaction;
    this.secondary.actions = derived.actions;
    this.secondary.movement = derived.movement;
  }

  get healthState() {
    if (this.health.value < this.secondary.deathThreshold) return "dead";
    if (this.health.value <= 0) return "coma";
    if (this.health.value <= this.secondary.damageThreshold) return "critical";
    return "stable";
  }
}

export class KuroCharacterData extends KuroActorBaseData {}
export class KuroNpcData extends KuroActorBaseData {}
