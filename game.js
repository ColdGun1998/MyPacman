var _COS = [1, 0, -1, 0];
var _SIN = [0, 1, 0, -1];

var settings = {
    'player': [55, 25, 1],
    'ghost': [[205, 175, 1],
    [175, 295, 1],
    [55, 255, 1]],
    'beans': [55, 35],
    'map': [40, 20, 30],
    'score': [40, 525],

}

const map = [
    [2, 1, 0, 1, 1, 1, 1, 0, 1, 0],
    [3, 0, 2, 0, 1, 1, 0, 0, 2, 1],
    [2, 0, 2, 2, 0, 2, 0, 2, 2, 0],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 0, 2, 2, 2, 2],
    [2, 2, 2, 2, 1, 3, 0, 2, 2, 2],
    [2, 3, 0, 1, 1, 1, 1, 0, 1, 2],
    [2, 1, 1, 0, 1, 1, 0, 1, 1, 0],
    [2, 0, 1, 0, 1, 1, 0, 1, 0, 0],
    [2, 2, 1, 1, 0, 0, 1, 1, 0, 2],
    [2, 2, 1, 1, 0, 2, 1, 1, 0, 2],
    [2, 2, 1, 1, 1, 1, 1, 1, 0, 2],
    [2, 2, 1, 0, 1, 1, 0, 1, 0, 2],
    [2, 2, 0, 1, 0, 0, 1, 0, 0, 2],
    [2, 1, 2, 2, 1, 3, 0, 2, 3, 0],
    [3, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
var beansMap = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

];
class Game {
    static WIDTH = 480;
    static HEIGHT = 600;
    static CANVASID = 'canvas';

    constructor() {
        this.canvas = document.getElementById(Game.CANVASID);   //canvas画布
        this.ctx = this.canvas.getContext('2d');                   //画布上下文环境
        this.scene = null;                                   //布景
    }
    // 添加布景
    addScene(scene) {
        this.scene = scene;
    };
    //开启动画
    animationStart() {
        var framesCounter = 0;		//帧数计算
        var fn = () => {
            framesCounter++;
            this.ctx.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
            this.scene.update(framesCounter);
            this.scene.render(this.ctx);

            requestAnimationFrame(fn);
        }
        requestAnimationFrame(fn);
    }


}

class Map {
    //地图类
    //默认参数和输入参数合并
    constructor(settings = {}) {
        Object.assign(this, {
            start_x: 40,					//地图起点坐标
            start_y: 10,
            cellSize: 30,				//地图单元的宽度
            x_length: 0,				//二维数组x轴长度
            y_length: 0,				//二维数组y轴长度
            data: [],                        //地图数据
            initFlag: false,                 //是否初始化
            imageData: [],                   //缓存数据
            wallWidth: 2,                    //墙宽
            wallColor: '#9ca5bf',            //墙颜色
            scene: null,			//与所属布景绑定
        }, settings);
        this.y_length = this.data.length;
        this.x_length = this.data[0].length;

    }


