# Cosense MCP Server

Cosenseのためのメッセージ制御プロトコル（MCP）サーバーです。

## 書き込み機能

Cosenseページに対する書き込み機能として、以下の3つのモードを提供しています：

### 1. ページ末尾への追加（append_lines）

指定したテキストをページの末尾に追加します。

```typescript
await appendLinesTool.execute(
  {
    pageTitle: "ページタイトル",
    text: "追加するテキスト\n複数行も可能"
  },
  {
    projectName: "プロジェクト名",
    cosenseOptions: { sid: "セッションID" }
  }
);
```

### 2. 特定の行の前への挿入（insert_before_lines）

指定した行の直前にテキストを挿入します。対象の行が見つからない場合は、ページ末尾に追加されます。

```typescript
await insertBeforeLinesTool.execute(
  {
    pageTitle: "ページタイトル",
    targetLineText: "対象の行のテキスト",
    text: "挿入するテキスト\n複数行も可能"
  },
  {
    projectName: "プロジェクト名",
    cosenseOptions: { sid: "セッションID" }
  }
);
```

### 3. インデントを考慮した挿入（insert_indented_lines）

指定した行の子孫ブロックの末尾にテキストを挿入します。インデントは自動的に調整されます。

例えば、以下のような構造のテキストがある場合：
```
親の行
	子の行1
	子の行2
次の親の行
```

以下のコードを実行すると：
```typescript
await insertIndentedLinesTool.execute(
  {
    pageTitle: "ページタイトル",
    targetLineText: "親の行",
    text: "新しい子の行1\n新しい子の行2"
  },
  {
    projectName: "プロジェクト名",
    cosenseOptions: { sid: "セッションID" }
  }
);
```

結果は以下のようになります：
```
親の行
	子の行1
	子の行2
	新しい子の行1
	新しい子の行2
次の親の行
```

### 共通の注意点

- インデントにはタブ文字を使用しています
- 複数行のテキストを挿入する場合は、`\n`で行を区切ってください
- 対象の行が見つからない場合の動作は各ツールによって異なります
  - `insert_before_lines`: ページ末尾に追加
  - `insert_indented_lines`: 1階層インデントしてページ末尾に追加
