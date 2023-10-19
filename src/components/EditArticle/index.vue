<template>
  <div class="edit-article-container">
    <!-- 文章标题 -->
    <div class="block">文章标题</div>
    <div style="margin-bottom: 15px">
      <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
    </div>

    <!-- 文章编辑 -->
    <div class="block">文章编辑</div>
    <editor
      ref="toastuiEditor"
      :initialValue="form.editorText"
      height="600px"
      :options="editorOptions"
    />

    <!-- 文章描述 -->
    <div class="block">文章描述</div>
    <el-input type="textarea" v-model="form.description" :rows="6"></el-input>

    <!-- 文章头图 -->
    <Upload uploadTitle="文章头图" v-model="form.thumb" />

    <!-- 选择分类 -->
    <div class="block">选择分类</div>
    <el-select v-model="form.select" placeholder="分类等级">
      <el-option
        v-for="i in blogType"
        :key="i.id"
        :label="i.name"
        :value="i.id"
      ></el-option>
    </el-select>

    <!-- 其余设置 -->
    <div class="block" v-if="mode === 'edit'">其余设置</div>
    <div class="block" v-if="mode === 'edit'">
      <el-checkbox v-model="checked">是否更新创建日期</el-checkbox>
    </div>

    <!-- 新增发布文章按钮 -->
    <div style="margin-top: 15px">
      <el-button type="primary" @click="addArticleHandle">{{
        this.mode === "add" ? "发布文章" : "确定修改"
      }}</el-button>
      <el-button v-if="mode === 'add'" type="info" @click="saveEditHandle"
        >保存编辑</el-button
      >
    </div>
  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/vue-editor";
import "@toast-ui/editor/dist/i18n/zh-cn";
import Upload from "@/components/Upload";
import { getBlogType } from "@/api/blogType";
import { addBlog, editBlog, findOneBlog } from "@/api/blog";

export default {
  components: {
    Editor,
    Upload,
  },
  props: ["mode"],
  data() {
    return {
      id: null,
      form: {
        title: "", // 文章的标题
        editorText: "", // 用户编辑的内容
        description: "", // 文章的描述
        thumb: "", //文章的头图
        select: "", // 选择的分类
      },
      blogType: [],
      imageUrl: "",
      checked: true, // 是否更新创建日期
      editorOptions: {
        language: "zh-CN",
      },
    };
  },
  created() {
    // 拿取文章分类
    getBlogType().then(({ data }) => {
      this.blogType = data;
    });
  },
  mounted() {
    let saveEditData = JSON.parse(localStorage.getItem("saveEditData"));
    if (this.mode === "edit") {
      // 编辑文章拿到要编辑的文章信息
      this.id = this.$route.params.id;
      findOneBlog(this.id).then(({ data }) => {
        this.form = data;
        this.form.select = data.category === null ? "" : data.category.id;
        this.$refs.toastuiEditor.invoke("setHTML", data.htmlContent);
        this.scanNumber = data.scanNumber;
        this.createDate = data.createDate;
      });
    } else if (saveEditData) {
      this.form = saveEditData;
      this.$refs.toastuiEditor.invoke("setHTML", saveEditData.htmlContent);
    }
  },
  methods: {
    addArticleHandle() {
      const newData = {
        title: this.form.title,
        description: this.form.description,
        createDate: new Date().getTime(),
        categoryId: this.form.select,
        toc: [],
        htmlContent: this.$refs.toastuiEditor.invoke("getHTML"),
        thumb: this.form.thumb,
        markdownContent: this.$refs.toastuiEditor.invoke("getMarkdown"),
      };

      if (
        newData.title &&
        newData.description &&
        newData.htmlContent !== "<p><br></p>"
      ) {
        if (this.mode === "add") {
          localStorage.removeItem("saveEditData");
          // 添加文章
          addBlog(newData).then((res) => {
            this.$router.push("/blog/blogList");
            this.$message.success("添加文章成功");
          });
        } else {
          // 编辑文章
          newData.scanNumber = --this.scanNumber; // 编辑文章不算浏览文章，浏览数不加
          // 是否更新创建日期
          if (!this.checked) {
            newData.createDate = this.createDate;
          }
          editBlog({ id: this.form.id, data: newData }).then((res) => {
            this.$router.push("/blog/blogList");
            this.$message.success("修改文章成功");
          });
        }
      } else {
        let errArr = [];
        if (!newData.title) {
          errArr.push("文章的标题");
        }
        if (!newData.description) {
          errArr.push("文章的描述");
        }
        if (newData.htmlContent === "<p><br></p>") {
          errArr.push("文章的内容");
        }
        this.$message.error(`请填写 ${errArr.join(",")} 信息`);
      }
    },
    // 保存编辑
    saveEditHandle() {
      if (!this.form.title && !this.form.editorText && !this.form.description) {
        this.$message.error("未有编辑内容");
        return;
      }
      const newData = this.form;
      newData.htmlContent = this.$refs.toastuiEditor.invoke("getHTML");
      localStorage.setItem("saveEditData", JSON.stringify(newData));
      this.$message.success("保存编辑成功");
    },
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
  font-weight: 100;
}
</style>