    ////把地图的静态元素绘制在canvas
    render(context) {
        context.clearRect(0, 0, Game.WIDTH, Game.HEIGHT);
        context.fillStyle = 'white';
        context.fillRect(0, 0, Game.WIDTH, Game.HEIGHT);
        context.lineWidth = this.wallWidth;
        //translate 1/2 个线宽像素，
        context.translate(this.wallWidth / 2, this.wallWidth / 2);
        for (let i = 0; i < this.y_length; i++) {  //第i行
            for (let j = 0; j < this.x_length; j++) { //第j列
                let value = this.data[i][j];
                // 画下边的墙
                if (value == 1 || value == 3) {
                    context.moveTo(this.start_x + j * this.cellSize, this.start_y + (i + 1) * this.cellSize);
                    context.lineTo(this.start_x + (j + 1) * this.cellSize, this.start_y + (i + 1) * this.cellSize);
                }
                //画左边的墙
                if (value == 2 || value == 3) {
                    context.moveTo(this.start_x + j * this.cellSize, this.start_y + i * this.cellSize);
                    context.lineTo(this.start_x + j * this.cellSize, this.start_y + (i + 1) * this.cellSize);
                }

            }
        }
        //补上边界，默认左上角和右下角为出口
        context.moveTo(this.start_x + this.cellSize, this.start_y);
        context.lineTo(this.start_x + this.cellSize * this.x_length, this.start_y);
        context.lineTo(this.start_x + this.cellSize * this.x_length, this.start_y + this.cellSize * (this.y_length - 1));
        context.strokeStyle = this.wallColor;
        context.stroke();
        this.imageData = context.getImageData(0, 0, Game.WIDTH, Game.HEIGHT);
    }

}
class Item {
    // 活动对象类
    // 默认参数和输入参数合并
    constructor(settings = {}) {
        Object.assign(this, {
            x: 40,					//位置坐标:横坐标
            y: 40,					//位置坐标:纵坐标
            scene: null,			//与所属布景绑定
            width: 20,				//宽
            height: 20,				//高
            color: '',              //颜色
            orientation: 1,			//当前定位方向,0表示右,1表示下,2表示左,3表示上
            status: 0,				//对象状态,0表示正常运动，1表示吃到大力豆
            isCollide: false,        //是否碰撞
            speed: 2,
            times: 0,				//刷新画布计数(用于循环动画状态判断)
            frames: 5,				//速度等级,内部计算器times多少帧变化一次
            control: {},            //控制缓存,到达定位点时处理
            location: [],           //地图
            timeout: 30,              //倒计时
        }, settings);
    }

    //画布坐标转地图坐标
    position2coord = function (x, y) {
        var fx = Math.abs(x - settings['beans'][0]) % 30;
        var fy = Math.abs(y - settings['beans'][1]) % 30;
        var isCenter = false;
        if (fx == 0 && fy == 0) {
            isCenter = true;
        }
        return {
            x: Math.floor((x - settings['beans'][0]) / 30),
            y: Math.floor((y - settings['beans'][1]) / 30),
            isCenter
        };
    };

    edge(cx, cy, orientation) {//判断该cell的反方向是否有墙壁
        let passflag = 1;
        //如果是从右方进入，则判断该cell左方是否有墙壁
        if (orientation == 0) {
            if (cx == 10 || this.location[cy][cx] == 2 || this.location[cy][cx] == 3) {
                passflag = 0;
            }
        }

        //如果是从下方进入，则判断该cell上方是否有墙壁
        if (orientation == 1) {
            if (this.location[cy - 1][cx] == 1 || this.location[cy - 1][cx] == 3) {
                passflag = 0;
            }
        }
        //如果是从左方进入，则判断该cell右方是否有墙壁
        if (orientation == 2) {
            if (this.location[cy][cx + 1] == 2 || this.location[cy][cx + 1] == 3) {
                passflag = 0;
            }
        }
        //如果是从上方进入，则判断该cell下方是否有墙壁
        if (orientation == 3) {
            if (cy == -1 || this.location[cy][cx] == 1 || this.location[cy][cx] == 3) {
                passflag = 0;
            }
        }

        return passflag;
    }


    //把此对象绘制在canvas
    render(context) {

    }

    //更新对象状态并调用父类的render方法
    update() {

    }

    //绑定键盘事件
    bindEvent() {

    }

}


class Beans extends Map {
    //能量豆
    //默认参数和输入参数合并
    constructor(settings = {}) {
        super(settings);
        Object.assign(this, {
            radius: 3,              //能量豆半径
            goods: {
                '2,2': 1,
                '7,13': 1,
                '2,13': 1,
                '7,2': 1,
            },               //大力豆坐标   
            frames: 8,        // 刷新画布计数(用于循环动画状态判断) 
            times: 0,        //计数器（能量豆闪烁动效）      
        }, settings)
        this.y_length = this.data.length;
        this.x_length = this.data[0].length;

    }

    update(framesCounter) {
        if (!(framesCounter % this.frames)) {
            this.times = framesCounter / this.frames;		   //计数器
        }
    }

    render(context) {
        context.fillStyle = '#9ca5bf';
        for (let i = 0; i < this.y_length; i++) {
            for (let j = 0; j < this.x_length; j++) {
                let value = this.data[i][j];
                if (value) {
                    if (this.goods[j + ',' + i]) {
                        //刷新画布计数(用于循环动画状态判断)
                        context.beginPath();
                        context.arc(this.start_x + j * this.cellSize, this.start_y + i * this.cellSize, 2 + 2 * (this.times % 2), 0, 2 * Math.PI, true);
                        context.closePath();
                        context.fill();
                    }
                    context.beginPath();
                    context.arc(this.start_x + j * this.cellSize, this.start_y + i * this.cellSize, this.radius, 0, 2 * Math.PI, true);
                    context.closePath();
                    context.fill();
                }
            }
        }
    }
}



