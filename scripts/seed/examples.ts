import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource";
import { exampleCVData, exampleJobDesc } from "../../data/upload-examples/cv";

const client = generateClient<Schema>();

await Promise.all(
  exampleCVData.map(async (cvObject) => {
    const [[key, cvData]] = Object.entries(cvObject);
    const { errors, data: newTodo } = await client.models.exampleCV.create({
      title: cvData.title,
      content: cvData.content,
    });
    return { key, errors, newTodo };
  })
);

await Promise.all(
  exampleJobDesc.map(async (cvObject) => {
    const [[key, cvData]] = Object.entries(cvObject);
    const { errors, data: newTodo } =
      await client.models.exampleJobDescription.create({
        title: cvData.title,
        content: cvData.content,
      });
    return { key, errors, newTodo };
  })
);
