<template>
  <div class="about-container">
    <div class="block">关于我</div>
    <el-input
      v-model="url"
      palceholder="请输入内容"
      :disabled="isDisabled"
    ></el-input>
    <el-button type="primary" style="margin-top: 15px" @click="clickHandle">{{
      btnConent
    }}</el-button>
  </div>
</template>

<script>
import { getAbout, setAbout } from "@/api/about";

export default {
  data() {
    return {
      url: "",
      isDisabled: true,
      btnConent: "编辑",
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAbout().then(({ data }) => {
        this.url = data;
      });
    },
    clickHandle() {
      if (this.isDisabled) {
        this.isDisabled = false;
        this.btnConent = "完成";
      } else {
        if (this.url) {
          setAbout({ url: this.url }).then((res) => {
            this.isDisabled = true;
            this.btnConent = "编辑";
            this.$message.success("更改成功");
          });
        } else {
          this.$message.warning("请输入框不能为空");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.about-container {
  padding: 20px;
}

.block {
  margin-bottom: 15px;
  font-weight: 100;
}
</style>
