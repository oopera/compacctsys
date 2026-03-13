import { Publication } from "@/types";

// Populated from BibTeX — placeholder until BibTeX import is set up.
// Each entry mirrors the Publication type in src/types/index.ts.
export const publications: Publication[] = [
  {
    id: "neumann-2026-chi-system-prompts",
    title: "Who Controls the Conversation? User Perspectives On Generative AI (LLM) System Prompts",
    authors: [
      { name: "Anna Neumann", teamMemberId: "anna-neumann" },
      { name: "Yulu Pi", teamMemberId: "yulu-pi" },
      { name: "Jatinder Singh", teamMemberId: "jatinder-singh" },
    ],
    venue: "Proceedings of the CHI Conference on Human Factors in Computing Systems",
    venueShort: "CHI",
    year: 2026,
    type: "conference",
    abstract:
      "System prompts - instructions that shape the behaviour of generative AI systems - strongly influence system outputs and users' experiences. They define the model's guidelines, 'personality', and guardrails, taking precedence over user inputs. Despite their influence, transparency is limited: system prompts are generally not made public and most platforms instruct models to conceal them, leaving users disconnected from and unaware of a key mechanism guiding and governing their AI interactions. This paper argues that system prompts warrant explicit, user-centred design attention and, focusing on large language models (LLMs), asks: what do system prompts contain, how do end-users perceive them, and what do these perceptions offer for design and governance practice? Our results reveal user perspectives on: the benefits and risks of system prompts; the values they prefer to be associated with prompt-design; their levels of comfort with different types of prompts; and degrees of transparency and user control regarding prompt content. From these findings emerge considerations for how designers can better align system prompt mechanisms with user expectations and preferences over these mechanisms that directly shape how generative AI systems behave.",
    doi: "10.1145/3772318.3791726",
    url: "https://arxiv.org/abs/2603.00089",
    bibtex: `@inproceedings{neumann2026systempropmts,
  title     = {Who Controls the Conversation? User Perspectives On Generative AI (LLM) System Prompts},
  author    = {Neumann, Anna and Pi, Yulu and Singh, Jatinder},
  booktitle = {Proceedings of the CHI Conference on Human Factors in Computing Systems},
  year      = {2026},
  doi       = {10.1145/3772318.3791726},
  url       = {https://arxiv.org/abs/2603.00089}
}`,
    award: "Best Paper Award",
    researchThemeIds: ["meaningful-transparency", "platforms-online-harms", "compliance-rights-engineering"],
    teamMemberIds: ["anna-neumann", "yulu-pi", "jatinder-singh"],
  },
];
