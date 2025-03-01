import { useState, useCallback } from "react";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

interface Props {
  modelId: string;
  bedrockClient: BedrockRuntimeClient;
  requestBody: string;
}

interface UseModelInvokeReturn {
  invokeModel: (prompt: string) => Promise<string | undefined>;
  isLoading: boolean;
  error: Error | null;
}

export const useAWSModelInvoke = ({
  modelId,
  bedrockClient,
  requestBody,
}: Props): UseModelInvokeReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const invokeModel = useCallback(
    async (prompt: string): Promise<string | undefined> => {
      console.log("prompt", prompt);
      setIsLoading(true);
      setError(null);

      const bodyWithPrompt = requestBody.replace("[[PROMPT]]", prompt);
      //console.log("newBody", newBody);
      const command = new InvokeModelCommand({
        modelId,
        contentType: "application/json",
        accept: "application/json",
        body: bodyWithPrompt,
      });

      try {
        // Invoke the model
        const response = await bedrockClient.send(command);

        // Parse the response body
        const modelResponse = JSON.parse(
          new TextDecoder().decode(response.body)
        );

        return modelResponse.output.message.content[0].text;
      } catch (err) {
        console.log(err);
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        console.error(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [modelId, bedrockClient, requestBody]
  );

  return { invokeModel, isLoading, error };
};
