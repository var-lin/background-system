<template>
  <div class="add-project-container">
    <div class="block">项目名称</div>
    <div class="margin-bottom-15">
      <el-input v-model="form.name" placeholder="请输入项目的名称"></el-input>
    </div>

    <div class="block">项目描述(每一项描述以英文逗号分隔)</div>
    <div class="margin-bottom-15">
      <el-input
        v-model="form.description"
        placeholder="请输入项目的描述"
      ></el-input>
    </div>

    <div class="block">项目链接</div>
    <div class="margin-bottom-15">
      <el-input v-model="form.url" placeholder="请输入项目的链接"></el-input>
    </div>

    <div class="block">GitHub 地址</div>
    <div class="margin-bottom-15">
      <el-input
        v-model="form.github"
        placeholder="请输入项目的GitHub 地址"
      ></el-input>
    </div>

    <!-- 项目预览图 -->
    <div class="margin-bottom-15">
      <Upload uploadTitle="项目预览图" v-model="form.thumb" />
    </div>

    <!-- 排序等级 -->
    <div class="block">排序等级</div>
    <div class="margin-bottom-15">
      <el-select v-model="form.order" placeholder="分类等级">
        <el-option lable="1" value="1"></el-option>
        <el-option lable="2" value="2"></el-option>
        <el-option lable="3" value="3"></el-option>
        <el-option lable="4" value="4"></el-option>
        <el-option lable="5" value="5"></el-option>
      </el-select>
    </div>

    <el-button type="primary" plain @click="addProjectHandle"
      >发布项目</el-button
    >
  </div>
</template>

<script>
import Upload from "@/components/Upload";
import { addProject } from "@/api/project";

export default {
  components: {
    Upload,
  },
  data() {
    return {
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
  methods: {
    addProjectHandle() {
      let arrData = Object.values(this.form);
      for (let i = 0; i < arrData.length; i++) {
        if (arrData[i] === "") {
          this.$message.error("请把全部数据填写完整");
          return;
        }
      }
      let nweData = { ...this.form };
      nweData.description = nweData.description.split(",");
      nweData.order = parseInt(nweData.order);
      addProject(nweData).then(() => {
        this.$router.push("/project/projectList");
        this.$message.success("添加项目成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.add-project-container {
  padding: 20px;
}

.block {
  margin: 15px 0;
  font-weight: 100;
}

.margin-bottom-15 {
  margin-bottom: 15px;
}
</style>
