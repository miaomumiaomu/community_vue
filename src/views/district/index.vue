<template>
  <el-tabs type="border-card" class="app-container" value="area">
    <el-tab-pane label="省市区县" name="area">
      <areas />
    </el-tab-pane>
    <el-tab-pane label="乡镇街道" name="towns">
      <towns />
    </el-tab-pane>
    <el-tab-pane label="居/村委会" name="village">
      <village />
    </el-tab-pane>
    <el-tab-pane label="街路巷(小区)" name="street">
      <street />
    </el-tab-pane>
    <el-tab-pane label="门牌楼号" name="unit">
      <unit />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "district-index",
  data: () => ({}),
  components: {
    areas: () => import("./areas"),
    towns: () => import("./towns"),
    village: () => import("./village"),
    street: () => import("./street"),
    unit: () => import("./unit")
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  /deep/ {
    .el-tabs__content {
      padding: 0;
    }
    .el-tabs__header {
      background: #fafbfd;
    }
    .el-tabs__item {
      width: 120px;
      height: 46px;
      line-height: 46px;
      padding: 0 !important;
      border-right: 1px solid #e4e5e6;
      text-align: center;
      font-size: 14px;
      color: #666;
      &.is-active {
        background: #eaeaea;
        font-weight: bold;
        color: #353535;
      }
    }
    .el-tab-pane {
      padding: 10px;
    }
  }
}
</style>

