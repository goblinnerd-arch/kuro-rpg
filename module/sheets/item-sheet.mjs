import { KURO, flattenSkills } from "../config.mjs";

const { ItemSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin } = foundry.applications.api;
const SKILLS = flattenSkills();

export class KuroItemSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["kuro", "sheet", "item", "kuro-item-sheet"],
    position: { width: 560, height: 620 },
    window: { resizable: true },
    form: { closeOnSubmit: false, submitOnChange: true },
    tag: "form"
  };

  static PARTS = {
    main: { template: "systems/kuro/templates/item/item-sheet.hbs" }
  };

  get title() {
    return `${this.item.name} — KURO`;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.isSpecialization = this.item.type === "specialization";
    context.isEquipment = this.item.type === "equipment";
    context.skillOptions = Object.entries(SKILLS).map(([key, label]) => ({
      key,
      label,
      selected: this.item.system.skill === key
    }));
    context.gimmicks = Object.entries(KURO.gimmicks).map(([key, label]) => ({
      key,
      label,
      value: this.item.system.gimmicks?.[key] ?? 0
    }));
    return context;
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    for (const image of this.element.querySelectorAll("[data-kuro-edit-image]")) {
      image.addEventListener("click", event => {
        event.preventDefault();
        if (!this.isEditable) return;
        new FilePicker({
          type: "image",
          current: this.item.img,
          callback: path => this.item.update({ img: path })
        }).browse();
      });
    }
  }
}
