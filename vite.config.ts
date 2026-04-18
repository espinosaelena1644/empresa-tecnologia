import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// cambio
// https://vite.dev/config/
export default defineConfig({
  base: "/empresa-tecnologia/",
  plugins: [react()],
});
