<template>
  <div class="blog-list-container">
    <!-- 搜索框 -->
    <div style="margin-bottom: 15px" v-if="options.length">
      <el-input
        placeholder="请输入搜索内容"
        v-model.trim="searchContent"
        class="input-with-select"
        @keyup.enter.native="searchHandle"
      >
        <!-- 选择文章分类 -->
        <el-select v-model="value" slot="prepend" placeholder="请选择文章分类">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHandle"
        ></el-button>
        >
      </el-input>
    </div>

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
          {{ scope.row.category === null ? "未分类" : scope.row.category.name }}
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
import pagination from "@/mixins/pagination";
// import { server_URL, frontEnd_URL } from "@/urlConfig";

export default {
  mixins: [pagination()],
  data() {
    return {
      data: [],
      allData: [],
      srcList: [], // 博客预览图
      options: [], // 选择文章分类数据
      value: "全部",
      searchContent: "", // 搜索内容
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
      this.options.push({
        name: "未分类",
      });
    });
  },
  watch: {
    // 选择文章分类
    async value(newVal) {
      if (this.value === "全部") {
        this.isDisplayPagination = true;
        this.fetchData();
        return;
      }
      if (!this.allData.length) {
        const res = await getBlogList(1, this.count);
        this.allData = res.data.rwos;
      }
      this.isDisplayPagination = false;
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.srcList = [];
      this.data = this.allData.filter((data) => {
        if (!data.category) {
          data.category = {
            name: "未分类",
          };
        }
        if (data.category.name === newVal) {
          data.createDate = formatDate(data.createDate);
          // data.thumb = server_URL + data.thumb;
          this.srcList.push(data.thumb);
          return data;
        }
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
    async searchHandle() {
      if (!this.searchContent) {
        // 没有搜索内容
        this.$message({
          type: "error",
          message: `请输入搜索内容`,
        });
        return;
      }

      if (!this.allData.length) {
        const res = await getBlogList(1, this.count);
        this.allData = res.data.rows;
      }

      // 搜索内容转小写
      const searchContent = this.searchContent.toLowerCase();
      let searchResultArr = [];
      let srcList = [];
      if (this.value === "全部") {
        searchResultArr = this.allData.filter((item) => {
          const title = item.title.toLowerCase();
          if (title.includes(searchContent)) {
            item.createDate = formatDate(item.createDate);
            // item.thumb = server_URL + item.thumb;
            srcList.push(item.thumb);
            return item;
          }
        });
      } else {
        searchResultArr = this.data.filter((item) => {
          const title = item.title.toLowerCase();
          if (title.includes(searchContent)) {
            // item.thumb = server_URL + item.thumb;
            srcList.push(item.thumb);
            return item;
          }
        });
      }

      const searchResultArrLength = searchResultArr.length;
      if (searchResultArrLength) {
        this.data = searchResultArr;
        this.$message({
          type: "success",
          message: `共搜索到 ${searchResultArrLength} 个数据`,
        });
        if (this.value === "全部") {
          this.isDisplayPagination = false;
          this.currentPage = 1;
          this.pagerCurrentPage = 1;
          this.srcList = srcList;
        }
      } else {
        this.$message({
          type: "error",
          message: `没有搜索到相关文章`,
        });
      }
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
  },
};
</script>

<style lang="scss" scoped>
.blog-list-container {
  padding: 20px;

  .el-select {
    width: 10em;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>