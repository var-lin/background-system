<template>
  <div class="project-list-container">
    <el-table
      v-loading="listLoading"
      :data="data"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
    >
      <!-- 序号 -->
      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <!-- 项目名称 -->
      <el-table-column align="center" label="项目名称" width="150">
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank" class="proName">{{
            scope.row.name
          }}</a>
        </template>
      </el-table-column>

      <!-- 项目描述 -->
      <el-table-column align="center" label="项目描述">
        <template slot-scope="scope">
          {{ scope.row.description.toString() }}
        </template>
      </el-table-column>

      <!-- 排序等级 -->
      <el-table-column align="center" label="排序等级" width="80">
        <template slot-scope="scope">
          {{ scope.row.order }}
        </template>
      </el-table-column>

      <!-- 预览图 -->
      <el-table-column align="center" label="预览图" width="150">
        <template slot-scope="scope">
          <el-image
            :src="scope.row.thumb"
            style="width: 120px"
            :preview-src-list="scrList"
          ></el-image>
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="github"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              style="background-color: #999; border: 1px solid #999"
              type="primary"
              icon="iconfont icon-GitHub"
              circle
              size="mini"
              @click="openGithubHandle(scope.row)"
            ></el-button>
          </el-tooltip>

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
              @click="editProjectHandle(scope.row)"
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
              @click="deleteProjectHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑框 -->
    <el-dialog
      title="请编辑该项目信息"
      :visible.sync="dialogFormVisible"
      fullscreen
    >
      <el-form :model="form">
        <el-form-item label="项目名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="项目描述(每一项描述以英文逗号分隔)">
          <el-input v-model="form.description"></el-input>
        </el-form-item>

        <el-form-item label="项目链接">
          <el-input v-model="form.url"></el-input>
        </el-form-item>

        <el-form-item label="GitHub 地址">
          <el-input v-model="form.github"></el-input>
        </el-form-item>

        <el-form-item label="项目预览图">
          <Upload v-model="form.thumb" />
        </el-form-item>

        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="分类等级">
            <el-option lable="1" value="1"></el-option>
            <el-option lable="2" value="2"></el-option>
            <el-option lable="3" value="3"></el-option>
            <el-option lable="4" value="4"></el-option>
            <el-option lable="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditProjectHandle"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProject, setProject, delProject } from "@/api/project";
// import { server_URL } from "@/urlConfig";
import Upload from "@/components/Upload";

export default {
  components: {
    Upload,
  },
  data() {
    return {
      data: [], // 项目数据
      listLoading: false,
      scrList: [],
      dialogFormVisible: false, // 编辑框不可见
      form: {
        name: "",
        description: "",
        url: "",
        github: "",
        thumb: "",
        order: 1,
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getProject().then(({ data }) => {
        this.listLoading = false;
        this.data = data;
        for (let i of this.data) {
          // i.thumb2 = server_URL + i.thumb;
          // this.scrList.push(server_URL + i.thumb);
          this.scrList.push(i.thumb);
        }
      });
    },
    // 跳转项目github地址
    openGithubHandle(projectInfo) {
      window.open(projectInfo.github);
    },
    // 编辑项目信息
    editProjectHandle(projectInfo) {
      this.dialogFormVisible = true;
      this.form = {
        ...projectInfo,
        description: projectInfo.description.toString(),
      };
    },
    // 确认编辑事件
    confirmEditProjectHandle() {
      let newData = { ...this.form };
      newData.description = this.form.description.split(",");
      newData.order = parseInt(this.form.order);

      setProject(newData.id, newData).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("修改项目成功");
      });
    },
    // 删除项目
    deleteProjectHandle({ id }) {
      this.$confirm("确定要删除该项目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProject(id).then(() => {
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
.project-list-container {
  padding: 20px;
}

.proName:hover {
  color: #999;
}
</style>
