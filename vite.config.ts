import { defineConfig } from "@solidjs/start/config";
import solidPlugin from "vite-plugin-solid";0



export default defineConfig({
  // plugins: [solidPlugin()],
  ssr:true,
  server: {
    // port: 3000,
    preset:'vercel'
  },
  // build: {
  //   target: "esnext",
  // },
});