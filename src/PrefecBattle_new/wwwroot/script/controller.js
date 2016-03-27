var myApp = angular.module('myApp', ["ngResource", "ngMessages", "ui.bootstrap"]);

//JQueryとの連携用変数
var SelectedPrefec = ""; //最後にクリックされた都道府県
var HoveredPrefec = "";　//最後にマウスオーバーされた都道府県

//CanvasServiceとコントローラー連携用
var CanvasClickFlg = false;


myApp.service('CanvasService', function () {

    var stage = new createjs.Stage("main-canvas");
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', function () { stage.update(); });

    //都道府県画像格納 
    var PrefecImg;
    var BattleBackImg;
    var CanvasW = stage.canvas.clientWidth;
    var CanvasH = stage.canvas.clientHeight;

    var allowClick=false;//canvasのクリックイベント許可


    ////////////////
    //ページ表示直後
    ///////////////
    this.PageInitCanvas = function () {

        ////背景
        var initback = new createjs.Shape();
        initback.graphics.beginLinearGradientFill(["#ffffe0", "#32cd32"], [0.1, 1.0], 250, 0, 250, 500).drawRect(0, 0, CanvasW, CanvasH);
        stage.addChild(initback);

        //「初期化中」
        var shokikaMes = new createjs.Text("初期化中…", "bold 40px serif", "#000000");
        shokikaMes.textAlign = "center";
        shokikaMes.x = CanvasW / 2;
        shokikaMes.y = CanvasH / 2;
        createjs.Tween.get(shokikaMes, { loop: true }).to({ alpha: 0 }, 2000).to({ alpha: 1 }, 2000);
        stage.addChild(shokikaMes);

        stage.update();
    }

    ////////////////
    //バトル用意
    ///////////////
    this.BattleStandby = function () {
        //画像ロード
        PrefecImg = {
            "北海道": new createjs.Bitmap("../img/p1.png"), "青森県": new createjs.Bitmap("../img/p2.png"),
            "岩手県": new createjs.Bitmap("../img/p3.png"), "宮城県": new createjs.Bitmap("../img/p4.png"),
            "秋田県": new createjs.Bitmap("../img/p5.png"), "山形県": new createjs.Bitmap("../img/p6.png"),
            "福島県": new createjs.Bitmap("../img/p7.png"), "茨城県": new createjs.Bitmap("../img/p8.png"),
            "栃木県": new createjs.Bitmap("../img/p9.png"), "群馬県": new createjs.Bitmap("../img/p10.png"),
            "埼玉県": new createjs.Bitmap("../img/p11.png"), "千葉県": new createjs.Bitmap("../img/p12.png"),
            "東京都": new createjs.Bitmap("../img/p13.png"), "神奈川県": new createjs.Bitmap("../img/p14.png"),
            "新潟県": new createjs.Bitmap("../img/p15.png"), "富山県": new createjs.Bitmap("../img/p16.png"),
            "石川県": new createjs.Bitmap("../img/p17.png"), "福井県": new createjs.Bitmap("../img/p18.png"),
            "山梨県": new createjs.Bitmap("../img/p19.png"), "長野県": new createjs.Bitmap("../img/p20.png"),
            "岐阜県": new createjs.Bitmap("../img/p21.png"), "静岡県": new createjs.Bitmap("../img/p22.png"),
            "愛知県": new createjs.Bitmap("../img/p23.png"), "三重県": new createjs.Bitmap("../img/p24.png"),
            "滋賀県": new createjs.Bitmap("../img/p25.png"), "京都府": new createjs.Bitmap("../img/p26.png"),
            "大阪府": new createjs.Bitmap("../img/p27.png"), "兵庫県": new createjs.Bitmap("../img/p28.png"),
            "奈良県": new createjs.Bitmap("../img/p29.png"), "和歌山県": new createjs.Bitmap("../img/p30.png"),
            "鳥取県": new createjs.Bitmap("../img/p31.png"), "島根県": new createjs.Bitmap("../img/p32.png"),
            "岡山県": new createjs.Bitmap("../img/p33.png"), "広島県": new createjs.Bitmap("../img/p34.png"),
            "山口県": new createjs.Bitmap("../img/p35.png"), "徳島県": new createjs.Bitmap("../img/p36.png"),
            "香川県": new createjs.Bitmap("../img/p37.png"), "愛媛県": new createjs.Bitmap("../img/p38.png"),
            "高知県": new createjs.Bitmap("../img/p39.png"), "福岡県": new createjs.Bitmap("../img/p40.png"),
            "佐賀県": new createjs.Bitmap("../img/p41.png"), "長崎県": new createjs.Bitmap("../img/p42.png"),
            "熊本県": new createjs.Bitmap("../img/p43.png"), "大分県": new createjs.Bitmap("../img/p44.png"),
            "宮崎県": new createjs.Bitmap("../img/p45.png"), "鹿児島県": new createjs.Bitmap("../img/p46.png"),
            "沖縄県": new createjs.Bitmap("../img/p47.png")
        };

        //バトル背景ランダム決定
        var battleBackUrl = ["../img/backpic/b00.jpg","../img/backpic/b01.jpg", "../img/backpic/b02.jpg",
                             "../img/backpic/b03.jpg", "../img/backpic/b04.jpg", "../img/backpic/b05.jpg",
                             "../img/backpic/b06.jpg", "../img/backpic/b07.jpg", "../img/backpic/b08.jpg",
                             "../img/backpic/b09.jpg"];
        var idx = Math.floor(Math.random() * battleBackUrl.length);
        BattleBackImg = new createjs.Bitmap(battleBackUrl[idx]);

        ////背景
        var initback = new createjs.Shape();
        initback.graphics.beginFill("#000000").drawRect(0, 0, CanvasW, CanvasH);
        stage.addChild(initback);

        //「初期化中」
        var shokikaMes = new createjs.Text("Get Ready…", "bold 100px Arial", "#ffff00");
        shokikaMes.textAlign = "center";
        shokikaMes.textBaseline = "middle";
        shokikaMes.x = CanvasW / 2;
        shokikaMes.y = CanvasH / 2;
        createjs.Tween.get(shokikaMes, { loop: true }).to({ alpha: 0, scaleX:3}, 2000).to({ alpha: 1 ,scaleX:1}, 2000);
        stage.addChild(shokikaMes);

        stage.update();
    }
    

    //////////////////　　結果表示関係　　//////////////////

    var BDs;   //バトル結果格納用
    var PreMm_A;
    var PreMm_B;
    var prefecA_img;
    var prefecB_img;
    var roundIdx = 0;　//ラウンド数格納用
    var xPole_A = CanvasW * 0.2; //表示の中心
    var xPole_B = CanvasW * 0.8;
    var yPole = CanvasH * 0.5;

    //画面要素
    var roundMes;
    var tokeiTitContainer;
    var valContainer;
    var resultBack;

    ////////////////
    //バトル結果
    ///////////////
    this.BattleResult = function (battleDetails, prefecA_Nm, prefecB_Nm) {
        flgsReset();
        BDs = battleDetails;
        PreMm_A=  prefecA_Nm;
        PreMm_B=  prefecB_Nm;
        allowClick = true;       

        //ベース表示
        resultBack = new createjs.Shape();
        resultBack.graphics.beginFill("#000000").drawRect(0, 0, CanvasW, CanvasH);
        stage.addChild(resultBack);
        stage.addChild(BattleBackImg);

        //AB共通定数
        var scalePoint = 0.5;//画像縮尺率        

        //都道府県A表示 
        var prefecA = new createjs.Text(prefecA_Nm, "60px serif bold", "#FFFF00");
        prefecA.textAlign = "center";
        prefecA.textBaseline = "bottom";
        prefecA.x = xPole_A - prefecA.getMeasuredHeight() / 2;
        prefecA.y = yPole;
        stage.addChild(prefecA);

        prefecA_img = PrefecImg[prefecA_Nm];
        scalePoint = getGoodScalePoint(prefecA_img);
        prefecA_img.scaleX = scalePoint;    //縮尺率
        prefecA_img.scaleY = scalePoint;
        prefecA_img.regX = prefecA_img.image.width * 0.5;    //基準点
        prefecA_img.regY = prefecA_img.image.height * 0.5;
        prefecA_img.x = xPole_A;    //座標
        prefecA_img.y = yPole + prefecA_img.regY*scalePoint;
        stage.addChild(prefecA_img);

         //都道府県B表示        
        var prefecB = new createjs.Text(prefecB_Nm, "60px serif bold", "#FFFF00");
        prefecB.textAlign = "center";
        prefecB.textBaseline = "bottom";
        prefecB.x = xPole_B - prefecB.getMeasuredHeight() / 2;
        prefecB.y = yPole;
        stage.addChild(prefecB);

        prefecB_img = PrefecImg[prefecB_Nm];
        scalePoint = getGoodScalePoint(prefecB_img);
        prefecB_img.scaleX = scalePoint;    //縮尺率
        prefecB_img.scaleY = scalePoint;
        prefecB_img.regX = prefecB_img.image.width * 0.5;    //基準点
        prefecB_img.regY = prefecB_img.image.height * 0.5;
        prefecB_img.x = xPole_B;    //座標
        prefecB_img.y = yPole + prefecB_img.regY * scalePoint;
        stage.addChild(prefecB_img);

        this.RoundResult();
    }

    //都道府県画像のベストな縮尺率取得
    function getGoodScalePoint(prefecImg) {
        var i = 0.1;
        for (i ; prefecImg.image.height * i < CanvasH * 0.5; i += 0.1) {}
        return i - 0.1;     
    }

    ///結果表示クリックイベント
    this.RoundResult=function () {

        //canvasクリック制御
        if (!allowClick)
            return;
        allowClick = false;

        prefecA_img.alpha = 1;
        prefecB_img.alpha = 1;
        if (roundIdx < BDs.length) {
            /////////////////////
            //ターン毎アニメ
            ////////////////////
            var r = BDs[roundIdx];
            
            stage.removeChild(roundMes);
            stage.removeChild(tokeiTitContainer);
            stage.removeChild(valContainer);

            //【ラウンド名】
            roundMes = new createjs.Text("Round " + r.RoundSeq, "300px serif", "#f0f8ff");
            roundMes.textAlign = "center";
            roundMes.textBaseline = "middle";
            roundMes.x = CanvasW / 2;
            roundMes.y = CanvasH / 2;
            roundMes.alpha = 0;
            createjs.Tween.get(roundMes, { loop: false }).to({ alpha: 1 }, 2000).wait(300).to({ y: CanvasH * 0.1 ,scaleX:0.5,scaleY:0.5}, 2000).call(function () {
                tokeiTitContainer = new createjs.Container();

                //【タイトル枠】
                var tokeiTitleRect = new createjs.Shape();
                var titY = roundMes.getMeasuredHeight() * 0.5;  //タイトル枠Y座標
                tokeiTitleRect.graphics.beginFill("#000000")
                    .drawRect(0, titY, CanvasW, CanvasH * 0.2);
                tokeiTitleRect.alpha = 0.5;
                tokeiTitContainer.addChild(tokeiTitleRect);

                //【統計名】
                var tokeiNm = new createjs.Text(r.TokeiNm, "40px serif", "#ffff00");
                tokeiNm.textAlign = "center";
                tokeiNm.x = CanvasW / 2;
                tokeiNm.y = titY * 1.1;
                tokeiTitContainer.addChild(tokeiNm);

                //【統計年・単位】
                var tokeiYT = new createjs.Text('単位：' + r.Tani + '  /  ' + r.Year + '年', "40px serif", "#f0ffff");
                tokeiYT.textAlign = "right";
                tokeiYT.x = CanvasW *0.9;
                tokeiYT.y = tokeiNm.y + tokeiNm.getMeasuredHeight()*1.3;
                tokeiTitContainer.addChild(tokeiYT);

                stage.addChild(tokeiTitContainer);
                valContainer = new createjs.Container();

                //【A値】
                var valA = new createjs.Text(0, "50px serif bold", "#0000ff");
                valA.textAlign = "center";
                valA.textBaseline = "middle";
                valA.x = xPole_A;
                valA.y = yPole*1.6; //yPole + (prefecA.getMeasuredHeight()) + prefecA_img.regY; //yPole - (valA.getMeasuredHeight());
                valA.regY = valA.getMeasuredHeight();
                valContainer.addChild(valA);
                createjs.Tween.get(valA, { loop: false }).to({ text: r.Value_A }, 2000);

                //【B値】
                var valB = new createjs.Text(0, "50px serif bold", "#0000ff");
                valB.textAlign = "center";
                valB.textBaseline = "middle";
                valB.x = xPole_B;
                valB.y = yPole * 1.6; 
                valB.regY = valB.getMeasuredHeight();
                valContainer.addChild(valB);
                createjs.Tween.get(valB, { loop: false }).to({ text: r.Value_B }, 2500);
                
                
                
                if (r.Value_A != r.Value_B) {
                    var winVal = valA;
                    var loseVal = valB;
                    var winImg = prefecA_img;
                    var loseImg=prefecB_img;
                    if (r.Value_A < r.Value_B) {
                        winVal = valB;
                        loseVal = valA;
                        winImg = prefecB_img;
                        loseImg=prefecA_img;
                    }
                        
                    //勝ち負け別エフェクト
                    createjs.Tween.get(winVal, { loop: false }).wait(3000).to({ scaleX: 3, scaleY: 3, color: "#FF0000" }, 1000);
                    createjs.Tween.get(loseImg, { loop: false }).wait(3100).to({ alpha: 0 }, 1000).call(function () { allowClick = true;});
                } else {
                    //引き分けエフェクト
                     allowClick = true;
                }
                stage.addChild(valContainer);

                

               
            });
            stage.addChild(roundMes);
            stage.update();
            roundIdx++;
            
        } else {
            /////////////////////
            //エンディング描画
            /////////////////////
            var endingBack = new createjs.Shape();
            endingBack.graphics.beginRadialGradientFill(["#FFD700", "#0000FF"], [0.1, 1.0], CanvasW / 2, CanvasH / 2, 0, CanvasW / 2, CanvasH / 2, CanvasW / 2).drawRect(0, 0, CanvasW, CanvasH);
            //beginLinearGradientFill(["#b22222", "#00bfff"], [0.1, 1.0], 250, 0, 250, 500).drawRect(0, 0, CanvasW, CanvasH);
            stage.addChild(endingBack);

            //最終結果計算
            var aWin = 0;
            var bWin = 0;
            for (var i = 0; i < BDs.length; i++) {
                if (BDs[i].Value_A > BDs[i].Value_B)
                    aWin++;
                else if (BDs[i].Value_A < BDs[i].Value_B)
                    bWin++;
            }


            if(aWin != bWin){
                //決着付いた場合
                var winNm = PreMm_A;
                if(aWin < bWin)
                    winNm = PreMm_B;

                //都道府県画像
                var win_img = PrefecImg[winNm];
                var scaP = getGoodScalePoint(win_img) * 1.5;
                win_img.scaleX = scaP;    //縮尺率
                win_img.scaleY = scaP;
                win_img.regX = win_img.image.width  / 2;    //基準点
                win_img.regY = win_img.image.height / 2;
                win_img.x = CanvasW / 2;    //座標
                win_img.y = CanvasH / 2;
                win_img.alpha = 0;
                stage.addChild(win_img);
                createjs.Tween.get(win_img, { loop: false }).to({ alpha: 1 }, 2000);

                //上WINNER
                for (var i = 0; i < 10; i++) {
                    var winner = new createjs.Text("WINNER", "100px serif", "#FFFF00");
                    winner.textAlign = "right";
                    winner.x = 0;
                    winner.y = 0;
                    stage.addChild(winner);
                    createjs.Tween.get(winner, { loop: true }).wait(i*3000).to({ x: CanvasW + winner.getMeasuredWidth()  },9000);
                }
                //下WINNER
                for (var i = 0; i < 10; i++) {
                    var winner = new createjs.Text("WINNER", "100px serif", "#FFFF00");
                    winner.textAlign = "left";
                    winner.textBaseline = "bottom";
                    winner.x = CanvasW;
                    winner.y = CanvasH;
                    stage.addChild(winner);
                    createjs.Tween.get(winner, { loop: true }).wait(i * 3000).to({ x: -1 * winner.getMeasuredWidth() }, 9000);
                }

                var winPrefec = new createjs.Text(winNm, "80px san-serif", "#000000");
                winPrefec.textAlign = "center";
                winPrefec.textBaseline = "middle";
                winPrefec.x = CanvasW / 2;
                winPrefec.y = CanvasH / 2;
                winPrefec.scaleX = 0;
                stage.addChild(winPrefec);
                createjs.Tween.get(winPrefec, { loop: true }).to({ scaleX: 1 }, 1500).to({ scaleY: 0 }, 1500).to({ scaleY: 1 }, 1500).to({ scaleX: 0 }, 1500);

                stage.update();
            } else {
                //引き分け
                var draw = new createjs.Text("DRAW", "50px serif", "#000000");
                draw.textAlign = "center";
                draw.x = CanvasW / 2;
                draw.y = CanvasH / 2;
                stage.addChild(draw);

            }
            flgsReset();
            //resultBack.removeEventListener("click", RoundResult);
            return true;
        }
        
    }

    //フラグ類初期化
    function flgsReset() {
        BDs='';
        roundMes='';
        tokeiTitContainer = new createjs.Container();
        valContainer = new createjs.Container();
        roundIdx = 0;
    }

})



