<template>
  <div class="app-container">
    <el-tabs value="station">
      <el-tab-pane label="派出所" name="station">
        <station />
      </el-tab-pane>
      <el-tab-pane label="警务区" name="policeman">
        <policeman />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "police-work",
  data: () => ({}),
  components: {
    station: () => import("./station"),
    policeman: () => import("./policeman")
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
    .el-tabs__active-bar {
      display: none;
    }
  }
}
</style>

