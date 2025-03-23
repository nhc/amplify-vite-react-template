import { useState } from "react";

type Props = {
  message: string;
};

export const SiteMessage = ({ message }: Props) => {
  const [closeMe, setCloseMe] = useState(false);
  const [loginReasons, showLoginReasons] = useState(false);

  function Close() {
    return (
      <span
        onClick={() => setCloseMe(true)}
        className="cursor-pointer float-end font-2xl"
      >
        X{" "}
      </span>
    );
  }

  if (loginReasons) {
    if (closeMe) return null;
    return (
      <div className="bg-red-600 dark:bg-red-900 text-white p-4 mb-4">
        <h2>
          Why Login? <Close />
        </h2>
        <div className="mt-2 text-left">
          This site is designed to save you time and improve your chances of
          getting your dream job. It works for any discipline and for any role.
          It works best on your documents and while in demo mode you can only
          use the example CVs and job descriptions.{" "}
        </div>
        <div className="my-2 text-lg font-bold">
          It's currently free for the basic service, so what are you waiting
          for?
        </div>
      </div>
    );
  }
  if (message === "1") {
    return (
      <div className="bg-red-600 dark:bg-red-900 text-white p-4 mb-4">
        <p className="text-center">
          You are in demo mode. In order to use your own CV and job description
          please login, its free !{" "}
          <span
            onClick={() => showLoginReasons(true)}
            className="text-blue-500 dark:text-blue-600 cursor-pointer"
          >
            Why login?
          </span>
        </p>
      </div>
    );
  }
  if (message === "2") {
    return (
      <div className="bg-red-600 dark:bg-red-900 p-2 mb-2">
        <p className="text-center">Using Job Dec</p>
      </div>
    );
  }
  return (
    <div className="bg-red-600 dark:bg-red-900 text-white p-4">
      <p className="text-center">
        We are currently experiencing heavy traffic.
      </p>
    </div>
  );
};
