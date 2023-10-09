<template>
  <div class="blog-list-container">
    <!-- 选择文章分类 -->
    <el-select
      v-model="value"
      placeholder="请选择文章分类"
      style="margin-bottom: 20px"
    >
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.name"
      >
      </el-option>
    </el-select>

    <!-- 文章列表 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="文章名称" width="200" align="center">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            title="博客头像预览"
            width="200"
            trigger="hover"
          >
            <el-image
              style="width: 176px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <a
              slot="reference"
              href="#"
              target="_blank"
              @click.prevent="goToTitleHandle(scope.row)"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="文章描述" align="center">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column
        prop="scanNumber"
        label="浏览数"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.scanNumber }}
        </template>
      </el-table-column>

      <el-table-column
        prop="commentNumber"
        label="评论量"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.commentNumber }}
        </template>
      </el-table-column>

      <el-table-column
        prop="categoryName"
        label="所属分类"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          {{
            scope.row.category.name === null
              ? "未分类"
              : scope.row.category.name
          }}
        </template>
      </el-table-column>

      <el-table-column
        prop="createDate"
        label="创建日期"
        width="250"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.createDate }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBlogHandle(scope.row)"
            ></el-button>
          </el-tooltip>

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
              @click="deleteBlogHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      v-if="isDisplayPagination"
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
import { getBlogList, delOneBlog } from "@/api/blog";
import { getBlogType } from "@/api/blogType";
import { formatDate } from "@/utils/tools";
// import { server_URL, frontEnd_URL } from "@/urlConfig";

export default {
  data() {
    return {
      data: [],
      srcList: [], // 博客预览图
      eachPage: 5, // 分页每页显示条数
      currentPage: 1, // 当前页码，默认第一页
      totalPage: 0, // 总页数
      count: 0, // 数据总条数
      pagerCurrentPage: 1, // 分页栏的当前页码
      // 选择文章分类数据
      options: [],
      value: "全部",
      isDisplayPagination: true,
    };
  },
  created() {
    this.fetchData();
    // 获取文章分类数据
    getBlogType().then(({ data }) => {
      this.options = data;
      this.options.unshift({
        id: -1,
        name: "全部",
      });
    });
  },
  watch: {
    // 选择文章分类
    value(newVal) {
      if (this.value === "全部") {
        this.isDisplayPagination = true;
        this.fetchData();
        return;
      }
      this.isDisplayPagination = false;
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.srcList = [];
      getBlogList(this.currentPage, this.count).then(({ data }) => {
        const filtrationData = [];
        this.data = data.rows.map((data) => {
          if (data.category.name === newVal) {
            data.createDate = formatDate(data.createDate);
            // data.thumb = server_URL + data.thumb;
            this.srcList.push(data.thumb);
            filtrationData.push(data);
          }
        });
        this.data = filtrationData;
      });
    },
  },
  methods: {
    fetchData() {
      getBlogList(this.currentPage, this.eachPage).then(({ data }) => {
        this.data = data.rows;
        for (let i of this.data) {
          i.createDate = formatDate(i.createDate);
          // i.thumb = server_URL + i.thumb;
          this.srcList.push(i.thumb);
        }
        this.count = data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    // 跳转到具体的文章
    goToTitleHandle(blogInfo) {
      window.open(`${frontEnd_URL}/article/${blogInfo.id}`);
    },
    // 删除文章
    deleteBlogHandle(blogInfo) {
      this.$confirm(
        "删除该文章也会删除该文章评论, 是否继续删除该文章",
        "是否删除该文章",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delOneBlog(blogInfo.id).then(() => {
            this.value = "全部";
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
    // 编辑文章
    editBlogHandle(blogInfo) {
      this.$router.push(`/blog/editBlog/${blogInfo.id}`);
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

<style lang="sass" scoped>
.blog-list-container
  padding: 20px
</style>