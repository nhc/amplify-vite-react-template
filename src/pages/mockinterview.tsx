export const MockInterview = () => {
  function toggleRecording() {
    const recordingStatus = document.getElementById("recordingStatus");
    const recordingIndicator = document.getElementById("recordingIndicator");

    if (recordingStatus?.textContent === "Recording...") {
      recordingStatus.textContent = "Mic Off";
      recordingIndicator?.classList.remove("animate-pulse", "bg-red-500");
      recordingIndicator?.classList.add("bg-gray-500");
    } else {
      if (recordingStatus?.textContent && recordingIndicator) {
        recordingStatus.textContent = "Recording...";
        recordingIndicator.classList.remove("bg-gray-500");
        recordingIndicator.classList.add("animate-pulse", "bg-red-500");
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Interview Questions
          </h3>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current Question:
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-lg p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
              Tell me about a challenging project you've worked on and how you
              overcame obstacles.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>What are your greatest strengths?</span>
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Where do you see yourself in 5 years?</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Your Response
          </h3>

          <div className="flex items-center mb-4">
            <div
              id="recordingIndicator"
              className="w-3 h-3 bg-gray-500 rounded-full"
            ></div>
            <span
              id="recordingStatus"
              className="ml-2 text-gray-600 dark:text-gray-400"
            >
              Mic Off
            </span>
            <button
              onClick={() => toggleRecording()}
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Toggle Mic
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Transcript:
            </h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-32 overflow-y-auto">
              <p className="text-gray-700 dark:text-gray-300">
                "In my previous role at XYZ Company, I led a team of five
                developers working on a critical client project..."
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Feedback:
            </h4>
            <div className="space-y-4">
              <div className="flex items-start">
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
                  Good use of specific example
                </span>
              </div>
              <div className="flex items-start">
                <svg
                  className="h-6 w-6 text-yellow-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  Consider adding more details about the outcome
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
