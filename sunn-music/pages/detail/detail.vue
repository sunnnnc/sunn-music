<template>
	<view class="detail">
		<view class="fixbg" :style="{backgroundImage:'url('+songDetail.al.picUrl+')'}">
		</view>
		<musichead :title="songDetail.name" :icon="true" color="white"></musichead>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<view class="detail-play" @tap="handleToPlay">
					<image :src="songDetail.al.picUrl" :class="{'detail-play-run' : isPlayRotate}"></image>
					<text class="iconfont" :class="playicon"></text>
					<view></view>
				</view>

				<view class="detail-lyric">
					<view class="detail-lyric-wrap"
						:style="{ transform : 'translateY(' +  - (lyricIndex - 1) * 82  + 'rpx)' }">
						<view class="detail-lyric-item" :class="{active: lyricIndex ===index}"
							v-for="(item,index) in songLyric" :key="index">
							{{item.lyric}}
						</view>
					</view>
				</view>

				<view class="detail-like">
					<view class="detail-like-title">
						喜欢这首歌的人也听
					</view>
					<view class="detail-like-list">
						<view class="detail-like-item" v-for="(item,index) in songSimi" :key="index"
							@tap="handleToSimi(item.id)">
							<view class="detail-like-img">
								<image :src="item.album.picUrl" mode=""></image>
							</view>
							<view class="detail-like-song">
								<view>
									{{item.name}}
								</view>
								<view>
									<image v-if="item.privilege.flag > 60 && item.privilege.flag < 70"
										src="../../static/dujia.png" mode=""></image>
									<image v-if="item.privilege.maxbr == 999000" src="../../static/sq.png" mode="">
									</image>
									</image>
									{{item.artists[0].name}} - {{item.name}}
								</view>
							</view>
							<text class="iconfont icon-bofang1"></text>
						</view>
					</view>
				</view>


				<view class="detail-comment">
					<view class="detail-comment-title">
						精彩评论
					</view>
					<view class="detail-comment-item" v-for="(item,index) in songComment" :key="index">
						<view class="detail-comment-img">
							<image :src="item.user.avatarUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-head">
								<view class="detail-comment-name">
									<view>{{ item.user.nickname }}</view>
									<view>{{item.time|formatTime}}</view>
								</view>
								<view class="detail-comment-like">
									{{ item.likedCount | formatCount }}
									<text class="iconfont icon-dianzan"></text>
								</view>
							</view>
							<view class="detail-comment-text">
								{{item.content}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>



	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {
		songDetail,
		songSimi,
		songComment,
		songLyric,
		songUrl
	} from '../../common/api.js'
	export default {
		data() {
			return {
				songDetail: {
					al: {
						picUrl: ''
					}
				},
				songSimi: [], //相似歌曲
				songComment: [], //评论
				songLyric: [], //歌词
				lyricIndex: 0, //歌词索引
				playicon: 'icon-zanting',
				isPlayRotate: true,
				isLoading: true,
			}
		},
		components: {
			musichead
		},
		onLoad(option) {
			this.getMusic(option.songId);
		},
		onUnload() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannger.destroy();
			// #endif

		},
		onHide() {
			this.cancelLyricIndex();
			// #ifdef H5
			this.bgAudioMannger.destroy();
			// #endif
		},
		methods: {
			// 初始化数据
			getMusic(songId) {
				this.$store.commit("NEXT_ID", songId);
				uni.showLoading({
					title: '加载中...'
				})
				this.isLoading = true;
				Promise.all([songDetail(songId), songSimi(songId), songComment(songId), songLyric(songId), songUrl(
					songId)]).then((res) => {
					if (res[0][1].data.code === 200) {
						this.songDetail = res[0][1].data.songs[0] || {};
					}
					if (res[1][1].data.code === 200) {
						this.songSimi = res[1][1].data.songs || [];
					}
					if (res[2][1].data.code === 200) {
						this.songComment = res[2][1].data.hotComments || [];
					}
					if (res[3][1].data.code === 200) {
						let lyric = res[3][1].data.lrc.lyric || [];
						let re = /\[([^\]]+)\]([^[]+)/g;
						var result = [];
						lyric.replace(re, ($0, $1, $2) => {
							result.push({
								"time": this.formatTimeToSec($1),
								"lyric": $2
							});
						})
						this.songLyric = result;
					}

					if (res[4][1].data.code === 200) {

						// #ifdef H5
						if (!this.bgAudioMannger) {
							this.bgAudioMannger = uni.createInnerAudioContext();
						}
						this.playicon = 'icon-24gl-playCircle';
						this.isPlayRotate = false;
						// #endif

						// #ifdef MP-WEIXIN
						// 小程序 音频
						this.bgAudioMannger = uni.getBackgroundAudioManager();
						this.bgAudioMannger.title = this.songDetail.name;
						// #endif


						this.bgAudioMannger.src = res[4][1].data.data[0].url || '';
						if (!this.bgAudioMannger.src) {
							return uni.showToast({
								title: '歌曲无版权',
							})
						}
						this.listenLyricIndex();
						this.bgAudioMannger.onPlay(() => {
							this.playicon = 'icon-zanting';
							this.isPlayRotate = true;
							this.listenLyricIndex();
						});
						this.bgAudioMannger.onPause(() => {
							this.playicon = 'icon-24gl-playCircle';
							this.isPlayRotate = false;
							this.cancelLyricIndex();
						});
						this.bgAudioMannger.onEnded(() => {
							this.getMusic(this.$store.state.nextId);
						});
					}

					this.isLoading = false;
					uni.hideLoading();
				});
			},
			playMusic(songId) {},

			formatTimeToSec(time) {
				let arr = time.split(":");
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
			},
			// 监听播放暂停
			handleToPlay() {
				if (this.bgAudioMannager.paused) {
					this.bgAudioMannager.play();
				} else {
					this.bgAudioMannager.pause();
				}
			},

			// 监听歌词
			listenLyricIndex() {
				clearInterval(this.timer);
				this.timer = setInterval(() => {
					for (let i = 0; i < this.songLyric.length; i++) {
						if (this.bgAudioMannger.currentTime > this.songLyric[this.songLyric.length - 1].time) {
							this.lyricIndex = this.songLyric.length - 1;
							break;
						}
						if (this.bgAudioMannger.currentTime > this.songLyric[i].time &&
							this.bgAudioMannger.currentTime < this.songLyric[i + 1].time) {
							this.lyricIndex = i;
						}
					}
				}, 500)
			},
			// 清除歌词计时器
			cancelLyricIndex() {
				clearInterval(this.timer);
			},
			// 相似歌曲
			handleToSimi(songId) {
				this.getMusic(songId);
			},
		}
	}
