<template>
  <div class="add-blog-container">
    <EditArticle mode="add" />
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
.add-blog-container
  padding: 20px
</style>