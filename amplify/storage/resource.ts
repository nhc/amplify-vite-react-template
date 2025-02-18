import { defineStorage } from "@aws-amplify/backend";

// enum AmplifyStorageNames {
//   IGSiteStorage = "IGSiteStorage",
//   IGCVStorage = "IGCVStorage",
//   IGJobSpecStorage = "IGJobSpecStorage",
// }

export const siteStorage = defineStorage({
  name: "IGSiteStorage",
  access: (allow) => ({
    "files/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
  isDefault: true,
});

//const IGCVStorage: AmplifyStorageNames = AmplifyStorageNames.IGCVStorage;
export const cvStorage = defineStorage({
  name: "IGCVStorage",
  access: (allow) => ({
    "cv/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
});

export const jobSpecStorage = defineStorage({
  name: "IGJobSpecStorage",
  access: (allow) => ({
    "specs/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
});