myApp.controller('mainCtrl', ['$scope', '$resource', '$modal', 'CanvasService', function ($scope, $resource, $modal, CanvasService) {
    $scope.isShowMap = false;
    var api = $resource('../PrefecBattle/makeBattle');

    //キャンバスクリック
    $scope.mainCanvasClick = function () {
        if (CanvasService.RoundResult()) { $scope.canOneMore = true; }
    }

    // 画面ロード時の都道府県データ取得
    $scope.initDisp = function () {
        getPrefecs();
        $scope.DispPrefecA = "";
        $scope.DispPrefecB = "";
    }

    //バトル開始ボタン押下
    $scope.battleStart = function () {
        $scope.canOneMore = false;
        $scope.isShowMap = false;
        CanvasService.BattleStandby();

        api.save($scope.BattleRequest, function (p) {
            var apiGet = $resource("../PrefecBattle/makeBattle/:btlSetCd");
            apiGet.get({btlSetCd: p.val }, function (pp) {
                $scope.BattleDispResult = pp;
                CanvasService.BattleResult(pp.BattleDetails, pp.Prefec_A_Nm, pp.Prefec_B_Nm);
                
            }, function () { alert("通信エラー：しばらくしてからもう一度アクセスしてください。"); })
        }, function () { alert("通信エラー：しばらくしてからもう一度アクセスしてください。"); });
    }

    //クリックされた都道府県反映
    $scope.prefecToModel = function () {     
        if ($scope.BattleRequest.prefecA == "" && $scope.BattleRequest.prefecB != SelectedPrefec) {
            // 都道府県Aが選択済みの場合
            $scope.BattleRequest.prefecA = SelectedPrefec;
        } else if ($scope.BattleRequest.prefecB == "" && $scope.BattleRequest.prefecA != SelectedPrefec) {
            // 都道府県Bが選択済みの場合
            $scope.BattleRequest.prefecB = SelectedPrefec;
        }       
    }

    //マウスオーバーされた都道府県反映
    $scope.prefecToTmpModel = function () {        
        if ($scope.BattleRequest.prefecA == "") {
            changeTargetPrefec(HoveredPrefec, 'A');
        } else if ($scope.BattleRequest.prefecB == "" ) {
            changeTargetPrefec(HoveredPrefec, 'B');
        }
    }

    //もう一度バトる
    $scope.OneMoreBattle = function () {
        getPrefecs();
        $scope.BattleRequest.prefecA = '';
        $scope.BattleRequest.prefecB = '';
        $scope.DispPrefecA = '';
        $scope.DispPrefecB = '';
        SelectedPrefec = "";
        HoveredPrefec = "";
        $scope.canOneMore = false;
    }

    //バトル結果ウィンドウ表示
    $scope.openBattleResultWindow = function () {

        //モーダル開く
        $modal.open({
            templateUrl: "W_Battle",
            scope: $scope
        });
    }
    //ランキングウィンドウ表示
    $scope.openRankingWindow = function () {

        //モーダル開く
        $modal.open({
            templateUrl: "W_Ranking",
            scope: $scope
        });
    }
    //ランキングウィンドウ表示
    $scope.openHelpWindow = function () {
        //モーダル開く
        $modal.open({
            templateUrl: "W_Help"
        });
    }

    //全都道府県取得
    function getPrefecs() {
        $scope.isShowMap = false; //ロード中はマップ隠す
        CanvasService.PageInitCanvas();
        $scope.allPrefecData = api.query(function (p) {
           $scope.isShowMap = true;
           
        }, function () { alert("通信エラー：しばらくしてからもう一度アクセスしてください。"); });
    }


    //都道府県表示切替
     function changeTargetPrefec (prefecCd , AorB) {
         for (var i = 0; i < $scope.allPrefecData.length; i++) {
             if ($scope.allPrefecData[i].PrefecCd == prefecCd) {
                if(AorB == 'A')
                    $scope.DispPrefecA = $scope.allPrefecData[i];
                else
                    $scope.DispPrefecB = $scope.allPrefecData[i];
                break;
            }
        }
    }
}])


myApp.run(function () {
    //画面ロード時イベント
    $(function () {
        $("#map").japanMap(
            {
                //areas: areas, //上で設定したエリアの情報
                selection: "prefecture", //選ぶことができる範囲(県→prefecture、エリア→area)
                borderLineWidth: 0.25, //線の幅
                drawsBoxLine: false, //canvasを線で囲む場合はtrue
                movesIslands: true, //南西諸島を左上に移動させるときはtrue、移動させないときはfalse
                showsAreaName: false, //エリア名を表示しない場合はfalse
                height: 700, //canvasのwidth。別途heightも指定可。
                backgroundColor: "#000000", //canvasの背景色
                font: "MS Mincho", //地図に表示する文字のフォント
                fontSize: 12, //地図に表示する文字のサイズ
                fontColor: "areaColor", //地図に表示する文字の色。"areaColor"でエリアの色に合わせる
                fontShadowColor: "black", //地図に表示する文字の影の色

                onSelect: function (data) {                    
                    SelectedPrefec = data.code;                  
                },
                onHover: function (data) { 
                    HoveredPrefec = data.code;
                },
            }
        );
    });
})
