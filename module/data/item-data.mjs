import { KURO } from "../config.mjs";

const { SchemaField, NumberField, StringField } = foundry.data.fields;

export class KuroSpecializationData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      skill: new StringField({ required: true, nullable: false, initial: "athletics" }),
      level: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 1 }),
      gimmicks: new SchemaField({
        technique: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
        precision: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
        focus: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
        mastery: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 }),
        enhancement: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 0 })
      }),
      description: new StringField({ required: true, nullable: false, initial: "" })
    };
  }

  get gimmickCount() {
    return Object.keys(KURO.gimmicks).reduce((sum, key) => sum + Number(this.gimmicks[key] ?? 0), 0);
  }
}

export class KuroEquipmentData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      category: new StringField({ required: true, nullable: false, initial: "geral" }),
      quantity: new NumberField({ required: true, nullable: false, integer: true, min: 0, initial: 1 }),
      kaiso: new NumberField({ required: true, nullable: false, integer: true, min: 0, max: 6, initial: 0 }),
      price: new NumberField({ required: true, nullable: false, min: 0, initial: 0 }),
      description: new StringField({ required: true, nullable: false, initial: "" })
    };
  }
}
