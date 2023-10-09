import request from "@/utils/request"

// 设置关于我页面的url
export function setAbout(data) {
    return request({
        url: '/api/about',
        method: 'post',
        data
    })
}

// 获取关于我页面的url
export function getAbout() {
    return request.get('/api/about')
}