import { KURO } from "./module/config.mjs";
import { KuroActor } from "./module/documents/actor.mjs";
import { KuroItem } from "./module/documents/item.mjs";
import { KuroCharacterData, KuroNpcData } from "./module/data/actor-data.mjs";
import { KuroSpecializationData, KuroEquipmentData } from "./module/data/item-data.mjs";
import { KuroActorSheet } from "./module/sheets/actor-sheet.mjs";
import { KuroItemSheet } from "./module/sheets/item-sheet.mjs";
import { KuroRoll } from "./module/dice/kuro-roll.mjs";

Hooks.once("init", () => {
  console.log("KURO | Inicializando sistema v0.1.0 para Foundry VTT 12.343");

  CONFIG.KURO = KURO;
  CONFIG.Actor.documentClass = KuroActor;
  CONFIG.Item.documentClass = KuroItem;

  CONFIG.Actor.dataModels = {
    character: KuroCharacterData,
    npc: KuroNpcData
  };

  CONFIG.Item.dataModels = {
    specialization: KuroSpecializationData,
    equipment: KuroEquipmentData
  };

  CONFIG.Actor.trackableAttributes = {
    character: {
      bar: ["health"],
      value: ["seriousWounds"]
    },
    npc: {
      bar: ["health"],
      value: ["seriousWounds"]
    }
  };

  game.kuro = {
    config: KURO,
    KuroRoll,
    version: "0.1.0"
  };

  const { ActorSheetV2, ItemSheetV2 } = foundry.applications.sheets;
  Actors.unregisterSheet("core", ActorSheetV2, { types: ["character", "npc"] });
  Items.unregisterSheet("core", ItemSheetV2, { types: ["specialization", "equipment"] });

  Actors.registerSheet("kuro", KuroActorSheet, {
    types: ["character", "npc"],
    makeDefault: true,
    label: "KURO.Sheets.Actor"
  });

  Items.registerSheet("kuro", KuroItemSheet, {
    types: ["specialization", "equipment"],
    makeDefault: true,
    label: "KURO.Sheets.Item"
  });
});

Hooks.once("ready", () => {
  const generation = game.release?.generation ?? 12;
  const build = game.release?.build ?? "?";
  if (generation !== 12 || String(build) !== "343") {
    ui.notifications.warn(`KURO v0.1.0 foi validado para Foundry VTT 12.343. Versão detectada: ${generation}.${build}.`);
  }
});
