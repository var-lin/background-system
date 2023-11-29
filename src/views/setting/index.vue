<template>
  <div class="setting-container">
    <div class="block">网站信息</div>

    <div class="block2">网站标题</div>
    <div class="margin_b_15_w500">
      <el-input v-model="form.siteTitle" disabled></el-input>
    </div>

    <div class="block2">邮箱</div>
    <div class="margin_b_15_w500">
      <el-input v-model="form.mail" disabled></el-input>
    </div>

    <div class="block2">备案号</div>
    <div class="margin_b_15_w500">
      <el-input v-model="form.icp" disabled></el-input>
    </div>

    <div class="block2">网站头像信息</div>
    <div class="margin_b_15">
      <el-image
        style="width: 100px; height: 100px"
        :src="form.avatar"
      ></el-image>
    </div>

    <el-divider></el-divider>
    <!-- 分割线 -->

    <div class="block">网站图标信息</div>
    <div class="block2">网站图标地址</div>
    <div class="margin_b_15_w500">
      <el-input
        v-model="form.favicon"
        placeholder="请输入图片地址"
        disabled
      ></el-input>
    </div>

    <div class="block2">网站图片预览</div>
    <div class="margin_b_15">
      <el-image
        style="width: 50px; height: 50px"
        :src="form.favicon"
      ></el-image>

      <el-divider></el-divider>
      <!-- 分割线 -->

      <div class="block">GitHub 信息</div>
      <div class="block2">GitHub 名字</div>
      <div class="margin_b_15_w500">
        <el-input v-model="form.githubName" disabled></el-input>
      </div>

      <div class="block2">GitHub 地址</div>
      <div class="margin_b_15_w500">
        <el-input v-model="form.github" disabled></el-input>
      </div>

      <el-divider></el-divider>
      <!-- 分割线 -->

      <div class="block">QQ 信息</div>
      <div class="block2">QQ 号码</div>
      <div class="margin_b_15_w500">
        <el-input v-model="form.qq" disabled></el-input>
      </div>

      <div class="margin_b_15_w500">QQ 二维码图片预览</div>
      <div class="margin_b_15">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.qqQrCode"
        ></el-image>
      </div>

      <el-divider></el-divider>
      <!-- 分割线 -->

      <div class="block">微信信息</div>
      <div class="block2">微信号</div>
      <div class="margin_b_15_w500">
        <el-input v-model="form.weixin" disabled></el-input>
      </div>

      <div class="margin_b_15_w500">微信二维码图片预览</div>
      <div class="margin_b_15">
        <el-image
          style="width: 100px; height: 100px"
          :src="form.weixinQrCode"
        ></el-image>
      </div>

      <el-divider></el-divider>
      <!-- 分割线 -->

      <el-button type="primary" @click="openEditPanel">进入编辑模式</el-button>

      <!-- 编辑信息框 -->
      <el-dialog
        title="请编辑信息"
        :visible.sync="dialogFormVisible"
        width="50%"
        top="5vh"
        fullscreen
      >
        <el-form :model="form">
          <el-form-item label="网站标题">
            <el-input v-model="form2.siteTitle"></el-input>
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input v-model="form2.mail"></el-input>
          </el-form-item>

          <el-form-item label="备案号">
            <el-input v-model="form2.icp"></el-input>
          </el-form-item>

          <el-form-item label="网站头像地址">
            <Upload v-model="form2.avatar" />
          </el-form-item>

          <el-form-item label="网站图标地址">
            <el-input v-model="form2.favicon"></el-input>
          </el-form-item>

          <el-form-item label="GitHub 名字">
            <el-input v-model="form2.githubName"></el-input>
          </el-form-item>

          <el-form-item label="GitHub 地址">
            <el-input v-model="form2.github"></el-input>
          </el-form-item>

          <el-form-item label="QQ 号码">
            <el-input v-model="form2.qq"></el-input>
          </el-form-item>

          <el-form-item label="QQ 二维码图片地址">
            <Upload v-model="form2.qqQrCode" />
          </el-form-item>

          <el-form-item label="微信号">
            <el-input v-model="form2.weixin"></el-input>
          </el-form-item>

          <el-form-item label="微信二维码图片地址">
            <Upload v-model="form2.weixinQrCode" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmEditSetting"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getSetting, setSetting } from "@/api/setting";
import Upload from "@/components/Upload";

export default {
  components: {
    Upload,
  },
  data() {
    return {
      form: {
        id: "",
        siteTitle: "",
        mail: "",
        icp: "",
        avatar: "",
        favicon: "",
        githubName: "",
        github: "",
        qq: "",
        qqQrCode: "",
        weixin: "",
        weixinQrCode: "",
      },
      form2: {
        id: "",
        siteTitle: "",
        mail: "",
        icp: "",
        avatar: "",
        favicon: "",
        githubName: "",
        github: "",
        qq: "",
        qqQrCode: "",
        weixin: "",
        weixinQrCode: "",
      },
      dialogFormVisible: false, // 编辑框显示
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getSetting().then(({ data }) => {
        this.form = { ...data };
        this.form2 = { ...this.form };
      });
    },
    // 打开编辑设置信息框
    openEditPanel() {
      this.dialogFormVisible = true;
    },
    // 确定设置信息
    confirmEditSetting() {
      setSetting(this.form2).then(() => {
        this.dialogFormVisible = false;
        this.fetchData();
        this.$message.success("更改成功");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 20px;
}

.block {
  margin-bottom: 15px;
  font-weight: 100;
}

.block2 {
  margin: 15px 0;
  font-size: 14px;
  font-weight: 100;
}

.margin_b_15 {
  margin-bottom: 15px;
}

.margin_b_15_w500 {
  margin-bottom: 15px;
  width: 500px;
}
</style>
