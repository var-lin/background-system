import request from "@/utils/request"

// 获取留言板评论数据
export function getMessage(page = 1, limit = 10) {
    return request({
        url: '/api/message',
        method: 'get',
        params: {
            page,
            limit
        }
    })
}

// 删除留言板评论接口
export function delMessage(id) {
    return request.delete(`/api/message/${id}`)
}