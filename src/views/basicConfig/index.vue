<template>
  <module-tabs class="app-container" :data="options" :active="active" />
</template>

<script>
export default {
  components: {
    MenuComponent: () => import("./menu"),
    DictComponent: () => import("./dict"),
    FaceComponent: () => import("./faceConfig"),
    SoundComponent: () => import("./sound"),
    SystemComponent: () => import("./systemConfig"),
    CoreSync: () => import("./coreSync")
  },

  data() {
    return {
      active: "menuManage",
      options: [
        {
          label: "菜单管理",
          name: "menuManage",
          permission: "'basicConfig:view_menu'",
          component: this.$options.components.MenuComponent
        },
        {
          label: "数据字典",
          name: "dictManage",
          permission: "'basicConfig:view_dict'",
          component: this.$options.components.DictComponent
        },
        {
          label: "人脸参数配置",
          name: "faceManage",
          permission: "'basicConfig:view_config'",
          component: this.$options.components.FaceComponent
        },
        {
          label: "提示音管理",
          name: "soundManage",
          permission: "'basicConfig:view_voice'",
          component: this.$options.components.SoundComponent
        },
        {
          label: "后台管理",
          name: "systemManage",
          permission: "'basicConfig:view_system'",
          component: this.$options.components.SystemComponent
        },
        {
          label: "中心同步",
          name: "coreSync",
          permission: "'basicConfig:btn_push_center'",
          component: this.$options.components.CoreSync
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
