<template>
  <div>
    <el-row>
      <!-- 左侧列表 S -->
      <el-col :span="6" class="tree-container">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree ref="tree" :data="treeData" @node-click="handleNodeClick" :filter-node-method="filterNode" node-key="id" accordion :highlight-current="true" :expand-on-click-node="false" :default-expanded-keys="[1]">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button type="text" size="mini" @click="()=>handleDialog(data)">
                <svg-icon iconClass="add" v-show="data.type !=='3'"></svg-icon>
              </el-button>
              <el-button type="text" size="mini" style="margin-left: 0" @click="()=>handleDelete(data.id)">
                <svg-icon iconClass="delete" v-show="data.type !=='root'"></svg-icon>
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <!-- 左侧列表 E -->
      <!-- 右侧内容 S -->
      <el-col :span="10">
        <el-form :model="form" :rules="rules" ref="updateForm" label-width="180px" v-loading="loading">
          <el-form-item label="代码" prop="code">
            <span v-text="form.code"></span>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入行政区名称"></el-input>
          </el-form-item>
          <el-form-item label="别名" prop="alias">
            <el-input v-model="form.alias" placeholder="请输入行政区别名"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <!-- <dict-select ref="dictSelect" :value="form.type" dictName="region" placeholder="请选择"></dict-select> -->
            <el-select v-model="form.type" placeholder="请选择">
              <el-option label="省/自治区/直辖市" value="1">
              </el-option>
              <el-option label="地级市/自治州/盟" value="2">
              </el-option>
              <el-option label="区/县" value="3">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用 / 禁用" prop="flag">
            <el-switch v-model="form.flag" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleUpdate">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <!-- 右侧内容  -->
    </el-row>
    <el-dialog title="新增行政区" :visible.sync="dialogFormVisible">
      <el-form :model="newForm" :rules="rules" ref="form" label-width="180px">
        <el-form-item label="上级" prop="parentCode">
          <span v-text="currentNode.label"></span>
        </el-form-item>
        <el-form-item label="代码" prop="code">
          <el-input v-model="newForm.code" placeholder="请输入行政区代码"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="newForm.name" placeholder="请输入行政区名称"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="newForm.alias" placeholder="请输入行政区别名"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="newForm.type" placeholder="请选择" disabled>
            <el-option label="省/自治区/直辖市" value="1">
            </el-option>
            <el-option label="地级市/自治州/盟" value="2">
            </el-option>
            <el-option label="区/县" value="3">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用 / 禁用" prop="flag">
          <el-switch v-model="newForm.flag" :active-value="1" :inactive-value="0">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取 消</el-button>
        <el-button type="primary" @click="handleCreate('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SvgIcon from "../../components/SvgIcon/index";
import DictSelect from "@/common/component/DictSelect";
export default {
  name: "areas",
  data() {
    return {
      currentNode: {},
      loading: false,
      form: {
        code: "",
        name: "",
        alias: "",
        type: "",
        parentCode: "",
        flag: ""
      },
      newForm: {
        code: "",
        name: "",
        alias: "",
        type: "",
        parentCode: "",
        flag: 0
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入行政区代码",
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
            message: "请输入行政区名称",
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
            message: "请输入类型 1表示省份 2表示市或直辖市 3表示县或区",
            trigger: "blur"
          }
        ],
        parentCode: [
          {
            required: true,
            message: "请输入上级行政区代码",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur"
          }
        ],
        flag: [
          {
            required: true,
            message: "请输入1启用 0禁用",
            trigger: "blur"
          }
        ]
      },
      dialogFormVisible: false,
      aiXzqManager_btn_edit: false,
      aiXzqManager_btn_del: false,
      aiXzqManager_btn_add: false,
      treeData: [],
      filterText: ""
    };
  },
  created() {
    this.fetchTree();
    this.aiXzqManager_btn_edit = this.elements["aiXzqManager:btn_edit"];
    this.aiXzqManager_btn_del = this.elements["aiXzqManager:btn_del"];
    this.aiXzqManager_btn_add = this.elements["aiXzqManager:btn_add"];
  },
  computed: {
    ...mapGetters(["elements"])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    fetchTree() {
      this.$store.dispatch("district/tree").then(payload => {
        console.log(payload);
        this.treeData = [payload];
      });
    },
    handleNodeClick(data, node) {
      this.newForm = {
        ...this.newForm,
        type: data.type === "root" ? "1" : parseInt(data.type) + 1 + "",
        parentCode: data.code || "root"
      };
      this.currentNode = data;
      if (data.type === "root") {
        return false;
      }
      this.loading = true;
      this.$store
        .dispatch("district/detail", data.id)
        .then(payload => {
          this.loading = false;
          this.form = payload.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleDialog(data) {
      this.newForm = {
        ...this.newForm,
        type: data.type === "root" ? "1" : parseInt(data.type) + 1 + "",
        parentCode: data.code || "root"
      };
      this.currentNode = data;
      this.dialogFormVisible = true;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("district/remove", id).then(payload => {
          if (payload.status === 200) {
            this.fetchTree();
          }
        });
      });
    },
    handleCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("district/create", this.newForm)
            .then(payload => {
              if (payload.status === 200) {
                this.dialogFormVisible = false;
                this.fetchTree();
                this.$message({
                  message: "操作成功",
                  type: "success"
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
    },
    handleUpdate() {
      this.loading = true;
      this.$refs.updateForm.validate(valid => {
        if (valid) {
          this.$store
            .dispatch("district/patch", this.form)
            .then(payload => {
              this.loading = false;
              this.$message({
                message: "操作成功",
                type: "success"
              });
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  components: {
    SvgIcon,
    DictSelect
  }
};
</script>
<style lang="scss" scoped>
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
</style>
