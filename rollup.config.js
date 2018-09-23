import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: `./src/CanvasLayer.js`,
  output: {
    file: `./lib/CanvasLayer.js`,
    format: 'cjs',
    name: `react-leaflet-canvas-layer`,
  },
  external: [
    "leaflet",
    "prop-types",
    "react",
    "react-leaflet"
  ],
  plugins: [
    resolve({
      module: true,
      jsnext: true,
      main: true,
      browser: true,
      extensions: ['.js'],
      modulesOnly: true,
    }),
    babel({
    }),
  ],
};
