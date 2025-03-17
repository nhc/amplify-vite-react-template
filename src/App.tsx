import "@aws-amplify/ui-react/styles.css";
// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Outlet, Route } from "react-router";
import { Navbar } from "./components/navigation";
import { Footer } from "./components/footer";
import { Home } from "./pages/home";
import { Routes } from "react-router";
import { CVUpload } from "./pages/cvupload";
import { Analysis } from "./pages/analysis";
import { MockInterview } from "./pages/mockinterview";
import { TestPage } from "./pages/test/test";
// import { TestPage } from "./pages/test";
// import { SiteMessage } from "./components/sitemessage";

Amplify.configure(outputs);

// const client = generateClient<Schema>();

function App() {
  const { authStatus } = useAuthenticator((context) => [context.user]);

  // const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  // useEffect(() => {
  //   client.models.Todo.observeQuery().subscribe({
  //     next: (data) => setTodos([...data.items]),
  //   });
  // }, []);

  // function createTodo() {
  //   client.models.Todo.create({ content: window.prompt("Todo content") });
  // }

  if (authStatus !== "authenticated")
    return (
      <div className="h-screen flex items-center justify-center">
        <Authenticator />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-75">
      <Navbar />
      {/* <SiteMessage /> */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/upload-documents" element={<CVUpload />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/mock-interview" element={<MockInterview />} />
          <Route path="/test-page" element={<TestPage />} />
          {/* <Route path="/cv-job-analysis" element={<Analysis />} />
            <Route path="/ai-mock-interview" element={<MockInterview />} /> */}
        </Routes>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
