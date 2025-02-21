import { useAuthenticator } from "@aws-amplify/ui-react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
// import { InfoIcon } from "../components/icon";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const CVUpload = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-12 dark:text-white ">
        Upload Your Documents
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CV Upload Box */}
        <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Upload CV <span className="text-sm ">(currently PDF only)</span>
          </h2>

          {/* <a
            href="#"
            onClick={() => toggleFileUpload()}
            className="text-blue-600"
          >
            Don't have a file or just prefer to paste?
          </a> */}

          <div className="flex flex-row items-start">
            <FileUploader
              bucket={"IGSiteStorage"}
              acceptedFileTypes={["pdf/*", "docx/*", "txt/*"]}
              path={({ identityId }) => `files/${identityId}/`}
              maxFileCount={1}
              maxFileSize={1 * 1024 * 1024}
              isResumable
              onUploadSuccess={async (file) => {
                console.log("File uploaded successfully", file, user.userId);
                const created = await client.models.uploadedFile.create({
                  bucket: "interviewGuyFileStorageCVs",
                  path: file.key,
                  cognitoUserId: user.userId,
                });
                if (created?.data) {
                  console.log(
                    "File uploaded successfully and saved to storage",
                    created.data
                  );
                }
                // save to storage
              }}
            />
            <div className="ml-5 dark:text-white">
              <p>You have the following CV uploaded</p>
              <div></div>
            </div>
          </div>
        </div>

        {/* Job Description Upload Box */}
        <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Upload Job Description
          </h2>
          <div className="flex flex-col items-center">
            <input
              type="file"
              className="hidden"
              id="jd-upload"
              accept=".pdf,.doc,.docx"
            />
            <label
              htmlFor="jd-upload"
              className="cursor-pointer bg-blue-50 dark:bg-gray-800 p-8 rounded-lg w-full text-center"
            >
              <span className="text-blue-600 dark:text-blue-400">
                Drop job description here or click to upload
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
