import { formatDate } from "@/utils/tools";
import pagination from "@/mixins/pagination"; // 分页

export default function (component, getCommentHandle, delHandle) {
    return {
        mixins: [pagination()],
        data() {
            return {
                data: [],
                oldData: [],
                allData: [], // 全部评论
                listLoading: false,
                searchMethod: "nickname", // 搜索方式
                searchContent: "", // 搜索内容
                searching: false, // 进入搜索
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                this.listLoading = true;
                getCommentHandle(this.currentPage, this.eachPage).then(({ data }) => {
                    this.listLoading = false;
                    this.searching = false
                    for (let i of data.rows) {
                        i.createDate = formatDate(i.createDate);
                    }
                    this.data = Object.freeze(data.rows);
                    this.count = data.total;
                    this.totalPage = Math.ceil(this.count / this.eachPage); // 总页数
                    if (this.currentPage > this.totalPage) {
                        this.currentPage = this.totalPage;
                        this.fetchData();
                    }
                    this.oldData = this.data;
                });
            },
            // 搜索函数
            async searchHandle() {
                if (this.allData.length == 0) {
                    // 拿到全部评论
                    await getCommentHandle(1, this.count).then(({ data }) => {
                        for (let i of data.rows) {
                            i.createDate = formatDate(i.createDate);
                        }
                        this.allData = Object.freeze(data.rows);
                    });
                }

                if (!this.searchContent) {
                    // 没有搜索内容
                    this.$message({
                        type: "error",
                        message: `请输入搜索内容`,
                    });
                    return;
                }

                this.listLoading = true;
                this.searching = true;
                // 搜索内容转小写
                const searchContent = this.searchContent.toLowerCase();
                const data = (() => {
                    let searchData;
                    if (component == "comment" && this.searchMethod == "blogTitle") {
                        searchData = this.allData.filter((data) => {
                            // 数据转小写
                            const title = data.blog.title.toLowerCase();
                            if (title.includes(searchContent)) {
                                return data;
                            }
                        });
                    } else {
                        searchData = this.allData.filter((data) => {
                            const dataContent = data[this.searchMethod].toLowerCase();
                            if (dataContent.includes(searchContent)) {
                                return data;
                            }
                        });
                    }
                    return searchData;
                })();

                const dataLength = data.length;
                if (dataLength) {
                    this.data = Object.freeze(data);
                    this.$message({
                        type: "success",
                        message: `共搜索到 ${dataLength} 个数据`,
                    });
                } else {
                    this.$message({
                        type: "error",
                        message: `没有搜索到相关评论`,
                    });
                    this.listLoading = false;
                    this.searching = false;
                }
                this.listLoading = false;
            },
            // 删除评论函数
            deleteHandle({ id }) {
                this.$confirm("是否删除该评论", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        delHandle(id).then(() => {
                            this.fetchData();
                            this.$message({
                                type: "success",
                                message: "删除成功!",
                            });
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除",
                        });
                    });
            },
        }
    }
}