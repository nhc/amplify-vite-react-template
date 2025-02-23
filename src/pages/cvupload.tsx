/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuthenticator } from "@aws-amplify/ui-react";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
// import { InfoIcon } from "../components/icon";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource";
import { useEffect, useRef, useState } from "react";
import { parseS3Filename } from "../utils/functions";
import { format } from "date-fns/format";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export const CVUpload = () => {
  const jobDescriptionTitleRef = useRef<HTMLInputElement>(null);
  const jobDescriptionContentRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuthenticator((context) => [context.user]);
  const [cvItem, setCvItem] = useState<Array<Schema["uploadedFile"]["type"]>>(
    []
  );
  const [hasCv, setHasCv] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);

  useEffect(() => {
    async function getFiles() {
      return await client.models.uploadedFile
        .list({ limit: 1 })
        .then((data) => {
          return data;
        })
        .catch((error) => {
          console.error(error);
        });
    }
    getFiles().then((data: any) => {
      if (data?.data.length > 0) {
        setHasCv(true);
      }
      setCvItem(data?.data);
    });
  }, []);

  async function deleteCv() {
    const toBeDeletedItem = { id: cvItem[0].id };
    const { errors } = await client.models.uploadedFile.delete(toBeDeletedItem);
    if (!errors) {
      setHasCv(false);
    }
  }

  async function saveJobDescription() {
    const { errors, data: newJobDescription } =
      await client.models.jobDescription.create({
        role: jobDescriptionTitleRef.current?.value || "No Job Title Provided",
        content:
          jobDescriptionContentRef.current?.value ||
          "No Job Desciption Provided",
        uploadedFileId: cvItem[0].id,
      });
    if (!errors) {
      console.log("Job Description saved", newJobDescription);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-12 dark:text-white ">
        Upload Your Documents
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* CV Upload Box */}
        <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            1. Upload CV <span className="text-sm ">(currently PDF only)</span>
          </h2>

          <div className="flex flex-row items-start">
            {!hasCv && !uploadingCV && (
              <FileUploader
                bucket={"IGSiteStorage"}
                acceptedFileTypes={["pdf/*"]}
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
                    setUploadingCV(true);
                  }
                  // save to storage
                }}
              />
            )}
            {hasCv && !uploadingCV && (
              <div className="ml-5 dark:text-white">
                <p>
                  Will we use the CV you previously uploaded on{" "}
                  {format(cvItem[0].createdAt, "dd MMM yyyy HH:m:s aaa")}{" "}
                </p>
                {cvItem?.map((item) => (
                  <div key={item.id}>
                    <div className="flex items-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 my-6">
                      <div className="my-2">
                        <svg
                          style={{
                            height: "40px",
                            width: "40px",
                            marginRight: "10px",
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path
                            fill="#ff4444"
                            d="M448 464c8.8 0 16-7.2 16-16V160H368c-17.7 0-32-14.3-32-32V48H96c-8.8 0-16 7.2-16 16v384c0 8.8 7.2 16 16 16h352z"
                          />

                          <path
                            fill="#dd2222"
                            d="M368 128h96L368 32v80c0 8.8 7.2 16 16 16z"
                          />

                          <text
                            x="130"
                            y="320"
                            fill="white"
                            fontFamily="Arial"
                            fontWeight="bold"
                            fontSize="140"
                          >
                            PDF
                          </text>
                        </svg>
                      </div>
                      <div>{parseS3Filename(item?.path || "").name}</div>
                    </div>
                  </div>
                ))}
                <div className="flex flex-col">
                  <p>
                    To add a new CV you must{" "}
                    <a
                      onClick={deleteCv}
                      className="text-red-500 cursor-pointer"
                    >
                      delete
                    </a>{" "}
                    this one first.
                  </p>
                  {/* <button
                    onClick={deleteCv}
                    className="inline-block bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 mt-2"
                  >
                    DELETE
                  </button> */}
                </div>
              </div>
            )}

            {uploadingCV && (
              <div className="ml-5 dark:text-white  flex items-center justify-center">
                <svg
                  style={{
                    height: "60px",
                    width: "60px",
                  }}
                  className="h-6 w-6 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div>
                  <p>
                    Great we have your CV. Give us a few minutes to process it.
                  </p>
                  <p className="mt-2">
                    While you are waiting paste a job description into the box
                    on the right.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Description Upload Box */}
        <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            2. Job Description
          </h2>
          <div className="flex flex-col items-center">
            <input
              type="text"
              ref={jobDescriptionTitleRef}
              placeholder="E.g. Marketing Manager"
              className="w-full p-3 mb-2 border-1 border-solid border-gray-300 dark:border-gray-600 bg-white"
            />
            <textarea
              ref={jobDescriptionContentRef}
              placeholder="Add required skills, qualifications, and responsibilities etc"
              className="w-full h-48 p-4 border-1 border-solid border-gray-300 dark:border-gray-600 bg-white"
            ></textarea>
            <div className="w-full text-right">
              <button
                onClick={saveJobDescription}
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mt-3"
              >
                Go !
              </button>
            </div>
            {/* <label
              htmlFor="jd-upload"
              className="cursor-pointer bg-blue-50 dark:bg-gray-800 p-8 rounded-lg w-full text-center"
            >
              <span className="text-blue-600 dark:text-blue-400">
                Drop job description here or click to upload
              </span>
            </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};
