for (var a in nodes[b]['children']) {
  if (!nodes[b]['children'][a]['checked']) {
    twoNoArr.push(nodes[b]['children'][a]['id'])
    for (var c in nodes[b]['children'][a]['children']) {
      if (!nodes[b]['children'][a]['children'][c]['checked']) {
        noArr.push(nodes[b]['children'][a]['children'][c]['id'])
      }
    }
  } else {
    twoArr.push(nodes[b]['children'][a]['id'])
    for (var c in nodes[b]['children'][a]['children']) {
      if (!nodes[b]['children'][a]['children'][c]['checked']) {
        noArr.push(nodes[b]['children'][a]['children'][c]['id'])
      } else {
        thrArr.push(nodes[b]['children'][a]['children'][c]['id'])
      }
    }
  }
}
