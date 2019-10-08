<template>
  <div class="unit-manage">
    <el-row :gutter="20" class="max-h">
      <el-col :span="6" class="max-h">
        <div class="tree-container">
          <el-input placeholder="输入关键字进行过滤" v-model="list.filterText">
          </el-input>
          <el-tree ref="tree" :data="treeData" :filter-node-method="filterNode" node-key="id" accordion :highlight-current="true" :expand-on-click-node="false" :default-expanded-keys="[1]">
            <span class="custom-tree-node" slot-scope="{ node, data }" @click="data.id && handleNodeClick(data,node)">
              {{ node.label }}
              <span>
                <el-button type="text" size="mini" @click.stop="handleCreate(data)">
                  <svg-icon iconClass="add" v-show="data.type !=='4'"></svg-icon>
                </el-button>
                <el-button type="text" size="mini" style="margin-left: 0" @click.stop="handleDelete(data.id)">
                  <svg-icon iconClass="delete" v-show="data.type !== undefined"></svg-icon>
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card">
          <el-form :label-position="labelPosition" :model="list" ref="list" v-loading.body="listLoading">
            <el-col :span="24">
              <el-form-item label="街路巷" prop="jlxxqName" label-width="100px">
                <span v-text="list.jlxxqName"></span>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="小区/后缀" prop="mlph" label-width="100px">
                <el-input v-model="list.mlph" placeholder="请输入小区" :disabled="formEdit || parseInt(list.type) >0"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="mlphhz">
                <el-input v-model="list.mlphhz" placeholder="后缀" :disabled="formEdit || parseInt(list.type) >0"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="18">
              <el-form-item label="楼牌号/后缀" prop="lph" label-width="100px">
                <el-input v-model="list.lph" placeholder="请输入楼牌号" :disabled="formEdit || parseInt(list.type) >1"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="lphhz">
                <el-input v-model="list.lphhz" placeholder="后缀" :disabled="formEdit || parseInt(list.type) >1"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="18">
              <el-form-item label="单元/后缀" prop="dyh" label-width="100px">
                <el-input v-model="list.dyh" placeholder="请输入单元" :disabled="formEdit ||  parseInt(list.type) >2"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="dyhhz">
                <el-input v-model="list.dyhhz" placeholder="后缀" :disabled="formEdit || parseInt(list.type) >2"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="18">
              <el-form-item label="房间/后缀" prop="fjh" label-width="100px">
                <el-input v-model="list.fjh" placeholder="请输入房间" :disabled="formEdit || parseInt(list.type) >3"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="fjhhz">
                <el-input v-model="list.fjhhz" placeholder="后缀" :disabled="formEdit || parseInt(list.type) >3"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="经度" prop="lng" label-width="100px">
                <el-input v-model="list.lng" placeholder="请输入经度" :disabled="formEdit" @focus="showMapLocation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="纬度" prop="lat" label-width="100px">
                <el-input v-model="list.lat" placeholder="请输入纬度" :disabled="formEdit" @focus="showMapLocation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="警务责任区" prop="jwzrqCode" label-width="100px">
                <el-select placeholder="请选择" @change="select" v-model="list.jwzrqCode" :disabled="formEdit || parseInt(list.type) >0" style="width: 100%">
                  <el-option v-for="item in options" :key="item.jwzrqCode" :label="item.jwzrqName" :value="item.jwzrqCode.toString()">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" prop="type" label-width="100px">
                <el-select v-model="list.type" v-show="formEdit===true" placeholder="请选择" :disabled="true" style="width: 100%">
                  <el-option label="街路巷" value="0"></el-option>
                  <el-option label="小区" value="1"></el-option>
                  <el-option label="楼号" value="2"></el-option>
                  <el-option label="单元" value="3"></el-option>
                  <el-option label="房间" value="4"></el-option>
                </el-select>
                <el-select v-model="list.type" v-show="formEdit===false" placeholder="请选择" :disabled="true" style="width: 100%">
                  <el-option label="小区" value="0"></el-option>
                  <el-option label="楼号" value="1"></el-option>
                  <el-option label="单元" value="2"></el-option>
                  <el-option label="房间" value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="formEdit === false">
                <el-button type="primary" @click="create('list')">保存</el-button>
                <el-button @click="cancel('list')">取消</el-button>
              </el-form-item>
            </el-col>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <map-location ref="locationDialog" :zoom="18" @local="setLocation"></map-location>
  </div>
