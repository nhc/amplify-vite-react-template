import type { Schema } from "../../amplify/data/resource";
import { useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
//import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";

import outputs from "../../amplify_outputs.json";
import Markdown from "react-markdown";

Amplify.configure(outputs);

const client = generateClient<Schema>();

// const bedrockClient = new BedrockAgentRuntimeClient({
//   region: "eu-west-1",
//   credentials: {
//     accessKeyId: import.meta.env.VITE_AWSACCESSKEY,
//     secretAccessKey: import.meta.env.VITE_AWSSECRETKEY,
//   },
// });

export const Analysis = () => {
  const [cvPrompt, setCvPrompt] = useState<string>("");
  const [jobPrompt] = useState<string>("");
  const [answer] = useState<string | null>(null);

  useEffect(() => {
    const jd = async function getConvertedCv() {
      return await client.models.extractedFileContent
        .list({ limit: 1 })
        .then((data) => {
          const content = data.data[0].content;
          if (typeof content == "string") {
            setCvPrompt(content);
          }
          return data;
        })
        .catch((error) => {
          console.error("getConvertedCv ERROR", error);
        });
    };
    const cv = async function getJobDescription() {
      return await client.models.jobDescription
        .list({ limit: 1 })
        .then((data) => {
          console.log("DATA"), data;
          //   const content = data.data[0].content;
          //   if (typeof content == "string") {
          //     setJobPrompt(content);
          //   }
          return data;
        })
        .catch((error) => {
          console.error("getJobDescription ERROR", error);
        });
    };
    // getConvertedCv().then((data: any) => {
    //   console.log("Converted CV", data);
    //   setCvPrompt(
    //     `This is cv for comparison: "{\\Text\\: \\Neil Charlton\\}\\n{\\Text\\: \\DOB: 30 July 1976 (48)\\}\\n{\\Text\\: \\9 East Parade\\}\\n{\\Text\\: \\Email: neil charlton@icloud.com\\}\\n{\\Text\\: \\Skelton-in-Cleveland\\}\\n{\\Text\\: \\Phone: 07775 503055\\}\\n{\\Text\\: \\Saltburn-by-the-Sea\\}\\n{\\Text\\: \\TS12 2BJ\\}\\n{\\Text\\: \\Personal Statement\\}\\n{\\Text\\: \\I am a creative full stack agile software developer with over 20 years experience in both contract\\}\\n{\\Text\\: \\and full time positions. I've worked small projects, all the way up to leading a six man\\}\\n{\\Text\\: \\development team and contributing to company digital strategy.\\}\\n{\\Text\\: \\I take a level headed and logical approach to projects and enjoy attention to detail. I am keen to\\}\\n{\\Text\\: \\try new ideas while not reinventing the wheel each time. I am familiar with all aspects of\\}\\n{\\Text\\: \\software development and management from planning and strategy, through to development\\}\\n{\\Text\\: \\(front and back), CI/CD and performance tweaking focussing on the agile methodology.\\}\\n{\\Text\\: \\Key Technical Skills\\}\\n{\\Text\\: \\Key Business Skills\\}\\n{\\Text\\: \\I can learn most things given the manual and a couple\\}\\n{\\Text\\: \\Business requirements capture.\\}\\n{\\Text\\: \\of days. I have built products and I am most familiar\\}\\n{\\Text\\: \\with the following:\\}\\n{\\Text\\: \\Prototyping ideas.\\}\\n{\\Text\\: \\Frontend: React (Since 2017), VueJS, Typescript\\}\\n{\\Text\\: \\User experience (UX) planning\\}\\n{\\Text\\: \\(Since 2020), CSS (+ Preprocessors), NextJS. Modern\\}\\n{\\Text\\: \\build tools like Vite, Webpack, eslint.\\}\\n{\\Text\\: \\Project analysis, planning and\\}\\n{\\Text\\: \\delivery using the AGILE\\}\\n{\\Text\\: \\Backend: Typescript / NodeJS (Express, Serverless\\}\\n{\\Text\\: \\methodology.\\}\\n{\\Text\\: \\Functions), PHP (Custom, Zend, Laravel, Wordpress,\\}\\n{\\Text\\: \\CraftCMS), Ruby on Rails, REST, GraphQL,\\}\\n{\\Text\\: \\Stand in scrum master and leader of\\}\\n{\\Text\\: \\daily stand-ups.\\}\\n{\\Text\\: \\Database: MongoDb, MySql, Postgres, MSSQL.\\}\\n{\\Text\\: \\ORM's like Prisma.\\}\\n{\\Text\\: \\Great spoken communication of\\}\\n{\\Text\\: \\ideas and technologies to non tech\\}\\n{\\Text\\: \\Platforms / Servers / Services: Azure Devops,\\}\\n{\\Text\\: \\people.\\}\\n{\\Text\\: \\Amazon Web Services, Nginx, Apache, Vercel,\\}\\n{\\Text\\: \\Railway, NPM, Git and Github, Bitbucket,\\}\\n{\\Text\\: \\Confident in front of the client /\\}\\n{\\Text\\: \\Containerisation with Docker.\\}\\n{\\Text\\: \\running client meetings and\\}\\n{\\Text\\: \\presentations.\\}\\n{\\Text\\: \\Automation: Developed creative solutions for\\}\\n{\\Text\\: \\automating workflows, generating reports, and chatbot\\}\\n{\\Text\\: \\customer service solutions.\\}\\n{\\Text\\: \\Testing: Jest, Cypress.lo\\}\\n{\\Text\\: \\Employment History and Career Highlights\\}\\n{\\Text\\: \\Nov 2020 - Current Employment. Sycous 60 + employees\\}\\n{\\Text\\: \\Senior Front End Software Developer (Full Time)\\}\\n{\\Text\\: \\Working in the energy industry, specifically in the metering and billing sector, I was employed to\\}\\n{\\Text\\: \\run a small team working for a sibling company Brunata,com, which is based in Copenhagen.\\}\\n{\\Text\\: \\Operating fully remotely I was tasked with the planning / development / testing and continuous\\}\\n{\\Text\\: \\deployment of the entire front end, which was part of a flagship project for the Danish company.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Responsible for deciding on the tools and testing systems used in the successful development of\\}\\n{\\Text\\: \\this 'smart buildings' project.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Used React and Typescript for the core project and spend 3 years working on basic then onto\\}\\n{\\Text\\: \\advanced features based around a micro-services architecture in the form of RESTFUL api's.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Used cypress.io to create a comprehensive set of end to end tests.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Delivered regular demo's and releases to senior stakeholders across the business.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Leveraged Docker containers and Nginx for CI/CD pipelines in Azure DevOps.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Successfully completed the project based on the timelines and handed over to a team based in\\}\\n{\\Text\\: \\Copenhagen which involved training some juniors and providing detailed documentation of our\\}\\n{\\Text\\: \\code.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\After 3 years I was moved into the core team at Sycous and work on the core product Mabdeck\\}\\n{\\Text\\: \\which involves backend development with C#, AspDotNet with frontend in Vue.js.\\}\\n{\\Text\\: \\Feb 2018 to Sept 2020 - MadeByExtreme.com 30+ employees\\}\\n{\\Text\\: \\Senior Software Developer (Full Time)\\}\\n{\\Text\\: \\I was brought into this team of 6 to help with a flagging, difficult and unique web ecommerce\\}\\n{\\Text\\: \\project. An established bricks and mortar business with 80,000+ building and DIY products and\\}\\n{\\Text\\: \\over 80 stores across the UK. Outside of this I worked on various client projects when I was\\}\\n{\\Text\\: \\needed.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Responsible for the REST PHP api which communicated between the site and some custom\\}\\n{\\Text\\: \\middleware. Covered members, accounts, products, prices, discounts and delivery functions.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Responsible for the MongoDB based middleware including new features and maintenance.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Responsible for the nightly communication with the ancient internal stock control system which\\}\\n{\\Text\\: \\controlled everything from members preferences to stock to prices.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Used defensive programming techniques and proper failsafe programming for when data was\\}\\n{\\Text\\: \\regularly corrupted from the host system and recovery, there from.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\The owner and driving force of testing across the whole company focusing a lot on Cypress.io.\\}\\n{\\Text\\: \\Responsible for testing standards and onboarding new staff.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Gave regular dev talks to the team.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Owned and ran a simple chatbot customer service solution made in React.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Automating workload by writing creative solutions for generating reports.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Researching and suggesting new tech and consulted on new company offerings.\\}\\n{\\Text\\: \\April 2017 to Feb 2018 - Advanced Digital Innovation (Contract)\\}\\n{\\Text\\: \\Software Engineer\\}\\n{\\Text\\: \\Working on one product which was based around health records for the NHS. Both a web\\}\\n{\\Text\\: \\(PWA) and mobile version. React (in Javascript) and Laravel based.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Working in an agile environment with continuous deployment.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Delivering software based on user stories. Authored user stories.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Writing and deploying software mostly as API's (microservices) that are part of a complex system\\}\\n{\\Text\\: \\that integrates directly with the NHS. Used Jenkins.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Writing QA tests in all disciplines.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Training new members of the team.\\}\\n{\\Text\\: \\2011 to Present - Bleep Systems LTD\\}\\n{\\Text\\: \\Freelancer / Owner / Developer\\}\\n{\\Text\\: \\Building and consulting on web based software projects. I 'slot in' as part of a bigger team or\\}\\n{\\Text\\: \\take the lead on planning and delivering a whole project.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Spent 4 months of 2020 working on a React project for a charity.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Pitching and specifying web based software projects based on client requirements.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Presenting and writing complex proposals and quotes.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Setting up of projects including plans, servers, version control and code bases.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Writing code and delivering projects on time and budget.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Maintaining relationships and selling new ideas and products to clients.\\}\\n{\\Text\\: \\2013 to 2014 - Bluestone98.com\\}\\n{\\Text\\: \\Head of Digital (Freelance Consultant)\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Brought on board to help to turn around the failing digital arm of the business.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Standardised the way projects were run and trained up a small team of developers between UK\\}\\n{\\Text\\: \\and India.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Responsible for all digital output during my time there.\\}\\n{\\Text\\: \\2009 to 2011 - Engageinteractive.co.uk\\}\\n{\\Text\\: \\Senior Developer (Full Time)\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Employee number 4 of this now very successful Leeds agency I laid the foundations for the\\}\\n{\\Text\\: \\development side of business for its early formative years.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Clients included Bella Italia, Belgo, Cafe Rouge and Giraffe restaurants.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Wrote content for a number of print publications.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Designed a company wide CMS to be used in the formative years of this company.\\}\\n{\\Text\\: \\2007 to 2009 - Magnitude\\}\\n{\\Text\\: \\Lead Developer (Full Time)\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Won a Webby Award for wagamama.com in 2008.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Headed up a 6 man development team at this marketing agency.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Built a custom CRM, CMS for Wagamama.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Devised and deployed a training plan and for Wagamama staff in 12 countries and ran a 2 day\\}\\n{\\Text\\: \\seminar to deliver training on the system.\\}\\n{\\Text\\: \\2005 to 2014 - hypetypestudio.com\\}\\n{\\Text\\: \\Lead Developer (Freelance)\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Worked with the owner Paul in a freelance capacity and was responsible for all their digital\\}\\n{\\Text\\: \\output for many years. Hypetype is primarily a graphic design / branding agency and I was\\}\\n{\\Text\\: \\able to handle all the work on a freelance basis. Many brochureware websites with basic\\}\\n{\\Text\\: \\CMS.\\}\\n{\\Text\\: \\2000 to 2004 - www.tuimedia.com\\}\\n{\\Text\\: \\Junior Developer\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Worked on one of the first incarnations of Asda Shopping and The Halifax building society.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Built some early web games for bt.com\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Worked on the website for DaftPunk and their discovery album\\}\\n{\\Text\\: \\Education\\}\\n{\\Text\\: \\| view myself as a lifelong learner. I love reading and learning new things.\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\Master of Science in Multimedia / Internet Applications from Teesside University (2000)\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\BA (Hons) Business Studies (2:1) Leeds Metropolitan University (1998)\\}\\n{\\Text\\: \\-\\}\\n{\\Text\\: \\4 A Levels, 10 GCSE's\\}\\n"`
    //   );
    // });

    Promise.all([cv(), jd()]).then(() => {
      console.log("Promise.all", cvPrompt, jobPrompt);
      //setJobPrompt(`This is the job description: ${data.data[0].content}`);
    });

    // getJobDescription().then((data: any) => {

    // });
  }, []);

  //   useEffect(() => {
  //     async function invokeAgent(prompt: string) {
  //       const session = "123";
  //       const command = new InvokeAgentCommand({
  //         agentId: "NNXVXHQC3X",
  //         agentAliasId: "YZTSEAXCHD",
  //         sessionId: session,
  //         inputText: prompt,
  //       });
  //       try {
  //         let completion = "";
  //         const response = await bedrockClient.send(command);
  //         if (response.completion === undefined) {
  //           throw new Error("Completion is undefined");
  //         }
  //         for await (const chunkEvent of response.completion) {
  //           const chunk = chunkEvent.chunk;
  //           const decodedResponse = new TextDecoder("utf-8").decode(chunk?.bytes);
  //           completion += decodedResponse;
  //         }
  //         return { sessionId: session, completion };
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     }
  //     if (cvPrompt.length !== 0 || jobPrompt.length !== 0) {
  //       //   console.log("CV Prompt", cvPrompt);
  //       //   console.log("Job Prompt", jobPrompt);
  //       const combinedPrompt = `${cvPrompt} ${jobPrompt}`;

  //       //   invokeAgent(prompt).then((data: any) => {
  //       //     setAnswer(data?.completion);
  //       //   });
  //       console.log("combinedPrompt", combinedPrompt);
  //     }
  //   }, [cvPrompt, jobPrompt]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-white">Ai Analysis Page</h2>
      <div className="text-center text-black dark:text-white text-left">
        <Markdown>{answer}</Markdown>
      </div>
    </div>
  );
};
