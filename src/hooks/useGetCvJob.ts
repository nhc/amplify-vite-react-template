interface UseResumeMatchingReturn {
  cvContent: string | null;
  jobDescription: string | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
import type { Schema } from "../../amplify/data/resource";
import { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "../../amplify_outputs.json";

export const useGetCvJob = (): UseResumeMatchingReturn => {
  const [cvContent, setCvContent] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const client = generateClient<Schema>();

  const fetchCv = async (): Promise<string | null> => {
    try {
      const response = await client.models.extractedFileContent.list({
        limit: 1,
      });
      const content = response.data[0]?.content;
      return content ? JSON.parse(JSON.stringify(content)) : null;
    } catch (err) {
      console.error("Error fetching CV:", err);
      throw new Error("Failed to fetch CV");
    }
  };

  const fetchJobDescription = async (): Promise<string | null> => {
    try {
      const response = await client.models.jobDescription.list({ limit: 1 });
      return response.data[0]?.content ?? null;
    } catch (err) {
      console.error("Error fetching job description:", err);
      throw new Error("Failed to fetch job description");
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const [cvData, jdData] = await Promise.all([
        fetchCv(),
        fetchJobDescription(),
      ]);

      setCvContent(cvData);
      setJobDescription(jdData);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Amplify.configure(outputs);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs]);

  const refetch = async (): Promise<void> => {
    await fetchData();
  };

  return {
    cvContent,
    jobDescription,
    isLoading,
    error,
    refetch,
  };
};
