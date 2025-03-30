/* eslint-disable @typescript-eslint/no-unused-vars */
import { generateClient } from "aws-amplify/data";
import { type Schema } from "../../amplify/data/resource.ts";
import {
  exampleCVData,
  exampleJobDesc,
} from "../../data/upload-examples/cv.ts";
import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);
const client = generateClient<Schema>();

exampleCVData.forEach(async (cvObject) => {
  const [[key, cvData]] = Object.entries(cvObject);
  const { errors, data: newTodo } = await client.models.exampleCV.create({
    title: cvData.title,
    content: cvData.content,
  });
});

// await Promise.all(
//   exampleCVData.map(async (cvObject) => {
//     const [[key, cvData]] = Object.entries(cvObject);
//     const { errors, data: newTodo } = await client.models.exampleCV.create({
//       title: cvData.title,
//       content: cvData.content,
//     });
//     return { key, errors, newTodo };
//   })
// );

// await Promise.all(
//   exampleJobDesc.map(async (cvObject) => {
//     const [[key, cvData]] = Object.entries(cvObject);
//     const { errors, data: newTodo } =
//       await client.models.exampleJobDescription.create({
//         title: cvData.title,
//         content: cvData.content,
//       });
//     return { key, errors, newTodo };
//   })
// );
