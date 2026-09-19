export const KURO = Object.freeze({
  attributes: {
    strength: { label: "Força", abbr: "FOR", group: "physical" },
    tolerance: { label: "Tolerância", abbr: "TOL", group: "physical" },
    reflexes: { label: "Reflexos", abbr: "REF", group: "physical" },
    dexterity: { label: "Destreza", abbr: "DES", group: "physical" },
    intelligence: { label: "Inteligência", abbr: "INT", group: "mental" },
    perception: { label: "Percepção", abbr: "PER", group: "mental" },
    willpower: { label: "Vontade", abbr: "VON", group: "mental" },
    charisma: { label: "Carisma", abbr: "CAR", group: "mental" }
  },

  skillGroups: {
    combat: {
      label: "Combate",
      skills: {
        projectileWeapons: "Armas de Disparo",
        handToHand: "Mano-a-Mano",
        heavyWeapons: "Armas Pesadas",
        firearms: "Armas de Fogo",
        meleeWeapons: "Armas Brancas",
        thrownWeapons: "Armas de Arremesso"
      }
    },
    academic: {
      label: "Acadêmicas",
      skills: {
        humanities: "Ciências Humanas",
        naturalSciences: "Ciências Naturais",
        physicalSciences: "Ciências Físicas",
        socialSciences: "Ciências Sociais"
      }
    },
    general: {
      label: "Gerais",
      skills: {
        athletics: "Atletismo",
        communication: "Comunicação",
        deception: "Logro",
        driving: "Condução",
        investigation: "Investigação",
        piloting: "Pilotagem",
        popularCulture: "Cultura Popular",
        spiritual: "Espiritual",
        survival: "Sobrevivência",
        nautical: "Náutica"
      }
    },
    technical: {
      label: "Técnicas",
      skills: {
        electrical: "Elétrica",
        explosives: "Explosivos",
        mechanics: "Mecânica",
        medicine: "Medicina",
        microphotonics: "Microfotônicos"
      }
    },
    engineering: {
      label: "Engenharia",
      skills: {
        biomechanics: "Biomecânica",
        biotechnology: "Biotecnologia",
        energyTechnology: "Tecnologia Energética",
        nanotechnology: "Nanotecnologia",
        robotics: "Robótica",
        security: "Segurança",
        contacts: "Contatos"
      }
    }
  },

  targetNumbers: [
    { value: 4, label: "Muito Fácil" },
    { value: 8, label: "Fácil" },
    { value: 12, label: "Mediana" },
    { value: 16, label: "Acima da Média" },
    { value: 20, label: "Difícil" },
    { value: 24, label: "Muito Difícil" },
    { value: 28, label: "Improvável" },
    { value: 32, label: "Impossível" }
  ],

  gimmicks: {
    technique: "Técnica",
    precision: "Precisão",
    focus: "Foco",
    mastery: "Maestria",
    enhancement: "Aprimoramento"
  }
});

export function flattenSkills() {
  const result = {};
  for (const group of Object.values(KURO.skillGroups)) {
    Object.assign(result, group.skills);
  }
  return result;
}
