import { defineConfig } from "vitest/dist/config";

export default defineConfig({
    define: {
        "import.meta.vitest": undefined,
    },
    test: {
        coverage: {
            reporter: ["text", "html"],
        },
    },
});
