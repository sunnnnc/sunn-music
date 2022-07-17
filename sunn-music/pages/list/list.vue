<template>
	<view class="list">
		<view class="fixbg" :style="{'background-image':'url('+playList.coverImgUrl+')'}"></view>
		<musichead title="歌单" :icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="list-head">
					<view class="list-head-img">
						<image :src="playList.coverImgUrl" mode=""></image>
						<text class="iconfont icon-caret-right">{{playList.playCount || '' |formatCount}}</text>
					</view>
					<view class="list-head-text">
						<view>
							{{playList.name}}
						</view>
						<view>
							<image :src="playList.creator.avatarUrl" mode=""></image>
							{{ playList.creator.nickname }}
						</view>
						<view>
							{{playList.description}}
						</view>
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<button class="list-share" open-type="share">
					<text class="iconfont icon-fenxiang"></text>分享给微信好友
				</button>
				<!-- #endif -->

				<view class="list-music">
					<view class="list-music-title">
						<text class="iconfont icon-bofang"></text>
						<text>播放全部</text>
						<text>(共{{playList.trackCount || 0}}首)</text>
					</view>
					<view class="list-music-item" v-for="(item,index) in playList.tracks" :key="index"
						@tap="handleToDetail(item.id)">
						<view class="list-music-top">
							{{ index + 1}}
						</view>
						<view class="list-music-song">
							<view>
								{{item.name}}
							</view>
							<view>
								<image v-if="privileges[index].flag >60 &&privileges[index].flag <70"
									src="../../static/dujia.png" mode="">
								</image>
								<image v-if="privileges[index].maxbr==999000" src="../../static/sq.png" mode=""></image>
								{{item.ar[0].name}} - {{item.name}}
							</view>
						</view>
						<text class="iconfont icon-bofang1"></text>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue';
	import {
		list
	} from '../../common/api.js'
	export default {
		data() {
			return {
				playList: {
					coverImgUrl: '',
					creator: {
						avatarUrl: ''
					}
				},
				privileges: [],
				isLoading: true,
			}
		},
		components: {
			musichead
		},
		onLoad(option) {
			uni.showLoading({
				title: '加载中...',
				icon: 'none'
			})
			list(option.listId).then((res) => {
				if (res[1].data.code == 200) {
					this.playList = res[1].data.playlist || {};
					this.privileges = res[1].data.privileges;
					this.$store.commit("INIT_TOPLISTIDS", res[1].data.playlist.trackIds);
					this.isLoading = false;
					uni.hideLoading();
				}
			});
		},
		methods: {
			handleToDetail(songId) {
				uni.navigateTo({
					url: `/pages/detail/detail?songId=${songId}`,

				})
			}
		}
	}
</script>

<style scope>
	.list-head {
		display: flex;
		margin: 30rpx;
	}

	.list-head-img {
		position: relative;
		margin-right: 42rpx;
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
	}

	.list-head-img image {
		width: 100%;
		height: 100%;
	}

	.list-head-img text {
		position: absolute;
		right: 8rpx;
		top: 8rpx;
		color: #fff;
		font-size: 26rpx;
	}

	.list-head-text {
		flex: 1;
		color: #f0f2f7;
	}

	.list-head-text view:nth-child(1) {
		color: #fff;
		font-size: 34rpx;
	}

	.list-head-text view:nth-child(2) {
		display: flex;
		align-items: center;
		margin: 20rpx 0;
		font-size: 24rpx;
	}

	.list-head-text view:nth-child(2) image {
		margin-right: 14rpx;
		width: 54rpx;
		height: 54rpx;
		border-radius: 50%;
	}

	.list-head-text view:nth-child(3) {
		line-height: 34rpx;
		font-size: 22rpx;
	}

	.list-share {
		margin: 0 auto;
		width: 330rpx;
		height: 74rpx;
		line-height: 74rpx;
		background: rgba(0, 0, 0, .4);
		border-radius: 37rpx;
		color: #fff;
		text-align: center;
		font-size: 28rpx;
	}

	.list-share text {
		margin-right: 16rpx;
	}

	.list-music {
		margin-top: 40rpx;
		background: #fff;
		border-radius: 50rpx;
		overflow: hidden;
	}

	.list-music-title {
		margin: 30rpx 0 70rpx 22rpx;
		height: 50rpx;

	}

	.list-music-title text:nth-child(1) {
		height: 50rpx;
		font-size: 50rpx;
	}

	.list-music-title text:nth-child(2) {
		margin: 0 10rpx 0 26rpx;
		font-size: 30rpx;
	}

	.list-music-title text:nth-child(3) {
		font-size: 26rpx;
		color: #b2b2b2;
	}

	.list-music-item {
		display: flex;
		align-items: center;
		margin: 0 32rpx 66rpx 46rpx;
		color: #959595;
	}

	.list-music-top {
		width: 58rpx;
		line-height: 30rpx;
		font-size: 30rpx;
	}

	.list-music-song {
		flex: 1;
	}

	.list-music-song view:nth-child(1) {
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 28rpx;
		color: #000;
	}

	.list-music-song view:nth-child(2) {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 20rpx;
	}

	.list-music-song view:nth-child(2) image {
		margin: 10rpx;
		width: 32rpx;
		height: 20rpx;
		flex-shrink: 0;
	}

	.list-music-item text {
		font-size: 50rpx;
		color: #C7C7C7;
		/* float: right; */
		/*width: 50rpx;
		height: 50rpx; */
	}
</style>
