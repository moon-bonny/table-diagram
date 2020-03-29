<template>
  <div
    class="diagram-tree"
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
      :data-node-id="item.nodeId"
      :data-table-id="item.tableId"
      :data-table-type="item.tableType"
      :data-can-add="item.canAdd ? '1' : '0'"
    >
      <div class="node-item-box" :class="{mr: item.level === 1}">
        <div
          class="node-item"
          :data-id="item.id"
          :data-level="item.level"
          :data-path="item.path"
          @click="onChooseNode"
        >
          <span
            class="opt"
            v-if="item.level !== 1"
            @click="onAddRelation(parentItem, item)"
          >
            <i class="el-icon-plus" :data-path="item.path"></i>
          </span>
          <span class="dot" v-if="item.level === 1"></span>
          <div class="node-txt">{{ item.name }}</div>
        </div>
        <diagram-tree
          v-if="item.children"
          :is-editable="isEditable"
          :diagram-tree="item.children"
          :parent-item="item"
          :group="{name: 'drag'}"
          @node-end="onNodeEnd"
          @add-relation="onAddRelation"
          @choose-node="onChooseNode"
        ></diagram-tree>
      </div>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'DiagramTree',
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
    diagramTree: Array
  },
  methods: {
    /**
     * @func onNodeEnd
     * @desc 拖动节点end事件
     * @param {obj} e 事件对象
     */
    onNodeEnd(e, parentItem, item) {
      console.log('end start')
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
     * @func onChooseNode
     * @desc 选中节点回调
     * @param {obj} e 事件对象
     */
    onChooseNode(e) {
      this.$emit('choose-node', e)
    }
  }
}
</script>
<style lang="less">
.diagram-tree {
  @line-color-grey: #cad1e8;

  .box {
    white-space: nowrap;
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
    border: 1px solid #cad1e8;
    margin-bottom: 14px;
    text-align: center;
    min-width: 200px;
    padding: 0 20px;
    cursor: pointer;

    .opt {
      position: absolute;
      z-index: 9;
      left: -56px;
      top: 50%;
      width: 26px;
      height: 26px;
      line-height: 26px;
      margin-top: -13px;
      text-align: center;
      border: 1px solid #ddd;
      border-radius: 50%;
      color: #999;
      background: #fff;
      cursor: pointer;

      b {
        position: absolute;
        width: 100%;
        height: 26px;
        line-height: 26px;
        display: block;
        font-size: 14px;
        color: #6b9de3;
        font-weight: 700;
      }

      i {
        position: absolute;
        // left: 1px;
        width: 100%;
        height: 26px;
        // display: none;
        display: block;
        line-height: 26px;
        // text-align:center;
        // vertical-align: middle;
        margin-bottom: 2px;
        font-size: 12px;
      }
    }

    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      margin-right: 6px;
      vertical-align: middle;
      background: @primary-color;
      border-radius: 100%;
    }

    .node-txt {
      position: relative;
      display: inline-block;
      // width: 100px;
      height: 34px;
      vertical-align: middle;
      // padding: 0 20px;
      line-height: 34px;
      font-size: 14px;
      pointer-events: none;
    }
  }

  .wrap {
    display: inline-block;
    overflow: hidden;

    .box {
      &:first-child > .node-item-box {
        margin-left: 115px;

        // 横线
        & > .node-item::before {
          content: '';
          position: absolute;
          left: -116px;
          top: 50%;
          transform: translate(0, -50%);
          width: 115px;
          border-top: 1px solid @primary-color;
        }
      }

      & + .box > .node-item-box {
        margin-left: 115px;

        & > .node-item {
          &::before {
            content: '';
            position: absolute;
            left: -91px;
            top: 50%;
            transform: translate(0, -50%);
            width: 90px;
            border-top: 1px solid @primary-color;
          }

          &::after {
            position: absolute;
            left: -92px;
            top: -10000px;
            bottom: 17px;
            border-left: 1px solid @primary-color;
            content: '';
          }
        }
      }

      //竖线
      // & + .box > .node-item-box > .node-item::after {
      //   position: absolute;
      //   left: -92px;
      //   top: -10000px;
      //   bottom: 17px;
      //   border-left: 1px solid @primary-color;
      //   content: '';
      // }

      &:first-child > .node-item-box > .node-item::after {
        position: absolute;
        z-index: 200;
        top: -25.5px;
        left: -92px;
        width: 1px;
        height: 41px;
        background: #fff;
        content: '';
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
