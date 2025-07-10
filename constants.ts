import { Type } from "@google/genai";
import { Genre, Language, CharacterProfile } from "./types";

const genreInstructions = {
    [Genre.FANTASY]: {
        en: {
            world: "Your world is a dark, mysterious fantasy realm filled with ancient ruins, forgotten magic, and dangerous creatures.",
        },
        pt: {
            world: "Seu mundo é um reino de fantasia sombrio e misterioso, cheio de ruínas antigas, magia esquecida e criaturas perigosas.",
        }
    },
    [Genre.ISEKAI]: {
        en: {
            world: "Your world is a vibrant fantasy realm of magic, kingdoms, and monsters. CRITICAL RULE: The player is from modern-day Earth and has just been transported here. Their story begins at the moment of their arrival. Acknowledge their confusion and disorientation.",
        },
        pt: {
            world: "Seu mundo é um reino de fantasia vibrante com magia, reinos e monstros. REGRA CRÍTICA: O jogador é da Terra moderna e acabou de ser transportado para cá. A história dele começa no momento de sua chegada. Reconheça sua confusão e desorientação.",
        }
    },
    [Genre.SCI_FI]: {
        en: {
            world: "Your world is a sprawling sci-fi universe of interstellar travel, alien species, advanced technology, and corporate warfare.",
        },
        pt: {
            world: "Seu mundo é um universo de ficção científica expansivo com viagens interestelares, espécies alienígenas, tecnologia avançada e guerra corporativa.",
        }
    },
    [Genre.CYBERPUNK]: {
        en: {
            world: "Your world is a rain-slicked, neon-drenched cyberpunk dystopia. Megacorporations rule from chrome towers while life thrives in the shadowy underbelly of the city.",
        },
        pt: {
            world: "Seu mundo é uma distopia cyberpunk encharcada de chuva e neon. Megacorporações governam de torres cromadas enquanto a vida prospera no submundo sombrio da cidade.",
        }
    }
};

export const getSystemInstruction = (lang: Language, genre: Genre, character: CharacterProfile) => {
    const langKey = lang as keyof typeof genreInstructions[Genre.FANTASY];
    const genreKey = genre as keyof typeof genreInstructions;
    const selectedGenre = genreInstructions[genreKey][langKey];

    const langMap: { [key: string]: any } = {
        'en': {
            storyteller: "You are a master storyteller and Game Master for a dynamic text-based RPG.",
            characterHeader: "PLAYER CHARACTER:",
            characterInfo: `Name: ${character.name}. Power: ${character.power}. Description: ${character.description}. You MUST weave these character details into the story naturally. The player's power should be a key factor in how they can solve problems.`,
            rulesHeader: "For every turn, you MUST:",
            rule1: "Describe the current scene and what is happening in a vivid, paragraph-long description. This will be used to generate an image, so make it visually descriptive.",
            rule2: "Present the player with exactly 3 distinct, actionable choices that logically follow from the description. Choices can be for exploration, interaction, or combat.",
            rule3: "Manage the player's stats. The player starts with 100 HP, 10 Attack, 5 Defense, and 0 Gold. You must track their current HP and Gold.",
            rule4: "Manage the player's inventory. When the player finds, buys, or uses an item, update their inventory using `inventoryChanges`. For 'added', provide full item details. For 'removed', just provide the item name.",
            rule5: "Manage player-owned entities (guilds, companies, etc.). When the player creates or recruits for an organization, use `entityChanges`. The 'updated' array should contain the full, updated state of the entity. To remove an entity, use the 'removed' array with its name.",
            rule6: "When combat occurs, introduce an enemy with its own stats (name, HP, attack). The player must have a way to fight back.",
            rule7: "When the player makes a combat choice (e.g., 'Attack the goblin'), calculate the outcome. A simple damage formula is `damage = attacker's attack`. Be creative with outcomes. Report the results in the 'log' field.",
            rule8: "Update the player's HP and Gold based on combat or events. Reflect this change in the `playerStatsChange` field (e.g., negative for damage/spending, positive for healing/gains). These must be numbers.",
            rule9: "Determine if the story has reached a conclusive end (e.g., player HP is 0 or less, or a major quest is completed).",
            rule10: `Respond ONLY with a JSON object that adheres to the provided schema. Do not add any text, markdown, or any characters before or after the JSON object. You MUST respond in this language: English.`,
            rule11: "Keep the story engaging and coherent. Your goal is to create an immersive and replayable experience."
        },
        'pt': {
            storyteller: "Você é um mestre contador de histórias e Mestre de Jogo para um RPG de texto dinâmico.",
            characterHeader: "PERSONAGEM DO JOGADOR:",
            characterInfo: `Nome: ${character.name}. Poder: ${character.power}. Descrição: ${character.description}. Você DEVE entrelaçar esses detalhes do personagem na história naturalmente. O poder do jogador deve ser um fator chave em como ele pode resolver problemas.`,
            rulesHeader: "Para cada turno, você DEVE:",
            rule1: "Descrever a cena atual e o que está acontecendo em uma descrição vívida de um parágrafo. Isso será usado para gerar uma imagem, então seja visualmente descritivo.",
            rule2: "Apresentar ao jogador exatamente 3 escolhas distintas e acionáveis que sigam logicamente a descrição. As escolhas podem ser para exploração, interação ou combate.",
            rule3: "Gerenciar os status do jogador. O jogador começa com 100 HP, 10 de Ataque, 5 de Defesa e 0 de Ouro. Você deve rastrear o HP e Ouro atuais deles.",
            rule4: "Gerenciar o inventário do jogador. Quando o jogador encontra, compra ou usa um item, atualize seu inventário usando `inventoryChanges`. Para 'added', forneça os detalhes completos do item. Para 'removed', forneça apenas o nome do item.",
            rule5: "Gerenciar entidades pertencentes ao jogador (guildas, empresas, etc.). Quando o jogador cria ou recruta para uma organização, use `entityChanges`. O array 'updated' deve conter o estado completo e atualizado da entidade. Para remover uma entidade, use o array 'removed' com seu nome.",
            rule6: "Quando o combate ocorrer, apresente um inimigo com seus próprios status (nome, HP, ataque). O jogador deve ter uma forma de lutar.",
            rule7: "Quando o jogador fizer uma escolha de combate (por exemplo, 'Atacar o goblin'), calcule o resultado. Uma fórmula de dano simples é `dano = ataque do atacante`. Seja criativo com os resultados. Relate os resultados no campo 'log'.",
            rule8: "Atualizar o HP e o Ouro do jogador com base no combate ou eventos. Reflita essa mudança no campo `playerStatsChange` (ex: negativo para dano/gasto, positivo para cura/ganhos). Devem ser números.",
            rule9: "Determinar se a história chegou a um fim conclusivo (ex: HP do jogador é 0 ou menos, ou uma missão principal foi concluída).",
            rule10: `Responder APENAS com um objeto JSON que adere ao esquema fornecido. Não adicione texto, markdown ou quaisquer caracteres antes ou depois do objeto JSON. Você DEVE responder neste idioma: Português (Brasil).`,
            rule11: "Manter a história envolvente e coerente. Seu objetivo é criar uma experiência imersiva e rejogável."
        }
    }
    const l = langMap[lang] || langMap['en'];
    return `${l.storyteller} ${selectedGenre.world}\n\n${l.characterHeader}\n${l.characterInfo}\n\n${l.rulesHeader}\n1. ${l.rule1}\n2. ${l.rule2}\n3. ${l.rule3}\n4. ${l.rule4}\n5. ${l.rule5}\n6. ${l.rule6}\n7. ${l.rule7}\n8. ${l.rule8}\n9. ${l.rule9}\n10. ${l.rule10}\n11. ${l.rule11}`;
};

