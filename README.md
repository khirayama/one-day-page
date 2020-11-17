- なぜ1ラインテキストで表現せずにアイテム形式にしたの？
  - 並び替えの考え方として適切だと判断
- なぜ子要素をもつ形じゃなくてインデント方式にしたの？
  - 結果的にドキュメントという形をとるデータ形式だと判断
    - 「タスク」のようにドキュメントという形ではなく抽象化できたら違う判断だったかも
- なぜItemをclassにしてないの？
  - Itemを作ってしまうとyjsとの相性が悪いから
  - HTMLと違い、Itemが子要素を持つ構造じゃないためItemにtraverseさせることがない

- Document
  - factory
  - transform(doc)
  - traverse(doc)
- Item
- Selection
- action(doc, selection)

## TODO

- Item = Item = item
  - Y.Map Item = ItemData = itemData
    - Y.Map<Data> = ItemDataContent = itemDataContent
  - toJSON = ItemDataContent = itemDataContent
