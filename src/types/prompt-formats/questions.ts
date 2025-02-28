export const questionJsonFormat = {
  Items: [
    {
      Category: "String",
      Question: "String",
    },
  ],
};

export const questionBodyFormat = {
  system: [
    {
      text: `You write JSON objects based on the given instructions, Please generate only the JSON output. DO NOT provide any preamble. Return valid JSON in the following format: ${questionJsonFormat}.`,
    },
  ],
  messages: [
    {
      role: "user",
      content: [
        {
          text: "Map the questions provided into JSON with the following keys: 1. category and 2. question. Infer a category from the question which is: [[PROMPT]]",
        },
      ],
    },
  ],
  inferenceConfig: {
    maxTokens: 300,
    // topP: 0.9,
    // topK: 20,
    temperature: 0.3,
  },
};

export const testBody = {
  inferenceConfig: {
    max_new_tokens: 1000,
  },
  messages: [
    {
      role: "user",
      content: [
        {
          text: "this is where you place your input text",
        },
      ],
    },
  ],
};
