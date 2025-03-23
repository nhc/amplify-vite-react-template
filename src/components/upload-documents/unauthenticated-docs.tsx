import { useState } from "react";
import { PdfSvg } from "../svg/pdf";
import { SiteMessage } from "../sitemessage";

export const UnAuthenticatedDocumentUpload = () => {
  const [cvName, setCvName] = useState<string>("Example Charity CV");
  return (
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
          <div>{cvName}</div>
        </div>
      </div>
      <div className="p-6 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        RIGHT
        <SiteMessage message="2" />
      </div>
    </div>
  );
};
