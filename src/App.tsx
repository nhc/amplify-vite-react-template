import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
// import { FileUploader } from "@aws-amplify/ui-react-storage";
// import { IGSiteStorage } from "../amplify/storage/resource";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

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
      {/* <FileUploader
        bucket={IGSiteStorage}
        acceptedFileTypes={["pdf/*", "docx/*", "txt/*"]}
        path={({ identityId }) => `cv/${identityId}/`}
        maxFileCount={1}
        maxFileSize={1 * 1024 * 1024}
        isResumable
        onUploadSuccess={async (file) => {
          console.log("File uploaded successfully", file);
        }}
      /> */}
    </main>
  );
}

export default App;
