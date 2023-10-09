import request from '@/utils/request'

// 获取文章列表api           page页码数     limit显示数量
export function getBlogList(page = 1, limit = 10,) {
    return request({
        url: '/api/blog',
        method: 'get',
        params: {
            page,
            limit
        }
    })
}

// 删除文章api
export function delOneBlog(id) {
    return request({
        url: `/api/blog/${id}`,
        method: 'delete'
    })
}

// 添加文章api
export function addBlog(data) {
    return request({
        url: '/api/blog',
        method: 'post',
        data
    })
}

// 修改文章api
export function editBlog(blogInfo) {
    return request({
        url: `/api/blog/${blogInfo.id}`,
        method: 'put',
        data: blogInfo.data
    })
}

// 查找文章api
export function findOneBlog(id) {
    return request({
        url: `/api/blog/${id}`,
        method: 'get',
    })
}