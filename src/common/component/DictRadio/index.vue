<template>
  <div>
    <el-radio v-for="item in dictCodes" :key="item.dictKey" :value="value" @input="update" :label="item.dictKey">{{item.dictValue}}</el-radio>
  </div>
</template>
<script>
import { getTypeValue } from '@/api/dict/dictValue'

export default {
  components: {},
  model: {
    //      prop: 'modelVal',
    event: 'change'
  },
  props: {
    value: {
      type: [String, Number]
    },
    dictName: {
      required: true,
      type: String
    },
  },
  created() {
    this.getDictCodes()
  },
  data() {
    return {
      dictCodes: []
    }
  },
  methods: {
    getDictCodes() {
      getTypeValue(this.dictName).then(resp => {
        this.dictCodes = resp.data.rows
      })
    },
    update(val) {
      this.$emit('change', val)
    }
  }
}

</script>
<style lang="scss" scoped></style>
