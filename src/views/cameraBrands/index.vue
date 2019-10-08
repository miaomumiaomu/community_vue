<template>
  <div class="app-container">
    <el-form class="form" ref="listForm" :model="listQuery" :inline="true" >
          <span>关键字</span>
          <el-form-item prop="brandCode">
            <el-input size="mini" placeholder="摄像头编码" v-model="listQuery.brandCode"></el-input>
          </el-form-item>
          <el-form-item prop="brandName">
            <el-input size="mini" placeholder="摄像头名称" v-model="listQuery.brandName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="onSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="onResetForm">重置</el-button>
          </el-form-item>
        </el-form>
    <!-- 工具栏 -->
    <div class="common-tool">
      <div class="title">
        摄像头品牌管理
        <em>{{listTableData.total?listTableData.total:0}}</em>
      </div>
      <div class="right">
        <el-button class="txt-btn" size="mini" type="text" icon="el-icon-plus" v-permission="'cameraBrandMan:btn_add'" @click="onItemEdit()">添加</el-button>
      </div>
    </div>

    <!-- 表格模式 S -->
    <el-table ref="listTabel" :data="listTableData.rows" height="calc(100vh - 255px)" v-loading.body="listTableLoading" highlight-current-row>
      <el-table-column align="center" prop="brandCode" label="品牌编码" />
      <el-table-column align="center" prop="brandName" label="品牌名称" />
      <el-table-column align="center" prop="rtspMain" label="主码流" min-width="150px"/>
      <el-table-column align="center" prop="rtspLive" label="辅码流" min-width="150px" />
      <el-table-column align="center" prop="openEnable" label="是否支持开门" min-width="110px">
        <template slot-scope="scope">
          <span v-if="scope.row.openEnable===1">是</span>
          <span v-if="scope.row.openEnable===0">否</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="openModel" label="开门方式" >
        <template slot-scope="scope">
          <span v-if="scope.row.openModel===0">SDK</span>
          <span v-if="scope.row.openModel===1">jgApi</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="openSignal" label="开门信号通道" min-width="110px" />
      <el-table-column align="center" prop="orderSeq" label="排序号" width="80px"/>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" v-permission="'cameraBrandMan:btn_edit'" @click="onItemEdit(scope.row.brandCode)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格模式 E -->

    <el-pagination @size-change="onListLimit" @current-change="onListPaging" :current-page.sync="listQuery.offset" :page-sizes="[50,100,300]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTableData.total" />

    <!-- 添加编辑表单 -->
    <el-dialog :title="id?'编辑':'添加'" :visible.sync="isFormDialog" width="500px">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="品牌编码" prop="brandCode">
          <el-input v-model="form.brandCode" placeholder="请输入品牌编码" :disabled="id" />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入品牌名称" />
        </el-form-item>
        <el-form-item label="主码流" prop="rtspMain">
          <el-input v-model="form.rtspMain" placeholder="请输入主码流"  />
        </el-form-item>
        <el-form-item label="辅码流" prop="rtspLive">
          <el-input v-model="form.rtspLive" placeholder="请输入主码流"  />
        </el-form-item>
        <el-form-item label="是否支持开门" prop="openEnable">
          <el-radio v-for="item in openEnableOptions" :key="item.value" v-model="form.openEnable" :label="item.value">{{item.label}}</el-radio>
        </el-form-item>
        <el-form-item label="开门方式" prop="openModel">
          <el-select v-model="form.openModel">
             <el-option v-for="item in openModelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开门信号通道" prop="openSignal">
          <el-input v-model="form.openSignal" placeholder="请输入主码流"  />
        </el-form-item>
        <el-form-item label="排序号" prop="orderSeq">
          <el-input type="number"  @keyup.native="onProving" v-model.number="form.orderSeq" placeholder="请输入排序数"  />
        </el-form-item>
        <el-form-item label="描　　述" prop="description" class="m0">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 3 }" v-model="form.description" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
        <el-button size="mini" @click="isFormDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from "moment";
