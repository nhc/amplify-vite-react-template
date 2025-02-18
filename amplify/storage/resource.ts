import { defineStorage } from "@aws-amplify/backend";

enum AmplifyStorageNames {
  IGSiteStorage = "IGSiteStorage",
  IGCVStorage = "IGCVStorage",
  IGJobSpecStorage = "IGJobSpecStorage",
}

const IGSiteStorage: AmplifyStorageNames = AmplifyStorageNames.IGSiteStorage;
export const siteStorage = defineStorage({
  name: IGSiteStorage,
  access: (allow) => ({
    "files/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
  isDefault: true,
});

//const IGCVStorage: AmplifyStorageNames = AmplifyStorageNames.IGCVStorage;
export const cvStorage = defineStorage({
  name: "IGCVStorage",
  access: (allow) => ({
    "cv/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
  isDefault: true,
});

const IGJobSpecStorage: AmplifyStorageNames =
  AmplifyStorageNames.IGJobSpecStorage;
export const jobSpecStorage = defineStorage({
  name: IGJobSpecStorage,
  access: (allow) => ({
    "specs/*": [allow.authenticated.to(["read", "write", "delete"])],
  }),
  isDefault: true,
});
