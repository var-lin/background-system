<template>
  <div class="edit-blog-container">
    <EditArticle mode="edit" />
  </div>
</template>

<script>
import EditArticle from "@/components/EditArticle";
export default {
  components: {
    EditArticle,
  },
};
</script>

<style lang="sass" scoped>
.edit-blog-container
  padding: 20px
</style>