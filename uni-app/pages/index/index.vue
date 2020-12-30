<template>
	<view class="page">
		<view class="canvas">
			<!-- 云朵位移 -->
			<view class="cloud">
				<view class="fly-1"></view>
				<view class="fly-2"></view>
				<view class="fly-3"></view>
			</view>

			<!-- 树、水滴值 -->
			<view class="tree">
				<view v-for="(o, i) in rainArr" :key="i" :class="['rain rain-'+ stages]" @click="rainFun(i, o)">{{o}}<text>g</text></view>
				<image :src="'../../static/img/tree-'+ stages +'.png'" :class="['tree-'+ stages, treemove ? 'move-'+ stages : '']" hover-class="none" @click="tree"></image>
			</view>

			<!-- 水壶、浇水动画 -->
			<view class="kettle">
				<view class="kettls" @click="water" hover-class="none"></view>
				<view class="flasks" v-show="watercss" :class="{'water': watercss}"></view>
				<view class="flasms" v-show="!watercss" @click="water" hover-class="none"></view>
				<view class="waters" v-show="waterdom"></view>
			</view>

			<!-- 用户信息、水滴值 -->
			<view class="sumup">
				<view class="user">
					<view class="cover">
						<image :src="info.avatar" @click="zoom(info.avatar)" hover-class="none"></image>
					</view>
					<view class="info">
						<view class="name">
							<text class="name" v-text="info.name"></text>
							<view :class="'sex-'+ info.sex"></view>
						</view>
						<view class="drop" hover-class="none">
							<text v-text="info.votes + ' 水滴'"></text>
							<view class="icon">
								<text class="plus" :class="{'pluss': pluss}">+{{plussNum}}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 树成长进度 -->
				<view class="speed">
					<view class="progress">
						<image class="speed-1" :src="'../../static/img/speed-1'+ [1 == stages ? '-h' : ''] +'.png'"></image>
						<image class="speed-2" :src="'../../static/img/speed-2'+ [2 == stages ? '-h' : ''] +'.png'"></image>
						<image class="speed-3" :src="'../../static/img/speed-3'+ [3 == stages ? '-h' : ''] +'.png'"></image>
					</view>
				</view>
			</view>
		</view>
		
		<view class="explain">
			<view>功能概述：</view>
			<view class="text">该插件样式主要是模仿蚂蚁森林，其中的数据都是可配的（完全可以自义定 或 从后端API获取），根据不同的数据(如用户信息、水滴值等)显示对应的动效。</view>
			<view>操作说明：</view>
			<view class="text">1、用水壶每浇水1次，水滴值向上+1。</view>
			<view class="text">2、点击树上面的雨滴，水滴值 + 收取到的雨滴值。</view>
			<view>成长说明：</view>
			<view class="text">1、树的成长过程分为小树、中树、大树3个阶段。</view>
			<view class="text">2、现默认值: 小树(水滴值在100以下)， 中树(水滴值在100 到 1000)， 大树(水滴值在1000以上)。</view>
			<view class="text">3、树苗会在水滴值变化时会展示对应的动效 和 树的动效、大小等。</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: {
					name: '沐枫', 	// 用户姓名
					sex: 2, 		// 用户姓别 1男， 2女
					votes: 8, 		// 水滴值 默认为8
					avatar: '../../static/img/detail-bg.jpg' 	//用户头像
				},
				rainArr: [28, 63, 5, 902], 	// 雨滴值 点击收取

				stages: 1, 			// 成长阶段 1(小树[默认])，中2(中树) ，大3(大树)
				during: 100, 		// 阶段阈值 1、小树[100以下](during > votes ) ，2、中树[100及以上 并且小于1000](during <= votes && oldest > votes)
				oldest: 1000, 		// 阶段阈值 3、大树[1000及以上](oldest <= votes )
				plussNum: 1, 		// 加值数量（默认1）

				pluss: false, 		// 水滴值+1动画开关
				movetree: true, 	// 树动画开关
				treemove: false, 	// 树大小动画类型开关
				wateroff: true, 	// 浇水动画开关
				watercss: false, 	// 水壶动画开关
				waterdom: false 	// 水滴动画开关
			};
		},

		methods: {
			// 设置树的大小，恢复动画
			setTree(time = 4000) {
				setTimeout(() => {
					this.plussNum = 1;
					this.pluss = false;
					this.wateroff = true;
					this.watercss = false;
					this.treemove = false;
					// 小树阶段
					if (this.during > this.info.vote) {
						this.stages = 1;
					};
					// 中树阶段
					if (this.during <= this.info.votes && this.oldest > this.info.votes) {
						this.stages = 2;
					};
					// 大树阶段
					if (this.oldest <= this.info.votes) {
						this.stages = 3;
					};
				}, time);
			},

			// 点击用户头像放大
			zoom(o) {
				uni.previewImage({
					'urls': [o]
				});
			},

			// 收取雨滴的动画
			rainFun(i, o) {
				this.plussNum = o;
				this.info.votes = Number(this.info.votes) + (o - 0);
				this.pluss = true;
				this.treemove = true;
				setTimeout(() => {
					this.rainArr.splice(i, 1);
				}, 1000);
				this.setTree(2000);
			},

			// 点击树的动画
			tree() {
				if (this.movetree) {
					this.treemove = true;
					this.movetree = false;
					setTimeout(() => {
						this.movetree = true;
						this.treemove = false;
					}, 1000);
				};
			},

			// 水壶浇水动画
			water() {
				if (this.wateroff) {
					this.watercss = true;
					this.wateroff = false;

					setTimeout(() => {
						this.waterdom = true;
					}, 1500);

					setTimeout(() => {
						this.info.votes++;
						this.pluss = true;
						this.treemove = true;
						this.movetree = false;
					}, 2000);

					setTimeout(() => {
						this.waterdom = false;
						this.movetree = true;
					}, 3500);

					this.setTree();
				};
			}
		}
	};
