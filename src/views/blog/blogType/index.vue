<template>
  <div class="blog-type-container">
    <!-- 搜索框及添加分类 -->
    <div style="margin: 20px 0">
      <el-input
        placeholder="请输入要添加的分类，左边选择该分类的等级"
        v-model="input"
        class="input-with-select blogAddInput"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-input>

      <el-button
        type="primary"
        style="margin-left: 10px"
        @click="addBlogTypeHandle"
        >添加</el-button
      >
    </div>

    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="博客类别" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="文章数量" align="center">
        <template slot-scope="scope">
          {{ scope.row.articleCount }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="排序等级" align="center">
        <template slot-scope="scope">
          {{ scope.row.order }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" align="center">
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
              @click="editBlogTypeHandle(scope.row)"
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
              @click="deleteBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑文章分类组件 -->
    <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditBlogTypeHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogType,
  addBlogType,
  delBlogType,
  findOneBlogType,
  updateeBlogType,
} from "@/api/blogType";

export default {
  data() {
    return {
      input: "",
      select: "1",
      listLoading: false,
      data: [],
      // 编辑文章分类表单的数据
      dialogFormVisible: false,
      form: {
        name: "",
        order: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getBlogType().then((res) => {
        this.listLoading = false;
        this.data = Object.freeze(res.data);
      });
    },
    // 添加文章
    addBlogTypeHandle() {
      if (this.input) {
        let isInclusion = false;
        this.data.forEach((data, i) => {
          if (data.name === this.input) {
            isInclusion = true;
          }
        });
        if (isInclusion) {
          this.$message.error(`已存在 *${this.input}* 该分类名称`);
        } else {
          addBlogType({ name: this.input, order: this.select }).then(() => {
            this.input = "";
            this.fetchData();
            this.$message.success("添加分类成功");
          });
        }
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    // 编辑文章方法
    editBlogTypeHandle({ id }) {
      findOneBlogType(id).then((res) => {
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },
    // 确认编辑方法
    confirmEditBlogTypeHandle() {
      updateeBlogType({
        id: this.form.id,
        data: this.form,
      }).then(() => {
        this.fetchData(), this.$message.success("修改分类信息成功");
        this.dialogFormVisible = false;
      });
    },
    // 删除文章方法
    deleteBlogTypeHandle({ id }) {
      this.$confirm(
        "删除该分类后, 该分类下的所有文章将变为未分类状态, 是否继续删除该文章分类",
        "是否删除该文章分类",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delBlogType(id).then(() => {
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
  },
};
</script>

<style lang="scss" scoped>
.blog-type-container {
  padding: 20px;

  .blogAddInput {
    width: 400px;
  }

  .input-with-select .el-select {
    width: 5em;
  }
}
</style>