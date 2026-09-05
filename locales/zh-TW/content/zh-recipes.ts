import type { Recipe } from '@/content/types';

type Specification = {
  slug: string;
  title: string;
  summary: string;
  task: Recipe['task'];
  risk: Recipe['risk'];
  features: Recipe['features'];
  sources: string[];
  steps: string;
  checks: string[];
  failure: [string, string];
};
const specifications: Specification[] = [
  {
    slug: 'explore-unfamiliar-repository',
    title: '探索陌生的儲存庫',
    task: 'explore',
    risk: 'low',
    features: ['plan-mode'],
    summary: '從入口追蹤一條實際執行路徑，建立附有程式碼引用的專案地圖。',
    steps:
      '保持唯讀。先找出入口、主要模組與測試命令，再追蹤一條請求到資料層的路徑。引用檔案與符號，區分已確認的事實和推測，列出尚未找到的資訊。不要逐檔複述整個專案。',
    checks: [
      '開啟引用的檔案，確認符號與路徑存在。',
      '核對至少一條完整執行路徑。',
      '確認沒有修改任何檔案。',
    ],
    failure: ['回答只有籠統的架構描述。', '縮小到一個入口，要求逐段列出呼叫者與被呼叫的符號。'],
    sources: ['bestPractices', 'commonWorkflows', 'permissionModes'],
  },
  {
    slug: 'diagnose-failing-test',
    title: '先診斷失敗測試，再決定是否修改',
    task: 'debug',
    risk: 'low',
    features: ['plan-mode'],
    summary: '重現失敗並找出原因，避免把不正確的測試修成綠燈。',
    steps:
      '先執行指定測試並保留失敗輸出，追蹤斷言與實作的差異。判斷是程式錯誤、測試假設、環境還是時序問題。先回報根因與建議的最小修正，不要編輯檔案或刪除斷言。',
    checks: [
      '相同命令能重現失敗。',
      '解釋連結到具體斷言與程式路徑。',
      '建議仍保留原本的行為要求。',
    ],
    failure: ['還沒定位原因就開始改期望值。', '停止修改，恢復診斷範圍，要求先說明需求應有的行為。'],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'fix-reproducible-bug',
    title: '修正可重現的錯誤',
    task: 'debug',
    risk: 'medium',
    features: ['git'],
    summary: '從失敗案例出發，做最小修正並留下能防止復發的測試。',
    steps:
      '先重現錯誤並說明根因。新增在修正前會失敗的回歸測試，再做最小修正。保留公開介面、錯誤格式與無關行為。先跑聚焦測試，再跑必要的廣域檢查，回報實際結果。',
    checks: [
      '回歸測試在舊程式上會失敗。',
      '修正後新舊測試都通過。',
      '差異不包含無關重構或被刪除的檢查。',
    ],
    failure: ['測試通過，但只是吞掉例外。', '補上錯誤路徑的行為斷言，重新追蹤根本原因。'],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'review-pull-request',
    title: '審查 PR 的正確性與安全性',
    task: 'review',
    risk: 'low',
    features: ['git', 'subagents'],
    summary: '找出可重現、會影響使用者的問題，提供審查者可以直接核對的證據。',
    steps:
      '只做審查，不修改檔案。先讀取差異，再追蹤受影響的呼叫端與測試。優先檢查行為退化、權限、輸入驗證與錯誤處理。每項發現提供檔案位置、觸發條件、影響與建議；沒有足夠證據時標示不確定。',
    checks: ['發現能對應到此次修改。', '觸發條件具體且可核對。', '沒有把個人風格偏好當成錯誤。'],
    failure: [
      '列出大量假設性的問題。',
      '要求每項發現補上實際呼叫路徑或重現案例，刪除無法支持的推測。',
    ],
    sources: ['commonWorkflows', 'securityGuidance', 'subAgents'],
  },
  {
    slug: 'analyze-performance-regression',
    title: '用基準測試分析效能退化',
    task: 'performance',
    risk: 'medium',
    features: ['git'],
    summary: '保持量測條件一致，先找瓶頸，再確認改善是否超過雜訊。',
    steps:
      '記錄執行環境、輸入規模與量測方法。重複執行基準，分析時間花在哪裡，再提出局部修正。比較修改前後的分布與資源使用，保留原有行為。不要只憑一次較快的結果宣稱成功。',
    checks: [
      '前後使用相同環境與輸入。',
      '有多次量測及變異說明。',
      '效能改善沒有犧牲正確性或安全檢查。',
    ],
    failure: ['只回報一次執行時間。', '重複量測並檢查暖機、快取與背景負載，說明結果限制。'],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'implement-small-feature',
    title: '實作小型功能',
    task: 'implement',
    risk: 'medium',
    features: ['git'],
    summary: '把需求轉成可觀察的驗收案例，在既有架構內完成局部改動。',
    steps:
      '先查看相鄰功能與測試慣例，列出成功、空值與失敗情境。沿用現有元件與依賴，完成最小實作。新增覆蓋使用者行為的測試，跑相關檢查，再說明修改與限制。',
    checks: [
      '需求中的行為都有對應驗收。',
      '鍵盤、錯誤與空狀態可用。',
      '沒有不必要的新依賴或架構變更。',
    ],
    failure: [
      '功能做出來了，但擴大成重寫整個模組。',
      '回到驗收條件，保留必要修改，將獨立重構拆開。',
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'plan-large-feature',
    title: '規劃跨檔案的大型功能',
    task: 'implement',
    risk: 'low',
    features: ['plan-mode'],
    summary: '在動手前釐清資料流、介面、遷移與驗證，讓計畫可以被逐項審查。',
    steps:
      '先探索既有資料流與限制，只產出計畫。列出要改的模組、介面契約、資料遷移、失敗情境、分階段交付與測試策略。指出需要決策的假設，並說明回復方式。此階段不要實作。',
    checks: ['每一步都有具體產出與驗收。', '跨模組相依關係清楚。', '遷移與回復策略可執行。'],
    failure: [
      '計畫只有「更新前端、更新後端」。',
      '要求指出確切介面、資料欄位與每個階段的成功條件。',
    ],
    sources: ['bestPractices', 'permissionModes', 'commonWorkflows'],
  },
  {
    slug: 'refactor-without-behavior-change',
    title: '不改變行為的重構',
    task: 'refactor',
    risk: 'medium',
    features: ['git'],
    summary: '先明確列出必須保持的契約，再改善內部結構。',
    steps:
      '確認公開匯出、回傳值、例外、副作用與呼叫順序。先補足高風險行為的測試，再做局部重構。不要同時改功能、升級依賴或調整 API。比較前後行為並檢查差異。',
    checks: ['公開契約與錯誤行為不變。', '測試覆蓋關鍵邊界情況。', '差異集中於結構調整。'],
    failure: ['重構順便改了回應格式。', '把行為變更拆成獨立需求，還原到原本的契約。'],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'add-tests-for-module',
    title: '為既有模組補上測試',
    task: 'test',
    risk: 'medium',
    features: ['git'],
    summary: '依模組責任與風險補測試，避免只複製目前的實作細節。',
    steps:
      '先讀取公開介面、呼叫端與現有測試。列出正常、空值、錯誤與邊界行為，優先覆蓋高風險路徑。只在必要邊界使用 mock，讓測試能抓到實際錯誤。不要為了提高覆蓋率降低斷言品質。',
    checks: [
      '測試描述可觀察行為。',
      '關鍵斷言在故意破壞行為時會失敗。',
      '測試可重複執行且不依賴外部正式服務。',
    ],
    failure: [
      '測試只是確認 mock 被呼叫。',
      '加入輸入與輸出、錯誤或副作用的斷言，減少對內部實作的耦合。',
    ],
    sources: ['commonWorkflows', 'bestPractices'],
  },
  {
    slug: 'upgrade-dependency-safely',
    title: '安全升級依賴套件',
    task: 'maintenance',
    risk: 'high',
    features: ['git'],
    summary: '依版本說明與遷移指南處理相容性，連同 lockfile 和建置一起驗證。',
    steps:
      '先確認目前與目標版本，閱讀官方變更與遷移文件。找出受影響 API，升級指定套件並更新 lockfile，只做必要相容性修改。跑測試、型別檢查、建置與相關使用流程，記錄尚未驗證的風險。',
    checks: ['套件版本與 lockfile 一致。', '破壞性變更都有對應處理。', '建置與主要使用流程通過。'],
    failure: [
      '只改版本號，沒有讀取遷移說明。',
      '先核對官方版本差異，建立受影響 API 清單，再進行驗證。',
    ],
    sources: ['commonWorkflows', 'bestPractices', 'security'],
  },
  {
    slug: 'write-or-prune-claude-md',
    title: '撰寫或精簡 CLAUDE.md',
    task: 'configure',
    risk: 'medium',
    features: ['claude-md'],
    summary: '保留真正影響專案行為的規則，移除過時與無用的常駐上下文。',
    steps:
      '核對建置命令、測試、目錄與團隊限制。保留難以從程式碼推知的資訊，刪除重複、過時與空泛要求。將局部規則放到合適範圍；固定檢查交給工具，不要假設文字規則是安全邊界。',
    checks: [
      '每個命令與路徑都存在。',
      '沒有衝突或過期規則。',
      '每條規則都能說明避免哪種常見錯誤。',
    ],
    failure: ['檔案變成整份專案文件的複本。', '只保留常駐必需資訊，其餘以連結供按需閱讀。'],
    sources: ['memory', 'skills', 'hooksGuide'],
  },
  {
    slug: 'create-formatting-hook',
    title: '建立固定格式化或驗證 hook',
    task: 'configure',
    risk: 'medium',
    features: ['hooks'],
    summary: '把每次都該執行的工具動作放進事件流程，並測試失敗與特殊路徑。',
    steps:
      '先查官方 hook 事件與輸入 schema，確認專案現有 formatter。限制匹配範圍，安全處理檔名與未受信任輸入，設定逾時與錯誤回報。測試一般檔案、含空格路徑與工具失敗，避免事件迴圈。',
    checks: [
      '匹配條件只涵蓋預期檔案。',
      '含空格與特殊字元的路徑能正確處理。',
      '逾時、失敗與重複觸發不會靜默破壞工作。',
    ],
    failure: [
      '直接把工具輸入拼接成 shell 命令。',
      '改用結構化解析與安全的參數傳遞，補上惡意輸入測試。',
    ],
    sources: ['hooksGuide', 'hooksReference', 'settings'],
  },
  {
    slug: 'delegate-research-to-subagents',
    title: '把獨立研究交給子代理',
    task: 'explore',
    risk: 'low',
    features: ['subagents'],
    summary: '用清楚的分工與回傳格式減少主對話雜訊，同時保留證據。',
    steps:
      '將探索拆成互不相依的問題，各自指定範圍、唯讀限制與回傳格式。要求每個子代理提供檔案引用、結論與不確定性。主代理核對衝突、整合結果，避免重複讀取所有探索內容。',
    checks: ['子任務可獨立完成。', '回傳結論附有可核對引用。', '主代理有處理相互矛盾的結果。'],
    failure: ['多個子代理重複研究同一範圍。', '重新界定檔案或問題所有權，縮小回傳內容。'],
    sources: ['subAgents', 'agents', 'contextWindow'],
  },
  {
    slug: 'run-non-interactive-ci-task',
    title: '執行非互動式 CI 任務',
    task: 'automate',
    risk: 'high',
    features: ['headless', 'permissions'],
    summary: '在受限環境執行有明確輸出契約的工作，妥善處理逾時與失敗。',
    steps:
      '查閱目前非互動 CLI 選項，使用乾淨 checkout 與最小工具權限。設定執行時間與資源上限，要求結構化輸出並驗證其 schema 與語意。處理權限拒絕、逾時與空結果，不得默默改用更高權限重試。',
    checks: [
      '執行環境沒有不必要的正式憑證。',
      '失敗會回傳可辨識狀態。',
      '重試不會重複產生外部副作用。',
    ],
    failure: ['任何錯誤都以無限制權限重跑。', '保留失敗證據，修正明確原因；權限調整須有對應需求。'],
    sources: ['headless', 'cliReference', 'permissionModes', 'githubActions'],
  },
  {
    slug: 'prepare-commit-or-pull-request',
    title: '驗證後準備 commit 或 PR',
    task: 'review',
    risk: 'medium',
    features: ['git'],
    summary: '把已驗證的修改整理成審查者看得懂的提交與說明。',
    steps:
      '檢查未暫存、已暫存與未追蹤檔案，只納入此次任務。確認驗證結果，草擬以 feat、fix 或 chore 等類型開頭的主旨，本文用每行不超過 120 字元的條列。PR 說明交代問題、行為改變、驗證與限制。',
    checks: [
      '差異只包含同一目的的改動。',
      '主旨有類型前綴，本文為短條列。',
      '說明中的驗證確實執行過。',
    ],
    failure: [
      '把所有工作目錄內容一口氣加入提交。',
      '逐檔檢查並只暫存此次範圍，排除機密與無關修改。',
    ],
    sources: ['commonWorkflows', 'permissions', 'bestPractices'],
  },
];

export const recipes: Recipe[] = specifications.map((item) => ({
  slug: item.slug,
  title: item.title,
  summary: item.summary,
  task: item.task,
  difficulty: item.risk === 'high' ? 'advanced' : item.risk === 'low' ? 'beginner' : 'intermediate',
  risk: item.risk,
  features: item.features,
  sources: item.sources,
  whenToUse: [item.summary, '已能指出具體目標，並希望產出可供檢查的結果。'],
  prerequisites: [
    '先保存現有工作，確認目前分支與工作目錄。',
    '提供相關檔案、輸入或錯誤證據，並移除機密。',
    '確認下列驗證命令適用於專案。',
  ],
  template: `任務：${item.title}\n範圍：{{target}}\n\n${item.steps}\n\n驗證：{{verification}}\n\n完成後回報：\n- 原因或設計決策。\n- 檢查或修改的檔案及理由。\n- 實際執行的驗證與結果。\n- 未完成的工作、假設與風險。`,
  variables: [
    {
      id: 'target',
      label: '目標範圍',
      placeholder: '檔案、模組、分支或具體問題',
      example: 'src/features/auth',
      help: '盡量使用確切路徑與可觀察行為，避免「整個專案」這類過大的範圍。',
    },
    {
      id: 'verification',
      label: '驗證方式',
      placeholder: '可執行的命令或人工核對步驟',
      example: 'npm test -- auth',
      help: '請替換成此專案實際存在的檢查；命令需要能判斷成功或失敗。',
    },
  ],
  whyItWorks: [
    '先界定範圍與順序，減少不必要的探索與修改。',
    '把完成條件寫成可核對證據，便於審查與重試。',
    item.checks[0]!,
  ],
  expectedBehavior: [item.steps, '遇到無法確認的假設時明確回報，不把推測寫成已驗證的結果。'],
  verification: item.checks,
  failureSignals: [
    { signal: item.failure[0], recovery: item.failure[1] },
    {
      signal: '回報聲稱檢查通過，卻沒有命令或輸出。',
      recovery: '要求實際執行可用的驗證，並清楚列出未執行的部分。',
    },
  ],
}));
