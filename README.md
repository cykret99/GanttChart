# GanttChart

![画面イメージ](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/headerImage.jpg)

## 概要

本システムはWebブラウザで操作するWebアプリケーションです。スケジュールや作業進捗の管理を視覚的に表現することができます。本システムには下記のような特徴があります。  
***  

- Webアプリケーションのため複数メンバで情報の共有がリアルタイムで可能  
- スワイプにより画面を直感的に操作可能  
- Webサーバー、データベースインストール不要で利用可能  

***  

利用言語：Java, Sql, TypeScript  
利用ミドルウエア：Spring Boot, MyBatis, Thymeleaf, Bootstrap, Vite

## 導入方法

1. 本プログラムはJavaで動作するアプリケーションとなります。  
   Java バージョン21を用意してください。動作確認をしたバージョンは下記となります  
   > openjdk version "21.0.4" 2024-07-16 LTS  
   > OpenJDK Runtime Environment Temurin-21.0.4+7 (build 21.0.4+7-LTS)  
   > OpenJDK 64-Bit Server VM Temurin-21.0.4+7 (build 21.0.4+7-LTS, mixed mode, sharing)  

   プログラムをダウンロードをすると下記のファイルがあります。  
   `実行.bat` をテキストエディタで開き、`JAVA_HOME`のパスをインストール先に変更してください。  
   ![バッチファイル設定変更](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/editBat.jpg)  

1. 実行.batを実行します。プログラムが流れ、画面が止まるまでお待ちください。
   ![バッチ実行結果画面](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/exeBat.jpg)  

1. `ログイン画面ショートカット`を実行し、Webブラウザでログイン画面を表示します。  
   下記のログインID、パスワードを入力し`ログイン`ボタンを押下することでGanttChartへログインできます  
   ![ログイン画面](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/loginView.jpg)  

   | ログインID | パスワード |  
   | --- | --- |  
   | admin | admin |

## 操作説明

GanttChartではGROUP、PROJEC、TASKの概念があります。  

- TASK　　　　 ・・・ 作業単位を表すデータ、作業内容や進捗を管理する最小単位。  
- PROJECZT　　・・・ 複数のTASKを保持するデータ単位、関連するTASKをまとめ管理する単位。  
- GROUP　　　 ・・・  複数のPROJECTを保持するデータ単位、ログインユーザーのアクセスを制限可能。  
   ![データ構造](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/dataStruct.jpg)  

### メニュー画面

ログインするとメニュー画面が表示されます。メニュー画面ではお気に入り項目、およびGROUP項目が選択できます。  
マウスカーソルを合わせると項目の色が変わります、左クリックで選択した対象画面へ遷移することができます。  
![メニュー画面](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/menuView.jpg)  

### グループ画面

グループ画面では紐づくPROJECTの進捗を表示できます。カレンダ部分を左クリックし移動させることでカレンダを左右に滑らせることができます。  
カレンダ中のバーはPROJECTに紐づくTASKをまとめた進捗を表示しています。  
`お気に入りボタン`を押下することでお気に入り登録することができ、メニュー画面のお気に入りから遷移することが可能です。  
![グループ画面](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/groupView.jpg)  

### プロジェクト画面

プロジェクト画面では紐づくTASKの進捗の表示、TASKの更新ができます。  
カレンダ上のバーをクリックすることで画面下部にタスクの状態を表示し、変更をすることができます。  
TASKをクリックし、移動することで期間の変更ができます。黄色のつまみを移動するとTASKの開始、終了を変更することができます。  
![プロジェクト画面](https://raw.githubusercontent.com/cykret99/GanttChart/refs/heads/main/readme/projectView.jpg)  

