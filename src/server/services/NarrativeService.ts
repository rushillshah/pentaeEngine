import Anthropic from "@anthropic-ai/sdk";
import type { ElementVector } from "@/types/personalization";

const FALLBACK_NARRATIVES: Record<string, string> = {
  FIRE: "Your elemental essence burns with the intensity of fire. You are driven by passion, courage, and an unwavering commitment to action. Fire illuminates your path, fueling your ambitions and inspiring those around you.\n\nThis fiery nature makes you a natural catalyst for change. You don't just dream — you ignite. Channel this energy wisely, and you'll find that your warmth draws others to you like moths to a flame.",
  WATER:
    "Your soul flows with the depth and mystery of water. You navigate the world through emotion, intuition, and a profound connection to the unseen currents of life. Like a river, you find your way around any obstacle.\n\nThis fluid nature gives you remarkable empathy and insight. You sense what others cannot articulate. Trust this inner knowing — it is your greatest gift and your truest compass.",
  AIR: "Your mind soars with the clarity and freedom of air. You live in the realm of ideas, constantly seeking new perspectives and making connections that others miss. Communication is your natural element.\n\nThis airy nature gives you intellectual agility and social grace. You bring fresh thinking wherever you go. Let your curiosity lead you — the world needs your ability to see things from above.",
  EARTH:
    "Your spirit is grounded in the strength and wisdom of earth. You value what is real, what endures, and what can be built with patience and care. Stability is not your limitation — it is your superpower.\n\nThis earthy nature makes you the foundation others rely on. You turn dreams into reality through steady, deliberate action. Trust your practical wisdom — it has never led you astray.",
  SPIRIT:
    "Your essence transcends the physical elements, resonating with something deeper and more mysterious. You are guided by intuition, vision, and a connection to purpose that goes beyond the everyday.\n\nThis spiritual nature gives you a rare perspective on life. You see meaning where others see coincidence. Honor this gift by staying open to the whispers of the universe — they are speaking directly to you.",
};

interface NarrativeInput {
  fullName: string;
  dominantElement: string;
  elementVector: ElementVector;
}

interface NarrativeOutput {
  text: string;
  source: "LLM" | "FALLBACK";
}

function getFallback(dominantElement: string): NarrativeOutput {
  const text =
    FALLBACK_NARRATIVES[dominantElement] ?? FALLBACK_NARRATIVES.SPIRIT;
  return { text, source: "FALLBACK" };
}

function formatElementScores(vector: ElementVector): string {
  return Object.entries(vector)
    .map(([el, score]) => `${el}: ${Math.round((score as number) * 100)}%`)
    .join(", ");
}

export class NarrativeService {
  static async generateNarrative(
    params: NarrativeInput,
  ): Promise<NarrativeOutput> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return getFallback(params.dominantElement);
    }

    try {
      const client = new Anthropic({ apiKey });
      const scores = formatElementScores(params.elementVector);

      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        temperature: 0.8,
        system:
          "You are the voice of Pentae, an elemental jewelry brand. Write a personalized 2-3 paragraph personality narrative based on the customer's elemental profile. Tone: warm, mystical, empowering. Reference their dominant element and how other elements support them. No markdown formatting. Under 200 words.",
        messages: [
          {
            role: "user",
            content: `Name: ${params.fullName}\nDominant Element: ${params.dominantElement}\nElement Scores: ${scores}`,
          },
        ],
      });

      const text =
        response.content[0]?.type === "text" ? response.content[0].text : null;
      if (!text) {
        throw new Error("No text in response");
      }

      return { text, source: "LLM" };
    } catch {
      return getFallback(params.dominantElement);
    }
  }
}
