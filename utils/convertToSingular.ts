export function convertToSingular(word : string) {
  if (word.endsWith('ies')) {
    // Handle words ending in 'ies' (e.g., "FarmMachineries" -> "FarmMachinery")
    return word.slice(0, -3) + 'y';
  } else if (word.endsWith('s')) {
    // Handle words ending in 's' (e.g., "Tractors" -> "Tractor")
    return word.slice(0, -1);
  }
  // If no transformation is needed, return the word as-is
  return word;
}