</script>

<style>
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(~@/static/disc.png);
		background-size: cover;
		margin: 210rpx auto 44rpx auto;
		position: relative;
	}

	.detail-play image {
		width: 380rpx;
		height: 380rpx;
		border-radius: 50%;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		animation: 10s linear infinite move;
		animation-play-state: paused;
	}

	@keyframes move {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.detail-play .detail-play-run {
		animation-play-state: running;
	}

	.detail-play text {
		width: 100rpx;
		height: 100rpx;
		font-size: 100rpx;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		color: white;
	}

	.detail-play view {
		position: absolute;
		width: 170rpx;
		height: 266rpx;
		position: absolute;
		left: 60rpx;
		right: 0;
		margin: auto;
		top: -170rpx;
		background: url(~@/static/needle.png);
		background-size: cover;
	}

	.detail-lyric {
		height: 246rpx;
		line-height: 82rpx;
		font-size: 32rpx;
		text-align: center;
		color: #949495;
		overflow: hidden;
	}

	.active {
		color: white;
	}

	.detail-lyric-wrap {
		transition: .5s;
	}

	.detail-lyric-item {
		height: 82rpx;
	}

	.detail-like {
		margin: 0 32rpx;
	}

	.detail-like-title {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-like-list {}

	.detail-like-item {
		display: flex;
		margin-bottom: 38rpx;
		align-items: center;
	}

	.detail-like-img {
		width: 82rpx;
		height: 82rpx;
		border-radius: 15rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.detail-like-img image {
		width: 100%;
		height: 100%;
	}

	.detail-like-song {
		flex: 1;
	}

	.detail-like-song view:nth-child(1) {
		color: white;
		font-size: 30rpx;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 10rpx;
	}

	.detail-like-song view:nth-child(2) {
		font-size: 22rpx;
		color: #a2a2a2;
		width: 70vw;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.detail-like-song image {
		width: 34rpx;
		height: 22rpx;
		margin-right: 10rpx;
	}

	.detail-like-item text {
		font-size: 50rpx;
		color: #877764;
	}

	.detail-comment {
		margin: 0 32rpx;
	}

	.detail-comment-title {
		font-size: 36rpx;
		color: white;
		margin: 50rpx 0;
	}

	.detail-comment-item {
		display: flex;
		margin-bottom: 28rpx;
	}

	.detail-comment-img {
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.detail-comment-img image {
		width: 100%;
		height: 100%
	}

	.detail-comment-content {
		flex: 1;
		color: #cac9cd;
	}

	.detail-comment-head {
		display: flex;
		justify-content: space-between;
	}

	.detail-comment-name view:nth-child(1) {
		font-size: 24rpx;
	}

	.detail-comment-name view:nth-child(2) {
		font-size: 20rpx;
	}

	.detail-comment-like {
		font-size: 30rpx;
	}

	.detail-comment-text {
		line-height: 40rpx;
		color: white;
		font-size: 28rpx;
		margin-top: 16rpx;
		border-bottom: 1px #595860 solid;
		padding-bottom: 40rpx;
	}
</style>
