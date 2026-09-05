import { CLINIC_EXAMPLES as original } from '@english/content/clinic-examples';
export type { ClinicExample } from '@english/content/clinic-examples';

const examples: [string, string, string][] = [
  ['資訊不足：錯誤修正', '修好登入錯誤。', '缺少位置、症狀與能判斷成敗的檢查。'],
  ['資訊不足：模糊感受', '整理結帳程式碼，感覺很亂。', '「很亂」不是驗收條件，代理只能自行猜測。'],
  [
    '基本可用：錯誤修正',
    'src/features/auth 的過期 refresh token 造成 500，預期應為 401。請找出原因並修正，再跑 npm test -- auth。',
    '有位置與檢查，仍可補上範圍、邊界情況與回報格式。',
  ],
  [
    '結構完整：錯誤修正',
    'src/features/auth 遇到過期 refresh token 時回傳 500。先用既有測試重現，說明根因再編輯。做最小修正，保留有效 session 的行為，不要改 API 回應 schema。新增回歸測試，執行 npm test -- auth 與型別檢查，最後回報修改檔案、根因與結果。',
    '具備位置、症狀、順序、範圍、非目標、回歸測試與交付要求。',
  ],
  [
    '結構完整：調查',
    '探索 billing 模組，解釋請求如何從 HTTP 入口到持久化層。不要修改檔案。引用路徑與符號，列出覆蓋這條路徑的測試、尚未確認的部分與測試缺口。將摘要控制在 400 字內。',
    '唯讀且要求引用，也明確要求回報缺口。',
  ],
  [
    '結構完整：重構',
    'src/checkout/total.ts 的 calculateTotal() 有四層折扣條件。把各折扣規則抽成同檔案內的具名函式，維持行為不變。不要改公開簽章、稅額處理或新增依賴。修改前後跑 npm test -- checkout，不要改測試檔。若測試必須改，先停止並說明。回報既有測試未涵蓋的情況。',
    '保留測試原本的行為要求，讓前後比較有意義。',
  ],
  [
    '結構完整：測試',
    '依 src/lib/parseDate.test.ts 的慣例，為 src/lib/parseDuration.ts 新增測試。涵蓋空值、最大合理值、錯誤路徑、負數、小數單位與超過 24 小時的值。不要只重述實作；可疑行為先回報，不要寫成固定期望值。跑 npm test -- parseDuration，說明未測部分與原因。',
    '聚焦邊界，避免把現有 bug 固定成測試規格。',
  ],
  [
    '結構完整：效能',
    '/dashboard 的 p95 在 a1b2c3d 後從 180ms 變成 1.4s。修改前先用 bench/dashboard.bench.ts 量測並找出耗時位置。提出修正計畫，等我核准再實作。不要加快取，先找根因。回報相同基準下的前後數據。',
    '有量測依據、核准節點與清楚的非目標。',
  ],
  [
    '結構完整：審查',
    '審查本分支差異，排除 lockfile，不要修正檔案。追蹤會導致錯誤的輸入、缺少的狀態處理、吞掉的例外，以及授權與輸入驗證假設。每項發現列出檔案、觸發條件、影響與證據，依嚴重程度排序，並指出既有測試會漏掉什麼。',
    '要求可核對的發現，保留審查本身作為交付內容。',
  ],
  [
    '結構完整：文件',
    '依 src/lib/http.ts 的實際程式碼撰寫 README 的重試說明，涵蓋預設退避、會重試的狀態碼與停用方式。不要描述找不到程式依據的行為，模糊處明確標示。附一個簡短範例，最後列出不確定性。',
    '文件以目前行為為依據，並保留未知資訊。',
  ],
  [
    '基本可用：功能',
    '在分享視窗新增「複製連結」按鈕，複製 canonical URL，依 src/components/ShareDialog.tsx 的慣例實作。跑 npm test -- ShareDialog。',
    '有參考模式與檢查，仍缺少剪貼簿拒絕與無障礙回饋。',
  ],
  [
    '結構完整：功能',
    '在分享視窗新增「複製連結」按鈕，複製 canonical URL。沿用 src/components/ShareDialog.tsx，只修改 src/components/ 與相關測試。處理剪貼簿權限拒絕，並向螢幕閱讀器宣告成功。不要新增依賴。新增成功與拒絕情境測試，跑 npm test -- ShareDialog 與 npm run typecheck，回報修改檔案、決策與未做事項。',
    '相同功能補上範圍、真實邊界情況、非目標與兩項檢查。',
  ],
];
export const CLINIC_EXAMPLES = original.map((example, index) => {
  const [label, text, note] = examples[index]!;
  return { ...example, label, text, note };
});
