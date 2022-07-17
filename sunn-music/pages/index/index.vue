<template>
	<view class="index">
		<musichead title="苏恩音乐" :icon="false"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<!-- 搜索 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont icon-sousuo"></text>
					<input type="text" placeholder="搜索歌曲">
				</view>
				<view v-if="isLoading">
					<m-for-skeleton :avatarSize="200" :row="3" :loading="isLoading" isarc='square' :titleStyle="{}"
						:title="false" v-for="(item,key) in 4" :key="key">
					</m-for-skeleton>
				</view>

				<!-- 歌单 -->
				<view class="index-list" v-else>
					<view class="index-list-item" v-for="(item,index) in topList" :key="index"
						@tap="handleToList(item.listId)">
						<view class="index-list-img">
							<image :src="item.coverImgUrl"></image>
							<text>{{ item.updateFrequency }}</text>
						</view>

						<view class="index-list-text">
							<view v-for="(i,index) in item.tracks" :key="index">{{ index+1 }}.{{ i.first }} -
								{{ i.second }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue';
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	import {
		topList
	} from '../../common/api.js'
	export default {
		data() {
			return {
				topList: [],
				isLoading: true,
			}
		},
		components: {
			musichead,
			mForSkeleton
		},
		onLoad() {
			topList().then(res => {
				if (res.length) {
					setTimeout(() => {
						this.topList = res;
						this.isLoading = false;
					}, 1000);

				}
			});
		},
		methods: {
			handleToList(listId) {
				uni.navigateTo({
					url: '/pages/list/list?listId=' + listId
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
		}
	}
</script>

<style>
	.index {}

	.index-search {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 70rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius: 35rpx;
	}

	.index-search text {
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}

	.index-search input {
		flex: 1;
		font-size: 28rpx;
	}

	.index-list {
		margin: 0 30rpx;
	}

	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
	}

	.index-list-img {
		position: relative;
		margin-right: 22rpx;
		min-height: 212rpx;
		max-height: 212rpx;
		min-width: 212rpx;
		max-width: 212rpx;
		width: 212rpx;
		height: 212rpx;
		border-radius: 30rpx;
		overflow: hidden;
	}

	.index-list-img image {
		width: 100%;
		height: 100%;
	}

	.index-list-img text {
		position: absolute;
		left: 12rpx;
		bottom: 16rpx;
		color: #fff;
		font-size: 20rpx;
	}

	.index-list-text {
		flex: 1;
		font-size: 24rpx;
		line-height: 66rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.index-list-text view {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
