import { useState } from "react";
import { NavItem } from "./navigation-item";
import { NavLink } from "react-router";
import { signOut } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

export function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { authStatus } = useAuthenticator((context) => [context.user]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="">
            <NavLink to="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Interview Guy
              </span>
            </NavLink>
          </div>
          <div className="flex-grow text-center ">
            <div className="space-x-4">
              <NavItem href="/upload-documents" text="Upload Documents" />
              <NavItem href="/analysis" text="Analysis" />
              <NavItem href="/mock-interview" text="Mock Interview" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleDarkMode()}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              <svg
                className="h-6 w-6 text-gray-800 dark:text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                ></path>
              </svg>
            </button>
            {authStatus === "authenticated" && (
              <button
                onClick={() => handleSignOut()}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
