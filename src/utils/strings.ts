export function getStringOrNull(input: unknown): string | null {
    // Check if input is undefined or null
    if (input === undefined || input === null) {
      return null;
    }
    
    // Check if input is a string
    if (typeof input === 'string') {
      // Trim the string
      const trimmed = input.trim();
      // Check if the trimmed string is empty
      if (trimmed.length === 0) {
        return null;
      }
      // Return the trimmed string if it's not empty
      return trimmed;
    }
  
    // If it's not a string, return null
    return null;
}