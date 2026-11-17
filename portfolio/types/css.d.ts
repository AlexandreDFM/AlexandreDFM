// TypeScript 6 checks side-effect imports (noUncheckedSideEffectImports):
// stylesheets imported for their side effect, such as app/layout.tsx's
// globals.css, need a declaration. Next.js bundles them.
declare module "*.css";
