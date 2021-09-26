# Glitch lyrics writer
![60455ad029650e538d9edc53f1f6a285](https://user-images.githubusercontent.com/57606507/134773822-49fe9734-f598-46de-9c1b-76e186020e4b.gif)

楽曲の歌詞をグリッチアニメーションで表示するWebアプリケーション  
またランダムに動く光の粒子をマウスホバーすると、粒子同士を繋げるアニメーションを表示する

**Demo:** https://suganuma3510.github.io/textalive-app-demo/

## 使用楽曲
**First Note**  
blues さん

楽曲：https://piapro.jp/t/FDb1  
歌詞：https://piapro.jp/t/kiuG

## 構築方法

**Dockerを使った方法**  
1. `docker compose build`
2. `docker compose run --rm app yarn install`
3. `docker compose up`
4. http://localhost:3000/ にアクセス

**Dockerを使わない方法**  
1. Node.js をインストールしている環境で以下のコマンドを`app`ディレクトリ配下で実行する
```
yarn install
yarn start
```

## 使用技術
- React.js
- TypeScript
- Docker

## 使用した主なライブラリ
- TextAlive App API  
  https://developer.textalive.jp/
- Glitched Writer  
  https://github.com/thetarnav/glitched-writer
- tsParticles - TypeScript Particles  
  https://github.com/matteobruni/tsparticles
- Semantic UI React  
  https://github.com/Semantic-Org/Semantic-UI-React

## ライセンス：MIT