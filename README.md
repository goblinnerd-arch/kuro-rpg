# KURO RPG — Foundry VTT 12.343

Versão inicial **0.1.0** de um Game System independente para KURO RPG.

## Escopo desta build

- Foundry VTT **12.343** exclusivamente.
- Actors: `character` e `npc`.
- Items: `specialization` e `equipment`.
- 8 Atributos em PT-BR.
- 32 Perícias oficiais estruturadas por categoria.
- Atributos secundários calculados automaticamente.
- Vida atual, Limiar de Dano, Limiar de Morte e Ferimentos Graves.
- Motor de Teste de Ação:
  - Atributo = quantidade de D6;
  - resultados 4 valem 0;
  - resultados 6 explodem recursivamente;
  - Perícia/Especialização entra como bônus;
  - Ferimentos Graves removem dados;
  - Número-Alvo e MS/MF opcionais.
- Ficha moderna de personagem/NPC.
- Ficha de Especialização e Equipamento.

## Deliberadamente ainda fora da v0.1.0

- Automação dos Gimmikus (os dados já são armazenados).
- Regras de criação guiada e validação dos pontos de criação.
- Pré-requisitos de Perícias.
- Combate completo, iniciativa por fases e múltiplas ações no Combat Tracker.
- Armas, armaduras, munição, alcance, modo automático e aplicação automática de dano.
- Cura, drogas, doenças e poderes sobrenaturais.
- Compêndios com conteúdo editorial do livro.

## Instalação manual

1. Feche o Foundry VTT.
2. Extraia a pasta `kuro` para `{UserData}/Data/systems/kuro/`.
3. Inicie o Foundry VTT 12.343.
4. Crie um mundo escolhendo **KURO RPG** como sistema.

> A pasta instalada precisa se chamar exatamente `kuro` e conter `system.json` diretamente na raiz.

## Observação

Esta build foi criada para teste funcional. Antes de usar em uma campanha real, faça um mundo de teste e reporte erros de console ou comportamentos inesperados.
