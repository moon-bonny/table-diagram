<template>
  <div class="diagram-wrapper">
    <!-- 弹窗 -->
    <dialog-wrapper
      :title="dialogTitle"
      :visible="dialogVisible"
      @close="onDialogClose"
      @confirm="onDialogConfirm"
    >
      <!-- 表关系弹窗 -->
      <dialog-table-relation
        v-if="dialogTitle === '关联'"
        ref="dialogRelation"
        :type="type"
        :is-editable="isDialogEditRelations"
        :relation-type="tableRelation.type"
        :relation-left-opts="tableRelation.leftOpts"
        :relation-right-opts="tableRelation.rightOpts"
        :relations="tableRelations"
        @relation-type-change="onTableRelationTypeChange"
      ></dialog-table-relation>
      <!-- 新建关联表 -->
      <dialog-create-table
        v-else-if="dialogTitle === '新建表'"
        ref="dialogCreateTable"
      >
      </dialog-create-table>
    </dialog-wrapper>
    <!-- 表关系图 -->
    <draggable
      id="diagramDraggable"
      class="diagram"
      :group="{name: 'diagram-drag', put: isDiagramDraggablePut}"
      :sort="false"
    >
      <!-- 只有表名的图 -->
      <diagram-tree
        v-if="type === 'simple'"
        :is-editable="isEditable"
        :diagram-tree="diagramList"
        @node-end="onNodeEnd"
        @add-relation="onAddRelation"
        @choose-node="onChooseNode"
      >
      </diagram-tree>
      <!-- 默认 -->
      <fields-diagram-tree
        v-else
        :is-editable="isEditable"
        :diagram-tree="diagramList"
        :root-dropdown="rootDropdown"
        @node-end="onNodeEnd"
        @add-relation="onAddRelation"
        @choose-node="onChooseNode"
        @create-table="onCreateTable"
        @toggle-node="onToggleNode"
        @node-more="onNodeMore"
      >
      </fields-diagram-tree>
    </draggable>
  </div>
</template>
<script>
// 拖拽组件
import Draggable from 'vuedraggable'

// 弹窗组件
import DialogWrapper from '@/components/dialog-wrapper'
import DialogTableRelation from './dialog/dialog-table-relation'
import DiagramTree from './diagram-tree'
import fieldsDiagramTree from './fields-diagram-tree'
import {deepClone} from '@/utils/utils'

