import { flag } from "flags/next";

export const newsletterFlag = flag<boolean>({
  key: "newsletter",
  defaultValue: false,
  description: "Show newsletter signup sections",
  decide() {
    return process.env.FLAG_NEWSLETTER === "true";
  },
});
