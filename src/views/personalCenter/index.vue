<template>
  <div class="personal-center-container">
    <el-form
      :model="adminInfo"
      :rules="setRules"
      ref="ruleForm"
      label-width="100px"
      width="500px"
    >
      <el-form-item label="用户名">
        <el-input
          v-model="adminInfo.name"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>

      <el-form-item label="旧密码" prop="oldLoginPwd">
        <el-input
          v-model="adminInfo.oldLoginPwd"
          placeholder="请输入旧密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="loginPwd">
        <el-input
          v-model="adminInfo.loginPwd"
          placeholder="请输入新密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-form-item label="确定新密码" prop="loginPwdConfirm">
        <el-input
          v-model="adminInfo.loginPwdConfirm"
          placeholder="请再次输入新密码"
          type="password"
        ></el-input>
      </el-form-item>

      <el-button type="primary" style="margin-top: 15px" @click="handleClick"
        >修改</el-button
      >
      <el-button type="danger" style="margin-top: 15px" @click="handleBack"
        >返回</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { getInfo, setUser } from "@/api/user";

export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.adminInfo.loginPwd) {
        callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    };
    return {
      url: "",
      // 数据
      adminInfo: {
        id: "",
        loginId: "", // loginid
        name: "", // 用户名
        oldLoginPwd: "", // 旧密码
        loginPwd: "", // 新密码
        loginPwdConfirm: "", // 确定新密码
      },
      setRules: {
        oldLoginPwd: [
          { required: true, trigger: "blur", message: "请输入旧的密码" },
        ],
        loginPwd: [
          { required: true, trigger: "blur", message: "请输入新的密码" },
        ],
        loginPwdConfirm: [
          { required: true, trigger: "blur", message: "请再次输入新密码" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getInfo().then(({ data }) => {
        this.adminInfo.name = data.name;
      });
    },
    // 修改
    handleClick() {
      if (
        this.adminInfo.name &&
        this.adminInfo.oldLoginPwd &&
        this.adminInfo.loginPwd
      ) {
        setUser(this.adminInfo).then((res) => {
          if (typeof res === "string") {
            res = JSON.parse(res);
            this.$message.error(res.msg);
          } else {
            this.$message.success("修改成功");
            this.$store.dispatch("user/logout").then(() => {
              this.$router.push(`/login?redirect=${this.$route.fullPath}`);
            });
          }
        });
      } else {
        this.$message.error("请把信息填写完整");
      }
    },
    // 返回
    handleBack() {
      this.$router.push("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.personal-center-container {
  width: 500px;
  padding: 20px;
}
</style>
