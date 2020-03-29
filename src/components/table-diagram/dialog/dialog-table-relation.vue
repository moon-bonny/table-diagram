<template>
  <!-- 表添加关系弹窗 -->
  <el-form class="dialog-table-relation" ref="form" :model="relations">
    <el-radio-group
      class="table-relation-type"
      v-model="currRelationType"
      :disabled="!isEditable"
      @change="onRelationTypeChange"
    >
      <el-radio-button label="inner join">内连接</el-radio-button>
      <el-radio-button label="left join">左连接</el-radio-button>
      <el-radio-button label="right join">右连接</el-radio-button>
    </el-radio-group>
    <div class="table-relation-item">
      <span class="table-name">{{
        relations.table1.code || relations.table1.name
      }}</span>
      <span class="table-name">{{
        relations.table2.code || relations.table2.name
      }}</span>
    </div>
    <el-form-item
      class="table-relation-item"
      :key="keysIndex"
      v-for="(keysItem, keysIndex) in relations.foreignKeys"
      :prop="`foreignKeys.${keysIndex}`"
      :rules="relationRule"
    >
      <el-select
        class="field-select"
        placeholder="请选择"
        v-model="keysItem.table1"
        value-key="column"
        :disabled="!isEditable"
        @change="onLeftFieldChange($event, keysIndex)"
      >
        <el-option
          v-for="item in relationLeftOpts"
          :key="item.code"
          :label="item.code"
          :value="item"
          :disabled="leftOptSelected.indexOf(item.column) > -1"
        >
        </el-option>
      </el-select>
      <span class="field-opt">=</span>
      <el-select
        class="field-select"
        placeholder="请选择"
        v-model="keysItem.table2"
        value-key="column"
        :disabled="!isEditable"
        @change="onRightFieldChange($event, keysIndex)"
      >
        <el-option
          v-for="item in relationRightOpts"
          :key="item.code"
          :label="item.code"
          :value="item"
          :disabled="rightOptSelected.indexOf(item.column) > -1"
        >
        </el-option>
      </el-select>
      <el-button
        class="remove-relation-btn"
        icon="el-icon-remove"
        type="text"
        size="mini"
        v-show="isEditable"
        @click="onRemoveRelation(keysIndex)"
      >
      </el-button>
    </el-form-item>
    <el-button
      class="add-relation-btn"
      type="text"
      icon="el-icon-circle-plus"
      v-show="isEditable"
      @click="onAddRelation()"
    >
      添加
    </el-button>

    <!-- er图 -->
    <template v-if="type === 'er'">
      <el-form-item label="业务规则">
        <el-input
          type="textarea"
          :rows="3"
          v-model="relations.businessRules"
          :disabled="!isEditable"
        ></el-input>
      </el-form-item>
    </template>
  </el-form>
</template>
<script>
let checkRelation

