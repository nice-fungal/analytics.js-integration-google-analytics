import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';


export default {
  entry: 'lib/index.js',
  external: [
    'analytics',
  ],
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs({
      sourceMap: false,
    }),
  ],
  targets: [
    { dest: 'dist/integration.js', format: 'iife', moduleName: 'NOT_A_MODULE', globals: { analytics: 'analytics' } },
  ],
};
