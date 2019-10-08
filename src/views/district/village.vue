<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="tree-container">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <div class="labelList" v-for="(data,index) in treeData" :key="index">
            <span class="custom-tree-node">
              <el-tooltip :content="''+ data.parentFullName" placement="top">
                <span @click="handleNodeClick(data)">{{ data.lable }}</span>
              </el-tooltip>
              <span>
                <el-button type="text" size="mini" @click.stop="()=>createDialog(data)">
                  <svg-icon iconClass="add"></svg-icon>
                </el-button>
              </span>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="18">
        <div class="filter-bar">
          <el-form :inline="true" :model="filter" ref="filterForm" class="demo-form-inline">
            <el-form-item label="关键字">
              <div class="picture-btn-wrap">
                <picture-search ref="pictureSearch" size="mini" style="width: 200px;" placeholder="名称/编码" @change="onSearchChange"></picture-search>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" @click="onResetForm">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="default" @click="handleReset">清除</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 工具栏 -->
        <div class="common-tool">
          <div class="title">
            村/居委会
            <em>{{total?total:0}}</em>
          </div>
          <div class="re-right">
            <el-button class="txt-btn" size="mini" icon="el-icon-delete" type="text" @click="onItemDelete">删除</el-button>
          </div>
        </div>
        <el-table :data="list" v-loading="loading" height="calc(100vh - 335px)" style="width: 100%" @selection-change="onListChange">
          <el-table-column type="selection" width="50" />
          <el-table-column prop="code" label="代码" min-width="110px">
          </el-table-column>
          <el-table-column prop="name" label="名称" min-width="140px">
          </el-table-column>
          <el-table-column prop="type" label="类型" min-width="80px">
          </el-table-column>

          <el-table-column prop="flag" label="启用" min-width="80px">
          </el-table-column>
          <el-table-column prop="crtName" label="创建人" min-width="100px">
          </el-table-column>
          <el-table-column prop="crtTime" label="创建时间" min-width="150px">
          </el-table-column>
          <el-table-column prop="udpName" label="修改人" min-width="100px">
          </el-table-column>

          <el-table-column prop="updTime" label="修改时间" min-width="150px">
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150px">
            <template slot-scope="scope">
              <a href="javascript:;" class="table-editor" @click="handleDialog(scope.row)">编辑</a>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="filter.offset" :page-sizes="[10, 20, 30, 50]" :page-size="filter.limit" layout="total,sizes, prev, pager, next, jumper" :total="total" style="margin-top: 15px">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="居/村委会" :visible.sync="dialogFormVisible">
      <el-form :model="newForm" :rules="rules" ref="form" label-width="180px">
        <el-form-item label="上级" prop="xzjdName">
          <span v-text="newForm.xzjdName"></span>
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="newForm.code"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="newForm.name"></el-input>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="newForm.type">
                <el-option label="社区" value="1">
                </el-option>
                <el-option label="居委会" value="2">
                </el-option>
                <el-option label="村委会" value="3">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城乡分类" prop="grade">
              <el-select v-model="newForm.grade" placeholder="请选择">
                <el-option label="城镇" value="100">
                </el-option>
                <el-option label="城区" value="110">
                </el-option>
                <el-option label="主城区" value="111">
                </el-option>
                <el-option label="城乡结合" value="112">
                </el-option>
                <el-option label="镇区" value="120">
                </el-option>
                <el-option label="镇中心区" value="121">
                </el-option>
                <el-option label="镇乡结合区" value="122">
                </el-option>
                <el-option label="特殊区域" value="123">
                </el-option>
                <el-option label="乡村" value="200">
                </el-option>
                <el-option label="乡中心区" value="210">
                </el-option>
                <el-option label="村庄" value="220">
                </el-option>

              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="启用/禁用" prop="flag">
          <el-switch v-model="newForm.flag" active-color="#C9C9C9" inactive-color="#13ce66" active-text="禁用" inactive-text="启用" :active-value="'0'" :inactive-value="'1'" :disabled="!!newForm.id">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取 消</el-button>
        <el-button v-if="newForm.id" type="primary" @click="handleUpdate('form')">确 定</el-button>
        <el-button v-else type="primary" @click="handleCreate('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SvgIcon from "../../components/SvgIcon/index";
import { getObj, fetchList, delObj } from "@/api/district/village";

