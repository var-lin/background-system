<template>
  <div class="comment-container">
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="imgage" label="头像" align="center" width="100">
        <template slot-scope="scope">
          <el-avatar
            shape="square"
            size="small"
            :src="scope.row.avatar"
          ></el-avatar>
        </template>
      </el-table-column>

      <el-table-column prop="nickname" label="昵称" align="center" width="150">
        <template slot-scope="scope">
          {{ scope.row.nickname }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="评论文章" align="center">
        <template slot-scope="scope">
          {{ scope.row.blog.title }}
        </template>
      </el-table-column>

      <el-table-column prop="content" label="评论内容" align="center">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>

      <el-table-column
        prop="createDate"
        label="评论日期"
        align="center"
        width="250"
      >
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="mini"
              @click="deleteCommentHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      background
      :page-size="eachPage"
      :page-sizes="[5, 10, 15, 20]"
      layout="prev, pager, next, total, ->,sizes, jumper"
      :total="count"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      @prev-click="prevClickHandle"
      @next-click="nextClickHandle"
    >
    </el-pagination>
  </div>
</template>

<script>
import { getComment, delComment } from "@/api/comment";
import { formatDate } from "@/utils/tools";
// import { server_URL, frontEnd_URL } from "@/urlConfig";

export default {
  data() {
    return {
      data: [],
      listLoading: false,
      currentPage: 1, // 当前第几页
      eachPage: 5, // 一页显示多少条
      count: 0, // 评论总数量
      totalPage: 0, // 总页数
      pagerCurrentPage: 1, // 页码栏第几页
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getComment(this.currentPage, this.eachPage).then(({ data }) => {
        this.listLoading = false;
        this.data = data.rows;
        for (let i of this.data) {
          // i.avatar = server_URL + i.avatar;
          i.createDate = formatDate(i.createDate);
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage); // 总页数
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    // 删除评论函数
    deleteCommentHandle({ id }) {
      this.$confirm("是否删除该评论", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delComment(id).then(() => {
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
  },
};
</script>

<style lang="scss" scoped>
.comment-container {
  padding: 20px;
}
</style>
