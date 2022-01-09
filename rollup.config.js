import progress from "rollup-plugin-progress"
import html from "@rollup/plugin-html"
import replace from "@rollup/plugin-replace"
import url from '@rollup/plugin-url'
import resolve from "@rollup/plugin-node-resolve"
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import postcssUrl from "postcss-url"
import {terser} from "rollup-plugin-terser";

import path from "path";

const CURRENT_DIR = path.resolve(__dirname)

function getBuildMode() {
  let production = !process.env.ROLLUP_WATCH;

  return [
    production,
    production ? "production" : "development"
  ]
}

function getPlugins([isProduction, buildMode]) {
  return [
    progress(),
    resolve(),
    replace({
      preventAssignment: true,

      // Variables
      "process.env.NODE_ENV": JSON.stringify(buildMode),
    }),
    url({
      emitFiles: true,
      limit: 0,
    }),
    alias({
      entries: [
        {
          find: "src",
          replacement: path.resolve(CURRENT_DIR, "src")
        },
        {
          find: "styles",
          replacement: path.resolve(CURRENT_DIR, "styles")
        },
        {
          find: "assets",
          replacement: path.resolve(CURRENT_DIR, "assets")
        }
      ]
    }),
    commonjs(),
    typescript(),
    postcss({
      extract: true,
      autoModules: true,
      sourceMap: !isProduction,
      minimize: isProduction,
      to: "public/bundle.css",
      plugins: [
        postcssUrl({
          url: "copy",
          basePath: CURRENT_DIR,
          useHash: true,
        })
      ]
    }),
    isProduction && terser(),
    !isProduction && serve({
      verbose: true,
      contentBase: ["public"],
      host: "localhost",
      port: 3000
    }),
    !isProduction && livereload({
      watch: "public",
    })
  ]
}

/**
 * @type {import('rollup').RollupOptions}
 */
let config = {
  input: 'src/index.tsx',
  output: {
    file: "public/bundle.js",
    sourcemap: true,
    format: 'iife'
  },
  plugins: getPlugins(getBuildMode())
};

export default config;
