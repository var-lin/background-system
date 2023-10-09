import request from "@/utils/request"

// 获取设置信息
export function getSetting() {
    return request.get('/api/setting')
}

// 填写设置信息
export function setSetting(data) {
    return request({
        url: '/api/setting',
        method: 'put',
        data
    })
}