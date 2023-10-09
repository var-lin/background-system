import request from '@/utils/request'

// 查看文章分类接口
export function getBlogType() {
    return request.get('/api/blogtype')
}

// 删除文章分类接口
export function addBlogType(data) {
    return request({
        url: '/api/blogtype',
        method: 'post',
        data
    })
}

// 删除文章分类接口
export function delBlogType(id) {
    return request.delete(`/api/blogtype/${id}`)
}

// 查找文章分类接口
export function findOneBlogType(id) {
    return request({
        url: `/api/blogtype/${id}`,
        method: 'get'
    })
}

// 更新文章分类接口
export function updateeBlogType(editInfo) {
    return request({
        url: `/api/blogtype/${editInfo.id}`,
        method: 'put',
        data: editInfo.data
    })
}