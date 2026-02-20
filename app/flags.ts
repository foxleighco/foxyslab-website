import { flag } from "flags/next";

export const blogFlag = flag<boolean>({
  key: "blog",
  defaultValue: false,
  description: "Show blog section and navigation links",
  decide() {
    return process.env.FLAG_BLOG === "true";
  },
});

export const newsletterFlag = flag<boolean>({
  key: "newsletter",
  defaultValue: false,
  description: "Show newsletter signup sections",
  decide() {
    return process.env.FLAG_NEWSLETTER === "true";
  },
});
