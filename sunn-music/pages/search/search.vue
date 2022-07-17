<template>
	<view class="search">
		<musichead title="搜索" :icon="true" :iconblack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true">
				<view class="search-search">
					<text class="iconfont icon-sousuo1"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch(searchWord)"
						@input="handleToSuggest">
					<text v-show="searchType !== 1" @tap="handleToClose" class="iconfont icon-guanbi"></text>
				</view>
				<template v-if="searchType==1">
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont icon-lajixiang" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in historyList" :key="index" @tap="handleToWord(item)">{{item}}
							</view>
						</view>
					</view>
					<view class="search-hot">
						<view class="search-hot-title">
							热搜榜
						</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index"
							@tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">
								{{ index+1 }}
							</view>
							<view class="search-hot-word">
								<view>
									{{ item.searchWord }}
									<image :src="item.iconType ? item.iconUrl:''" mode="aspectFit"></image>
								</view>
								<view>
									{{ item.content }}
								</view>
							</view>
							<text class="search-hot-count">{{ item.score }}</text>
						</view>
					</view>
				</template>

				<template v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index"
							@tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
							<text class="iconfont icon-bofang1"></text>
						</view>
					</view>
				</template>

				<template v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-title">搜索"{{ this.searchWord }}"</view>
						<view class="search-suggest-item" v-for="(item,index) in suggestList" :key="index"
							@tap="handleToWord(item.keyword)">
							<text class="iconfont icon-sousuo"></text>
							{{ item.keyword }}
						</view>
						<!-- 	<view class="search-suggest-item" v-for="(item,index) in suggestList" :key="index"
							@tap="handleToWord(item.id)">
							<text class="iconfont icon-sousuo"></text>
							{{ item.name }}
						</view> -->
					</view>
				</template>

			</scroll-view>
		</view>
	</view>
</template>

<script>
	import {
		searchHot,
		searchSuggest,
		searchWord
	} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchWord: '',
				historyList: [],
				searchType: 1,
				searchList: [],
				suggestList: [],
			}
		},
		onLoad() {
			searchHot().then((res) => {
				if (res[1].data.code == 200) {
					this.searchHot = res[1].data.data;
				}
			});
			uni.getStorage({
				key: 'searchHistory',
				success: (res) => {
					this.historyList = res.data;
				}
			})
		},
		methods: {

			// 搜索
			handleToSearch(word) {
				this.historyList.unshift(word);
				// 去重
				this.historyList = [...new Set(this.historyList)];

				if (this.historyList.length > 10) {
					// this.historyList.pop();
					this.historyList = 10;
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.historyList
				});
				this.getSearchList(word);
			},
			// 清空历史记录
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: () => {
						this.historyList = [];
					}
				})

			},


			getSearchList(word) {
				searchWord(word).then((res) => {
					if (res[1].data.code === 200) {
						this.searchList = res[1].data.result.songs;
						this.searchType = 2;
					}
				});
			},
			// 关闭搜索结果
			handleToClose() {
				this.searchWord = '';
				this.searchType = 1;
			},
			// 搜索框
			handleToSuggest(ev) {
				let value = ev.detail.value;
				if (!value) {
					return this.searchType = 1;
				}
				searchSuggest(value).then((res) => {
					const data = res[1].data;
					if (data.code === 200) {
						this.suggestList = data.result.allMatch;
						console.log(this.suggestList);
						this.searchType = 3;
					}
				});
			},

			// 热搜词
			handleToWord(word) {
				this.searchWord = word;
				this.handleToSearch(word);
			},
			// 跳到详情页
			handleToDetail(songId) {
				uni.navigateTo({
					url: '/pages/detail/detail?songId=' + songId,
				})
			},
		}
	}
</script>

<style>
	.search-search {
		margin: 70rpx 30rpx 50rpx 30rpx;
		display: flex;
		align-items: center;
		height: 70rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
	}

	.search-search text {
		margin: 0 26rpx;
	}

	.search-search input {
		flex: 1;
		font-size: 26rpx;
		background: ;
	}

	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}

	.search-history-head {
		margin-bottom: 36rpx;
		display: flex;
		justify-content: space-between;
	}

	.search-history-list {
		display: flex;
		flex-wrap: wrap;
	}

	.search-history-list view {
		margin-right: 30rpx;
		padding: 16rpx 26rpx;
		border-radius: 40rpx;
		margin-bottom: 30rpx;
		background: #f7f7f7;
	}


	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;
	}

	.search-hot-title {
		margin-bottom: 35rpx;
	}

	.search-hot-item {
		margin-bottom: 58rpx;
		display: flex;
		align-items: center;
	}

	.search-hot-top {
		margin-left: 8rpx;
		width: 60rpx;
		color: #fb2222;
	}

	.search-hot-word {
		flex: 1;
	}

	.search-hot-word view:nth-child(1) {
		color: #000;
		font-size: 30rpx;
	}

	.search-hot-word view:nth-child(2) {
		color: #878787;
		font-size: 24rpx;
	}

	.search-hot-word image {
		width: 48rpx;
		height: 22rpx;
	}

	.search-hot-count {
		color: #878787;
	}

	.search-result {
		padding: 30rpx;
		border-top: 2rpx solid #e4e4e4;
	}

	.search-result-item {
		margin-bottom: 30rpx;
		padding-bottom: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #e4e4e4;
	}

	.search-result-item text {
		font-size: 50rpx;
	}

	.search-result-word {}

	.search-result-word view:nth-child(1) {
		margin-bottom: 12rpx;
		font-size: 28rpx;
		color: #235790;
	}

	.search-result-word view:nth-child(2) {
		font-size: 22rpx;
		color: #898989;
	}

	.search-suggest {
		border-top: 2rpx solid #e4e4e4;
		padding: 30rpx;
		font-size: 26rpx;
	}

	.search-suggest-title {
		margin-bottom: 74rpx;
		color: #4574a5;
	}

	.search-suggest-item {
		margin-bottom: 74rpx;
		color: #5d5d5d;
	}

	.search-suggest-item text {
		position: relative;
		top: 2rpx;
		margin-right: 28rpx;
		color: #bdbdbd;
	}
</style>
