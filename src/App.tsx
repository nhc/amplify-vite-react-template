import "@aws-amplify/ui-react/styles.css";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);

const client = generateClient<Schema>();

function App() {
  const { signOut, authStatus, user } = useAuthenticator((context) => [
    context.user,
  ]);

  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  if (authStatus === "configuring") return <div>Loading...</div>;
  if (authStatus !== "authenticated")
    return (
      <div className="h-screen flex items-center justify-center">
        <Authenticator />
      </div>
    );

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <br />
      <button
        className="cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 px-4"
        onClick={signOut}
      >
        Sign out
      </button>

      <FileUploader
        bucket={"IGSiteStorage"}
        acceptedFileTypes={["pdf/*", "docx/*", "txt/*"]}
        path={({ identityId }) => `files/${identityId}/`}
        maxFileCount={1}
        maxFileSize={1 * 1024 * 1024}
        isResumable
        onUploadSuccess={async (file) => {
          console.log("File uploaded successfully", file, user.userId);
          const created = await client.models.uploadedFiles.create({
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
    </main>
  );
}

export default App;
