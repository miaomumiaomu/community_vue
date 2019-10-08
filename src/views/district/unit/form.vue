<template>
  <div class="app-container calendar-list-container">
    <el-dialog title="门(楼)牌号" :visible.sync="dialogVisible">
      <el-form :model="item" :rules="rules" ref="form" label-width="180px">
        <div v-if="operate === 1 || operate === 11">
          <el-form-item label="街路巷(小区)" prop="jlxxqCode">
            <span v-text="item.jlxxqName"></span>
          </el-form-item>
          <el-form-item label="门(楼)牌号" prop="mlph">
            <el-input v-model="item.mlph" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="门(楼)牌号后缀" prop="mlphhz">
            <el-input v-model="item.mlphhz"></el-input>
          </el-form-item>
        </div>
        <div v-else-if="operate == 2 || operate == 22">
          <el-form-item label="门(楼)牌号" prop="jlxxqCode">
            <span v-text="item.jlxxqName+item.mlph+item.mlphhz"></span>
          </el-form-item>
          <el-form-item label="楼牌号" prop="lph">
            <el-input v-model="item.lph" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="楼牌号后缀" prop="lphhz">
            <el-input v-model="item.lphhz"></el-input>
          </el-form-item>
        </div>
        <div v-else-if="operate == 3 || operate == 33">
          <el-form-item label="门(楼)牌号" prop="jlxxqCode">
            <span v-text="item.jlxxqName+item.mlph+item.mlphhz+item.lph+item.lphhz"></span>
          </el-form-item>
          <el-form-item label="单元号" prop="dyh">
            <el-input v-model="item.dyh" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="单元号后缀" prop="dyhhz">
            <el-input v-model="item.dyhhz"></el-input>
          </el-form-item>
        </div>
        <div v-else-if="operate == 4 || operate == 44">
          <el-form-item label="门(楼)牌号" prop="jlxxqCode">
            <span v-text="item.jlxxqName+item.mlph+item.mlphhz+item.lph+item.lphhz+item.dyh+item.dyhhz"></span>
          </el-form-item>
          <el-form-item label="房间号" prop="fjh">
            <el-input v-model="item.fjh" class="input-with-select">
            </el-input>
          </el-form-item>
          <el-form-item label="房间号后缀" prop="fjhhz">
            <el-input v-model="item.fjhhz"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="警务责任区" prop="jwzrqCode">
          <el-select placeholder="请选择" @change="handleChange" v-model="item.jwzrqCode">
            <el-option v-for="item in options" :key="item.jwzrqCode" :label="item.jwzrqName" :value="item.jwzrqCode.toString()">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="item.lng" @focus="showMapLocation"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="item.lat" @click="showMapLocation"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('form')">取 消</el-button>
        <el-button v-if="item.id" type="primary" @click="handleUpdate('form')">确 定</el-button>
        <el-button v-else type="primary" @click="handleCreate('form')">确 定</el-button>
      </div>
      <map-location ref="locationDialog" :zoom="18" @local="setLocation"></map-location>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SvgIcon from "../../../components/SvgIcon/index";

