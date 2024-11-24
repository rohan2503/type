// Consonants and vowels for pronounceable nonsense words
const consonants = 'bcdfghjklmnpqrstvwxyz';
const vowels = 'aeiou';
const punctuation = '.,!?';

// Generate a random word with alternating consonants and vowels
const generateWord = (minLength: number = 3, maxLength: number = 8): string => {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let word = '';
  
  for (let i = 0; i < length; i++) {
    const chars = i % 2 === 0 ? consonants : vowels;
    word += chars[Math.floor(Math.random() * chars.length)];
  }
  
  return word;
};

// Generate a random sentence
const generateSentence = (minWords: number = 4, maxWords: number = 10): string => {
  const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  let sentence = '';
  
  for (let i = 0; i < length; i++) {
    let word = generateWord();
    if (i === 0) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }
    sentence += word;
    
    // Add space or punctuation
    if (i === length - 1) {
      sentence += punctuation[Math.floor(Math.random() * punctuation.length)];
    } else {
      sentence += ' ';
    }
  }
  
  return sentence;
};

// Generate a paragraph of random sentences
export const generateRandomParagraph = (minSentences: number = 3, maxSentences: number = 5): string => {
  const length = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences = [];
  
  for (let i = 0; i < length; i++) {
    sentences.push(generateSentence());
  }
  
  return sentences.join(' ');
};
