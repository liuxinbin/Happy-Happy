var game={
	state:1,//保存游戏状态
	RUNNING:1,//运行中
	GAMEOVER:0,//结束
	boxNumber:0,//当前激活的格子数量（0或1）
	boxColor:null,//若有激活的格子，则保存当前激活格子的颜色字符串信息"rgb(a,b,c)"
	level:0,//保存游戏进行到第几关
	maxLevel:0,
	coupleNumber:0,//页面中成对数量（0~8）
	baseColor:null,//每局最终趋向的颜色（每局随机）（String）
	baseColorArray:[],//最终趋向的颜色数组 （Array）
	range:255/5,//范围，用来控制颜色的取值范围
	star:function(){//游戏启动函数
		this.state=this.RUNNING;
		this.boxNumber=0;
		this.boxColor=null;
		this.level=0;
		document.querySelector("#level").innerHTML=0;
		this.coupleNumber=0;
		this.baseColor=null;
		this.baseColorArray=[];
		this.range=255/5;
		this.randomColor();//初始化最终趋向的颜色(数组)
		this.baseColor=this.stringRandomColor(this.baseColorArray);//初始化最终趋向的颜色(字符串)
		this.showColor();//在页面中生成8对格子
		this.addEvent();//给16个小块注册点击事件
	},
	randomColor:function(){//从八个预选的值中选出一个最终的颜色，
							//并返回一个包含颜色信息的一维数组,
							//即为本局最终的颜色
		var r=(Math.floor(Math.random()*2)+1)/3*255;
		var g=(Math.floor(Math.random()*2)+1)/3*255;
		var b=(Math.floor(Math.random()*2)+1)/3*255;
		this.baseColorArray=[r,g,b];
	},
	stringRandomColor:function(arr){//把包含颜色信息的数组转换为字符串形式
									//[a,b,c]--->"rgb(a,b,c)"
		return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
	},
	starColor:function(){//生成8对颜色的取值，并返回一个包含颜色信息的二维数组
		var arr=[[],[],[],[],[],[],[],[]];
		var i=0;
		this.range=parseInt(this.range);
		//console.log(this.range);
		for (var r = -1; r < 3; r+=2) {
			for (var g = -1; g < 3; g+=2){
				for (var b = -1; b < 3; b+=2){
					arr[i][0]=r*this.range+this.baseColorArray[0];
					arr[i][1]=g*this.range+this.baseColorArray[1];
					arr[i][2]=b*this.range+this.baseColorArray[2];
					i++;
				}
			}
		};
		//console.log(arr.join("\n"));
		for(var i = 0; i < 8; i++){
				arr[i]=this.stringRandomColor(arr[i]);
			}
		return arr;
	},
	showColor:function(){//在页面随机生成8对不同颜色的格子
		var arr=this.finalColorArr();
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				document.querySelector(`[id=c${r}${c}]`).style.background=arr[r][c];
			};
		};
	},
	finalColorArr:function(){//生成一个包含颜色字符串信息的二维数组
		var arr=this.randomArr();//随机生成一个内容为（0~7）*2的二维数组
		var colorArr=this.starColor();//随机生成八种颜色的二维数组
		var newColorArr=[[],[],[],[]];
		for (var r = 0; r < 4 ; r++) {
			for (var c = 0; c < 4; c++) {
				switch(arr[r][c]){
					case 0:
						newColorArr[r][c]=colorArr[0];
						break;
					case 1:
						newColorArr[r][c]=colorArr[1];
						break;
					case 2:
						newColorArr[r][c]=colorArr[2];
						break;
					case 3:
						newColorArr[r][c]=colorArr[3];
						break;
					case 4:
						newColorArr[r][c]=colorArr[4];
						break;
					case 5:
						newColorArr[r][c]=colorArr[5];
						break;
					case 6:
						newColorArr[r][c]=colorArr[6];
						break;
					case 7:
						newColorArr[r][c]=colorArr[7];
						break;
				}
			};
		};
		return newColorArr;
	},
	randomArr:function(){//返回一个随机的内容为（0~7）*2的二维数组
						 //每个数字对应一种颜色
		var arr=[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
		var arrRandom=[[],[],[],[]];
		for (var r = 0; r < 4; r++) {
			for (var c = 0; c < 4; c++) {
				var a=Math.random();/*
				console.log(a);
				console.log((a*arr.length));
				console.log(Math.floor(a*arr.length));*/
				var i=Math.floor((Math.random()*arr.length));
				arrRandom[r][c]=Number(arr.splice(i,1));
			};
		};
		//console.log(arrRandom.join('\n'));
		return arrRandom;
	},
	addEvent:function(){//对每个格子注册点击事件
		//console.log(document.querySelector("#box"));
		document.querySelector("#box").onclick=function(e){
			var target=e.target||e.srcElement;//点击的目标
			//console.log(target);
			//console.log(target.getAttribute("id"));
			if(target.getAttribute("id")=="box"){//若选中父元素则把target定义为undefined
				target=undefined;
			}
			if(target!==undefined){//选中的是格子不是格子之外空白的区域
				//若点击的不是自己(通过是否拥有属性choosed=1来判断)则执行以下操作，
				//若点击的是自己则取消阴影，并重置this.boxNumber=0,this.boxColor=null
				//console.log(target.getAttribute("choosed"));
				if(target.getAttribute("choosed")==null){//若点击的不是自己
					target.style.boxShadow="2px 2px 20px #000";
					target.setAttribute("choosed",1);//设置已选中的格子的自定义属性为choose:1;
					//console.log(this.boxNumber);
					if(this.boxNumber==0){//若还没有激活的格子
						this.boxNumber=1;
						this.boxColor=target.style.background;
					}else if(this.boxNumber==1){//若已有激活的格子
						if(this.boxColor==target.style.background){//选中了一对正确的颜色组合
							this.removeSameBox();//移除相同颜色的格子
							this.boxNumber=0;//重置激活的格子数量
							this.boxColor=null;//重置前激活格子的颜色字符串信息
							this.coupleNumber++;
							//console.log(this.coupleNumber);
							if(this.coupleNumber==8){
								this.nextLevel();//进行下一个等级
							}
						}else{//两个格子配对失败
							this.boxNumber=0;
							this.boxColor=null;
							//alert("game over!");//到时候自定义游戏结束函数
							this.removeClass();
							this.gameOver();
						}
					}
				}else{//若点击的是自己
					target.style.boxShadow="";
					this.boxNumber=0;
					this.boxColor=null;
					target.removeAttribute("choosed")//删除choosed=1的自定义属性
				}
			}
		}.bind(this);
	},
	gameOver:function(){//游戏结束
		//alert("game over!");
		document.querySelector("#shadowGameover").style.display="block";
		document.querySelector("#overLevel").innerHTML=this.level;
		document.querySelector("#tryAgain").onclick=function(){
			document.querySelector("#shadowGameover").style.display="none";
			this.star();
		}.bind(this);
	},
	removeClass:function(){//清除格子的样式和自定义属性（重构）
		for(var i=0,tra=document.querySelectorAll(".bounceOut");i<tra.length;i++){
			tra[i].style.boxShadow="";
			tra[i].className="cell bounceIn";
		}
		for(var i=0,tra=document.querySelectorAll("[choosed='1']");i<tra.length;i++){
			tra[i].style.boxShadow="";
			tra[i].removeAttribute("choosed");
		}
	},
	nextLevel:function(){
		//console.log("nextLevel");
		this.boxNumber=0;
		this.boxColor=null;
		this.coupleNumber=0;
		this.level++;//修改分数
		document.querySelector("#level").innerHTML=this.level;
		if(this.level>this.maxLevel){
			this.maxLevel=this.level;
			document.querySelector("#maxLevel").innerHTML=this.maxLevel;
		}
		//使颜色更相似
		this.range*=(2/3);
		//重新开始游戏
		this.removeClass();
		this.showColor();//在页面中生成8对格子
	},
	removeSameBox:function(){//删除配对成功的格子（有自定义属性choosed='1'的格子）
		for(var i=0,tra=document.querySelectorAll("[choosed='1']");i<tra.length;i++){
			tra[i].className += ' bounceOut';
			tra[i].removeAttribute("choosed");
		}
	}
}

game.star();



