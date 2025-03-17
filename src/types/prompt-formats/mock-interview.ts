interface Content {
  text: string;
}

interface Message {
  role: string;
  content: Content[];
}

interface InferenceConfig {
  max_new_tokens: number;
  temperature: number;
}

export interface IInterviewQuestionPrompt {
  messages: Message[];
  inferenceConfig: InferenceConfig;
}

export const interviewQuestion = {
  messages: [
    {
      role: "user",
      content: [
        {
          text: `You are an expert in career coaching and recruitment. Specifically in the area of [[JOB-ROLE]]. First, I want you to answer analyse the CV and Job description. Then I want you to answer a question. Then, I want you to use your answer to analyze and respond to a second (final) question.

            Step 1 (Priming 1) Assume you are a career coach who will provide helpful feedback to a user.
            Step 2 (Priming 2) [[CV-JOB-DESCRIPTION]]
            Step 3 (First Question) [[QUESTION]] // FROM ANALYSIS PASSED TO INTERVIEW
            Step 4 (Answer One) Give a detailed model answer to the first question, but keep it to yourself.
            Step 5 (Final Question) [CANDIDATE-ANSWER] 
            Step 6 (Analysis Directive) Use your answer to "Step 3 (First Question)" to analyze and provide succinct insights in short bullet points for the final question previously provided.`,
        },
      ],
    },
  ],
  inferenceConfig: {
    max_new_tokens: 1000,
    // topP: 0.9,
    // topK: 20,
    temperature: 0.2,
  },
};

export const testBody = {
  messages: [
    {
      role: "user",
      content: [
        {
          text: "Please give me 5 ideas of positive things to do in the morning.",
        },
      ],
    },
  ],
  inferenceConfig: {
    max_new_tokens: 1000,
  },
};

// You are an expert in career coaching and recruitment. Specifically in the area of [[JOB-ROLE]]. First, I want you to answer analyse the CV and Job description. Then I want you to answer a question. Then, I want you to use your answer to analyze and respond to a second (final) question.

// Step 1 (Priming 1): Assume you are a career coach who will provide helpful feedback to a user.
// Step 2 (Priming 2): [[CV-JOB-DESCRIPTION]]
// Step 3 (First Question): [[QUESTION]] // FROM ANALYSIS PASSED TO INTERVIEW
// Step 4 (Answer One): Give a detailed model answer to the first question, but keep it to yourself.
// Step 5 (Final Question): [CANDIDATE-ANSWER]
// Step 6 (Analysis Directive): Use your answer to "Step 3 (First Question)" to analyze and provide succinct insights in short bullet points for the following question.
