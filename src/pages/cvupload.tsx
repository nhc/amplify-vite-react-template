import { useAuthenticator } from "@aws-amplify/ui-react";
import { UnAuthenticatedDocumentUpload } from "../components/upload-documents/unauthenticated-docs";
import { AuthenticatedDocumentUpload } from "../components/upload-documents/authenticated-docs";
import { SiteMessage } from "../components/sitemessage";

export const CVUpload = () => {
  const { authStatus } = useAuthenticator((context) => [context.user]);

  const Component = () => {
    return authStatus !== "authenticated" ? (
      <UnAuthenticatedDocumentUpload />
    ) : (
      <AuthenticatedDocumentUpload />
    );
  };

  return (
    // <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {authStatus !== "authenticated" && <SiteMessage message="1" />}
      <h1 className="text-3xl font-bold text-center mb-12 dark:text-white mt-6">
        Upload Your Documents
      </h1>

      <div className=" dark:text-white">
        <Component />
      </div>
    </div>
  );
};
