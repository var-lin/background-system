import request from '@/utils/request'

// 获取首页标语api
export function getBanner() {
    return request({
        url: '/api/banner',
        method: 'get'
    })
}

// 设置首页标语api
export function setBanner(data) {
    return request({
        url: '/api/banner',
        method: 'post',
        data
    })
}