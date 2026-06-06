import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/climate-command-center.ts',
  output: {
    file: 'dist/climate-command-center.js',
    format: 'es',
  },
  plugins: [
    resolve({ browser: true }),
    typescript(),
    terser({ format: { comments: false } }),
  ],
};
