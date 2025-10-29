import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],

    // // path repository (github pages)
    // base: "/CPE334_FinalProject_StudentPlanner/",
});