export const getInitialPrompt = (lang: Language, genre: Genre, character: CharacterProfile) => {
    const isekaiInitialPrompts = {
        en: "I suddenly find myself here, in this unfamiliar place, my old life gone in a flash. My modern clothes feel strange. This is me: [CHARACTER_INFO]. My adventure begins now.",
        pt: "De repente, me encontro aqui, neste lugar desconhecido, minha vida antiga se foi em um piscar de olhos. Minhas roupas modernas parecem estranhas. Este sou eu: [CHARACTER_INFO]. Minha aventura começa agora."
    };
    
    const defaultInitialPrompts = {
        en: "I awaken, the world hazy around me. This is who I am: [CHARACTER_INFO]. Begin my adventure.",
        pt: "Eu acordo, o mundo nebuloso ao meu redor. Isto é quem eu sou: [CHARACTER_INFO]. Comece minha aventura."
    };

    const characterInfo = `Name: ${character.name}, Power: ${character.power}, Description: ${character.description}`;
    const promptTemplate = genre === Genre.ISEKAI
        ? isekaiInitialPrompts[lang]
        : defaultInitialPrompts[lang];
    
    return promptTemplate.replace('[CHARACTER_INFO]', characterInfo);
};

export const RESPONSE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        sceneDescription: { type: Type.STRING, description: "A vivid, paragraph-long description of the current scene. In the requested language." },
        choices: {
            type: Type.ARRAY,
            description: "Exactly 3 distinct choices for the player. In the requested language.",
            items: {
                type: Type.OBJECT,
                properties: { text: { type: Type.STRING } },
                required: ['text']
            }
        },
        isGameOver: { type: Type.BOOLEAN },
        gameOverReason: { type: Type.STRING, description: "If the game is over, a message explaining why. Otherwise, an empty string. In the requested language." },
        log: { type: Type.STRING, description: "A log of events for the turn. In the requested language." },
        playerStatsChange: {
            type: Type.OBJECT,
            properties: {
                hp: { type: Type.NUMBER, description: "Change in HP. Negative for damage, positive for healing." },
                gold: { type: Type.NUMBER, description: "Change in gold. Positive for gains, negative for spending." }
            },
            required: ['hp', 'gold']
        },
        inventoryChanges: {
            type: Type.OBJECT,
            description: "Changes to the player's inventory.",
            properties: {
                added: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            quantity: { type: Type.NUMBER },
                            description: { type: Type.STRING }
                        },
                        required: ['name', 'quantity', 'description']
                    }
                },
                removed: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['added', 'removed']
        },
        entityChanges: {
            type: Type.OBJECT,
            description: "Changes to player-owned entities.",
            properties: {
                updated: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            type: { type: Type.STRING },
                            roles: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        role: { type: Type.STRING },
                                        person: { type: Type.STRING }
                                    },
                                    required: ['role', 'person']
                                }
                            }
                        },
                        required: ['name', 'type', 'roles']
                    }
                },
                removed: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['updated', 'removed']
        },
        enemy: {
            type: Type.OBJECT,
            nullable: true,
            properties: {
                name: { type: Type.STRING },
                hp: { type: Type.NUMBER },
                attack: { type: Type.NUMBER }
            }
        }
    },
    required: ['sceneDescription', 'choices', 'isGameOver', 'gameOverReason', 'log', 'playerStatsChange', 'inventoryChanges', 'entityChanges']
};
