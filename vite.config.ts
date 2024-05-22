import { defineConfig } from "@solidjs/start/config";
import solidPlugin from "vite-plugin-solid";0



export default defineConfig({
    server: {
      preset:'vercel'
    },
    start: {
      ssr: true,
      server: {
        baseURL: process.env.BASE_PATH,
        preset: "static"
      }
    }
});