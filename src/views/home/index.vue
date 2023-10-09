<template>
  <div class="home-container">
    <el-table :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>

      <el-table-column prop="description" label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column label="中图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.midImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="大图预览" align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 100px"
            :src="scope.row.bigImg"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
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
              @click="editBannerHandle(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="请编辑信息" :visible.sync="dialogFormVisible" top="5vh">
      <el-form :model="form">
        <el-form-item label="标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>

        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="首页中图">
              <!-- 上传中图组件 -->
              <Upload v-model="form.midImg" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="首页大图">
              <!-- 上传大图组件 -->
              <Upload v-model="form.bigImg" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBannerConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, setBanner } from "@/api/banner";
// import { server_URL } from "@/urlConfig";
import Upload from "@/components/Upload";

export default {
  components: {
    Upload,
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      data: [], // 存储数据
      dialogFormVisible: false, // 编辑对话框是否显示
      form: {
        id: "",
        midImg: "",
        bigImg: "",
        title: "",
        description: "",
      },
    };
  },
  methods: {
    fetchData() {
      getBanner().then((res) => {
        this.data = res.data;
        // for (let i of this.data) {
        //   i.midImg2 = server_URL + i.midImg;
        //   i.bigImg2 = server_URL + i.bigImg;
        // }
      });
    },
    editBannerHandle(bannerInfo) {
      this.form = { ...bannerInfo };
      this.dialogFormVisible = true;
    },
    editBannerConfirm() {
      let arr = [...this.data];
      arr.forEach((data, i) => {
        if (data.id === this.form.id) {
          arr[i] = this.form;
        }
      });
      setBanner(arr).then((res) => {
        this.dialogFormVisible = false;
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.fetchData();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home-container {
  padding: 20px;
}
</style>
