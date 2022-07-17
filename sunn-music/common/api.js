import config from '@/common/config.js';
import domain from '@/common/domain.js';
const env = config['env'];
const baseUrl = domain[env];

// 获取首页
export function topList() {
	// let listIds = ['3', '0', '2', '1'];
	let listIds = ['19723756', '3779629', '2884035', '3778678'];
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			success: (res) => {
				let result = res.data.list || [];
				if (result.length) result.length = 4;
				for (let i = 0; i < listIds.length; i++) {
					result[i].listId = listIds[i];
				}
				resolve(result);
			},
			fail: () => {},
			complete: () => {}
		})
	})

}


// 获取列表页
export function list(listId) {
	return uni.request({
		url: `${baseUrl}/playlist/detail?id=${listId}`,
		method: 'GET'
	})
}


// 获取歌曲详情
export function songDetail(id) {
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${id}`,
		method: 'GET'
	})
}

// 获取歌曲地址
export function songUrl(id) {
	return uni.request({
		url: `${baseUrl}/song/url?id=${id}`,
		method: 'GET'
	})
}

// 获取歌词
export function songLyric(id) {
	return uni.request({
		url: `${baseUrl}/lyric?id=${id}`,
		method: 'GET'
	})
}

// 获取相似音乐
export function songSimi(id) {
	return uni.request({
		url: `${baseUrl}/simi/song?id=${id}`,
		method: 'GET',
	})
}

// 获取歌曲评论
export function songComment(id) {
	return uni.request({
		url: `${baseUrl}/comment/music?id=${id}`,
		method: 'GET'
	})
}

//热搜列表(详细)
export function searchHot() {
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	})
}

//关键词搜索
export function searchWord(word) {
	return uni.request({
		url: `${baseUrl}/search?keywords=${word}`,
		method: 'GET'
	})
}

//搜索建议 
export function searchSuggest(word) {
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET'
	})
}
