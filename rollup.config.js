import glob from 'glob'
import path from 'path'
import alias from 'rollup-plugin-alias'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { dependencies, peerDependencies } from './package.json'

const buildDir = ".build";
const inputs = glob.sync(`./${buildDir}/**/*.js`);

// 外部依存はnodePackage表記にしたesm形式
const nodeEsmConfig = inputs.map(input => ({
  input,
  output: {
    file: path.format({
      dir: path.join(
        "./lib",
        path.relative(buildDir, path.dirname(input))
      ),
      name: path.basename(input, '.js'),
      ext: '.mjs'
    }),
    format: "esm"
  },
  external: id => true
}));

// 外部依存はnodePackage表記にしたcjs形式
const nodeCjsConfig = inputs.map(input => ({
  input,
  output: {
    file: path.join(
      "./lib",
      path.relative(buildDir, input),
    ),
    format: "cjs",
  },
  external: id => /^[a-zA-Z@]/.test(id)
}));

// 内部依存・外部依存すべてをOneFileにしたumd形式
const umdBundleConfig = {
  input: `./${buildDir}/index.js`,
  output: {
    file: "dist/pocket-monster.umd.js",
    format: "umd",
    name: "pocketMonster"
  },
  plugins: [
    commonjs(),
    resolve()
  ]
}

// 外部依存はCDNにしたesm形式
const browserEsmConfig = inputs.map(input => {
  const prodAndPeerDepencencyEntries = [
    ...Object.entries(dependencies || {}),
    ...Object.entries(peerDependencies || {})
  ];
  const dependencyAliasEntries = prodAndPeerDepencencyEntries.map(([name, version]) => ({
    find: name,
    replacement: `https://unpkg.com/${name}@${version}`
  }));
  return {
    input,
    output: {
      file: path.join(
        "./dist/lib/",
        path.relative(buildDir, input),
      ),
      format: "esm"
    },
    external: id => !/^(?:@([^/]+?)[/])?(?:[^/]+?)$/.test(id),
    plugins: [
      alias({
        entries: [
          ...dependencyAliasEntries,
          { find: /^((?:@([^/]+?)[/])?(?:[^/]+?))$/, replacement: `https://unpkg.com/$1` }
        ]
      })
    ]
  };
});


const config = [
  ...nodeEsmConfig,
  ...nodeCjsConfig,
  umdBundleConfig,
  ...browserEsmConfig,
];

export default config
