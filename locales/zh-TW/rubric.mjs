export const rubric = {
  'Bug fix': '修正錯誤',
  'A reproducible defect with a known symptom.': '有明確症狀、可以重現的錯誤。',
  'New behavior added to existing code.': '在既有程式碼中新增行為。',
  'Structure changes with behavior held constant.': '維持行為，調整內部結構。',
  Tests: '測試',
  'Coverage for code that already exists.': '為既有程式補上測試。',
  Investigation: '調查',
  'Understanding before any edit is made.': '修改前先理解問題。',
  Documentation: '文件',
  'Explaining code to future readers.': '向未來的讀者說明程式碼。',
  'A measured regression or a measured target.': '有量測依據的退化或改善目標。',
  'Reading a change for correctness and risk.': '檢查修改的正確性與風險。',
  Goal: '目標',
  'An explicit action and outcome, not just a topic.': '具體的動作與結果，而不只是主題。',
  'Without a stated outcome, Claude has to guess what "done" means and often picks a broader job than you wanted.':
    '缺少結果定義時，Claude 得自行猜測完成標準，容易擴大工作範圍。',
  Context: '上下文',
  'A file path, module, symbol, URL, log line, or error message.':
    '檔案路徑、模組、符號、網址、日誌或錯誤訊息。',
  'Concrete anchors let Claude read the right code first instead of searching the whole repository.':
    '具體線索能讓 Claude 優先讀取正確的程式碼，減少廣泛搜尋。',
  Scope: '範圍',
  'A boundary: smallest change, only this module, do not touch X.':
    '清楚的邊界，例如最小修改、只處理此模組或不碰特定檔案。',
  'Agents will happily widen a change. A stated boundary keeps the diff reviewable.':
    '明確邊界能減少改動擴張，讓差異維持在可審查的範圍。',
  'Constraints and non-goals': '限制與非目標',
  'Words like "do not", "without changing", "preserve", "must keep".':
    '例如「不要」、「不改變」、「保留」或「必須維持」。',
  'Non-goals are usually cheaper to state than to undo after the fact.':
    '先說清楚不做什麼，通常比事後撤銷更省力。',
  'Examples or evidence': '範例或證據',
  'A pasted error, a code block, sample input/output, or a reproduction.':
    '錯誤訊息、程式碼區塊、輸入輸出範例或重現方式。',
  'Evidence turns a guess into a diagnosis and shortens the explore phase.':
    '證據讓診斷有依據，也能縮短探索時間。',
  'Expected behavior and edge cases': '預期行為與邊界情況',
  'Mentions of edge cases, empty/null input, errors, or concurrency.':
    '邊界情況、空輸入、錯誤或並行行為。',
  'Stating the boundary conditions is how you get a fix that survives review.':
    '明確的邊界條件，有助於產出經得起審查的修正。',
  'A command or check that produces a pass/fail result.': '能產生成功或失敗結果的命令或檢查。',
  'This is the single strongest signal in the rubric. An agent that can run a check can tell whether it is done; one that cannot is guessing.':
    '這是評分中最重要的訊號。代理能執行檢查，才有依據判斷是否完成。',
  'A request for a summary, root cause, list of files changed, or a report.':
    '要求摘要、根本原因、修改檔案清單或報告。',
  'A stated deliverable makes the result reviewable in a minute instead of ten.':
    '事先說明交付格式，可以減少整理與審查結果的時間。',
  'Open with a verb and an outcome: "Fix the 500 returned when a refresh token has expired."':
    '先寫動作與結果，例如：「修正 refresh token 過期時回傳 500 的問題。」',
  'Point at the code: name a path (`src/features/auth/session.ts`), a symbol, a failing test, or paste the error.':
    '指出程式碼位置，例如 `src/features/auth/session.ts`、符號或失敗測試，也可以貼上錯誤訊息。',
  'Add a boundary: "Make the smallest change that fixes this" or "Only touch files under src/features/auth."':
    '補上邊界，例如：「做最小修正」或「只修改 src/features/auth 下的檔案」。',
  'State a non-goal: "Do not change the API response schema" or "No new dependencies."':
    '明說非目標，例如：「不要改 API 回應 schema」或「不要新增依賴」。',
  'Paste the evidence: the stack trace, the failing assertion, or a short input/output pair.':
    '提供堆疊追蹤、失敗斷言，或簡短的輸入與輸出範例。',
  'Name the boundaries that must keep working: expired tokens, empty lists, concurrent callers.':
    '列出必須處理的邊界，例如過期權杖、空清單或同時呼叫。',
  'Name a command Claude can run and read: "Run `npm test -- auth` and the repo type check, and report the results."':
    '指定能執行的命令，例如：「跑 `npm test -- auth` 與專案型別檢查，並回報結果。」',
  'Ask for a report: "Finish with the root cause, the files changed, and the verification output."':
    '要求完成報告，例如：「最後回報根因、修改檔案與驗證輸出。」',
  'This prompt is very short. For anything beyond a trivial edit, add a target and a check.':
    '提示詞很短。如果不是極小的修改，請補上目標與驗證方式。',
  'This prompt is long. Length is not the goal — trim anything that does not change what Claude does or how the result is checked.':
    '提示詞較長。請刪去不影響動作或驗證方式的內容，不必追求篇幅。',
  'write clean code': '撰寫乾淨的程式碼',
  'follow best practices': '遵循最佳實務',
  'be careful': '小心處理',
  'use good names': '使用好名稱',
  'comment where appropriate': '適當加入註解',
  'keep functions small': '保持函式精簡',
  'think carefully': '仔細思考',
  'write tests': '撰寫測試',
  'handle errors properly': '妥善處理錯誤',
  'a directory description': '目錄描述',
  'the framework, which is visible in the manifest files': '可從套件設定看出的框架',
  'a dependency version, which lives in the lockfile': 'lockfile 已記錄的依賴版本',
  'a file count': '檔案數量',
  'a point-in-time statement': '只適用於當下的狀態',
  'in-flight work': '進行中的工作',
  'a task marker': '待辦標記',
  'a schedule': '時程資訊',
  'a transient failure': '暫時性失敗',
  'a PostToolUse hook': 'PostToolUse hook',
  'a PreToolUse hook on the commit command, or a pre-commit hook':
    '提交命令的 PreToolUse hook 或 pre-commit hook',
  'a permissions deny rule or a PreToolUse hook': '權限拒絕規則或 PreToolUse hook',
  'a deny rule plus a secret scanner in CI': '拒絕規則與 CI 機密掃描',
  'package manager': '套件管理器',
  'commit policy': '提交政策',
  'commit automatically': '自動提交',
  'never commit': '不要提交',
  'A long code block reads like a tutorial. CLAUDE.md is loaded into every session, so a walkthrough costs context on every task, whether or not it is relevant.':
    '長篇程式碼教學會在每次載入 CLAUDE.md 時佔用上下文，即使與任務無關。',
  'Move the walkthrough into a skill, which loads only when it is relevant, and leave a one-line pointer here.':
    '把教學移到按需載入的 skill，在這裡保留簡短指引。',
  'Delete it, or replace it with the project-specific version — the rule someone would only know after a code review here.':
    '刪除，或改成專案特有、需要經過此專案審查才會知道的規則。',
  'Remove it. Keep only what the code does not say out loud.':
    '移除，僅保留無法直接從程式碼推知的資訊。',
  'Move it to the issue tracker or the pull request. CLAUDE.md is for facts that stay true.':
    '移到議題或 PR，CLAUDE.md 適合保存穩定資訊。',
  'This must happen every time. CLAUDE.md is context, not enforcement — Claude reads it and usually complies, but nothing guarantees it.':
    '如果每次都必須執行，應使用工具強制觸發；CLAUDE.md 的文字指示不能提供這種保證。',
  'Hedged wording gives Claude room to skip the instruction, and no way to tell whether it followed it.':
    '模糊措辭讓指示難以執行，也無法判斷是否遵循。',
  'Rewrite it as something you could check: name the command, the path, or the exact convention.':
    '改成可檢查的要求，指出命令、路徑或確切慣例。',
  'Keep one copy, in the section where a reader would look for it.':
    '只保留一份，放在讀者會尋找的位置。',
  'Decide on one and delete the other. If both are genuinely true, say when each applies.':
    '選定一種規則並刪除另一種；若兩者都適用，明確說明各自情境。',
  'Split path-specific guidance into .claude/rules/ files with `paths:` frontmatter so they load only when Claude touches matching files, and move procedures into skills.':
    '將局部指示移至帶有 `paths:` 的 .claude/rules/ 檔案，流程教學則移至 skills，按需載入。',
};
