<template>
  <!-- 弹窗 -->
  <el-dialog
    class="dialog-wrapper"
    :title="title"
    :visible.sync="visible"
    :before-close="onClose"
    width="629px"
  >
    <slot></slot>

    <!-- 弹窗按钮 -->
    <span slot="footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DialogWrapper',
  data() {
    return {}
  },
  props: {
    visible: Boolean,
    title: String //弹窗标题
  },
  methods: {
    /*
      @func onDialogClose
      @desc 关闭弹窗, 点击左上角关闭按钮, 点击取消按钮, 点击弹窗蒙层回调
    */
    onClose() {
      this.$emit('close')
    },

    /*
      @func onDialogConfirm
      @desc 点击弹窗确定按钮
    */
    onConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less">
// 弹窗
.dialog-wrapper {
  .el-dialog__header {
    padding: 14px 24px;
    border: 1px solid #eef0f7;
  }

  .el-dialog__title {
    font-size: 16px;
  }

  .el-dialog__body {
    font-size: 0;
    text-align: center;
  }

  .el-dialog__footer {
    text-align: center;
  }

  .dialog-input-name {
    margin-right: 8px;
    font-size: 14px;
  }

  .dialog-input {
    width: 180px;
    margin-right: 20px;
  }

  /*   .dialog-tips {
  color:#2D303B;
  font-size: 16px;
  .em{
    color: #E24156;
  }
} */

  .search-input {
    &.dialog {
      float: left;
      width: 194px;
      margin: -17px 0 15px;
    }
  }
}
</style>
