(function(){
    //获取元素与定义重要变量
    let oWrap = document.getElementById("wrap"),
        oMenu = document.getElementById("menu"),
        oGame = document.getElementById("game"),
        oOver = document.getElementById("over"),
        oScore = document.getElementById("score"),
        oLi = [...document.getElementsByTagName("li")],
        aBullet = document.getElementsByClassName("bullet"),
        ourPlane = document.getElementsByClassName("plane"),
        oBlood = document.querySelector("#blood"),
        oRestBlood = document.querySelector("#blood .restBlood"),
        oCount = document.querySelector(".count"),
        oReStart = document.querySelector("#over .restart"),
        move = null,//事件函数
        bulletTimer,//子弹定时器
        enemyTimer,//敌军定时器
        blingTimer,//闪烁定时器
        noBlingTimer,//闪烁消除定时器
        score = 0,//计分器
        blood = 100;//血量
    //添加menu选择难度事件
    oLi.forEach((ele,index)=>{
        //不同的难度不同的背景
        let bgSrc = [
            "./img/bg_1.jpg",
            "./img/bg_2.jpg",
            "./img/bg_3.jpg",
            "./img/bg_4.jpg",
            "./img/bg_4.jpg"
        ]
        ele.addEventListener("click",function(event){
            starGame(event,index);
            oGame.style.background = `url(${bgSrc[index]}) no-repeat center/cover`;
        })
    })
    //游戏开始
    function starGame(evnt,index){
        toggleShow();
        initial();
        createPlane(event,index)
    }
    //初始化
    function initial(){
        score = 0;
        blood = 100;
        oScore.innerHTML = 0;
        oRestBlood.style.height = blood + "px";
    }
    //切换页面显示
    function toggleShow(){
        oMenu.style.display = "none";
        oGame.style.display = "block";
        oOver.style.display = "none";
        oScore.style.display = "block";
        oBlood.style.display = "block";
    }
    //创建我军飞机
    function createPlane(event,index){
        //定义一些重要的变量
        let oPlane,sTop,sLeft;
        //创建飞机
        oPlane = new Image();
        oPlane.src = "./img/plane_1.png";
        oPlane.width = 50;
        oPlane.height = 40;
        oPlane.className = "plane";
        sLeft = event.pageX - oWrap.offsetLeft - oPlane.width/2,
        sTop = event.pageY - oWrap.offsetTop - oPlane.height/2;
        //赋初始位置
        oPlane.style.top = sTop + "px";
        oPlane.style.left = sLeft + "px";
        oGame.appendChild(oPlane);
        //飞机运动
        move = movePlane(oPlane,event.pageX,event.pageY,sLeft,sTop);
        //子弹
        planeBullet(oPlane,index);
        //敌军
        enemy(index);
    }
    //操控飞机
    function movePlane(oPlane,sX,sY,sLeft,sTop){
        document.addEventListener("mousemove",move,false);
        function move(event){
            let x_ = event.pageX - sX,//横轴移动值
                y_ = event.pageY - sY,//竖轴移动值
                newLeft = sLeft + x_,//新的left值
                newTop = sTop + y_,//新的top值
                maxLeft = oWrap.offsetWidth - oPlane.width,//左右的极限值
                minLeft = 0,
                maxTop = oWrap.offsetHeight - oPlane.height,//上下的极限值
                minTop = 0;
            //飞机移动的范围
            newTop = Math.max(newTop,minTop);
            newTop = Math.min(newTop,maxTop);
            newLeft = Math.max(newLeft,minLeft);
            newLeft = Math.min(newLeft,maxLeft);
            oPlane.style.top = newTop + "px";
            oPlane.style.left = newLeft + "px";
        }
        return move;
    }
    //生成子弹
    function planeBullet(oPlane,index){
        //声明一些变量
        let interval = [100,200,250,350,50][index],//每种模式对应的时间间隔
            speed = 15;//子弹的速度
        //创建子弹元素
        let bullet = new Image();
            bullet.src = "./img/fire.png";
            bullet.width = 12;
            bullet.height = 20;
            bullet.className = "bullet";
        (function creBullet(){
            let oBullet = bullet.cloneNode();
            //计算子弹的位置
            let biuTop = oPlane.offsetTop - oBullet.height,
                biuLeft = oPlane.offsetLeft + oPlane.width/2 -oBullet.width/2;
            //赋值子弹的位置
            oBullet.style.top = biuTop + "px";
            oBullet.style.left = biuLeft + "px";
            oGame.appendChild(oBullet);
            //子弹的运动
            function moveBullet(){
                if(!oBullet.parentNode)return;
                biuTop -= speed;
                oBullet.style.top = biuTop + "px";
                //超出屏幕就移除掉
                if(biuTop <= -oBullet.height){
                    oGame.removeChild(oBullet);
                }else{
                    requestAnimationFrame(moveBullet);
                }
            }
            requestAnimationFrame(moveBullet);
            bulletTimer = setTimeout(creBullet,interval);
        })()
    }
    //生成敌军 
    function enemy(index){
        //定义变量
        let interval = [500,300,200,100,200][index];//生成敌军时间间隔
        let space = [10,8,5,2,5][index];//生成大敌军的间隔
        let num = 0; //生成敌军计数
        //生成敌军副本
        //小敌军
        let smallEnemy = new Image();
        smallEnemy.src = "./img/enemy_small.png";
        smallEnemy.width = 50;
        smallEnemy.height = 40;
        smallEnemy.className = "enemy small";
        //大敌军
        let bigEnemy = new Image();
        bigEnemy.src = "./img/enemy_big.png";
        bigEnemy.width = 120;
        bigEnemy.height = 80;
        bigEnemy.className = "enemy big";
        //克隆创建敌军
        !function creEnemy(){
            let enemy = ((++num)%space == 0?bigEnemy:smallEnemy).cloneNode();
            //敌军的血量
            enemy.Hp = enemy.classList.contains("small")?
                                                        Math.floor(Math.random()*2+1)
                                                        :Math.floor(Math.random()*3+4);
            //随机生成敌军的初始位置
            let emyLeft = Math.floor(Math.random()*(oGame.offsetWidth-enemy.width)),
                emyTop = -enemy.height;
            //添加敌军的位置
            enemy.style.top = emyTop + "px";
            enemy.style.left = emyLeft + "px";
            oGame.appendChild(enemy);
            //随机生成敌军下落的速度，范围为3到7
            let speed = Math.floor(Math.random()*5+3);
            //敌军运动
            function moveEnemy(){
                if(!enemy.parentNode)return;
                //打飞机
                cashEnemy(enemy,aBullet);
                if(ourPlane[0]){
                    //自己开飞机去撞
                    planeCash(enemy);
                }
                emyTop += speed;
                enemy.style.top = emyTop + "px";
                //超出屏幕就移除掉
                if(emyTop >= oGame.offsetHeight){
                    oGame.removeChild(enemy);
                }else{
                    requestAnimationFrame(moveEnemy);
                }
            }
            requestAnimationFrame(moveEnemy);
            //设定定时器来生成敌军
            enemyTimer = setTimeout(creEnemy,interval);
        }();
    }
    //碰撞检测
    function isCash(obj1,obj2){
        let L1 = obj1.offsetLeft,//obj1左边到父盒子左边的距离
            R1 = L1 + obj1.offsetWidth,//obj1右边到父盒子左边的距离
            T1 = obj1.offsetTop,//obj1顶部到父盒子顶部的距离
            B1 = T1 + obj1.offsetHeight,//obj1顶部到父盒子顶部的距离
            L2 = obj2.offsetLeft,
            R2 = L2 + obj2.offsetWidth,
            T2 = obj2.offsetTop,
            B2 = T2 + obj2.offsetHeight;
        return !(L1>R2 || R1<L2 || T1>B2 || T2>B1);//碰撞了返回真
    }
    //子弹打敌机处理
    function cashEnemy(enemy,aBullet){
        if(!enemy.parentNode)return;
        let aBiu = [...aBullet];
        for(let i = 0,len = aBiu.length;i < len;i++){
            let b = aBiu[i],
                e = enemy;
            if(isCash(e,b)){
                oGame.removeChild(b);
                getScore();
                e.Hp --;
                if(!e.Hp){
                    boomEnemy(e);
                    getScore(e);
                    oGame.removeChild(e);
                    break;
                }
                    
            }
        }
    }
    //敌军爆炸
    function boomEnemy(enemy){
        let boomFloar = new Image();
            boomFloar.width = enemy.offsetWidth;
            boomFloar.height = enemy.offsetHeight;
            boomFloar.src = enemy.classList.contains("small")?"./img/boom_small.png":"./img/boom_big.png";
            boomFloar.className = "boomFloar";
        //设置爆炸特效的位置
        boomFloar.style.top = enemy.offsetTop + "px";
        boomFloar.style.left = enemy.offsetLeft + "px";
        //添加到页面中去
        oGame.appendChild(boomFloar);
        setTimeout(()=>{
            boomFloar.style.opacity = 0;
        })
        setTimeout(()=>{
            oGame.removeChild(boomFloar);
        },600)
    }
    //我军凉凉处理
    function planeCash(enemy){
        if(!enemy.parentNode)return;
        if(isCash(enemy,ourPlane[0])){
            //敌机爆炸
            boomEnemy(enemy);
            oGame.removeChild(enemy);
            //我军闪烁扣血
            ourPlane[0].classList.add("bling");
            //消掉闪烁
            noBlingTimer = setTimeout(()=>{
                if(ourPlane[0]){
                    ourPlane[0].classList.remove("bling");
                }
            },900);
            //我军的血量
            blood -= 20;
            if(blood <= 0){
                blood = 0;
                document.removeEventListener("mousemove",move,false);
                clearTimeout(bulletTimer);
                clearTimeout(enemyTimer);
                clearTimeout(blingTimer);
                oGame.removeChild(ourPlane[0]);
                setTimeout(() => {
                    gameOver();
                }, 3000);
            }
            oRestBlood.style.height = blood + "px";
        }
    }
    //得分
    function getScore(){
        //作一下死
        score += arguments.length == 0?10:arguments[0].classList.contains('small')?50:200;
        oScore.innerHTML = score;
    }
    //游戏结束
    function gameOver(){
        oMenu.style.display = "none";
        oOver.style.display = "block";
        oScore.style.display = "none";
        oBlood.style.display = "none";
        oCount.innerHTML = `你的得分为:${score}`;
        
        oReStart.onclick = function(){
            oMenu.style.display = "block";
            oOver.style.display = "none";
            oGame.style.display = "none";
            //将数据初始化
            initial();
        }
    }
})();