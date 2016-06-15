import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';


export default {
  entry: 'lib/index.js',
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs({
      sourceMap: false,
    }),
  ],
  targets: [
    { dest: 'dist/integration.js', format: 'iife', moduleName: 'NOT_A_MODULE' },
  ],
};
