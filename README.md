# dev_threejs-gallery

Three.js と GLSLのお勉強ディレクトリ

## Get started

```bash
$ git clone git@github.com:baco-16g/dev_threejs-gallery.git

$ cd dev_threejs-gallery
$ npm install
```

```bash
# run
$ npm run start # to develop
# Server running at: http://localhost:3000

```

jsonでコンテンツを管理したい場合は...

```json
// json/data.json

{
  "title": "ここにタイトル"
}
```
```html
// .pug

- var title = data.data.title;
h1 #{title}
```
