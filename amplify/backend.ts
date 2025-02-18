import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { siteStorage, cvStorage, jobSpecStorage } from "./storage/resource";

defineBackend({
  auth,
  data,
  siteStorage,
  cvStorage,
  jobSpecStorage,
});
