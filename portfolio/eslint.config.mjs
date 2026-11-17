// ESLint flat config. eslint-config-next 16 ships flat configs: no FlatCompat needed.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
    { ignores: [".next/**", "node_modules/**", ".pnpm-store/**", "next-env.d.ts"] },
    ...nextCoreWebVitals,
    {
        // New in eslint-plugin-react-hooks 7 (React Compiler rules). The flagged
        // code (data loading and mount state set in effects) works as is: warnings
        // until it is reworked, so the Next 16 upgrade changes no behaviour.
        rules: {
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/immutability": "warn",
        },
    },
];

export default config;
