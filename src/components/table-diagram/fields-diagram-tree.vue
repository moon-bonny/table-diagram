<template>
  <div
    class="fields-diagram-tree"
    :class="{wrap: diagramTree.length && diagramTree[0].level !== 1}"
  >
    <draggable
      class="box"
      :class="{grey: !isEditable || !item.canEdit}"
      :id="item.id"
      :group="{name: 'drag', pull: false}"
      :sort="false"
      @end="onNodeEnd($event, parentItem, item)"
      v-for="item in diagramTree"
      :key="item.id"
      :data-level="item.level"
      :data-path="item.path"
      :data-name="item.name"
      :data-code="item.code"
      :data-node-id="item.nodeId"
      :data-table-id="item.tableId"
      :data-can-add="item.canAdd ? '1' : '0'"
      :data-can-edit="item.canEdit ? '1' : '0'"
    >
      <div class="node-item-box" :class="{mr: item.level === 1}">
        <div
          class="node-item"
          :data-id="item.id"
          :data-level="item.level"
          :data-path="item.path"
          @click="onChooseNode"
        >
          <template v-if="item.level !== 1">
            <span class="opt" @click="onAddRelation(parentItem, item)">
              <icon-font icon="icon-huaban" :data-path="item.path"></icon-font>
            </span>
            <span class="opt remove" @click="onRemoveRelation" v-if="false">
              <icon-font icon="icon-jian" :data-path="item.path"></icon-font>
            </span>
          </template>

          <!-- <i class="el-icon-remove" :data-path="item.path"></i> -->
          <!-- <span class="dot" v-if="item.level === 1"></span> -->
          <!-- 表名 -->
          <div class="node-name-box">
            <p class="node-name-txt ellipsis">
              {{ (item.role && item.role.code) || item.code }}
            </p>
            <span class="node-name-right">
              <!-- 更多操作 -->
              <el-dropdown
                v-if="item.canEdit && isEditable"
                class="node-name-more"
                @command="onNodeMore($event, parentItem, item)"
              >
                <i class="el-icon-more"></i>
                <el-dropdown-menu slot="dropdown">
                  <!-- 根节点 -->
                  <template v-if="item.level === 1">
                    <!-- 自定义菜单 -->
                    <template v-if="rootDropdown">
                      <el-dropdown-item
                        v-for="item in rootDropdown"
                        :key="item.command"
                        :command="item.command"
                        >{{ item.label }}</el-dropdown-item
                      >
                    </template>
                    <!-- 默认菜单 -->
                    <el-dropdown-item v-else command="create"
                      >新建关联表</el-dropdown-item
                    >
                    <!-- 固定菜单 -->
                    <!-- <el-dropdown-item command="clear">清空关联</el-dropdown-item> -->
                    <el-dropdown-item command="delete">删除</el-dropdown-item>
                  </template>

                  <!-- 非根节点 -->
                  <template v-else>
                    <!-- 部分节点or所有节点自定义菜单 -->
                    <el-dropdown-item
                      v-for="dropdownItem in item.dropdown"
                      :key="dropdownItem.command"
                      :command="dropdownItem.command"
                      >{{ dropdownItem.label }}</el-dropdown-item
                    >
                    <!-- 固定菜单 -->
                    <el-dropdown-item
                      command="remove"
                      v-if="item.canEdit && !item.dropdown"
                      >移出窗口</el-dropdown-item
                    >
                    <!-- <el-dropdown-item command="cancel">取消关联</el-dropdown-item> -->
                  </template>
                </el-dropdown-menu>
              </el-dropdown>

              <!-- 展开收起 -->
              <span
                :class="['node-name-right-btn', {expand: item.expand}]"
                v-if="item.level !== 1 && item.hasChildren"
                @click="onToggleNode(parentItem, item)"
              >
                <icon-font icon="icon-left-square"></icon-font>
              </span>
            </span>
          </div>

          <!-- 字段列表 -->
          <div
            :class="['node-fields-box', {expand: item.fieldsExpand}]"
            v-if="item.columns"
          >
            <div class="node-fields-container">
              <div class="node-fields-list">
                <div
                  class="node-field-item"
                  v-for="columnItem in item.columns"
                  :key="columnItem.code"
                >
                  <icon-font
                    icon="icon-key--line"
                    v-if="columnItem.isPrimaryKey"
                  ></icon-font>
                  <span class="node-field ellipsis">{{ columnItem.code }}</span>
                  <span class="node-field right ellipsis">{{
                    columnItem.name
                  }}</span>
                </div>
              </div>
              <div
                class="node-fields-bottom-btn"
                v-if="item.columns.length > 3"
                @click="onToggleAllFields(item)"
              >
                <i class="el-icon-arrow-down"></i>
              </div>
            </div>
          </div>
        </div>
        <fields-diagram-tree
          v-if="item.children"
          :is-editable="isEditable"
          :diagram-tree="item.children"
          :parent-item="item"
          :group="{name: 'drag'}"
          @node-end="onNodeEnd"
          @add-relation="onAddRelation"
          @choose-node="onChooseNode"
          @node-more="onAfterNodeMore"
          @toggle-node="onAfterToggleNode"
        ></fields-diagram-tree>
      </div>
    </draggable>
  </div>