export default {
  components: { SvgIcon },
  name: "village",
  data() {
    return {
      currentNode: {},
      loading: false,
      listIds: [],
      list: [],
      total: 0,
      newForm: {
        code: "",
        name: "",
        alias: "",
        type: "",
        xzjdCode: "",
        xzjdName: "",
        flag: 0,
        grade: ""
      },
      rules: {
        xzjdCode: [
          {
            required: true,
            message: "请输入代码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "请输入代码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请输入类型 ",
            trigger: "blur"
          }
        ],
        parentCode: [
          {
            required: true,
            message: "请输入上级代码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符"
          }
        ],
        flag: [
          {
            required: true,
            message: "请输入1启用 0禁用"
          }
        ],
        grade: [
          {
            required: true,
            message: "请选择分类"
          }
        ]
      },
      dialogFormVisible: false,
      aiXzqManager_btn_edit: false,
      aiXzqManager_btn_del: false,
      aiXzqManager_btn_add: false,
      treeData: [],
      cachedTreeData: [],
      filterText: "",
      filter: {
        limit: 20,
        offset: 1,
        keyword: "",
        xzjdCode: ""
      }
    };
  },
  created() {
    this.fetchTree();
    this.fetchData();
  },
  computed: {
    ...mapGetters(["elements"])
  },
  watch: {
    filterText(val) {
      // this.$refs.tree.filter(val);
      this.filterList(val);
    }
  },
  methods: {
    fetchData() {
      this.loading = true;
      this.$store
        .dispatch("village/query", this.filter)
        .then(payload => {
          this.loading = false;
          if (payload.status === 200) {
            this.list = payload.data.rows;
            this.total = payload.data.total;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    // 关键字搜索框
    onSearchChange(val, img) {
      this.filter.keyword = val;
      this.filter.image = img;
    },
    // 重置按钮
    onResetForm() {
      // this.filter = {
      //   keyword: '',
      //   image: '',
      // };
      this.$refs.pictureSearch.reset();
    },
    // 更新列表选中
    onListChange(val) {
      this.listIds = val.map(item => item.id);
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
            this.onSearch();
          }
        });
      });
    },
    fetchTree() {
      fetchList().then(payload => {
        this.cachedTreeData = this.treeData = payload.data.rows;
      });
    },
    handleNodeClick(data) {
      this.filter.xzjdCode = data.code;
      this.fetchData();
    },
    filterList(keywords) {
      if (keywords) {
        let filteredList = [];
        for (let row of this.treeData) {
          if (row.lable.indexOf(keywords) !== -1) {
            filteredList.push(row);
          }
        }
        this.treeData = filteredList;
      } else {
        this.treeData = this.cachedTreeData;
      }
    },
    onSearch() {
      this.loading = true;
      this.$store
        .dispatch("village/query", { ...this.filter, offset: 1 })
        .then(payload => {
          this.loading = false;
          if (payload.status === 200) {
            this.list = payload.data.rows;
            this.total = payload.data.total;
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    handleReset() {
      this.$refs.filterForm.resetFields();
      this.filter = {
        ...this.filter,
        code: "",
        name: ""
      };
      this.fetchData();
    },
    handleDialog(data) {
      getObj(data.id).then(response => {
        this.newForm = response.data;
      });
      this.dialogFormVisible = true;
    },
    createDialog(data) {
      this.newForm = Object.assign({}, this.newForm, {
        xzjdCode: data.code,
        xzjdName: data.lable
      });
      this.dialogFormVisible = true;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("village/remove", id).then(payload => {
          if (payload.status === 200) {
            this.fetchData();
          } else {
            this.$message({
              type: "warning",
              message: payload.message
            });
          }
        });
      });
    },
    handleCreate(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("village/create", this.newForm)
            .then(payload => {
              if (payload.status === 200) {
                this.handleCancel(form);
                this.fetchData();
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
    handleCancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
      this.newForm = {
        code: "",
        name: "",
        alias: "",
        type: "",
        xzjdCode: "",
        xzjdName: "",
        flag: 0,
        grade: ""
      };
    },
    handleUpdate(form) {
      this.loading = true;
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("village/patch", this.newForm)
            .then(payload => {
              if (payload.status === 200) {
                this.loading = false;
                this.handleCancel(form);
                this.fetchData();
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
            .catch(err => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    handleCurrentChange(page) {
      this.filter.offset = page;
      this.fetchData();
    },
    handleSizeChange(size) {
      this.filter.limit = size;
      this.fetchData();
    },
    handleUpdateFlag(record) {
      let opt = record.flag === 1 ? "禁用" : "启用";
      let flag = record.flag === 1 ? 0 : 1;
      this.$confirm(`此操作将${opt}${record.name}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store
          .dispatch("village/updateFlag", { code: record.code, flag })
          .then(payload => {
            if (payload.status === 200) {
              this.$message({
                type: "success",
                message: "操作成功"
              });
              this.fetchData();
            } else {
              this.$message({
                type: "warning",
                message: payload.message
              });
            }
          });
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.fixed-table {
  height: 500px;
}

.tree-container {
  width: 100%;
  overflow-x: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .el-button {
    padding: 0;
  }
}

.dialog-footer {
  text-align: center;
}

.labelList {
  cursor: pointer;
}

.el-form-item {
  margin-bottom: 12px;
  margin-right: 3px;
}
</style>
