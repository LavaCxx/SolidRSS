import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";0


export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
  },
});