</template>
<script>
import UnitForm from "./form";
import { getObj, police } from "@/api/district/unit";
export default {
  components: { UnitForm },
  name: "unit",
  data() {
    return {
      list: {
        mlph: undefined,
        mlphhz: undefined,
        lph: undefined,
        lphhz: undefined,
        dyh: undefined,
        dyhhz: undefined,
        fjh: undefined,
        fjhhz: undefined,
        lng: undefined,
        lat: undefined,
        jwzrqName: undefined,
        jlxxqName: undefined,
        type: undefined,
        jlxxqCode: undefined,
        jwzrqCode: undefined
      },
      columns: [
        {
          label: "门楼牌号",
          prop: "label"
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
          width: "220px",
          align: "right"
        }
      ],
      labelPosition: "right",
      currentNode: {},
      formEdit: true,
      loading: false,
      listLoading: false,
      selectList: {
        xzqCode: undefined
      },
      options: [],
      total: 0,
      treeData: [],
      filterText: "",
      filter: {
        jlxxqCode: ""
      }
    };
  },
  created() {
    this.fetchTree();
    this.select();
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$store
        .dispatch("unit/query", this.filter)
        .then(payload => {
          this.loading = false;
          if (payload) {
            this.list = payload;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    fetchTree() {
      this.$store.dispatch("unit/tree").then(payload => {
        this.treeData = payload.data;
      });
    },
    fetchPolice(params) {
      this.$store.dispatch("unit/police", params).then(payload => {
        this.options = payload.data;
      });
    },
    handleNodeClick(data, node) {
      if (data.type === undefined) {
        this.formEdit = true;
        this.selectList.xzqCode = data.xzqCode;
        this.list = {
          mlph: undefined,
          mlphhz: undefined,
          lph: undefined,
          lphhz: undefined,
          dyh: undefined,
          dyhhz: undefined,
          fjh: undefined,
          fjhhz: undefined,
          lng: undefined,
          lat: undefined,
          jwzrqName: undefined,
          jlxxqName: data.label,
          type: "0",
          jlxxqCode: undefined,
          jwzrqCode: undefined,
          parentId: 0
        };
      } else {
        this.formEdit = true;
        this.listLoading = true;
        getObj(data.id).then(response => {
          this.list = response.data;
          this.listLoading = false;
          this.list.parentId = response.data.id;
          this.list.id = undefined;
        });
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleCreate(data) {
      // this.resetTemp();
      if (!data.type) {
        this.selectList.xzqCode = data.xzqCode;
        this.select();
        this.list = {
          mlph: undefined,
          mlphhz: undefined,
          lph: undefined,
          lphhz: undefined,
          dyh: undefined,
          dyhhz: undefined,
          fjh: undefined,
          fjhhz: undefined,
          lng: undefined,
          lat: undefined,
          jwzrqName: undefined,
          jlxxqName: data.label,
          type: "0",
          jlxxqCode: data.jlxxqCode,
          jwzrqCode: data.jwzrqCode,
          parentId: 0
        };
        this.formEdit = false;
      } else {
        // this.formEdit = true;
        this.listLoading = true;
        getObj(data.id).then(response => {
          this.list = response.data;
          this.listLoading = false;
          this.list.parentId = response.data.id;
          this.list.id = undefined;
        });

        this.formEdit = false;
      }
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("unit/remove", id).then(payload => {
          if (payload.status === 200) {
            this.fetchTree();
          } else {
            this.$message({
              type: "warning",
              message: payload.message
            });
          }
        });
      });
    },
    select() {
      police(this.selectList).then(response => {
        this.options = response.data.rows;
      });
    },
    create(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.list.type = (parseInt(this.list.type) + 1).toString();
          delete this.list.content;
          this.$store
            .dispatch("unit/create", this.list)
            .then(payload => {
              if (payload.status === 200) {
                this.cancel(form);
                this.fetchTree();
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
              } else {
                this.$message({
                  type: "warning",
                  message: payload.message
                });
              }
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.formEdit = true;
      const set = this.$refs;
      set[formName].resetFields();
      this.list = {
        mlph: undefined,
        mlphhz: undefined,
        lph: undefined,
        lphhz: undefined,
        dyh: undefined,
        dyhhz: undefined,
        fjh: undefined,
        fjhhz: undefined,
        lng: undefined,
        lat: undefined,
        jwzrqName: undefined,
        jlxxqName: undefined,
        type: undefined,
        jlxxqCode: undefined,
        jwzrqCode: undefined,
        parentId: 0
      };
    },
    showMapLocation() {
      this.$refs.locationDialog.open({
        lng: this.list.lng,
        lat: this.list.lat
      });
    },
    setLocation(location) {
      this.list = Object.assign({}, this.list, {
        lng: location.lng,
        lat: location.lat
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.max-h {
  height: 100%;
}
.fixed-table {
  height: 500px;
}
.tree-container {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  .el-button {
    padding: 0;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