import {
  getCameraBrandsList,
  postCameraBrands,
  getCameraBrands,
  putCameraBrands
} from "@/api/cameraBrand.js";
import { getLabelType } from "@/api/faceModule/faceLabel/index";

export default {
  name: "cameraBrands",
  components: {
    LabelForm: () => import("@/views/faceModule/faceLabel/components/LabelForm")
  },
  data() {
    return {
      isFormDialog: false,
      listQuery: {
        offset: 1,
        limit: 50,
        sort: "brand_code",
        brandCode: null,
        brandName: null
      },
      listTableData: {},
      listTableLoading: false,

      id: null,
      form: {
        brandCode: null,
        brandName: null,
        rtspMain: null,
        rtspLive: null,
        openEnable: 0,
        openModel: null,
        openSignal: null,
        orderSeq: null,
        description: null
      },
      openModelOptions: [
        {
          value: 1,
          label: "jgApi"
        },
        {
          value: 0,
          label: "SDK"
        }
      ],
      openEnableOptions: [
        {
          value: 1,
          label: "是"
        },
        {
          value: 0,
          label: "否"
        }
      ],
      rules: {
        brandCode: { required: true, message: "品牌编码不能为空" },
        brandName: { required: true, message: "品牌名称不能为空" },
        orderSeq: [{ required: true, message: "排序数不能为空" }],
        openEnable: { required: true, message: "是否支持开门不能为空" }
      }
    };
  },
  watch: {
    isFormDialog(val) {
      if (val) {
        this.id = null;
        this.form.brandCode = null;
        this.$refs.form && this.$refs.form.resetFields();
      }
    }
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      getCameraBrandsList(this.listQuery).then(res => {
        this.listTableData = res.data;
      });
    },
    onSearch() {
      this.listQuery.offset = 1;
      this.initData();
    },
    onResetForm() {
      this.$refs.listForm.resetFields();
      this.initData();
    },
    // 分页更新
    onListLimit(val) {
      this.listQuery.limit = val;
      this.initData();
    },
    // 分页更新
    onListPaging(val) {
      this.listQuery.offset = val;
      this.initData();
    },
    onItemEdit(brandCode) {
      this.form.brandCode = brandCode || null;

      this.isFormDialog = true;
      if (this.form.brandCode) {
        getCameraBrands(this.form.brandCode).then(res => {
          if (res.status === 200) {
            this.form = res.data;
            this.id = true;
          }
        });
      }
    },
    onProving() {
      this.form.orderSeq = this.form.orderSeq.replace(/[^\.\d]/g, "");
      this.form.orderSeq = this.form.orderSeq.replace('.', "");
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.id) {
            putCameraBrands(this.form).then(res => {
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
                this.initData();
              }
            });
          } else {
            postCameraBrands(this.form).then(res => {
              let isSuccess = res.status === 200;
              // 提示处理
              this.$notify({
                title: isSuccess ? "成功" : "失败",
                message: isSuccess ? "新增成功" : res.message,
                type: isSuccess ? "success" : "error",
                duration: 2000
              });

              if (isSuccess) {
                this.initData();
                this.isFormDialog = false;
              }
            });
          }
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  position: relative;
  height: 100%;
  .w100 {
    width: 100%;
  }
  .form {
    background: #fafbfd;
    height: 46px;
    line-height: 46px;
    overflow: hidden;
    font-size: 0;
    span {
      display: inline-block;
      padding-left: 10px;
      text-align: right;
      font-size: 13px;
      color: #3f4041;
    }
    .el-form-item {
      height: auto;
      line-height: 100%;
      margin: 4px 0 0 6px;
      font-size: 0;
    }
  }
  .el-pagination {
    padding: 10px;
  }
}
.el-table {
  .identity {
    line-height: 140%;
    label {
      font-size: 14px;
    }
    p {
      color: #9da5af;
    }
  }
  .pic {
    display: block;
    width: 48px;
    height: 48px;
    border-radius: 4px;
  }
  .el-button {
    margin: 2px 0;
  }
}
</style>
