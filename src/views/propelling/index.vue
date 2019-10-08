<template>
  <module-tabs class="app-container" :data="options" :active="active" />
</template>

<script>
export default {
  components: {
    DoorManage: () => import("./components/DoorManage"),
    AppManage: () => import("./components/AppManage"),
    SmsManage: () => import("./components/SmsManage"),
    ClientManage: () => import("./components/ClientManage")
  },

  data() {
    return {
      active: "doorManage",
      options: [
        {
          label: "门禁推送",
          name: "doorManage",
          permission: "'pushMan:view_access'",
          component: this.$options.components.DoorManage
        },
        {
          label: "APP推送",
          name: "appManage",
          permission: "'pushMan:view_app'",
          component: this.$options.components.AppManage
        },
        {
          label: "短信推送",
          name: "smsManage",
          permission: "'pushMan:view_sms'",
          component: this.$options.components.SmsManage
        },
        {
          label: "客户端推送",
          name: "clientManage",
          permission: "'pushMan:view_client'",
          component: this.$options.components.ClientManage
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