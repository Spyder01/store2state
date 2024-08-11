const esbuild = require('esbuild');

esbuild.build({
    entryPoints: ['./index.ts'], // Path to your main TypeScript file
    bundle: true,                  // Bundle all dependencies into a single file
    outfile: 'dist/index.js',     // Output file path
    platform: 'browser',           // 'node' for Node.js, 'browser' for web
    target: 'esnext',              // Specify ECMAScript target
    sourcemap: true,               // Generate a source map
    minify: true,                  // Minify the output
    tsconfig: 'tsconfig.json',     // Path to your tsconfig.json
}).catch(() => process.exit(1));
