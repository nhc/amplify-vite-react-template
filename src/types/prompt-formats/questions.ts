// system: [
//     {
//       text: `You write JSON objects based on the given instructions, Please generate only the JSON output. DO NOT provide any preamble. Return valid JSON in the following format: ${JSON.stringify(
//         questionJsonFormat
//       )}.`,
//     },
//   ],

export const questionBodyFormat = {
  messages: [
    {
      role: "user",
      content: [
        {
          text: `You write JSON objects based on the given instructions, Please generate only the JSON output. DO NOT provide any preamble. Return valid JSON in the following format: {"Items": [{"Category": "String", "Question": "String"}]} Map the questions provided into JSON with the following keys: 1. category and 2. question. Infer a category from the questions. The questions to be converted are: [[PROMPT]] `,
        },
      ],
    },
  ],
  inferenceConfig: {
    maxTokens: 300,
    // topP: 0.9,
    // topK: 20,
    temperature: 0,
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

interface IInterviewQuestion {
  Category: string;
  Question: string;
}

export interface IQuestionCollection {
  id?: string;
  Items?: IInterviewQuestion[];
}
