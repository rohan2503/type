interface TextData {
  easy: string[];
  medium: string[];
  hard: string[];
  random: string[];
}

export const texts: TextData = {
  easy: [
    "The sun rises in the east and sets in the west. Birds fly high in the blue sky. The flowers bloom in spring.",
    "I like to read books and write stories. My cat sleeps on the soft pillow. The wind blows through the trees.",
    "She walks to school every morning. The dog plays in the green park. Children laugh and sing together.",
  ],
  medium: [
    "The quantum computer processes information using quantum-mechanical phenomena, such as superposition and entanglement.",
    "Professional photographers understand the delicate balance between aperture, shutter speed, and ISO to capture perfect moments.",
    "Environmental scientists study the complex interactions between organisms and their ecosystems to predict climate changes.",
  ],
  hard: [
    "The enigmatic phenomenon of consciousness has perplexed philosophers and neuroscientists alike; the intricate interplay between subjective experience and neural correlates remains a fascinating frontier in cognitive science.",
    "Cryptocurrency's decentralized blockchain technology revolutionizes traditional financial paradigms through sophisticated cryptographic algorithms and peer-to-peer networks, challenging conventional banking systems.",
    "The anthropogenic impact on Earth's biogeochemical cycles has precipitated unprecedented perturbations in atmospheric composition, leading to cascading effects throughout global ecosystems.",
  ],
  random: [''] // This will be generated dynamically
};

export type Level = keyof typeof texts;