export default {
  components: { SvgIcon },
  name: "unit-form",
  data() {
    return {
      props: {
        isFold: true
      },
      loading: false,
      total: 0,
      item: {
        parentId: 0,
        jlxxqCode: "",
        jlxxqName: "",
        jwzrqCode: "",
        jwzrqName: "",
        mlph: "",
        mlphhz: "",
        lph: "",
        lphhz: "",
        dyh: "",
        dyhhz: "",
        fjh: "",
        fjhhz: "",
        lng: "",
        lat: "",
        type: 1
      },
      rules: {
        jlxxqCode: [
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
        mlph: [
          {
            required: true,
            message: "请输入门楼牌号",
            trigger: "blur"
          }
        ],
        mlphhz: [
          {
            required: true,
            message: "请输入门(楼)牌号后缀",
            trigger: "blur"
          }
        ],
        lph: [
          {
            required: true,
            message: "请输入楼牌号",
            trigger: "blur"
          }
        ],
        lphhz: [
          {
            required: true,
            message: "请输入楼牌号后缀",
            trigger: "blur"
          }
        ],
        dyh: [
          {
            required: true,
            message: "请输入单元号",
            trigger: "blur"
          }
        ],
        dyhhz: [
          {
            required: true,
            message: "请输入单元号后缀",
            trigger: "blur"
          }
        ],
        fjh: [
          {
            required: true,
            message: "请输入房间号",
            trigger: "blur"
          }
        ],
        fjhhz: [
          {
            required: true,
            message: "请输入房间号后缀",
            trigger: "blur"
          }
        ],
        lng: [
          {
            required: false,
            message: "请输入经度 ",
            trigger: "blur"
          }
        ],
        lat: [
          {
            required: false,
            message: "请输入纬度",
            trigger: "blur"
          }
        ],
        jwzrqCode: [
          {
            required: true,
            message: "请选择警务责任区",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false,
      options: [],
      operate: 1, // 操作类型，1-门楼牌号新增，11-门楼牌号编辑，2-楼牌号新增，22-楼牌号编辑，3-单元号新增，33-单元号编辑，4-房间新增，44-房间编辑
      location: { lng: 0, lat: 0 }
    };
  },
  created() {},
  computed: {
    ...mapGetters(["elements"])
  },
  methods: {
    open(data, operate) {
      // 编辑
      if (data.id) {
        this.fetchDetail(data.id);
      } else {
        // 新增
        this.item.jlxxqCode = data.code.toString();
        this.item.jlxxqName = data.label;
        this.item.type = "1";
        this.fetchPolice({ jlxxqCode: data.code });
      }
      this.operate = operate;
      this.dialogVisible = true;
    },
    close() {
      this.dialogVisible = false;
    },
    fetchPolice(params) {
      this.$store.dispatch("unit/police", params).then(payload => {
        this.options = payload.data;
      });
    },
    fetchDetail(id) {
      this.$store.dispatch("unit/detail", id).then(payload => {
        const data = payload.data;
        switch (this.operate) {
          case 11: //编辑
          case 22:
          case 33:
          case 44:
            this.item = data;
            break;
          case 2: // 新增
          case 3:
          case 4:
            this.item = {
              ...data,
              parentId: data.id,
              type: this.operate.toString()
            };
            delete this.item.id;
        }
      });
    },
    handleChange(value) {
      const item = this.options.filter(i => i.jwzrqCode === value);
      this.item.jwzrqCode = value.toString();
      this.item.jwzrqName = item.jwzrqName;
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("unit/remove", id).then(payload => {
          this.props.isFold = false;
          this.$emit("afterSave", true);
        });
      });
    },
    handleCreate(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("unit/create", this.item)
            .then(resp => {
              this.handleCancel(form);
              this.props.isFold = false;
              this.$emit("afterSave", true);
              this.$message({
                message: "操作成功",
                type: "success"
              });
            })
            .catch(err => {});
        } else {
          return false;
        }
      });
    },
    handleCancel(formName) {
      this.dialogVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
      this.item = {
        parentId: 0,
        jlxxqCode: "",
        jlxxqName: "",
        jwzrqCode: "",
        jwzrqName: "",
        mlph: "",
        mlphhz: "",
        lng: "",
        lat: ""
      };
      this.close();
    },
    handleUpdate(form) {
      this.loading = true;
      this.$refs[form].validate(valid => {
        if (valid) {
          this.$store
            .dispatch("unit/patch", this.item)
            .then(payload => {
              this.loading = false;
              this.handleCancel(form);
              this.$emit("afterSave", true);
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
    },
    showMapLocation() {
      Object.assign(this.location, { lng: this.item.lng, lat: this.item.lat });
      this.$refs.locationDialog.open(this.location);
    },
    setLocation(location) {
      this.item = Object.assign({}, this.item, {
        lng: location.lng,
        lat: location.lat
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
}

.dialog-footer {
  text-align: center;
}
</style>
