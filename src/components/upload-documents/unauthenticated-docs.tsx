import { useState } from "react";
import { PdfSvg } from "../svg/pdf";
//import { SiteMessage } from "../sitemessage";
import { TxtSvg } from "../svg/txt";
import {
  exampleCVData,
  exampleJobDesc,
} from "../../../data/upload-examples/cv";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import outputs from "../../../amplify_outputs.json";
import { Schema } from "../../../amplify/data/resource";
import { LoadingSpinner } from "../loading-spinner";
import { useNavigate } from "react-router";
import { useLocalStorage } from "usehooks-ts";

Amplify.configure(outputs);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const client = generateClient<Schema>();

export const UnAuthenticatedDocumentUpload = () => {
  const [cvName, setCvName] = useState<string>("Example Charity CV");
  const [JdName, setJdName] = useState<string>(
    "Example - Charity Shop Manager"
  );
  const [loading, setLoading] = useState<boolean>(false);

  const [, localSetCV] = useLocalStorage("cv", "");
  const [, localSetJD] = useLocalStorage("jd", "");
  const [, localSetCvJD] = useLocalStorage("hasCvJd", false);

  const navigate = useNavigate();

  const saveCV = async () => {
    const cv = exampleCVData.find((d) => cvName === d.title);

    const { errors, data: savedCvData } = await client.models.exampleCV.create({
      title: cv?.title,
      content: cv?.content,
    });
    if (!errors) {
      return savedCvData;
    }
  };

  const saveJD = async () => {
    const jd = exampleJobDesc.find((data) => JdName === data.title);
    console.log(exampleJobDesc, jd?.title), JdName;
    const { errors, data: savedJdData } =
      await client.models.exampleJobDescription.create({
        title: jd?.title,
        content: jd?.content,
      });
    if (!errors) {
      return savedJdData;
    }
  };

  const saveCvJd = async () => {
    setLoading(true);
    await Promise.all([saveCV(), saveJD()]).then((data) => {
      if (data[0]) {
        const cv = data[0];
        const jd = data[1];
        // console.log("cv", cv);
        // console.log("jd", jd);
        if (cv?.content) {
          localSetCV(cv?.content);
        }
        if (jd?.content) {
          localSetJD(jd?.content);
        }
        if (jd?.content && cv?.content) {
          localSetCvJD(true);
        }

        setTimeout(() => {
          navigate("/analysis");
        }, 500);
      }
    });
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            1. Choose example CV
          </h2>
          <div className="flex">
            <select
              onChange={(e) => {
                console.log(e.target.value);
                setCvName(e.target.value);
              }}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <option value="Example Charity CV">CV 1 - Charity CV</option>
              <option value="Example Business / Consultant CV">
                CV 2 - Business / Consultant CV
              </option>
              <option value="Example Science CV">CV 3 - Science CV</option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-start rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 my-6 p-3">
            <PdfSvg />
            <div className="cursor-pointer" onClick={() => alert("cv content")}>
              {cvName}
            </div>
          </div>
        </div>
        <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            2. Insert your job description
          </h2>
          <div className="flex">
            <select
              onChange={(e) => {
                setJdName(e.target.value);
              }}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <option value="Example Job Description - Charity Shop Manager">
                Example - Charity Shop Manager
              </option>
              <option value="Example Job Description - Project Manager">
                Example - Project Manager
              </option>
              <option value="Example Job Description - Graduate Chemist">
                Example - Graduate Chemist
              </option>
            </select>
          </div>
          <div className="flex flex-row items-center justify-start rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 my-6 p-3">
            <TxtSvg />
            <div className="cursor-pointer" onClick={() => alert("cv content")}>
              {JdName}
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div></div>
        <div className="flex items-end justify-end">
          <button
            disabled={loading}
            onClick={saveCvJd}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded min-w-1/2 mt-5 flex items-center justify-center"
          >
            {loading ? <LoadingSpinner /> : "Continue"}
          </button>
        </div>
      </div>
    </>
  );
};
