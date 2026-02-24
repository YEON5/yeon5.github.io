import type { Config } from "tailwindcss";
import sharedConfig from "../../packages/react-ui/tailwind.config";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/react-ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  presets: [sharedConfig],
};
export default config;