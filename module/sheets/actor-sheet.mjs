import { KURO, flattenSkills } from "../config.mjs";
import { escapeHTML } from "../utils/html.mjs";

const { ActorSheetV2 } = foundry.applications.sheets;
const { HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;
const SKILLS = flattenSkills();

export class KuroActorSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["kuro", "sheet", "actor", "kuro-actor-sheet"],
    position: { width: 960, height: 760 },
    window: { resizable: true },
    form: { closeOnSubmit: false, submitOnChange: true },
    tag: "form"
  };

  static PARTS = {
    main: { template: "systems/kuro/templates/actor/actor-sheet.hbs" }
  };

  _activeTab = "summary";

  get title() {
    return `${this.actor.name} — KURO`;
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const actor = this.actor;
    const system = actor.system;

    context.actor = actor;
    context.system = system;
    context.editable = this.isEditable;
    context.isCharacter = actor.type === "character";
    context.activeTab = this._activeTab;

    context.physicalAttributes = this._prepareAttributes("physical");
    context.mentalAttributes = this._prepareAttributes("mental");
    context.skillGroups = this._prepareSkills();
    context.specializations = actor.items.filter(i => i.type === "specialization");
    context.equipment = actor.items.filter(i => i.type === "equipment");

    const hpMax = Math.max(1, Number(system.health.max ?? 1));
    const hpValue = Number(system.health.value ?? 0);
    context.healthPercent = Math.max(0, Math.min(100, (Math.max(0, hpValue) / hpMax) * 100));
    context.healthState = system.healthState;
    context.healthStateLabel = {
      stable: "Estável",
      critical: "Ferido",
      coma: "Coma",
      dead: "Morto"
    }[system.healthState] ?? "—";

    return context;
  }

  _prepareAttributes(group) {
    return Object.entries(KURO.attributes)
      .filter(([, cfg]) => cfg.group === group)
      .map(([key, cfg]) => ({
        key,
        label: cfg.label,
        abbr: cfg.abbr,
        value: this.actor.system.attributes[key]
      }));
  }

  _prepareSkills() {
    return Object.entries(KURO.skillGroups).map(([groupKey, group]) => ({
      key: groupKey,
      label: group.label,
      skills: Object.entries(group.skills).map(([key, label]) => ({
        key,
        label,
        value: this.actor.system.skills[key],
        specializations: this.actor.items
          .filter(i => i.type === "specialization" && i.system.skill === key)
          .map(i => ({
            id: i.id,
            name: i.name,
            level: i.system.level,
            gimmickCount: i.system.gimmickCount
          }))
      }))
    }));
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    const root = this.element;

    for (const image of root.querySelectorAll("[data-kuro-edit-image]")) {
      image.addEventListener("click", event => {
        event.preventDefault();
        if (!this.isEditable) return;
        new FilePicker({
          type: "image",
          current: this.actor.img,
          callback: path => this.actor.update({ img: path })
        }).browse();
      });
    }

    for (const button of root.querySelectorAll("[data-kuro-tab]")) {
      button.addEventListener("click", event => {
        event.preventDefault();
        this._activeTab = button.dataset.kuroTab;
        this._applyActiveTab();
      });
    }
    this._applyActiveTab();

    for (const element of root.querySelectorAll("[data-roll-attribute]")) {
      element.addEventListener("click", event => {
        event.preventDefault();
        this._rollAttribute(element.dataset.rollAttribute);
      });
    }

    for (const element of root.querySelectorAll("[data-roll-skill]")) {
      element.addEventListener("click", event => {
        event.preventDefault();
        this._rollSkill(element.dataset.rollSkill);
      });
    }

    for (const element of root.querySelectorAll("[data-roll-specialization]")) {
      element.addEventListener("click", event => {
        event.preventDefault();
        this._rollSpecialization(element.dataset.rollSpecialization);
      });
    }

    for (const element of root.querySelectorAll("[data-create-specialization]")) {
      element.addEventListener("click", async event => {
        event.preventDefault();
        const skillKey = element.dataset.createSpecialization;
        const skillLabel = SKILLS[skillKey] ?? "Especialização";
        const [item] = await this.actor.createEmbeddedDocuments("Item", [{
          name: `Nova Especialização — ${skillLabel}`,
          type: "specialization",
          img: "icons/svg/book.svg",
          system: { skill: skillKey, level: Math.max(1, Number(this.actor.system.skills[skillKey] ?? 0)) }
        }]);
        item?.sheet?.render(true);
      });
    }

    for (const element of root.querySelectorAll("[data-create-equipment]")) {
      element.addEventListener("click", async event => {
        event.preventDefault();
        const [item] = await this.actor.createEmbeddedDocuments("Item", [{
          name: "Novo Equipamento",
          type: "equipment",
          img: "icons/svg/item-bag.svg"
        }]);
        item?.sheet?.render(true);
      });
    }

    for (const element of root.querySelectorAll("[data-edit-item]")) {
      element.addEventListener("click", event => {
        event.preventDefault();
        this.actor.items.get(element.dataset.editItem)?.sheet?.render(true);
      });
    }

    for (const element of root.querySelectorAll("[data-delete-item]")) {
      element.addEventListener("click", async event => {
        event.preventDefault();
        const item = this.actor.items.get(element.dataset.deleteItem);
        if (!item) return;
        const confirmed = await DialogV2.confirm({
          window: { title: "Excluir item" },
          content: `<p>Excluir <strong>${escapeHTML(item.name)}</strong>?</p>`,
          rejectClose: false,
          modal: true
        });
        if (confirmed) await item.delete();
      });
    }
  }

  _applyActiveTab() {
    if (!this.element) return;
    for (const button of this.element.querySelectorAll("[data-kuro-tab]")) {
      button.classList.toggle("active", button.dataset.kuroTab === this._activeTab);
    }
    for (const panel of this.element.querySelectorAll("[data-kuro-panel]")) {
      panel.hidden = panel.dataset.kuroPanel !== this._activeTab;
    }
  }

  async _rollAttribute(attributeKey) {
    const cfg = KURO.attributes[attributeKey];
    if (!cfg) return;
    const options = await this._rollDialog({ title: `Teste de ${cfg.label}`, allowSpecialization: false });
    if (!options) return;
    return this.actor.rollAttribute(attributeKey, options);
  }

  async _rollSkill(skillKey) {
    const skillLabel = SKILLS[skillKey];
    if (!skillLabel) return;
    if (Number(this.actor.system.skills[skillKey] ?? 0) === 0) {
      ui.notifications.warn(`KURO | ${skillLabel} está em nível 0. Pela regra, testes destreinados normalmente não podem ser tentados; o Mestre pode permitir quando a tarefa for simples.`);
    }
    const options = await this._rollDialog({ title: skillLabel, skillKey, allowSpecialization: true });
    if (!options) return;

    if (options.specializationId) {
      return this.actor.rollSpecialization(options.specializationId, options.attributeKey, options);
    }
    return this.actor.rollSkill(skillKey, options.attributeKey, options);
  }

  async _rollSpecialization(itemId) {
    const item = this.actor.items.get(itemId);
    if (!item) return;
    const options = await this._rollDialog({ title: item.name, skillKey: item.system.skill, allowSpecialization: false });
    if (!options) return;
    return this.actor.rollSpecialization(itemId, options.attributeKey, options);
  }

  async _rollDialog({ title, skillKey = null, allowSpecialization = false }) {
    const attributeOptions = Object.entries(KURO.attributes)
      .map(([key, cfg]) => `<option value="${key}">${cfg.label} (${cfg.abbr})</option>`)
      .join("");

    let specializationOptions = "";
    if (allowSpecialization && skillKey) {
      const skillLevel = Number(this.actor.system.skills[skillKey] ?? 0);
      const specs = this.actor.items.filter(i => i.type === "specialization" && i.system.skill === skillKey);
      specializationOptions = `
        <div class="form-group">
          <label>Habilidade</label>
          <select name="specializationId">
            <option value="">Perícia (${skillLevel})</option>
            ${specs.map(i => `<option value="${i.id}">${escapeHTML(i.name)} (${i.system.level})</option>`).join("")}
          </select>
        </div>`;
    }

    const tnOptions = KURO.targetNumbers
      .map(t => `<option value="${t.value}">${t.value} — ${t.label}</option>`)
      .join("");

    const content = `
      <div class="kuro-roll-dialog">
        <div class="form-group">
          <label>Atributo</label>
          <select name="attributeKey">${attributeOptions}</select>
        </div>
        ${specializationOptions}
        <div class="form-group">
          <label>Número-Alvo</label>
          <select name="targetNumber">
            <option value="">Sem NA</option>
            ${tnOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Modificador</label>
          <input type="number" name="modifier" value="0" step="1">
        </div>
      </div>`;

    return DialogV2.prompt({
      window: { title },
      content,
      rejectClose: false,
      ok: {
        label: "Rolar",
        callback: (event, button) => ({
          attributeKey: button.form.elements.attributeKey.value,
          specializationId: button.form.elements.specializationId?.value || "",
          targetNumber: button.form.elements.targetNumber.value,
          modifier: button.form.elements.modifier.valueAsNumber || 0
        })
      }
    });
  }
}