class Player extends Item {
    //主角类
    constructor(settings = {}) {
        super(settings);
        this.life = 3;    //生命值
        this.score = 0;   //得分
        this.bindEvent();
    }

    update(framesCounter) {	// 更新对象状态，0：正常移动状态，1：吃到能量豆

        if (!(framesCounter % this.frames)) {
            this.times = framesCounter / this.frames;		   //计数器
        }

        if (!this.isCollide) {
            var coord = this.position2coord(this.x, this.y);
            if (coord.isCenter) {
                //如果走到了cell中心，得分，吃豆
                if (this.scene.beans.data[coord.y][coord.x]) {
                    this.score += 10;
                    //如果吃到的是能量豆，则额外加分，并进入大力状态
                    if (this.scene.beans.goods[coord.x + ',' + coord.y]) {
                        this.score += 90;
                        this.status = 1;
                    }
                }
                this.scene.beans.data[coord.y][coord.x] = 0;
                //1、取出把缓存区中的操作方向
                if (Object.keys(this.control).length != 0) {  //如果缓存区放入操作的方向
                    this.orientation = this.control.orientation;
                }
                this.control = {};//清空缓存区
                //2、判断前进方向是否有墙
                if (this.edge(coord.x + _COS[this.orientation], coord.y + _SIN[this.orientation], this.orientation) == 1) {
                    this.x += this.speed * _COS[this.orientation];
                    this.y += this.speed * _SIN[this.orientation];
                } else {
                }

            } else {
                //如果没有走到中心，按照前进方向前进即可
                this.x += this.speed * _COS[this.orientation];
                this.y += this.speed * _SIN[this.orientation];
            }

        } else {
            this.timeout--;
        }



    }

    render(context) {
        context.fillStyle = this.color;
        context.beginPath();

        if (!this.status && this.isCollide) {	//玩家在正常状态下，与幽灵碰撞，则被吃，开始倒计时
            context.arc(this.x, this.y, this.width / 2, (.5 * this.orientation + 1 - .02 * this.timeout) * Math.PI, (.5 * this.orientation - 1 + .02 * this.timeout) * Math.PI, false);
        } else {   //其他情况，玩家正常移动
            if (this.times % 3) {
                context.arc(this.x, this.y, this.width / 2, (.5 * this.orientation + .20) * Math.PI, (.5 * this.orientation - .20) * Math.PI, false);
            } else {
                context.arc(this.x, this.y, this.width / 2, (.5 * this.orientation + .01) * Math.PI, (.5 * this.orientation - .01) * Math.PI, false);
            }

        }
        context.lineTo(this.x, this.y);
        context.closePath();
        context.fill();
    }

    bindEvent() {
        window.addEventListener('keydown', e => {
            switch (e.keyCode) {
                case 39: //右
                    this.control = { orientation: 0 };
                    break;
                case 40: //下
                    this.control = { orientation: 1 };
                    break;
                case 37: //左
                    this.control = { orientation: 2 };
                    break;
                case 38: //上
                    this.control = { orientation: 3 };
                    break;
            }
        });

    }

}

