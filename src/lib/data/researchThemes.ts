import { ResearchTheme } from "@/types";

export const researchThemes: ResearchTheme[] = [
  {
    id: "reviewability-contestability",
    title: "Algorithmic 'reviewability' and 'contestability'",
    description:
      "Contrasting with the general focus on 'explanation', we consider that which is necessary to facilitate the review, understanding, scrutiny and challenge of algorithmic and automated decision-making (ML) systems.",
    order: 0,
  },
  {
    id: "meaningful-transparency",
    title: "Meaningful transparency",
    description:
      "Exploring requirements and mechanisms for facilitating the meaningful inspection and interrogation of socio-technical systems and their behaviour(s). One focus is on auditable augmented/mixed/virtual reality systems, as well as the Internet of Things, and the use of machine learning in various contexts.",
    order: 1,
  },
  {
    id: "algorithmic-supply-chains",
    title: "Algorithmic supply chains",
    description:
      "Investigating how responsibility, control and opacity issues occur across the components of modern AI systems — which consists of multiple actors and multiple components.",
    order: 2,
  },
  {
    id: "data-protection-pets",
    title: "Data protection and privacy enhancing technologies (PETs)",
    description:
      "Considering issues, critiques, management and interventions regarding personal and confidential data.",
    order: 3,
  },
  {
    id: "algorithmic-bias-fairness",
    title: "Algorithmic bias / fairness",
    description:
      "Focusing on trade-offs in various context, and methods and tooling for supporting practitioners.",
    order: 4,
  },
  {
    id: "platforms-online-harms",
    title: "Platforms and online harms",
    description:
      "Exploring the design, use and abuse of platforms in perpetuating harms. The current focus is on social media (recommender systems), virtual user-spaces (games/XR), and cloud services, including 'AI as a Service'.",
    order: 5,
  },
  {
    id: "decision-provenance",
    title: "Decision provenance",
    description:
      "Considering how tracing the flow of data can be leveraged to assist accountability in complex, automated and ML-driven environments.",
    order: 6,
  },
  {
    id: "compliance-rights-engineering",
    title: "Compliance and rights engineering",
    description:
      "How systems can be better built to be (demonstrably) compliant with legal obligations, and to account for rights – fundamental, group and individual.",
    order: 7,
  },
  {
    id: "centralised-decentralised",
    title: "Centralised v. decentralised infrastructures",
    description:
      "Considering the potential of data management and compute infrastructures, and their legal, regulatory and policy implications. Currently looking at personal data stores and data trusts.",
    order: 8,
  },
];
