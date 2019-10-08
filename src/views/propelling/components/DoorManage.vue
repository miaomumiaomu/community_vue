<template>
  <div class="door-manage">
    <!-- 工具栏 -->
    <div class="common-tool">
      <!-- 表单筛选 -->
      <el-form class="form" @keyup.enter.native="getTableList">
        <span>关键字</span>
        <el-input size="mini" @keyup.enter.native="getTableList" placeholder="名称/代码" v-model="listQuery.keyword" />
        <el-button size="mini" type="primary" @click="getTableList">查询</el-button>
        <el-button size="mini" @click="onResetForm">重置</el-button>
      </el-form>
      <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" @click="onItemEdit()" v-permission="'accessPushMan:btn_add'">添加</el-button>
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-delete" @click="onItemDelete" v-permission="'accessPushMan:btn_batchDelete'">删除</el-button>
      </div>
    </div>

    <el-table class="table" :data="listData.rows" height="calc(100vh - 256px)" v-loading.body="listLoading" highlight-current-row @selection-change="onListChange">
      <el-table-column type="selection" width="50" />
      <el-table-column label="名称" prop="accessName" />
      <el-table-column label="代码" prop="accessCode" min-width="80" />
      <el-table-column label="进出类型" prop="inOut" width="80" align="center" />
      <el-table-column label="设备类型" prop="accessType" width="80" align="center" />
      <el-table-column label="启用/禁用" prop="accessAbleCn" width="100" align="center" />
      <el-table-column label="引用次数" prop="quoteCount" width="100" align="center" />
      <el-table-column fixed="right" width="150" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="onTest(scope.row)" v-permission="'accessPushMan:btn_test'">推送测试</el-button>
          <el-button size="mini" type="success" @click="onItemEdit(scope.row.id)" v-permission="'accessPushMan:btn_edit'">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page="listQuery.offset" :page-sizes="[15,30,50]" :page-size="listQuery.limit" :total="listData.total" layout="total, sizes, prev, pager, next, jumper"> </el-pagination>

    <!-- 表单编辑 -->
    <el-dialog :title="form.id?'编辑':'添加'" :visible.sync="isFormDialog" width="600px">
      <el-form :model="form" :rules="rules" ref="form" label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名　　称" prop="accessName">
              <el-input v-model="form.accessName" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经纬度" prop="lng">
              <el-input :value="form.lng&&form.lat?form.lng+','+form.lat:''" placeholder="请选择经度" @focus="showMapLocation" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代　　码" prop="accessCode">
              <el-input v-model="form.accessCode" placeholder="请输入代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="频率(秒)" prop="accessFrequency">
              <el-input v-model="form.accessFrequency" placeholder="请输入调用频率" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="URL地址" prop="accessUrl">
              <el-input v-model="form.accessUrl" placeholder="请输入url地址" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进出类型" prop="inOut">
              <dict-select dict-name="inOut" v-model="form.inOut" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="accessType">
              <el-input v-model="form.accessType" placeholder="请输入设备类型" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门牌楼号" prop="mlph">
              <el-input v-model="form.mlph.content" placeholder="请选择门牌楼号" @focus="isMlphDialog = true" readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用/禁用" prop="accessAble">
              <el-select v-model="form.accessAble" placeholder="请选择">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备　　注" prop="accessDesc" class="m0">
              <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" v-model="form.accessDesc" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 门牌楼号选择层 -->
    <mlph-select :is-open.sync="isMlphDialog" :data.sync="form.mlph" />

    <!-- 经纬度选择器 -->
    <map-location ref="locationDialog" :zoom="18" @local="setLocation" />
  </div>
</template>
<script>
import {
  page,
  addObj,
  getObj,
  delObj,
  putObj,
  getTest
} from "@/api/Linkage/doorLinkage/index";

