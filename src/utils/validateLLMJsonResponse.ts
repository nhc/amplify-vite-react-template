/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Validates if a string from an LLM response contains valid JSON
 * @param llmResponse - The string response from an LLM
 * @returns An object with validation result and parsed data or error message
 */
export function validateLLMJsonResponse(llmResponse: string): {
  isValid: boolean;
  data?: any;
  error?: string;
} {
  try {
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = llmResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const textToValidate = jsonMatch ? jsonMatch[1] : llmResponse;

    // Parse the JSON
    const parsedData = JSON.parse(textToValidate);

    return {
      isValid: true,
      data: parsedData,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid JSON: ${(error as Error).message}`,
    };
  }
}

//   // Example usage
//   function testLLMJsonValidation() {
//     // Example LLM responses
//     const validResponse = '```json\n{"name": "Claude", "version": "3.7"}\n```';
//     const invalidResponse = '{"name": "Claude", version: 3.7}'; // Missing quotes around "version"

//     console.log("Valid response test:", validateLLMJsonResponse(validResponse));
//     console.log("Invalid response test:", validateLLMJsonResponse(invalidResponse));
//   }
