<template>
  <module-tabs class="app-container" :data="options" :active="active" />
</template>
<script>
export default {
  name: "communityManager",
  components: {
    BasisManage: () => import("./components/BasisManage"),
    HousesManage: () => import("./components/HousesManage")
  },
  data() {
    return {
      active: "basisManage",
      options: [
        {
          label: "基础信息",
          name: "basisManage",
          permission: "",
          component: this.$options.components.BasisManage
        },
        {
          label: "实有信息",
          name: "housesManage",
          permission: "",
          component: this.$options.components.HousesManage
        }
      ]
    };
  }
};
</script>

<style scoped>
.app-container {
  position: relative;
  height: 100%;
}
</style>