class Ghost extends Item {
    //幽灵类
    render(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.width * .5, 0, Math.PI, true);
        switch (this.times % 2) {
            case 0:
                context.lineTo(this.x - this.width * .5, this.y + this.height * .4);
                context.quadraticCurveTo(this.x - this.width * .4, this.y + this.height * .5, this.x - this.width * .2, this.y + this.height * .3);
                context.quadraticCurveTo(this.x, this.y + this.height * .5, this.x + this.width * .2, this.y + this.height * .3);
                context.quadraticCurveTo(this.x + this.width * .4, this.y + this.height * .5, this.x + this.width * .5, this.y + this.height * .4);
                break;
            case 1:
                context.lineTo(this.x - this.width * .5, this.y + this.height * .3);
                context.quadraticCurveTo(this.x - this.width * .25, this.y + this.height * .5, this.x, this.y + this.height * .3);
                context.quadraticCurveTo(this.x + this.width * .25, this.y + this.height * .5, this.x + this.width * .5, this.y + this.height * .3);
                break;
        }
        context.fill();
        context.closePath();
    }

    //随机游走
    getRandomDirection(orientation, x, y) {
        //之前是左右向移动
        if (orientation == 0 || orientation == 2) {
            let nextOrientation = [1, 3];
            return nextOrientation[Math.floor(Math.random() * 2)];
        } else {
            let nextOrientation = [0, 2];
            return nextOrientation[Math.floor(Math.random() * 2)];
        }

    }

    update(framesCounter) {
        if (!(framesCounter % this.frames)) {
            this.times = framesCounter / this.frames;		   //计数器
        }


        if (!this.isCollide) {
            var coord = this.position2coord(this.x, this.y);
            if (coord.isCenter) {
                //如果走到了cell中心
                //判断前进方向是否有墙
                //1、取出把缓存区中的操作方向
                if (Object.keys(this.control).length != 0) {  //如果缓存区放入操作的方向
                    this.orientation = this.control.orientation;
                }
                this.control = {};//清空缓存区
                if (this.edge(coord.x + _COS[this.orientation], coord.y + _SIN[this.orientation], this.orientation) == 1) {
                    this.x += this.speed * _COS[this.orientation];
                    this.y += this.speed * _SIN[this.orientation];
                } else {
                    //如果前方是墙，则自动转向
                    this.orientation = this.getRandomDirection(this.orientation, coord.x, coord.y)
                }
            } else {
                //如果没有走到中心，按照前进方向前进即可
                this.x += this.speed * _COS[this.orientation];
                this.y += this.speed * _SIN[this.orientation];
            }

        }
    }

}

class Score extends Item {
    //得分类（包含分值和生命值）
    render(context) {
        context.font = 'bold 12px Helvetica';
        context.textAlign = 'left';
        context.textBaseline = 'bottom';
        context.fillStyle = '#9ca5bf';
        context.fillText('SCORE', this.x, this.y);
        context.font = '12px Helvetica';
        context.textAlign = 'left';
        context.textBaseline = 'bottom';
        context.fillStyle = '#9ca5bf';
        context.fillText(this.scene.player.score, this.x + 52, this.y);
        context.font = 'bold 12px Helvetica';
        context.textAlign = 'left';
        context.textBaseline = 'bottom';
        context.fillStyle = '#9ca5bf';
        context.fillText('LEVEL', this.x + 245, this.y);
        context.font = '12px Helvetica';
        context.textAlign = 'left';
        context.textBaseline = 'bottom';
        context.fillStyle = '#9ca5bf';
        context.fillText(1, this.x + 290, this.y);

        for (var i = 0; i < this.scene.player.life; i++) {
            var x = this.x + 135 + 20 * i, y = this.y - 7;
            context.fillStyle = '#9ca5bf';
            context.beginPath();
            context.arc(x, y, this.width / 2, .15 * Math.PI, -.15 * Math.PI, false);
            context.lineTo(x, y);
            context.closePath();
            context.fill();
        }
    }
}


class Scene {
    //布景类
    //默认参数和输入参数合并
    constructor(settings = {}) {
        Object.assign(this, {
            status: 0,						//布景状态,0表示开始,1表示进入游戏,2表示暂停,3表示游戏结束
            map: null,						//地图
            beans: null,                   //能量豆
            player: null,                    //玩家
            score: null,                      //得分
            ghosts: [],                      //幽灵队列
        }, settings);
        this.bindEvent();
    }


    //添加静态地图
    addMap(map) {
        //关系绑定
        map.scene = this;
        this.map = map;
    }

    //添加能量豆
    addBeans(beans) {
        beans.scene = this;
        this.beans = beans;
    }

    //添加玩家对象
    addPlayer(player) {
        player.scene = this;
        player.location = this.map.data;
        this.player = player;
    }
    //添加幽灵对象
    addGhost(ghost) {
        ghost.scene = this;
        ghost.location = this.map.data;
        this.ghosts.push(ghost);
    }

    //添加得分对象
    addScore(score) {
        score.scene = this;
        this.score = score;
    }

