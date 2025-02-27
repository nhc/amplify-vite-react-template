import { useState, useCallback } from "react";
import {
  InvokeAgentCommand,
  BedrockAgentRuntimeClient,
} from "@aws-sdk/client-bedrock-agent-runtime";

interface UseAgentInvokeProps {
  agentId: string;
  agentAliasId: string;
  sessionId: string;
  bedrockClient: BedrockAgentRuntimeClient;
}

interface UseAgentInvokeReturn {
  invokeAgent: (prompt: string) => Promise<string | undefined>;
  isLoading: boolean;
  error: Error | null;
}

export const useAgentInvoke = ({
  agentId,
  agentAliasId,
  sessionId,
  bedrockClient,
}: UseAgentInvokeProps): UseAgentInvokeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const invokeAgent = useCallback(
    async (prompt: string): Promise<string | undefined> => {
      setIsLoading(true);
      setError(null);

      const command = new InvokeAgentCommand({
        agentId,
        agentAliasId,
        sessionId,
        inputText: prompt,
      });

      try {
        let completion = "";
        const response = await bedrockClient.send(command);

        if (response.completion === undefined) {
          throw new Error("Completion is undefined");
        }

        for await (const chunkEvent of response.completion) {
          const chunk = chunkEvent.chunk;
          const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes);
          completion += decodedResponse;
        }

        return completion;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        console.error(error);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [agentId, agentAliasId, sessionId, bedrockClient]
  );

  return { invokeAgent, isLoading, error };
};