export default {
  name: 'DraggableDiagram',
  components: {
    Draggable,
    DiagramTree,
    fieldsDiagramTree,
    DialogWrapper,
    DialogTableRelation
  },
  data() {
    return {
      dialogVisible: false,
      dialogTitle: '',
      isDialogEditRelations: true
      // isDiagramDraggablePut: false
    }
  },
  props: {
    type: {
      type: String,
      default: ''
    },

    // 弹窗
    tableRelation: Object,
    tableRelations: Object, //表关联关系弹窗字段映射

    // 图表数据
    isEditable: {
      //是否可编辑图表
      type: Boolean,
      default: true
    },
    nodeId: {
      //节点id
      type: Number,
      default: 0
    },
    diagramList: {
      //生成关系图数据
      type: Array,
      default: () => {
        return []
      }
    },
    // 自定义菜单，对象属性：label - 菜单标签，command - 菜单指令
    rootDropdown: Array, //根节点菜单数据
    // beforeAddNode: Function, //可选, 添加节点前回调
    beforeDeleteNode: Function //可选, 删除节点前回调
  },
  computed: {
    isDiagramDraggablePut() {
      return !this.diagramList.length
    }
  },
  methods: {
    /**
     * @func showDialog
     * @desc 显示弹窗
     * @params {string} title 弹窗标题
     */
    showDialog(title, options = {}) {
      this.dialogTitle = title
      this.dialogVisible = true

      let dialogRef = {}
      switch (title) {
        case '关联':
          dialogRef = this.$refs.dialogRelation
          this.isDialogEditRelations =
            'isDialogEdit' in options ? options.isDialogEdit : true
          break
        case '新建表':
          dialogRef = this.$refs.dialogCreateTable
          break
      }
      dialogRef && dialogRef.resetForm()
    },

    /**
     * @func hideDialog
     * @desc 隐藏弹窗
     */
    hideDialog() {
      this.dialogVisible = false
    },

    /**
     * @func onDialogClose
     * @desc 关闭弹窗, 点击左上角关闭按钮, 点击取消按钮, 点击弹窗蒙层回调
     */
    onDialogClose() {
      this.$emit('dialog-close')
      this.hideDialog()
    },

    /**
     * @func onDialogConfirm
     * @desc 点击弹窗确定按钮
     */
    async onDialogConfirm() {
      switch (this.dialogTitle) {
        case '关联':
          // 弹窗可编辑时需要校验表单
          this.isDialogEditRelations &&
            (await this.$refs.dialogRelation.checkForm())
          break
        case '新建表':
          await this.$refs.dialogCreateTable.checkForm()
          break
      }

      let options = {
        isDialogEdit: this.isDialogEditRelations
      }
      this.$emit('dialog-confirm', this.dialogTitle, options)
      this.hideDialog()
    },

    /**
     * @func onTableRelationTypeChange
     * @desc 获取当前选择的关系类型
     * @param {string} currTableRelationType 当前选择表关系类型
     */
    onTableRelationTypeChange(currTableRelationType) {
      this.$emit('table-relation-type-change', currTableRelationType)
    },

    /**
     * @func findNode
     * @desc 寻找节点数据
     * @param {obj|string} options 选项, 若为字符串类型, 默认为节点路径
     * @param {string} [options.type] 可选, 类型, 'parent' - 寻找父节点
     * @param {array|string} options.path 节点路径
     */
    findNode(options) {
      let arr = this.diagramList,
        path = typeof options === 'string' ? options.split(',') : options,
        loopNum = options.type === 'parent' ? path.length - 1 : path.length //循环次数
      for (let i = 0; i < loopNum; i++) {
        arr = i === 0 ? arr[+path[i]] : arr.children[+path[i]]
      }
      return arr
    },

    /**
     * @func setNodesPath
     * @desc 设置节点路径
     * @param {obj} options 选项
     * @param {string} options.handle 操作, 'delete' - 删除, 'update' - 更改父节点
     * @param {obj} options.parentNode 父节点对象
     * @param {int} options.parentNodeLevel 父节点层级
     * @param {int} [options.startIndex] 可选, 修改的节点起始索引, 删除操作才有此选项设置
     * @param {obj} [options.targetNode] 可选, 目标节点, 更改父节点操作才有此选项设置
     * @param {string} [options.type] 可选, 类型, 'child' - 子节点, 更改父节点操作才有此选项设置
     * @param {string} [options.handleType] 可选, 类型, 'disabledAddRelation' - 不能添加表关系, 更改父节点操作才有此选项设置
     */
    setNodesPath(options) {
      switch (options.handle) {
        case 'delete': //删除节点
          let childrenNodes = options.parentNode.children
          if (!childrenNodes || !childrenNodes.length) {
            return
          }

          // 修改当前节点后的所有兄弟节点及其子节点的路径
          for (let i = options.startIndex || 0; i < childrenNodes.length; i++) {
            let node = childrenNodes[i],
              path = node.path
            path[options.parentNodeLevel]--
            node.path = [...path]

            if (node.children.length) {
              this.setNodesPath({
                handle: 'delete',
                parentNode: node,
                parentNodeLevel: options.parentNodeLevel
              })
            }
          }
          break
        case 'update': //更改节点父节点
          let targetNode = options.targetNode,
            parentNode = options.parentNode,
            parentNodeLevel = options.parentNodeLevel

          // 修改节点路径
          if (options.type === 'child') {
            //当前选中的节点的子节点
            this.id++
            options.isTree && (targetNode.id = this.id)
            targetNode.level = parentNodeLevel + 1
            targetNode.path = parentNode.path.concat(
              targetNode.path[targetNode.path.length - 1]
            )
          } else {
            // 根节点
            options.isTree && (targetNode.id = this.id = this.nodeId)
            //当前选中的节点
            targetNode.level = parentNode.level + 1
            targetNode.path = parentNode.path.concat(parentNode.children.length)
          }

          // 展开子节点时
          this.$emit('after-add-node', null, null, this.id)

          // 如果当前节点有子节点
          for (let i = 0; i < targetNode.children.length; i++) {
            let node = targetNode.children[i],
              _options = {
                type: 'child',
                targetNode: node,
                parentNode: targetNode,
                parentNodeLevel: targetNode.level
              }
            Object.assign(options, _options)
            this.setNodesPath(options)
          }
          break
      }
    },

    /**
     * @func addNode
     * @desc 添加节点
     * @param {obj} e 事件对象
     * @param {string} nodeData 节点名字或者是节点对象信息
     */
    addNode(e, nodeData) {
      this.$nextTick(() => {
        //关系图不可编辑, 不可添加节点
        if (!this.isEditable) return

        // 判断传入节点信息是节点名字or节点对象
        let isTree = 'children' in nodeData,
          node = isTree
            ? nodeData
            : {
                ...nodeData,
                id: this.nodeId
              }

        // 添加第一个节点
        if (!this.diagramList.length) {
          Object.assign(node, {
            level: 1,
            // sort: 0,
            path: ['0'],
            children: []
          })
          this.diagramList.push(node)
          return
        }

        let parentNode
        if (!e) {
          // 点击新建添加
          parentNode = this.diagramList[0]
          if (node.level === 1) {
            this.setNodesPath({
              handle: 'update',
              targetNode: node,
              parentNode: parentNode,
              parentNodeLevel: parentNode.level,
              isTree
            })
          }
          parentNode.children.push(node)
        } else {
          // 拖拽添加
          // 添加第n个节点
          let elToData = e.to.dataset,
            level = +elToData.level
          if (!level) return //未识别到元素

          // sort = +elToData.sort,
          let path = deepClone(elToData.path)
          parentNode = this.findNode(path)
          let parentChildren = parentNode.children

          parentNode = this.findNode(path)
          // sort = parentChildren.length
          typeof path === 'string' && (path = path.split(','))

          path.push(parentChildren.length + '')
          if (!isTree) {
            Object.assign(node, {
              level: ++level,
              // sort: sort,
              path: path,
              children: []
            })
          } else {
            // 更换父节点, 遍历nodeData, 设置leve和path
            this.setNodesPath({
              handle: 'update',
              targetNode: node,
              parentNode: parentNode,
              parentNodeLevel: level,
              isTree
            })
          }
          parentChildren.push(node)
        }

        this.$emit('after-add-node', parentNode, node, this.id)
      })
    },

    /**
     * @func isDiagramDraggablePut
     * @desc 设置目的拖拽区域是否允许put
     */
    // isDiagramDraggablePut() {
    //   return this.diagramList.length ? false : true
    // },

    /**
     * @func onNodeEnd
     * @desc 拖拽节点end事件
     * @param {obj} e 事件对象
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 当前节点对象
     */
    async onNodeEnd(e, parentItem, item) {
      //关系图不可编辑, 不可删除节点
      if (!this.isEditable) return

      // 当前拖拽节点不允许被删除
      // if (item.canDelete === 0) return

      let toElConId = ''
      if (typeof e === 'object') {
        let toEl = e.originalEvent.toElement
        toElConId =
          toEl.id ||
          toEl.parentElement.id ||
          toEl.parentElement.parentElement.id
      }

      //删除节点
      if (
        toElConId.indexOf('originDraggable') > -1 ||
        e === 'delete' ||
        e === 'remove'
      ) {
        // 删除节点前
        if (typeof this.beforeDeleteNode === 'function') {
          try {
            const isDeleteNode = await this.beforeDeleteNode(e)
            if (!isDeleteNode) {
              return
            }
          } catch (e) {
            return
          }
        }

        // 移除窗口or拖动删除节点, 删除表和根节点除外
        if (e !== 'delete' && item.canDelete !== 0) {
          let itemPath = item.path,
            //拖动节点在父节点的子节点数组的索引
            itemIndex = +itemPath[itemPath.length - 1]

          !parentItem && (parentItem = this.diagramList)
          parentItem.level
            ? parentItem.children.splice(itemIndex, 1)
            : parentItem.splice(itemIndex, 1)

          if (item.level !== 1) {
            //修改兄弟节点的path
            this.setNodesPath({
              handle: 'delete',
              parentNode: parentItem,
              parentNodeLevel: parentItem.level,
              startIndex: itemIndex
            })
          }
        }

        this.$emit('delete-node', item, e)
        return
      }

      // 修改父节点
      let toElData = e.originalEvent.toElement.dataset,
        toElId = toElData.id,
        toElLevel = toElData.level,
        fromElData = e.from.dataset,
        fromElLevel = item.level
      // 拖动到别的别的节点
      if (toElId && toElLevel !== '1' && fromElLevel !== '1') {
        let toElPath = toElData.path,
          fromElPath = item.path,
          toNode = this.findNode(toElPath)
        // 修改节点及其子节点path
        this.setNodesPath({
          handle: 'update',
          targetNode: item,
          parentNode: toNode,
          parentNodeLevel: toNode.level
        })

        toNode.children.push(item)
        // 旧父节点删除拖动节点
        let fromNodeIndex = fromElPath[fromElPath.length - 1] //拖动节点在父节点的子节点数组的索引

        !parentItem && (parentItem = this.diagramList)
        parentItem.level
          ? parentItem.children.splice(fromNodeIndex, 1)
          : parentItem.splice(fromNodeIndex, 1)

        //修改兄弟节点及其子节点的path
        this.setNodesPath({
          handle: 'delete',
          parentNode: parentItem,
          parentNodeLevel: parentItem.level,
          startIndex: fromNodeIndex
        })
      }
    },

    /**
     * @func onAddRelation
     * @desc 点击添加关联
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 当前节点对象
     */
    onAddRelation(parentItem, item) {
      //拖动节点的子节点关联关系or不可编辑则不弹窗
      // if (!item.canEdit || !this.isEditable) return
      this.isDialogEditRelations = item.canEdit && this.isEditable

      let options = {
        isDialogEdit: this.isDialogEditRelations
      }
      this.$emit('add-relation', parentItem, item, options)
      this.showDialog('关联', options)
    },

    /**
     * @func onChooseNode
     * @desc 选择节点触发
     * @param {obj} e 事件对象
     */
    onChooseNode(e) {
      this.$emit('choose-node', e)
    },

    /**
     * @func onCreateTable
     * @desc 点击节点新建表按钮
     */
    onCreateTable() {
      this.$emit('create-table')
    },

    /**
     * @func onToggleNode
     * @desc 展开收起节点
     * @param {boolean} currentNodeExpand 当前是展开还是收起状态
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象
     */
    onToggleNode(parentItem, item) {
      this.$emit('toggle-node', parentItem, item)
    },

    /**
     * @func onNodeMore
     * @desc 点击节点更多菜单
     * @param {string} command 菜单操作
     * @param {obj} parentItem 父节点对象
     * @param {obj} item 节点对象回调函数
     */
    onNodeMore(command, parentItem, item) {
      this.$emit('node-more', command, parentItem, item)
    }
  }
}
</script>
<style lang="less">
// 拖拽目标
.diagram-wrapper {
  flex: 0 1 100%;
  height: 100%;
  overflow: auto;
  @border-color: #e4e8f3;

  .diagram {
    height: 100%;
    padding: 24px;
  }
}
</style>
