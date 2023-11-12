<template>
  <div class="comment-container">
    <!-- 搜索框 -->
    <div style="margin-bottom: 15px" v-if="oldData.length != 0">
      <el-input
        placeholder="请输入搜索内容"
        v-model.trim="searchContent"
        class="input-with-select"
        @keyup.enter.native="searchHandle"
      >
        <el-select v-model="searchMethod" slot="prepend" placeholder="请选择">
          <el-option label="昵称" value="nickname"></el-option>
          <el-option label="评论内容" value="content"></el-option>
          <el-option label="评论文章" value="blogTitle"></el-option>
          <el-option label="id" value="id"></el-option>
        </el-select>
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchHandle"
        ></el-button>
        <el-button
          slot="append"
          @click="
            data = oldData;
            searching = false;
          "
          >返回旧数据</el-button
        >
      </el-input>
    </div>

    <!-- 文章评论列表 -->
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
              @click="deleteHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      v-if="!listLoading && !searching"
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
import commentMag from "@/mixins/commentMag";

export default {
  mixins: [commentMag("comment", getComment, delComment)],
};
</script>

<style lang="scss" scoped>
.comment-container {
  padding: 20px;

  .el-select {
    width: 8em;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