export default {
  data: () => ({
    isFormDialog: false, // 控制表单显示
    form: {
      id: null,
      accessCode: null,
      accessName: null,
      accessUrl: null,
      accessFrequency: 5,
      accessType: "0",
      accessAble: "0",
      accessDesc: null,
      mlphId: null,
      mlph: {},
      lng: null,
      lat: null,
    },
    rules: {
      accessName: { required: true, message: "名称不能为空" },
      accessCode: { required: true, message: "代码不能为空" },
      accessFrequency: { required: true, message: "调用频率不能为空" },
      accessType: { required: true, message: "类型不能为空" },
      accessAble: { required: true, message: "请选择启用/禁用" }
    },

    listIds: [],
    listData: {},
    listQuery: {
      offset: 1,
      limit: 15,
      keyword: null
    },
    listLoading: false,

    isMlphDialog: false
  }),
  methods: {
    init() {
      this.getTableList();
    },
    // 获取表格数据
    getTableList() {
      this.listLoading = true;
      page(this.listQuery)
        .then(res => {
          this.listData = res.data;
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let _form = Object.assign({}, this.form);
          _form.mlphId = _form.mlph.id;

          delete _form.mlph;

          if (_form.id) {
            putObj(_form.id, _form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "保存成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.isFormDialog = false;
                this.getTableList();
              }
            });
          } else {
            // 新增
            addObj(_form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "新增成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.isFormDialog = false;
                this.getTableList();
              }
            });
          }
        }
      });
    },
    // 列表参数重置
    onResetForm() {
      this.listQuery = {
        offset: 1,
        limit: 15,
        keyword: null
      };
    },
    // 表单编辑
    onItemEdit(id) {
      this.form.id = id || null;

      if (this.form.id) {
        getObj(this.form.id).then(res => {
          if (res.status === 200) {
            this.isFormDialog = true;
            this.$nextTick(() => {
              this.$refs.form && this.$refs.form.resetFields();
              this.form = res.data;
              this.form.mlph = {
                id: this.form.mlphId,
                content: this.form.mlphName
              };
            });
          }
        });
      } else {
        this.isFormDialog = true;
        this.$nextTick(() => {
          this.$refs.form && this.$refs.form.resetFields();
        });
      }
    },
    // 批量删除
    onItemDelete() {
      if (!this.listIds.length) {
        this.$notify({
          title: "提示",
          message: "请选择需要删除的数据",
          type: "warning",
          duration: 2000
        });
        return;
      }

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        confirmButtonClass: "el-button--mini",
        cancelButtonClass: "el-button--mini fr",
        type: "warning"
      }).then(() => {
        delObj({
          ids: this.listIds
        }).then(res => {
          let isSuccess = res.status === 200;
          this.$notify({
            title: isSuccess ? "成功" : "失败",
            message: isSuccess ? "删除成功" : res.message,
            type: isSuccess ? "success" : "error",
            duration: 2000
          });

          if (isSuccess) {
            this.getTableList();
          }
        });
      });
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
    },
    onTest(row) {
      getTest(row.id).then(res => {
        let isSuccess = res.status === 200;
        this.$message({
          type: isSuccess ? "success" : "error",
          message: isSuccess ? res.data : res.message
        });
      });
    },
    // 设置经纬度
    showMapLocation() {
      this.$refs.locationDialog.open({
        lng: this.form.lng,
        lat: this.form.lat
      });
    },
    // 返回经纬度设置
    setLocation(location) {
      this.form = Object.assign({}, this.form, {
        lng: location.lng,
        lat: location.lat
      });
    },
    onListPaging(val) {
      this.listQuery.offset = val;
      this.getTableList();
    },
    onListLimit(val) {
      this.listQuery.limit = val;
      this.getTableList();
    }
  }
};
</script>
<style lang="scss" scoped>
.door-manage {
  .m0 {
    margin: 0;
  }
  .common-tool {
    border-top: 0;
  }
  .el-select {
    width: 100%;
  }
  .table {
    .group {
      label {
        display: inline-block;
        vertical-align: top;
        line-height: 120%;
      }
      p {
        line-height: 120%;
      }
    }
    .el-button {
      margin: 0;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}
</style>
