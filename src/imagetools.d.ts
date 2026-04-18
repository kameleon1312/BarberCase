// TypeScript declarations for vite-imagetools query imports
// defaultDirectives in vite.config.ts adds format=webp+quality=80 automatically

declare module '*.jpg?w=1200' { const src: string; export default src; }
declare module '*.jpg?w=1400' { const src: string; export default src; }
declare module '*.jpg?w=900'  { const src: string; export default src; }
declare module '*.jpg?w=500'  { const src: string; export default src; }
declare module '*.png?w=120'  { const src: string; export default src; }
