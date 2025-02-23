export function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* <!-- Hero Section --> */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Accelerate Your Career With AI-Powered Coaching
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Get job specific CV optimization and intelligent, interactive
          interview preparation.
        </p>
      </div>

      {/* <!-- Featured Mock Interview Section --> */}
      <div className="bg-blue-100 dark:bg-blue-900 rounded-xl p-8 mb-16">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              AI-Powered Mock Interviews
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Practice with our real-time AI interviewer, get instant feedback,
              and improve your interview skills.
            </p>
            <a
              href="/interview"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Try Mock Interview
            </a>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <img
              src="https://placehold.co/400x200"
              alt="Mock Interview"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* <!-- Features Grid --> */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* <!-- For Candidates --> */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            For Candidates
          </h3>
          <ul className="space-y-4 text-xl font-medium">
            <li className="flex items-start">
              <svg
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
              <span className="text-gray-700 dark:text-gray-300">
                Save time analysing and optimising your CV
              </span>
            </li>
            <li className="flex items-start">
              <svg
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
              <span className="text-gray-700 dark:text-gray-300">
                Supercharge your interview preparation
              </span>
            </li>
            <li className="flex items-start">
              <svg
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
              <span className="text-gray-700 dark:text-gray-300">
                Real-time feedback on responses
              </span>
            </li>
          </ul>
        </div>

        {/* <!-- For Recruiters --> */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            For Recruiters
          </h3>
          <ul className="space-y-4 text-xl font-medium">
            <li className="flex items-start">
              <svg
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
              <span className="text-gray-700 dark:text-gray-300">
                Automated candidate screening
              </span>
            </li>
            <li className="flex items-start">
              <svg
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
              <span className="text-gray-700 dark:text-gray-300">
                Skill matching algorithms
              </span>
            </li>
            <li className="flex items-start">
              <svg
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
              <span className="text-gray-700 dark:text-gray-300">
                Interview question generation
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
