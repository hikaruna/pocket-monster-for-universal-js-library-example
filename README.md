# 様々な環境から読み込めるライブラリを生成するexample

- nativeなnodeからの読み込みに対応(cjs/npm) → lib/index.js
- esmを有効にしたnode、もしくは、webpackなどのバンドラからの読み込みに対応(esm/npm) → lib/index.mjs
- レガシーブラウザからの読み込みに対応(umd) → dist/packet-monster.umd.js
- モダンブラウザからの読み込みに対応(esm/cdn) → dist/lib/index.js

| dir | 説明 |
| --- | --- |
| . | |
| ./dist | ブラウザなどnodejs向け以外の成果物 |
| ./dist/lib | ```<script type="module">```に対応したブラウザなど、nodejs以外のためのesm/cdnの成果物 |
| ./lib  | node.js向けの成果物 |
| ./lib/**/*.js  | node.js向けのcsjの成果物 |
| ./lib/**/*.mjs  | esModuleに対応したnode.jsやwebpackなど向けのesm/npmの成果物 |
| ./src | ソースコード。sourceMapで参照される |
| ./typings | 型情報。 node.js向けに型情報を提供、sourceMapも含んでいる |

## Usage

### モダンブラウザ

```html
<monster-form></monster-form>

<script type="module">
  import { Monster, MonsterForm } from 'https://unpkg.com/@hikaruna/pocket-monster'
  // or
  // import Monster from 'https://unpkg.com/@hikaruna/pocket-monster/dist/lib/Monster.js'
  // import MonsterForm from 'https://unpkg.com/@hikaruna/pocket-monster/dist/lib/components/MonsterForm.js'

  const monster = new Monster({ name: "フシギダネ" });

  window.onload = () => {
    const monsterForm = document.querySelector('monster-form');
    monsterForm.monster = monster;
  }
</script>
```

### レガシーブラウザ

```html
<script src="https://unpkg.com/@hikaruna/pocket-monster/dist/pocket-monster.umd.js"></script>

<script>
  var monster = new pocketMonster.Monster({ name: "フシギダネ" });

  window.onload = function() {
    const monsterForm = document.querySelector('monster-form');
    monsterForm.monster = monster;
  }
</script>
```

### node.js(esm), webpack等

```console
$ npm i @hikaruna/pocket-monster
```

```javascript
import { Monster } from '@hikaruna/pocket-monster'
// or
// import Monster from '@hikaruna/pocket-monster/lib/Monster'

const monster = new Monster({ name: "フシギダネ" });
```

### node.js

```console
$ npm i @hikaruna/pocket-monster
```

```javascript
const { Monster, MonsterForm } = require('@hikaruna/pocket-monster');
// or
// const Monster = require('@hikaruna/pocket-monster/lib/Monster');
// const MonsterForm = require('@hikaruna/pocket-monster/lib/components/MonsterForm');


const monster = new Monster({ name: "フシギダネ" });

window.onload = () => {
  const monsterForm = document.querySelector('monster-form');
  monsterForm.monster = monster;
}
```

## Development

### edit

```src/**/*.ts```を開発します

### build

```$ npm run build```でbuildを行います。

内部で行われていることは

```
$ tsc #=> src/ -> .build/
$ rollup -c #=> .build/ -> lib/ dist/
```

### 制限

#### 直接利用する依存パッケージは、package.json記述する必要があります
依存パッケージは、package.jsonのdependency or peerDependencyに記述されている必要があります。
そうでない場合、esm/cdn形式に変換する際に、version: latestと認識されます。
cdnを利用しない形式の場合問題はありません。
