export default function () {
    return {
        data() {
            return {
                eachPage: 5, // 分页每页显示条数
                currentPage: 1, // 当前页码，默认第一页
                totalPage: 0, // 总页数
                count: 0, // 数据总条数
                pagerCurrentPage: 1, // 分页栏的当前页码
            }
        },
        methods: {
            // 四个分页组件方法
            sizeChangeHandle(pageNum) {
                this.eachPage = parseInt(pageNum);
                this.currentPage = 1;
                this.pagerCurrentPage = 1;
                this.fetchData();
            },
            currentChangeHandle(pageNum) {
                this.currentPage = parseInt(pageNum);
                this.fetchData();
            },
            // 上一页
            prevClickHandle() {
                this.currentPage -= 1;
            },
            // 下一页
            nextClickHandle() {
                this.currentPage += 1;
            },
        }
    }
}