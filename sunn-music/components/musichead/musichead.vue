<template>
	<view class="music-head" :style="{color:color}">
		<view class="music-head-icon" v-if="icon" :class="{'music-head-iconblack':iconblack}">
			<text class="iconfont icon-zuojiantou" @tap="handleToBack"></text> |
			<text class="iconfont icon-zhuye" @tap="handleToHome"></text>
		</view>
		{{title}}
	</view>
</template>

<script>
	export default {
		props: {
			title: {
				default: '苏恩音乐',
				type: String
			},
			icon: {
				default: true,
				type: Boolean,
			},
			color: {
				default: 'black',
				type: String
			},
			iconblack: {
				default: false,
				type: Boolean
			},
		},
		name: "musichead",
		data() {
			return {

			};
		},
		methods: {
			handleToBack() {
				uni.navigateBack();
			},
			handleToHome() {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			},
		}
	}
</script>

<style scope>
	.music-head {
		position: relative;
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		text-align: center;
		color: #000;
	}

	.music-head-icon {
		display: flex;
		justify-content: space-evenly;
		position: absolute;
		left: 8px;
		top: 26px;
		width: 90px;
		height: 31px;
		line-height: 31px;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		border-radius: 15px;
	}

	.music-head-iconblack {
		color: #000;
		border: 1px solid #eaeaea;
		background: #fff;
	}
</style>
