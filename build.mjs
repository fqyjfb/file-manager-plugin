import { build } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runBuild() {
  await build({
    root: __dirname,
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        name: 'FileManagerPlugin',
        formats: ['iife'],
        fileName: () => 'index.js'
      },
      outDir: path.resolve(__dirname, 'dist'),
      emptyOutDir: true,
      minify: false,
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime', 'react-dom/client'],
        output: { 
          globals: { 
            react: 'window.React', 
            'react-dom': 'window.ReactDOM', 
            'react/jsx-runtime': 'window.React',
            'react-dom/client': 'window.ReactDOM'
          } 
        }
      }
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    }
  });
  console.log("Build complete: dist/index.js generated.");
}
runBuild();
