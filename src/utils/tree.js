export function toTreeData(data, callback) {
// 属性配置设置
  const attr = {
    id: 'id',
    parentId: 'parentId',
    name: 'name',
    rootId: 0
  }
  function TreeData(data) {
    const tree = []
    const resData = data
    for (let i = 0; i < resData.length; i++) {
      if (+resData[i].parentId === +attr.rootId) {
        const obj = {
          id: +resData[i][attr.id],
          label: resData[i][attr.name],
          children: []
        }
        tree.push(obj)
        resData.splice(i, 1)
        i--
      }
    }
    var run = function(treeArrs) {
      if (resData.length > 0) {
        for (let i = 0; i < treeArrs.length; i++) {
          for (let j = 0; j < resData.length; j++) {
            if (+treeArrs[i].id === +resData[j][attr.parentId]) {
              const obj = {
                id: +resData[j][attr.id],
                label: resData[j][attr.name],
                children: []
              }
              treeArrs[i].children.push(obj)
              resData.splice(j, 1)
              j--
            }
          }
          run(treeArrs[i].children)
        }
      }
    }
    run(tree)
    return tree
  }
  return TreeData(data)
}