export default {
  data() {
    // 校验关系对象
    checkRelation = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('字段不能为空'))
      }

      let table1 = value.table1,
        table2 = value.table2
      if (!('column' in table1) || !('column' in table2)) {
        return callback(new Error('字段不能为空'))
      }

      // 兼容数据没有dataType属性的情况
      this.relationLeftOpts.forEach(leftOpt => {
        if (table1.code === leftOpt.code) {
          this.relationRightOpts.forEach(rightOpt => {
            if (table2.code === rightOpt.code) {
              if (leftOpt.dataType !== rightOpt.dataType) {
                return callback(new Error('字段类型不匹配'))
              }
              // leftOpt.dataType
            }
          })
        }
      })

      // if (table1.dataType !== table2.dataType) {
      //   return callback(new Error('字段类型不匹配'))
      // }
      callback()
    }

    return {
      currRelationType: '', //物理关系
      leftOptSelected: [],
      rightOptSelected: []
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    isEditable: Boolean, //是否可编辑
    //物理模型弹窗数据
    relationType: {
      //弹窗关联方式默认值, 'inner join' - 内连接, 'left join' - 左连接, 'right join' - 右连接
      type: String,
      default: 'inner join'
    },
    relations: {
      // 关联关系弹窗字段映射
      type: Object,
      default: () => {
        return {}
      }
    },
    relationLeftOpts: {
      //关系左节点选项
      type: Array,
      default: () => {
        return []
      }
    },
    relationRightOpts: {
      //关系右节点选项
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    // 监听物理关系图关系变化
    relationType: {
      handler: function() {
        this.currRelationType = this.relationType
      },
      immediate: true
    },
    // 监听关系字段变化
    relations: {
      handler(newVal, oldVal) {
        // 初始化
        !oldVal && (this.rightOptSelected = [])

        // 新值没有字段绑定或者不是第一次弹窗
        if (!newVal.foreignKeys.length || oldVal) {
          this.resetOptions()
        }

        if (!!oldVal) {
          this.rightOptSelected = []
          // !items.length && this.resetOptions()
          this.getSelectedOptions()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    /**
     * @func resetOptions
     * @desc 重置选项
     */
    resetOptions() {
      this.leftOptSelected = []
      this.rightOptSelected = []
    },

    /**
     * @func getSelectedOptions
     * @desc 获取选中的选项
     */
    getSelectedOptions() {
      this.relations.foreignKeys.forEach(item => {
        if (item.table1.column) {
          this.leftOptSelected.push(item.table1.column)
        }
        if (item.table2.column) {
          this.rightOptSelected.push(item.table2.column)
        }
      })
    },

    /**
     * @func onLeftFieldChange
     * @desc 左边字段change事件
     * @param {obj} newVal 字段对象新值
     * @param {int} keysIndex 关系数据索引
     */
    onLeftFieldChange(newVal, keysIndex) {
      this.leftOptSelected[keysIndex] = newVal.column
    },

    /**
     * @func onRightFieldChange
     * @desc 右边字段change事件
     * @param {obj} newVal 字段对象新值
     * @param {int} keysIndex 关系数据索引
     */
    onRightFieldChange(newVal, keysIndex) {
      this.rightOptSelected[keysIndex] = newVal.column
    },

    /**
     * @func onRemoveFieldRelation
     * @desc 点击关联弹窗移除按钮移除表字段关系
     * @params {int} keysIndex 关系键索引
     */
    onRemoveRelation(keysIndex) {
      this.relations.foreignKeys.splice(keysIndex, 1)
      this.leftOptSelected.splice(keysIndex, 1)
      this.rightOptSelected.splice(keysIndex, 1)
    },

    /**
     * @func onAddFieldRelation
     * @desc 点击关联弹窗添加按钮添加物理模型字段关系
     */
    onAddRelation() {
      this.relations.foreignKeys.push({
        table1: {},
        operator: '=',
        table2: {}
      })
    },

    /**
     * @func getRelationType
     * @desc 获取当前选择的关系类型
     */
    onRelationTypeChange() {
      this.$emit('relation-type-change', this.currRelationType)
    },

    /**
     * @func resetForm
     * @desc 移除校验结果
     */
    resetForm() {
      this.$refs['form'].clearValidate()
    },

    /**
     * @func checkForm
     * @desc 检测表单
     */
    async checkForm() {
      await this.$refs['form'].validate()
    }
  },
  created() {
    this.relationRule = {validator: checkRelation, trigger: 'blur'}
  }
}
</script>
<style lang="less">
.dialog-table-relation {
  padding: 0 45.5px;

  .table-relation-type {
    margin-top: -5px;
    margin-bottom: 30px;

    .el-radio-button__inner {
      width: 166px;
      height: 40px;
    }
  }

  .table-relation-item {
    margin-bottom: 14px;
    @itemWidth: 200px;

    .table-name {
      display: inline-block;
      width: @itemWidth;
      margin-right: 50px;
      text-align: center;
      color: #2d303b;
      font-size: 14px;
      line-height: 1;

      &:last-child {
        margin-right: 0;
      }
    }

    .field-select {
      width: @itemWidth;
    }

    .field-opt {
      margin: 0 20px;
      font-size: 14px;
      color: #2d303b;
    }
  }

  .remove-relation-btn {
    margin-left: 15px;
    color: #e24437;
    font-size: 14px;
  }

  .add-relation-btn {
    display: block;
    padding: 0;
    font-size: 16px;
    color: @primary-color;
  }

  .el-form-item {
    margin-top: 24px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .el-form-item__content {
    text-align: center;
  }

  .el-textarea {
    width: 430px;
  }
}
</style>