</script>

<style>
	.canvas {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 702upx;
		background: url(../../static/img/detail-bg.jpg) no-repeat;
		background-size: cover;
		overflow: hidden;
	}

	.canvas .cloud {
		margin-top: 128upx;
	}

	.canvas .cloud view {
		margin: 40upx 0;
	}

	.canvas .cloud .fly-1 {
		width: 102upx;
		height: 68upx;
		animation: cloud-1 80s ease-in-out 0s infinite alternate;
		background: url(../../static/img/fly-1.png) no-repeat;
		background-size: contain;
	}

	.canvas .cloud .fly-2 {
		width: 72upx;
		height: 52upx;
		animation: cloud-2 60s linear 0s infinite alternate;
		background: url(../../static/img/fly-2.png) no-repeat;
		background-size: contain;
	}

	.canvas .cloud .fly-3 {
		width: 78upx;
		height: 56upx;
		animation: cloud-3 70s ease 0s infinite alternate;
		background: url(../../static/img/fly-3.png) no-repeat;
		background-size: contain;
	}

	.canvas .tree {
		position: relative;
		display: flex;
		flex-direction: row;
		height: 160upx;
		justify-content: center;
	}

	.canvas .tree .rain {
		position: relative;
		top: -100upx;
		margin: 10upx;
		width: 60upx;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
		font-size: 16upx;
		color: green;
		background: repeating-radial-gradient(#0fff00, #53c72d);
		box-shadow: 0 0 16upx 6upx #b8ffc4;
		border-radius: 50%;
		animation: rain 4s infinite;
		z-index: 1;
	}

	.canvas .tree .rain text {
		font-size: 12upx;
	}

	.canvas .tree .rain-1 {
		top: -100upx;
	}

	.canvas .tree .rain-2 {
		top: -200upx;
	}

	.canvas .tree .rain-3 {
		top: -300upx;
	}

	.canvas .tree .rain:nth-child(1) {
		animation-delay: .8s;
		margin-top: 10px;
	}

	.canvas .tree .rain:nth-child(2) {
		animation-delay: .5s;
		margin-top: -10px;
	}

	.canvas .tree .rain:nth-child(4) {
		animation-delay: .1s;
		margin-top: -5px;
	}

	.canvas .tree image {
		position: absolute;
		bottom: 0;
		width: 280upx;
		height: 380upx;
		z-index: 0;
	}

	.canvas .tree .tree-1 {
		width: 124upx;
		height: 264upx;
	}

	.canvas .tree .tree-3 {
		width: 420upx;
		height: 460upx;
	}

	.canvas .kettle {
		display: flex;
		position: relative;
		flex-direction: row;
		justify-content: flex-end;
		width: 100%;
		height: 80upx;
	}

	.canvas .kettle view {
		position: absolute;
		z-index: 2;
	}

	.canvas .kettle .kettls {
		top: -172upx;
		right: 20upx;
		width: 116upx;
		height: 112upx;
		background: url(../../static/img/kettls.png) no-repeat;
		background-size: contain;
		transition: all 2s;
	}

	.canvas .kettle .flasks {
		top: -176upx;
		right: 28upx;
		width: 113upx;
		height: 70upx;
		background: url(../../static/img/flasks.png) no-repeat;
		background-size: contain;
		transition: all 2s;
	}

	.canvas .kettle .flasms {
		top: -176upx;
		right: 26upx;
		width: 117upx;
		height: 75upx;
		background: url(../../static/img/flasms.png) no-repeat;
		background-size: contain;
		transition: all 2s;
	}

	.canvas .kettle .waters {
		top: -240upx;
		right: 316upx;
		width: 85upx;
		height: 150upx;
		background: url(../../static/img/waters.gif) no-repeat;
		background-size: contain;
		transition: all 2s;
	}

	.canvas .sumup {
		position: absolute;
		bottom: 26upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		width: 100%;
	}

	.canvas .sumup .user {
		display: flex;
		flex-direction: row;
	}

	.canvas .sumup .user .cover {
		padding: 0 20upx;
	}

	.canvas .sumup .user .cover image {
		width: 110upx;
		height: 110upx;
		border-radius: 50%;
		border: 1upx solid white;
	}

	.canvas .sumup .user .info {
		display: flex;
		flex-direction: column;
		color: white;
		justify-content: flex-start;
		padding-top: 16upx;
		font-weight: bold;
		text-shadow: 4upx 4upx 2upx #085828;
	}

	.canvas .sumup .user .info .name {
		font-size: 30upx;
		color: white;
	}

	.canvas .sumup .user .info .name .sex-1 {
		width: 25upx;
		height: 31upx;
		background: url(../../static/img/male.png) no-repeat;
		background-size: contain;
	}

	.canvas .sumup .user .info .name .sex-2 {
		width: 21upx;
		height: 34upx;
		background: url(../../static/img/women.png) no-repeat;
		background-size: contain;
	}

	.canvas .sumup .user .info .name view {
		margin-left: 12upx;
		display: inline-block;
		vertical-align: middle;
	}

	.canvas .sumup .user .info .drop {
		margin-top: 10upx;
		line-height: 32upx;
		font-size: 26upx;
	}

	.canvas .sumup .user .info .drop .icon {
		position: relative;
		display: inline-block;
		margin-left: 10upx;
		width: 20upx;
		height: 30upx;
		vertical-align: bottom;
		background: url(../../static/img/water.png) no-repeat bottom right;
		background-size: contain;
	}

	.canvas .sumup .user .info .drop .plus {
		position: absolute;
		top: 0upx;
		right: -12upx;
		font-size: 32upx;
		opacity: 0;
		color: #ffbe2d;
	}

	.canvas .sumup .speed {
		display: flex;
		flex-direction: row;
		padding: 16upx 32upx;
		height: 100upx;
		align-items: flex-end;
	}

	.canvas .sumup .speed .progress {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		width: 208upx;
		height: 30upx;
		border-radius: 14upx;
		background: linear-gradient(#9587ce, #7182d8);
	}

	.canvas .sumup .speed .speed-1 {
		width: 44upx;
		height: 50upx;
		margin-left: -8upx;
	}

	.canvas .sumup .speed .speed-2 {
		width: 44upx;
		height: 60upx;
	}

	.canvas .sumup .speed .speed-3 {
		width: 58upx;
		height: 68upx;
		margin-right: -12upx;
	}

	.explain {
		padding: 50upx 16upx;
		font-size: 28upx;
		color: #ff00a5;
		font-weight: bold;
	}

	.explain .text {
		padding: 16upx;
		line-height: 60upx;
		text-indent: 40upx;
		color: #09b900;
		font-weight: normal;
	}

	@keyframes rain {
		0% {
			transform: translateY(-6px);
		}

		50% {
			transform: translateY(6px);
		}

		100% {
			transform: translateY(-6px);
		}
	}

	@keyframes cloud-1 {
		0% {
			opacity: .8;
			transform: translate3d(200%, 0, 0);
		}

		50% {
			opacity: .6;
			transform: translate3d(800%, 0, 0) scale(1.3);
		}

		100% {
			opacity: .8;
			transform: translate3d(-120%, 0, 0);
		}
	}

	@keyframes cloud-2 {
		0% {
			opacity: .8;
			transform: translate3d(820%, 0, 0);
		}

		50% {
			opacity: .6;
			transform: translate3d(-120%, 0, 0);
		}

		100% {
			opacity: .8;
			transform: translate3d(1080%, 0, 0) scale(1.3);
		}
	}

	@keyframes cloud-3 {
		0% {
			opacity: .6;
			transform: translate3d(-120%, 0, 0) scale(1.3);
		}

		100% {
			opacity: .8;
			transform: translate3d(1000%, 0, 0);
		}
	}

	@keyframes move-1 {
		0% {
			height: 268upx;
		}

		10% {
			height: 280upx;
		}

		20% {
			height: 295upx;
		}

		40% {
			height: 275upx;
		}

		70% {
			height: 285upx;
		}

		100% {
			height: 264upx;
		}
	}

	.move-1 {
		animation: move-1 1s;
	}

	@keyframes move-2 {
		0% {
			height: 385upx;
		}

		10% {
			height: 390upx;
		}

		20% {
			height: 400upx;
		}

		40% {
			height: 380upx;
		}

		70% {
			height: 395upx;
		}

		100% {
			height: 380upx;
		}
	}

	.move-2 {
		animation: move-2 1s;
	}

	@keyframes move-3 {
		0% {
			height: 475upx;
		}

		10% {
			height: 490upx;
		}

		20% {
			height: 500upx;
		}

		40% {
			height: 470upx;
		}

		70% {
			height: 490upx;
		}

		100% {
			height: 460upx;
		}
	}

	.move-3 {
		animation: move-3 1s;
	}

	@keyframes water {
		0% {
			opacity: .5;
			transform: translate3d(0, 0, 0);
		}

		20% {
			opacity: 1;
			transform: translate3d(-150upx, -90upx, 0) scale(1.5);
		}

		30% {
			opacity: 1;
			transform: translate3d(-150upx, -90upx, 0) scale(1.5) rotate(-35deg);
		}

		80% {
			opacity: 1;
			transform: translate3d(-150upx, -90upx, 0) scale(1.5) rotate(-35deg);
		}

		100% {
			opacity: 0;
			transform: translate3d(-150upx, -90upx, 0) scale(1.5) rotate(0deg);
		}
	}

	.water {
		animation: water 4s ease-in-out forwards;
	}

	@keyframes pluss {
		0% {
			opacity: 0.8;
			top: -10upx;
		}

		80% {
			opacity: 1;
			top: -80upx;
		}

		100% {
			opacity: 0;
			top: -120upx;
		}
	}

	.pluss {
		animation: pluss 2s;
	}
</style>