</template>
<script>
import Draggable from 'vuedraggable'

export default {
  name: 'FieldsDiagramTree',
  components: {
    Draggable
  },
  data() {
    return {}
  },
  props: {
    isEditable: {
      type: Boolean,
      default: true
    },
    parentItem: Object, //父节点数据
    diagramTree: Array,
    rootDropdown: Array, //根节点菜单数据
    // deleteNodeCallback: Function,
    removeRelationCallback: {
      type: Function,
      default: () => {
        return null
      }
    }
  },
  methods: {
    /**
     * @func onNodeEnd
     * @desc 拖动节点end事件
     * @param {obj} e 事件对象
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象
     */
    onNodeEnd(e, parentItem, item) {
      this.$emit('node-end', e, parentItem, item)
    },

    /**
     * @func onAddRelation
     * @desc 添加节点关联
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象
     */
    onAddRelation(parentItem, item) {
      this.$emit('add-relation', parentItem, item)
    },

    /**
     * @func onRemoveRelation
     * @desc 移除节点关联
     */
    onRemoveRelation() {
      let msgInfo = {
        title: '取消关联提示',
        msg: '取消关联，原关联设置清除，确定取消关联吗？',
        successMsg: '取消成功'
      }
      this.showMessageBox(msgInfo, this.removeRelationCallback)
      // this.onNodeMore('cancel')
    },

    /**
     * @func onChooseNode
     * @desc 选中节点回调
     * @param {obj} e 事件对象
     */
    onChooseNode(e) {
      this.$emit('choose-node', e)
    },

    /**
     * @func onToggleNode
     * @desc 展开收起节点
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象
     */
    onToggleNode(parentItem, item) {
      let id = item.id,
        expand = item.expand

      item.expand = !expand

      // 收起子节点并删除子节点
      if (!item.expand) {
        item.children = []
        return
      }

      this.$emit('toggle-node', parentItem, item)
    },

    /**
     * @func onAfterToggleNode
     * @desc 展开收起节点后
     * @param {boolean} currentNodeExpand 当前是展开还是收起状态
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象
     */
    onAfterToggleNode(parentItem, item) {
      this.$emit('toggle-node', parentItem, item)
    },

    /**
     * @func showMessageBox
     * @desc 显示弹窗信息
     * @param {obj} options 选项对象
     * @param {string} options.msg 弹窗信息
     * @param {string} [options.title] 可选参数,弹窗标题
     * @param {function} [successCallback] 点击确定按钮回调函数
     */
    showMessageBox(options, successCallback) {
      this.$confirm(options.msg, options.title || '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          typeof successCallback === 'function' && successCallback()
          this.$message({
            type: 'success',
            message: options.successMsg
          })
        })
        .catch(() => {
          /* options.cancelMsg && this.$message({
          type: 'info',
          message: options.cancelMsg
        })  */
        })
    },

    /**
     * @func onNodeMore
     * @desc 点击节点更多菜单
     * @param {string} command 菜单操作
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象回调函数
     */
    onNodeMore(command, parentItem, item) {
      let msgInfo = {}
      switch (command) {
        case 'create': //新建关联表
          this.$emit('create-table')
          break
        case 'clear': //清空关联
          msgInfo = {
            // title: '清空关联提示',
            msg: '清空关联后，该表的所有关联将清除，确定清空该表关联吗？',
            successMsg: '清空成功'
          }
          this.showMessageBox(msgInfo)
          break
        case 'remove': //移出窗口
          msgInfo = {
            title: '移出窗口提示',
            msg:
              '移出窗口后，该表不再在窗口展示，并且原关联关系随之清除，确定将该表移出窗口吗？',
            successMsg: '移出成功'
          }
          break
        case 'cancel': //取消关联
          msgInfo = {
            // title: '取消关联提示',
            msg: '取消关联，原关联设置清除，确定取消关联吗？',
            successMsg: '取消成功'
          }
          this.showMessageBox(msgInfo)
          break
      }

      if (command === 'delete' || command === 'remove') {
        let deleteNodeCallback = () => {
          this.onNodeEnd(command, parentItem, item)
        }

        // 移出窗口
        if (command === 'remove') {
          this.showMessageBox(msgInfo, deleteNodeCallback)
          return
        }

        // 删除表的弹窗在action里的deleteTable中写了
        this.onNodeEnd(command, parentItem, item)
      }

      // 自定义菜单命令事件
      this.$emit('node-more', command, parentItem, item)
    },

    /**
     * @func onAfterNodeMore
     * @desc 点击节点更多菜单
     * @param {string} command 菜单操作
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象回调函数
     */
    onAfterNodeMore(command, parentItem, item) {
      this.$emit('node-more', command, parentItem, item)
    },

    /**
     * @func onToggleAllFields
     * @desc 点击展示所有字段
     * @param {obj} item 节点对象信息调函数
     */
    onToggleAllFields(item) {
      if (!('fieldsExpand' in item)) {
        this.$set(item, 'fieldsExpand', true)
        return
      }

      let expand = item.fieldsExpand
      this.$set(item, 'fieldsExpand', !expand)
    }
  }
}
</script>
<style lang="less">
.fields-diagram-tree {
  @line-color-grey: #cad1e8;
  @line-top: 70px;

  .iconfont {
    font-size: 0;
  }

  .box {
    white-space: nowrap;
    font-size: 0;
  }

  .node-item-box {
    display: inline-block;

    &.mr {
      margin-right: 24px;
    }
  }

  .node-item {
    position: relative;
    display: inline-block;
    vertical-align: top;
    // border: 1px solid #cad1e8;
    margin-bottom: 14px;
    width: 200px;
    padding: 0;
    text-align: left;
    cursor: pointer;

    // 添加关联关系按钮
    .opt {
      position: absolute;
      z-index: 9;
      left: -56px;
      top: @line-top;
      transform: translate(0, -50%);
      width: 20px;
      height: 20px;
      line-height: 20px;
      // text-align: center;
      // border: 1px solid @primary-color;
      border-radius: 50%;
      color: #999;
      background: #fff;
      cursor: pointer;
      box-shadow: 0 0 4px @primary-color;
      @shadow-color: #ff4d4f;

      &.remove {
        left: -102px;
        box-shadow: 0 0 4px @shadow-color;
      }

      /* b {
        position: absolute;
        width: 100%;
        height: 26px;
        line-height: 26px;
        display: block;
        font-size: 14px;
        color: #6b9de3;
        font-weight: 700;
      } */

      .icon-jian {
        color: @shadow-color;
        font-size: 20px;
        // box-shadow: 0 0 4px @shadow-color;
        border-radius: 100%;
      }

      .icon-huaban {
        // position: absolute;
        // left: 1px;
        color: @primary-color;
        font-size: 22px;
        margin-left: -1px;
      }
    }

    .node-name-box {
      position: relative;
      // width: 100px;
      height: 34px;
      border: 1px solid #cad1e8;
      vertical-align: middle;
      padding: 0 12px;

      .node-name-txt {
        padding-right: 20px;
        line-height: 34px;
        font-size: 14px;
      }

      .node-name-right {
        position: absolute;
        top: 50%;
        right: 12px;
        transform: translate(0, -50%);
      }
      // 更多操作
      .node-name-more {
        vertical-align: middle;

        .el-icon-more {
          transform: rotate(90deg);
        }
      }
      // 展开收起
      .node-name-right-btn {
        position: relative;
        display: inline-block;
        width: 14px;
        height: 14px;
        text-align: center;
        vertical-align: middle;

        &.expand {
          transform: rotate(180deg);
        }

        i {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          vertical-align: middle;
          color: #2d303b;
          font-size: 16px;
          pointer-events: none;
        }
      }
    }

    // 字段
    .node-fields-box {
      position: relative;
      max-height: 104px;

      .node-fields-container {
        min-height: 104px;
        background: #fff;
        border-left: 1px solid #cad1e8;
        border-right: 1px solid #cad1e8;
        border-bottom: 1px solid #cad1e8;
        padding-top: 5px;
      }

      .node-field-item {
        position: relative;
        height: 26px;
        line-height: 26px;
        padding: 0 12px 0 27px;

        .icon-key--line {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translate(0, -50%);
          font-size: 10px;
          color: @primary-color;
        }

        .node-field {
          display: inline-block;
          width: 45%;
          color: #2d303b;
          font-size: 12px;

          &.right {
            float: right;
          }
        }
      }

      .node-fields-list {
        max-height: 78px;
        overflow: hidden;
      }

      .node-fields-bottom-btn {
        text-align: center;
        font-size: 14px;
      }

      // 展开
      &.expand {
        z-index: 99;

        .node-fields-list {
          overflow: auto;
          max-height: fit-content;
        }

        .node-fields-bottom-btn {
          i {
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  .wrap {
    display: inline-block;
    overflow: hidden;
    padding-bottom: 30px;

    .box {
      &:first-child > .node-item-box {
        margin-left: 115px;

        // 横线
        & > .node-item::before {
          content: '';
          position: absolute;
          left: -115px;
          top: @line-top;
          // transform: translate(0, -50%);
          width: 119px;
          border-top: 1px solid @primary-color;
        }

        // 竖线
        & > .node-item::after {
          position: absolute;
          z-index: 200;
          top: -21.5px;
          left: -92px;
          width: 1px;
          height: 91px;
          background: #fff;
          content: '';
        }
      }

      & + .box > .node-item-box {
        margin-left: 115px;

        // 横线
        & > .node-item {
          &::before {
            content: '';
            position: absolute;
            left: -91px;
            top: @line-top;
            // transform: translate(0, -50%);
            width: 92px;
            border-top: 1px solid @primary-color;
          }

          //竖线
          &::after {
            position: absolute;
            left: -92px;
            top: -10000px;
            bottom: 67px;
            border-left: 1px solid @primary-color;
            content: '';
          }
        }
      }

      // 灰线, 不可点击
      &.grey {
        &:first-child > .node-item-box {
          // 横线
          & > .node-item::before {
            border-color: @line-color-grey;
          }
        }

        & + .box > .node-item-box {
          & > .node-item {
            &::before,
            &::after {
              border-color: @line-color-grey;
            }
          }
        }

        &:first-child > .node-item-box > .node-item::after {
          border-color: @line-color-grey;
        }
      }
    }
  }
}
</style>
