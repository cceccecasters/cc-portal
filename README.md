# cc-portal

彰銓企業內部作業系統入口站。GitHub Pages 靜態站，無後端。

## 結構

```
index.html            入口頁
404.html              GitHub Pages 404
version.json          版次（入口頁右下角顯示）
shared/theme.css      視覺
shared/shell.js       版本號、操作人、卡片渲染
shared/modules.json   模組清單 ← 新增模組只需要改這裡
```

## 新增一個模組

在 `shared/modules.json` 的 `modules` 陣列加一筆：

```json
{
  "id": "unique-id",
  "name": "顯示名稱",
  "desc": "一句話說明",
  "path": "https://cceccecasters.github.io/xxx/",
  "external": true,
  "status": "live",
  "meta": "補充資訊",
  "roles": ["admin", "prod"]
}
```

`status` 為 `live` 才會產生可點擊的卡片，`wip` 顯示為灰色「即將推出」。
`roles` 目前只是預留欄位，尚未強制執行（S6 個人登入後才會生效）。

## 操作人

沿用 ISO 表單站的 `iso:user`。同一個 origin（`cceccecasters.github.io`）共用
localStorage，所以在入口切換操作人，各模組會一起生效。

## 部署

`main` 分支根目錄，GitHub Pages。推上去約 1 分鐘生效。