    //绑定事件
    bindEvent() {
        window.addEventListener('keyup', e => {
            switch (e.keyCode) {
                case 78: this.status = 1;
                    break;
            }
        })

    };


    //更新对象数据
    update(framesCounter) {

        this.beans.update(framesCounter);
        this.player.update(framesCounter);
        this.ghosts.forEach((ghost) => {
            ghost.update(framesCounter);
        })
        this.damage();
        //如果玩家生命值为0，则游戏结束
        if (this.player.life == 0) {
            this.status = 3;
        }

        //如果玩家在正常状态下被吃，且生命值不为0，且动画倒计时已经结束，则重置玩家和幽灵位置
        if (this.player.status == 0 && this.player.life != 0 && this.player.timeout == 0) {
            this.resetItem();
        }

    }

    //渲染布景内所有对象
    render(context) {
        if (this.status == 0) {
            context.font = 'bold 22px Helvetica';
            context.textAlign = 'left';
            context.textBaseline = 'bottom';
            context.fillStyle = '#9ca5bf';
            context.fillText('Press N to Start a Game', 70, 270);
        }

        if (this.status == 1) {
            //绘制地图
            if (!this.map.initFlag) {
                this.map.render(context);
                this.map.initFlag = true;                       //初始化地图，并将静态地图存入缓存imgData
            }
            context.putImageData(this.map.imageData, 0, 0);  //绘制缓存中的静态地图

            //绘制能量豆
            this.beans.render(context);

            //绘制玩家
            this.player.render(context);

            //绘制幽灵
            this.ghosts.forEach((ghost) => {
                ghost.render(context);
            })

            //绘制关卡得分
            this.score.render(context);
        }

        if (this.status == 3) {
            context.font = 'bold 22px Helvetica';
            context.textAlign = 'left';
            context.textBaseline = 'bottom';
            context.fillStyle = '#9ca5bf';
            context.fillText('Game Over', 135, 260);
            context.font = 'bold 14px Helvetica';
            context.fillText('Your Score:', 137, 290);
            context.fillText(this.player.score, 228, 290);
        }


    }

    damage() {
        this.ghosts.forEach((ghost) => {                //绘制当前布景中的玩家是否撞到幽灵
            var dx = Math.abs(ghost.x - this.player.x);
            var dy = Math.abs(ghost.y - this.player.y);
            if (dx < 20 && dy < 20) {
                this.player.isCollide = true;
                this.ghosts.forEach((ghost) => {
                    ghost.isCollide = true;
                })
            }
        });

    }

    //重置
    reset() {
        this.resetBeans();
        this.resetItem();

    };

    //重置Beans
    resetBeans() {

    }

    //重置玩家和幽灵
    resetItem() {
        this.player.x = settings['player'][0];
        this.player.y = settings['player'][1];
        this.player.orientation = settings['player'][2];
        this.player.life--;
        this.player.isCollide = false;
        this.player.status = 0;
        this.ghosts.forEach((ghost, index) => {
            ghost.isCollide = false;
            ghost.x = settings['ghost'][index][0];
            ghost.y = settings['ghost'][index][1];
            ghost.orientation = settings['ghost'][index][2];

        })
        this.player.timeout = 30;

    }
}





var game = new Game();
var s1 = new Scene();
var m1 = new Map({
    start_x: settings['map'][0],
    start_y: settings['map'][1],
    data: map
});
var b1 = new Beans({
    start_x: settings['beans'][0],
    start_y: settings['beans'][1],
    data: beansMap
})

var p1 = new Player({
    x: settings['player'][0],
    y: settings['player'][1],
    color: '#FFE600'
})

var sc1 = new Score({
    x: settings['score'][0],
    y: settings['score'][1],
    width: 12,
})

var g1 = new Ghost({
    x: 205,
    y: 175,
    speed: 2,
    color: '#f44336'
})

var g2 = new Ghost({
    x: 235,
    y: 295,
    color: '#7ac37d'
})
var g3 = new Ghost({
    x: 55,
    y: 445,
    color: '#2196f3'
})

s1.addMap(m1);
s1.addBeans(b1);
s1.addPlayer(p1);
s1.addGhost(g1);
s1.addGhost(g2);
s1.addGhost(g3);
s1.addScore(sc1);


game.addScene(s1);
game.animationStart();





