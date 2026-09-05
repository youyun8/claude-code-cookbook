export const labs = {
  High: '高',
  Medium: '中',
  Low: '低',
  'CLAUDE.md linter': 'CLAUDE.md 檢查工具',
  'Heuristic sample rules, not an authoritative validator. Everything runs in your browser; nothing is uploaded.':
    '依啟發式規則提供建議，不是權威驗證器。全部在瀏覽器執行，不會上傳內容。',
  'Your CLAUDE.md': '你的 CLAUDE.md',
  'Paste your own file, or edit the deliberately bad sample below. Do not paste anything confidential.':
    '貼上自己的檔案，或修改下方刻意設計的不良範例。請勿貼入機密。',
  'lines,': ' 行，其中 ',
  'with content': ' 行有內容',
  'Reset sample': '還原範例',
  Clear: '清空',
  Findings: '檢查結果',
  '● No findings from these heuristics. That is not a guarantee the file is good — read it yourself and ask whether every line would still be true next month.':
    '● 這些規則未發現問題，但不代表內容一定合適。請自行閱讀，確認每條指示下個月是否仍然適用。',
  'whole file': '整份檔案',
  'Instead:': '建議改成：',
  'A short CLAUDE.md (60 lines)': '精簡的 CLAUDE.md（60 行）',
  'Loads every session. Worth it when every line earns its place.':
    '每個工作階段都會載入，每行都有用途才值得保留。',
  'A sprawling CLAUDE.md (400 lines)': '冗長的 CLAUDE.md（400 行）',
  'Loads every session, relevant to almost none of it.': '每次都載入，但大多與當前任務無關。',
  'Two targeted file reads': '讀取兩份相關檔案',
  'The files the task is actually about.': '只讀任務真正需要的檔案。',
  'Twelve files from a broad search': '廣泛搜尋後讀取十二份檔案',
  'Most will never be referenced again, and all of them stay.': '多數不會再用到，卻都留在上下文。',
  'Focused test output': '聚焦測試的輸出',
  'Short, and it is the signal the loop iterates against.': '簡短，且直接提供下一輪調整的依據。',
  'Full test suite output': '完整測試套件輸出',
  'Useful once at the end; expensive on every iteration.':
    '結尾完整檢查有用，每輪都輸出則成本較高。',
  'A pasted stack trace': '貼上堆疊追蹤',
  'High signal per token. Paste the frames, not the log file.':
    '資訊密度高，保留相關堆疊即可，不必貼整份日誌。',
  'A whole log file': '整份日誌',
  'The three useful lines arrive with two thousand others.': '三行有用資訊混在兩千行其他內容中。',
  'Thirty turns of conversation': '三十輪對話',
  'Grows on its own. This is what `/compact` reclaims.':
    '隨互動累積，可透過 `/compact` 摘要釋放空間。',
  'Six connected MCP servers': '連接六個 MCP 伺服器',
  'Tool definitions load every session, used or not.': '工具定義也會佔用上下文，即使目前沒有使用。',
  'Context budget simulator': '上下文預算模擬器',
  "An educational model with illustrative units. It is not a token meter and does not reflect any real model's limits.":
    '使用示意單位的教學模型，不是 token 計量器，也不代表任何真實模型的限制。',
  'Add things to the session': '加入工作階段的內容',
  '● signal': '● 相關資訊',
  '▲ noise': '▲ 雜訊',
  Window: '視窗',
  'Context window used': '已使用的上下文',
  '— over budget': '— 超出預算',
  Includes: '包含 ',
  'units of unavoidable startup context: system prompt and tool definitions.':
    ' 單位的基本啟動內容：系統提示詞與工具定義。',
  'Signal ratio': '相關資訊比例',
  'The share of the window that is relevant to the task in front of you.':
    '上下文中與目前任務相關的比例。',
  '■ Over budget. Compaction would run, summarising the conversation to make room.':
    '■ 超出預算。此時需要壓縮對話摘要以騰出空間。',
  '▲ Most of this window is not about your task. `/clear` between tasks, and delegate broad reads to a subagent.':
    '▲ 多數內容與任務無關。換任務時使用 `/clear`，獨立的大範圍探索可考慮交給子代理。',
  '● Healthy. Most of what Claude can see is relevant.':
    '● 狀態良好，Claude 看到的多數資訊都與任務相關。',
  'Signature verification was replaced with decoding': '簽章驗證被換成單純解碼',
  '`decode` reads the payload without checking the signature, so any attacker-supplied token is now accepted. Tests that use validly signed fixtures still pass, because they never present a forged token. This is the most serious defect in the diff and the easiest to skim past.':
    '`decode` 只讀取內容，不驗證簽章，攻擊者偽造的權杖也可能被接受。只用合法權杖的測試仍會通過，因此這是差異中最嚴重、也容易漏看的問題。',
  'A missing expiry now means "never expires"': '缺少到期時間變成「永不過期」',
  'Guarding on `claims.exp &&` looks defensive, but it turns an absent expiry claim into an unconditional pass. The safe reading of a missing security claim is rejection, not acceptance.':
    '`claims.exp &&` 看似防禦性檢查，實際上卻讓缺少到期資訊的權杖跳過驗證。缺少必要的安全欄位應拒絕處理。',
  'A database failure is silently swallowed': '資料庫錯誤被默默吞掉',
  'The `.catch(() => null)` makes a transient database error indistinguishable from "no such user". Callers will see an ordinary auth failure, the incident will be invisible in logs, and the root cause will be untraceable. Errors that are handled by discarding them are handled twice: once here, once at 3am.':
    '`.catch(() => null)` 讓資料庫故障與找不到使用者無法區分。呼叫端只看到一般驗證失敗，也失去了追查根因所需的錯誤資訊。',
  'The raw token is now returned to the caller': '原始權杖被加入回應',
  'Adding `token` to the response widens the API surface and puts a credential somewhere it was not before — logs, error reports, and client-side storage. Nothing in the task asked for it, which is exactly the signal to question it.':
    '回應新增 `token` 改變了 API 契約，還可能讓憑證進入日誌、錯誤報告與客戶端儲存空間。這不在原本需求中，應提出質疑。',
  'Four defects are planted in this diff, and the test suite passes with all of them. Flag the lines you would question, then reveal.':
    '這份差異藏有四個問題，即使存在這些問題，既有測試仍會通過。先標記可疑行，再查看解析。',
  'Simulated diff of src/api/session.ts. Select a line to flag it as a concern.':
    'src/api/session.ts 的模擬差異。選取一行即可標記為疑慮。',
  Unflag: '取消標記',
  Flag: '標記',
  'Reveal the defects': '顯示問題',
  '■ Line': '■ 行 ',
  '✓ you flagged this': '✓ 你有標記',
  '▲ missed': '▲ 未標記',
  'All four defects pass the existing tests. That is the point: a green suite tells you the cases somebody thought to write still hold, not that the change is correct.':
    '四個問題都不會讓既有測試失敗。綠燈只表示已寫出的案例仍成立，不能單憑它判定修改正確。',
  'Step 1 — sharpen the prompt': '步驟 1：寫清楚提示詞',
  'A user reports that the shopping cart total is wrong when a percentage discount is applied to an item that is already on sale. You open a session and start typing.':
    '使用者回報：特價商品再套用百分比折扣後，購物車總額不正確。你開始撰寫任務。',
  'Fix the discount bug in the cart.': '修正購物車的折扣錯誤。',
  'Which rewrite gives Claude the most to work with?': '哪個改寫能提供最有用的資訊？',
  'Please carefully and thoroughly fix the discount bug in the cart. Take your time.':
    '請仔細、完整地修正購物車折扣錯誤，慢慢來。',
  'Politeness and emphasis add tokens without adding information. Claude still does not know which function, what the wrong value is, or how anyone would know it was fixed.':
    '禮貌與強調沒有增加具體資訊。Claude 仍不知道是哪個函式、錯誤數值，以及如何確認修正。',
  'In src/cart/total.ts, applyDiscount() reuses the sale percentage instead of the additional discount to items that already have a sale price: a £100 item at 20% off then 10% off returns £64 instead of £72. Reproduce it with a test first, explain the cause, then make the smallest fix. Do not change the public signature. Run `npm test -- cart`.':
    'src/cart/total.ts 的 applyDiscount() 對特價商品誤用原本的折扣比例：原價 £100，先打八折再打九折，應為 £72，實際卻是 £64。先用測試重現並說明原因，再做最小修正。保留公開簽章，執行 `npm test -- cart`。',
  'Correct. It names the file and function, gives a concrete wrong value against an expected one, requires reproduction before diagnosis, states a non-goal, and names a command that produces pass or fail. Everything Claude needs, and nothing it does not.':
    '正確。它提供檔案、函式、實際與預期數值，要求先重現，並指出不可改動的部分與驗證命令。',
  'Read the whole cart module and all its tests, then fix every discount-related issue you find.':
    '讀完購物車模組與所有測試，修掉找到的全部折扣問題。',
  'This maximises context cost and scope at once. You get a large diff addressing problems you did not report, and the one bug the user actually hit is buried in it.':
    '這同時擴大上下文與修改範圍，使用者真正遇到的錯誤反而埋在大量無關修改中。',
  'The cart total is wrong. Fix it and make sure the tests pass.':
    '購物車總額有誤，修正並確保測試通過。',
  'Closer — "make sure the tests pass" is a check. But with no location and no expected value, a passing suite only proves nothing that was already tested broke.':
    '有提到檢查，但缺少位置與預期數值。既有測試通過，不代表此次回報的錯誤已解決。',
  'Step 2 — choose the verification': '步驟 2：選擇驗證',
  'Claude has reproduced the bug and proposed a one-line fix in applyDiscount(). Before you approve, you decide what has to pass.':
    'Claude 已重現錯誤，並提出一行修正。核准前，你要決定需要哪些驗證。',
  'Which verification actually proves the fix works?': '哪個驗證能證明修正有效？',
  'The existing cart test suite passes.': '既有購物車測試通過。',
  'It passed before the fix too — that is why the bug shipped. Existing tests prove you did not break the cases someone already thought of.':
    '修正前也會通過，所以錯誤才沒有被發現。既有測試只保護原本已涵蓋的案例。',
  'A new test asserting that a £100 item at 20% then 10% off returns £72, which fails without the fix and passes with it, plus the existing cart suite.':
    '新增測試確認 £100 商品打八折再打九折得到 £72，證明修正前失敗、修正後通過，並跑既有購物車測試。',
  'Correct. The new test is a regression guard tied to the reported value, and demonstrating that it fails without the fix is what proves the test is actually testing the fix. The existing suite covers what you might have broken.':
    '正確。新測試直接對準回報數值，修正前會失敗才證明它有保護作用；既有測試則檢查是否造成其他退化。',
  'Claude confirms the logic is now correct and explains why.': 'Claude 說邏輯已正確，並解釋原因。',
  'An explanation is useful for review and is not evidence. The loop needs something that can come back red.':
    '解釋有助審查，但仍需可執行、可能失敗的檢查作為證據。',
  'The application builds and the type check passes.': '應用程式建置與型別檢查通過。',
  'Necessary, not sufficient. Both would have passed with the bug in place — neither knows what the total should be.':
    '這些檢查必要但不充分；它們不知道折扣後的總額應是多少。',
  'Step 3 — read the diff': '步驟 3：審查差異',
  'The tests are green. Claude reports success. Here is the whole diff.':
    '測試通過，Claude 回報完成。以下是完整差異。',
  'What deserves a question before you merge this?': '合併前應對哪一點提出疑問？',
  'Nothing — the tests pass and the diff is small.': '不用，測試通過而且差異很小。',
  'Small and green is not the same as understood. There is a change here that has nothing to do with the reported bug.':
    '差異小、測試綠，不等於已理解修改。這裡包含與回報錯誤無關的行為改動。',
  'The rounding was introduced without being asked for, and `i.discount ?? 0` quietly changes behavior for items with no discount field.':
    '未經要求加入四捨五入，且 `i.discount ?? 0` 改變了缺少折扣欄位時的行為。',
  'Correct on both. Rounding to two decimal places is a product decision about money that nobody made — and it may not even be the right one for this currency. The `?? 0` fixes a different, unreported bug in the same commit, which is exactly the kind of thing that makes a change hard to revert cleanly.':
    '兩點都正確。金額取兩位小數是需要確認的產品決策，`?? 0` 則處理了另一個問題。混在同一提交中會增加審查與復原難度。',
  'The new test should have been written first.': '應該先寫新測試。',
  'It was — Claude reproduced the failure before editing. The ordering is fine; the unrequested behavior changes are the issue.':
    '前面已先重現失敗。問題在於未經要求的行為變更，而不是順序。',
  'The variable name `discounted` is unclear.': '變數名稱 `discounted` 不清楚。',
  'Naming is worth a comment in review, but it is not what would cause an incident. Prioritise findings by what breaks.':
    '命名可以討論，但應優先處理會導致錯誤的行為問題。',
  'Correct.': '答對了。',
  'Not the strongest option. Read the explanation.': '還有更合適的選擇，請閱讀解析。',
  'Three decisions in the order a real session presents them.':
    '依真實工作階段的順序，練習三個決策。',
  Step: '步驟 ',
  Back: '返回',
  'Next step': '下一步',
  'best answers. Saved to your progress.': ' 個最佳答案。已存入學習進度。',
  'Loading the interactive exercise…': '正在載入互動練習…',
  'Simulated · runs in your browser only': '模擬練習・僅在瀏覽器內執行',
  'Safe to allow': '可以允許',
  'Read-only or trivially reversible, and inside the task’s scope.':
    '唯讀或容易復原，且在任務範圍內。',
  'Review first': '先審查',
  'Legitimate, but read the actual command before approving.':
    '有合理用途，但核准前需閱讀實際命令。',
  'Stop and clarify': '停止並釐清',
  'Out of scope, irreversible, or reaching for something the task never needed.':
    '超出範圍、不可逆，或存取任務不需要的資源。',
  'While investigating where database connections are made.': '正在追查建立資料庫連線的位置。',
  'A read-only search inside the working directory, directly serving the stated task. Nothing to weigh.':
    '在工作目錄內唯讀搜尋，直接服務於已提出的任務。',
  'After editing the auth module.': '修改驗證模組後。',
  'Running the project’s own tests is the verification you asked for. This is the kind of command worth putting on an allowlist so it never prompts again.':
    '執行已知的專案測試是所需驗證。確認腳本內容後，可考慮將常用命令加入精確的允許清單。',
  'After the tests passed.': '測試通過後。',
  'Pushing is legitimate but outward-facing: it starts CI, notifies reviewers, and is awkward to unwind. Check the branch name and that you have reviewed the diff. An ask rule on `Bash(git push *)` makes this prompt reliably.':
    '推送可能觸發 CI 並通知他人。先確認分支、差異與授權，可用 `Bash(git push *)` 的詢問規則要求確認。',
  'While fixing a date-formatting bug you asked to be fixed without new dependencies.':
    '正在修正日期格式錯誤，而你已要求不新增依賴。',
  'You stated a non-goal and this crosses it. A dependency is also a supply-chain decision with lifecycle scripts attached — worth a conversation, not an approval.':
    '這違反明確的非目標。新依賴也可能包含安裝腳本，應先釐清必要性。',
  'While debugging a failing integration test.': '正在排查失敗的整合測試。',
  'Reading secrets puts them into the session transcript, which persists on disk. If Claude needs to know which variables exist, `grep -o "^[A-Z_]*=" .env` gives the names without the values.':
    '讀取機密會讓值進入對話紀錄。若只需知道變數名稱，應只列出名稱，避免輸出其內容。',
  'To tidy up before running the build.': '為了在建置前整理工作目錄。',
  'This deletes untracked, non-ignored files and directories, which may include your own new work or local configuration. Git cannot restore files it never tracked. Preview the targets with `git clean -nd` first; ignored files are only included with `-x`.':
    '這會刪除未追蹤且未被忽略的檔案，可能包含你尚未提交的新工作。Git 無法直接還原這些內容，應先預覽並確認目標。',
  'The README suggested it during project setup.': 'README 在安裝步驟中建議此命令。',
  'Executing a remote script sight unseen gives an unreviewed third party your shell. Download it, read it, then decide — and note that the instruction came from repository content, which is untrusted input.':
    '直接執行沒讀過的遠端腳本，等於讓第三方在你的 shell 裡執行程式。先下載、檢查，再決定；文件中的文字也不是自動授權。',
  'Seven proposed actions. Classify each one, then compare with the reasoning.':
    '將七個提議的動作分類，再對照判斷理由。',
  Action: '動作 ',
  'Classify:': '分類：',
  '✓ Matches the recommendation': '✓ 與建議一致',
  '→ Recommended:': '→ 建議：',
  'Answers shown': '已顯示答案',
  'Show the reasoning': '顯示判斷理由',
  'Saved to your progress.': '已存入學習進度。',
  'The login form in src/features/auth returns a generic 500 when an expired refresh token is present.':
    'src/features/auth 的登入表單遇到過期 refresh token 時會回傳通用的 500。',
  'Context and symptom': '上下文與症狀',
  'A search of the whole repository. The path narrows exploration, and the exact symptom stops Claude from fixing a different, more interesting bug it happens to notice.':
    '避免搜尋整個儲存庫；明確路徑與症狀能防止代理轉去修不相關的問題。',
  'Reproduce the failure using the existing auth tests, identify the root cause, and explain it before editing.':
    '先用既有驗證測試重現，找到根因，並在編輯前說明。',
  'Sequence: diagnose before treating': '順序：先診斷再處理',
  'A plausible fix for a misdiagnosed cause. Requiring an explanation first gives you a checkpoint where a wrong theory is cheap to reject.':
    '避免根因判斷錯誤卻做出看似合理的修正。先說明原因，便能及早排除錯誤方向。',
  'Then make the smallest fix that preserves current behavior for valid sessions.':
    '再做最小修正，保留有效 session 的現有行為。',
  'Scope and invariant': '範圍與不變條件',
  'A wide diff, and a fix that repairs the error path while breaking the happy path nobody thought to mention.':
    '避免差異擴大，也避免修好錯誤路徑卻破壞正常情境。',
  'Do not change the API response schema.': '不要改變 API 回應 schema。',
  'Non-goal': '非目標',
  'A schema change that reaches review, may already have consumers, and costs far more to unwind than this sentence cost to write.':
    '避免影響既有使用端的格式變更，事前說清楚比事後復原容易。',
  'Add or update a regression test.': '新增或更新回歸測試。',
  'Regression requirement': '回歸測試要求',
  'The same bug returning silently in three months. It converts a one-time fix into a permanent guarantee.':
    '減少同樣錯誤日後悄悄復發的機會，讓測試持續保護這個行為。',
  'Run the focused auth tests, then run the repository’s required type check.':
    '先跑驗證模組的聚焦測試，再跑專案要求的型別檢查。',
  'Code that was never executed. This is the strongest line in the prompt: focused first for a tight loop, broader second for coverage.':
    '避免交付未執行過的程式碼；先聚焦以縮短回饋，再擴大檢查範圍。',
  'Finish with the files changed, the root cause, and the verification results.':
    '最後回報修改檔案、根本原因與驗證結果。',
  Deliverable: '交付內容',
  'A ten-minute review of a two-minute change. You get the summary in the shape you need to assess it.':
    '讓摘要直接符合審查需要，減少重新整理對話的時間。',
  'Prompt anatomy': '提示詞拆解',
  'Select any part of the prompt to see which failure it prevents.':
    '選取提示詞的各個部分，查看它能避免哪種失敗。',
  'A strong bug-fix task': '清楚的錯誤修正任務',
  'Prevents:': '避免：',
  'Fix the login bug.': '修好登入錯誤。',
  'Goal: <what should be true when this is done>': '目標：<完成後應成立的行為>',
  'Context: <file path, symbol, or the error you saw>': '上下文：<檔案路徑、符號或看到的錯誤>',
  'Scope: make the smallest change that achieves this; only touch <path>':
    '範圍：做最小修改，只處理 <路徑>',
  'Non-goals: do not <the thing you would reject in review>': '非目標：不要 <審查時不會接受的改動>',
  'Evidence: <paste the stack trace, failing assertion, or input/output pair>':
    '證據：<貼上堆疊追蹤、失敗斷言或輸入輸出>',
  'Edge cases that must keep working: <empty input, error path, concurrent callers>':
    '必須維持的邊界情況：<空輸入、錯誤路徑、同時呼叫>',
  'Verification: run `<focused test command>`, then `<broader check>`, and report the output':
    '驗證：執行 `<聚焦測試命令>`，再跑 `<較廣的檢查>`，回報輸出',
  'Deliverable: finish with the root cause, the files changed, the verification results, and anything you did not do':
    '交付：回報根因、修改檔案、驗證結果與未執行的工作',
  Thin: '資訊不足',
  Workable: '基本可用',
  Strong: '結構完整',
  'Your prompt': '你的提示詞',
  'Task type': '任務類型',
  'Task prompt': '任務提示詞',
  'Everything here runs in your browser.': '全部在瀏覽器內執行。',
  'Nothing is uploaded and no AI service is involved. Even so, treat any unfamiliar deployment of this page with the caution you would apply to any web form: do not paste secrets, credentials, or confidential production data.':
    '內容不會上傳，也沒有呼叫 AI 服務。仍請像使用其他網頁表單一樣，不要貼入機密、憑證或正式環境的敏感資料。',
  'Curated examples': '精選範例',
  'Load one to see how the rubric responds, from barely-a-request to unambiguous brief.':
    '載入不同完整程度的範例，觀察評分規則如何反應。',
  'Structure check': '結構檢查',
  'This checks whether the parts of a well-formed task are present. It cannot judge whether the request is a good idea, whether the file paths exist, or whether the fix you are asking for is the right one.':
    '這只檢查任務的結構要素，無法判斷想法是否合理、路徑是否存在，或要求的修正是否正確。',
  'weighted points': ' 加權分數',
  'Prompt structure score': '提示詞結構分數',
  '— present': '— 已具備',
  '— missing': '— 缺少',
  'matters more for this task type': '對此任務類型更重要',
  'Looks for:': '檢查內容：',
  'Add:': '可補上：',
  'Improve this prompt': '改善提示詞',
  'One suggestion at a time, most important first. Each step appends a scaffold line you then fill in with your own specifics — the scaffold is a reminder, not the answer.':
    '每次顯示一項建議，從最重要的開始。新增的文字只是填寫架構，請換成自己的具體資訊。',
  'Show the first suggestion': '顯示第一項建議',
  'Next suggestion': '下一項建議',
  Reset: '重設',
  '✕ Before': '✕ 修改前',
  '✓ After — fill in the angle brackets': '✓ 修改後：請填入角括號內的內容',
  'Improved prompt': '改善後的提示詞',
  '● Every element the rubric looks for is present. That means the prompt is well formed — not that it asks for the right thing. Read it once more and ask whether the goal is actually what you want.':
    '● 已具備規則檢查的所有要素。這代表結構完整，仍請再讀一次，確認目標就是你真正需要的結果。',
  'Safest productive response': '最安全且能推進工作的做法',
  'Defensible, but not the best move': '有道理，但還有更好的做法',
  Risky: '有風險',
  'That is the safest productive response.': '這是最安全且能推進工作的做法。',
  'Read the explanation — there is a narrower option.': '請閱讀解析，還有影響範圍更小的選擇。',
  Scenario: '情境 ',
  'Medium risk': '中風險',
  Attempted: '已練習',
  'The principle': '判斷原則',
  'Try this scenario again': '重新練習此情境',
  'You state the task': '你提出任務',
  '> formatRelative() in src/lib/date.ts renders past dates as':
    '> src/lib/date.ts 的 formatRelative() 對過去日期輸出',
  '"in -3 days". Fix it so they render as "3 days ago".': '"in -3 days"，請改為 "3 days ago"。',
  'Do not change the signature. Add tests for a past date, a': '保留簽章，新增過去日期、',
  'future date, and now. Run `npm test -- date` and report.':
    '未來日期與當下的測試，執行 `npm test -- date` 並回報。',
  'Goal, location, expected output, a non-goal, and a command that can pass or fail. Everything that follows depends on this last part.':
    '提供目標、位置、預期輸出、非目標與可判斷成敗的命令，讓後續行動有驗證依據。',
  'Claude inspects before editing': 'Claude 先檢查再編輯',
  'Reading first is what separates a fix from a guess. Notice it also opened the test file — that is where the conventions live.':
    '先閱讀才能有依據地修正。它也開啟測試檔案，以了解既有慣例。',
  'It reproduces the failure': '重現失敗',
  '✕ formats a past date': '✕ 格式化過去日期',
  'expected "3 days ago", received "in -3 days"': '預期 "3 days ago"，實際為 "in -3 days"',
  '2 passed, 1 failed': '2 項通過，1 項失敗',
  'A red test before any edit. Now there is an objective definition of done, and Claude can tell whether its next action worked.':
    '修改前先看到失敗，便有客觀的完成標準，能判斷下一步是否有效。',
  'It makes a bounded edit': '做範圍明確的修改',
  'One function, one behavior. The signature is untouched, as instructed — a small diff is a reviewable diff.':
    '只改一個函式的一項行為，並依要求保留簽章，讓差異容易審查。',
  'It observes the result': '觀察結果',
  '✓ formats a past date': '✓ 格式化過去日期',
  '3 passed': '3 項通過',
  'This is the loop closing. If the test had still failed, Claude would iterate against the same signal rather than declaring success.':
    '這一輪有了結果；若仍失敗，就依同樣的測試繼續修正。',
  'It reports what you can check': '回報可核對的資訊',
  'Root cause: formatRelative() interpolated the signed difference':
    '根因：formatRelative() 直接把帶正負號的日期差',
  'directly, so negative values leaked into the string.': '插入字串，導致負數出現在輸出中。',
  'Changed: src/lib/date.ts, src/lib/date.test.ts': '修改：src/lib/date.ts、src/lib/date.test.ts',
  'Verified: npm test -- date — 3 passed': '驗證：npm test -- date，3 項通過',
  'Not done: relative formatting for hours and minutes still uses':
    '未處理：小時與分鐘的相對格式仍使用',
  'the same pattern and likely has the same bug.': '相同模式，可能有類似錯誤。',
  'The last line is the valuable one. A report that only lists successes tells you nothing you did not already assume.':
    '未處理事項尤其重要；只列成功結果，無法揭露剩餘的檢查缺口。',
  You: '你',
  Claude: 'Claude',
  'Tool run': '工具執行',
  'The loop, one step at a time': '逐步觀察代理循環',
  'A recorded example. Nothing here runs on your machine or reads your files.':
    '這是預先編排的範例，不會在你的電腦執行命令或讀取檔案。',
  'simulated session — src/lib/date.ts': '模擬工作階段 — src/lib/date.ts',
  'Previous step': '上一步',
  'Start again': '重新開始',
};
