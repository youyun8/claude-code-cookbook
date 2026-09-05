export const reference = {
  'Agentic loop': '代理循環',
  'The cycle an agent runs: read the request, inspect the code, take an action, read the result, and repeat until the task is done. It is the reason a runnable check changes an agent’s reliability — the check is what the loop iterates against.':
    '代理反覆讀取要求、檢查程式碼、執行動作並觀察結果，直到完成任務。可執行的檢查提供每一輪調整的依據，因此能改善可靠性。',
  'Auto memory': '自動記憶',
  'Notes Claude writes for itself across sessions in a repository, based on your corrections and preferences, stored as plain markdown you can read and edit. Distinct from CLAUDE.md, which you write.':
    'Claude 依據你的修正與偏好，為同一儲存庫的後續工作階段記下筆記。內容是可閱讀、可編輯的 Markdown，與你撰寫的 CLAUDE.md 不同。',
  'Bare mode': '精簡執行模式（bare mode）',
  'The `--bare` flag, which skips auto-discovery of hooks, skills, custom commands, subagents, plugins, MCP servers, auto memory, and CLAUDE.md. It is the recommended mode for CI and scripts because it makes a run reproducible across machines.':
    '`--bare` 會略過 hooks、skills、自訂命令、子代理、plugins、MCP 伺服器、自動記憶與 CLAUDE.md 的自動探索，讓 CI 與腳本較不受本機配置影響。使用前請核對目前 CLI 文件。',
  Checkpoint: '檢查點',
  'A snapshot of file state captured before each prompt, so `/rewind` can restore code, conversation, or both. It covers edits Claude made; it is not a backup of your own uncommitted work.':
    '在提示詞前保存檔案狀態，供 `/rewind` 回復程式碼、對話或兩者。它涵蓋 Claude 的編輯，不能取代你原有未提交工作的備份。',
  'A markdown file of persistent project instructions, loaded into the context window at the start of every session. It is context, not enforcement: Claude reads it and usually complies, but nothing guarantees it.':
    '保存專案常駐指示的 Markdown 檔案，在工作階段開始時載入上下文。它是提供給模型的指示，不是強制的執行限制。',
  Compaction: '上下文壓縮',
  'Summarising the conversation so far to free context-window space. It runs automatically as you approach the limit, and you can run `/compact` yourself with focus instructions to control what the summary keeps.':
    '將目前對話整理成摘要，釋放上下文空間。接近限制時會自動進行，也可使用 `/compact` 並指定摘要應保留的重點。',
  'Context window': '上下文視窗',
  'Everything Claude can currently see: system prompt, instruction files, tool definitions, files read, command output, and the conversation. It is re-sent on every message, which is why irrelevant context costs on every turn rather than once.':
    'Claude 當下可看到的資訊，包括系統提示詞、指示檔、工具定義、讀過的檔案、命令輸出與對話。無關內容會持續增加後續處理的負擔。',
  'Deny rule': '拒絕規則',
  'A permission rule that blocks a tool or a pattern. Deny is evaluated before ask and allow, so a broad deny cannot carry allowlist exceptions — a narrower allow rule will not override it.':
    '封鎖特定工具或模式的權限規則。拒絕優先於詢問與允許，因此較窄的允許規則不能覆寫較廣的拒絕規則。',
  'Headless mode': '非互動模式',
  'Running Claude Code non-interactively with `-p` or `--print`. It exits 0 on success and non-zero on failure, so scripts and CI jobs can branch on the result.':
    '使用 `-p` 或 `--print` 以非互動方式執行 Claude Code。腳本可檢查結束狀態，再搭配輸出內容判斷下一步。',
  Hook: 'Hook（事件掛鉤）',
  'A shell command Claude Code runs at a fixed lifecycle event such as `PreToolUse` or `PostToolUse`. The only extension mechanism that guarantees something happens, because it does not depend on the model choosing to comply.':
    '由特定生命週期事件觸發的命令，例如 `PreToolUse` 或 `PostToolUse`。觸發不依賴模型是否記得遵循指示，但命令本身仍須妥善處理錯誤。',
  'The Model Context Protocol, used to connect Claude Code to external tools and data sources such as issue trackers and documentation systems. It grants access; it does not shape behavior. Its output is untrusted content.':
    'Model Context Protocol，用來連接議題追蹤器、文件系統等外部工具與資料。它提供存取能力，回傳內容仍應視為未受信任的資料。',
  'Permission mode': '權限模式',
  'The baseline for what runs without asking. Documented modes include `default` (shown as Manual), `acceptEdits`, `plan`, `auto`, `dontAsk`, and `bypassPermissions`. Rules layer on top of the mode.':
    '定義哪些動作不需詢問即可執行的基本策略。模式包含 `default`、`acceptEdits`、`plan`、`auto`、`dontAsk` 與 `bypassPermissions`；實際可用性請查目前文件，並搭配權限規則理解。',
  'Permission rule': '權限規則',
  'An allow, ask, or deny entry in settings that governs a tool or command pattern. Rules are evaluated deny, then ask, then allow, and the first match wins regardless of specificity.':
    '設定中的 allow、ask 或 deny 項目，用來控制工具或命令模式。依拒絕、詢問、允許的順序評估，先匹配者生效，不以較具體者優先。',
  'A permission mode that blocks edits until you approve a plan. It turns "explore before you edit" from a request into a constraint, which is why it suits unfamiliar or high-impact work.':
    '限制編輯的規劃模式，讓「先探索再修改」成為工具層的約束，適合陌生或影響較大的工作。',
  Plugin: 'Plugin（擴充套件）',
  'A distributable package that can bundle skills, hooks, subagents, commands, and MCP server definitions, so a team installs one thing rather than assembling six. Like any dependency, it can execute code — review what you install.':
    '可分發的套件，能封裝 skills、hooks、子代理、命令與 MCP 伺服器定義。它可能包含可執行程式，安裝前應如同依賴套件一樣審查。',
  'Prompt injection': '提示詞注入',
  'Text placed where an agent will read it, written to look like an instruction from you. Channels include repository files, dependency documentation, issue bodies, CI logs, fetched web pages, and MCP tool output.':
    '刻意放在代理會讀取的位置、偽裝成授權指示的文字。可能藏在儲存庫檔案、依賴文件、議題、CI 日誌、網頁或 MCP 工具輸出中。',
  Rewind: '回復（rewind）',
  'The `/rewind` menu, which restores code, conversation, or both to an earlier prompt, and can also summarise a chosen range of the conversation to free context.':
    '`/rewind` 選單可將程式碼、對話或兩者回復到較早的提示詞，也可摘要指定對話範圍以釋放空間。',
  'Rules directory': '規則目錄',
  '`.claude/rules/`, holding topic-specific instruction files. A rule with `paths:` frontmatter loads only when Claude works with matching files, which keeps scoped guidance out of every unrelated session.':
    '`.claude/rules/` 存放依主題區分的指示。使用 `paths:` frontmatter 可限定匹配檔案時才載入，避免局部規則佔用無關任務的上下文。',
  Sandbox: '沙箱',
  'OS-enforced filesystem and network isolation for Bash commands and their child processes, configured under the `sandbox` key in settings. It bounds what an action can reach, which is a different question from whether the action runs.':
    '由作業系統強制執行的檔案系統與網路隔離，限制 Bash 命令及子程序可存取的範圍。它處理的是「能碰到什麼」，與權限控制的「能否執行」不同。',
  Skill: 'Skill（技能）',
  'A directory containing a `SKILL.md` with frontmatter and instructions, loaded when you invoke it or when Claude judges it relevant. Suited to multi-step procedures used occasionally — the things that would bloat CLAUDE.md.':
    '包含 `SKILL.md`、frontmatter 與指示的目錄，在明確呼叫或判定相關時載入。適合偶爾使用的多步驟流程，避免全部塞入 CLAUDE.md。',
  'Structured output': '結構化輸出',
  'Machine-readable results from a headless run, selected with `--output-format`. Use it when another program consumes the result rather than a person reading it.':
    '以 `--output-format` 選擇的機器可讀輸出，適合由其他程式接收結果。解析後仍須檢查 schema 與內容語意。',
  Subagent: '子代理',
  'A delegated task with its own context window and, optionally, its own system prompt and tool set. Useful as a context firewall for research, and as a unit of parallel work.':
    '在獨立上下文中執行受委派的任務，可另設系統提示詞與工具。適合隔離研究過程的雜訊，或處理可獨立完成的平行工作。',
  'A check that produces readable pass/fail evidence — a test run, a build, a type check, a benchmark, a screenshot. The single strongest input to an agent’s reliability, because it is what the loop iterates against.':
    '能產生可核對成敗證據的檢查，例如測試、建置、型別檢查、基準量測或畫面核對。代理以這些結果作為調整依據。',
  Worktree: '工作樹（worktree）',
  'A separate working directory on its own branch from the same git repository. `claude --worktree <name>` starts a session in one, which is how parallel sessions avoid overwriting each other.':
    '同一 Git 儲存庫中，使用獨立分支與工作目錄的工作樹。`claude --worktree <name>` 可在其中啟動工作階段，減少平行工作互相覆蓋。',
  'Starts a new conversation with empty context while project memory still loads. The right command when switching to unrelated work; `/compact` is for freeing space within the same task.':
    '開始新的空白對話，專案記憶仍會載入。適合切換到不相關的任務；同一任務內需要釋放空間時則考慮 `/compact`。',
  'Shows current context usage by category, including which memory files loaded, with optimisation suggestions. The way to confirm a CLAUDE.md is actually in the session rather than assumed to be.':
    '依分類顯示上下文用量、已載入的記憶檔案與調整建議，可用來確認 CLAUDE.md 是否確實載入。',
  'Core mental model': '核心觀念',
  'The loop, and the one property that makes it reliable.':
    '理解代理循環，以及讓它可靠的回饋機制。',
  'Claude Code runs a loop: **prompt → inspect → act → observe → iterate → verify**. Everything else on this site is a technique for making one of those steps better.':
    'Claude Code 反覆進行 **提示 → 檢查 → 行動 → 觀察 → 調整 → 驗證**。本站介紹的技巧，都是為了改善其中一個環節。',
  '**Inspect before acting.** An edit made before the code was read is the most common cause of a bad change.':
    '**先檢查再行動。** 還沒閱讀相關程式就修改，容易判斷錯誤。',
  '**Give it a success signal it can run.** Without one, "done" means "looks plausible" — to Claude and to you.':
    '**提供可執行的成功判準。** 否則「完成」往往只代表看起來合理。',
  '**Bound the work.** State what may change and what must not.':
    '**界定範圍。** 明說可以改什麼，以及必須保留什麼。',
  '**Review the diff.** Tests catch what you thought to test; review catches the rest.':
    '**審查差異。** 測試涵蓋已想到的案例，審查則補足其他風險。',
  '**Record only what generalises.** If it will be true next month on a different task, write it down.':
    '**記錄可重用的知識。** 下個月換個任務仍適用的資訊，才值得常駐保存。',
  'Strong-prompt checklist': '好提示詞檢查表',
  'Seven parts, used in proportion to ambiguity and risk.': '七項要素，依模糊程度與風險取捨。',
  'The pattern': '基本格式',
  'Goal: Context: Relevant files or symptoms: Constraints and non-goals: Expected behavior and edge cases: Verification commands or evidence: Deliverable:':
    '目標：\n上下文：\n相關檔案或症狀：\n限制與非目標：\n預期行為與邊界情況：\n驗證命令或證據：\n交付內容：',
  'You do not need all seven for every task. Add structure in proportion to how ambiguous and how risky the work is.':
    '不是每個任務都要填滿七項。工作越模糊、風險越高，才需要越完整的結構。',
  'Closing paragraph worth reusing': '可重複使用的結尾要求',
  'Session and context commands': '工作階段與上下文命令',
  'What to run when the window fills up or the task changes.':
    '上下文接近上限或任務改變時，可查閱的命令。',
  Command: '命令',
  'What it does': '用途',
  'Shows context usage by category, including which memory files loaded':
    '依分類顯示上下文用量及已載入的記憶檔案',
  'Starts a new conversation with empty context; project memory still loads':
    '開始空白對話，仍載入專案記憶',
  'Summarises the conversation so far, optionally with a focus': '摘要目前對話，可指定保留重點',
  'Restores code, conversation, or both to an earlier prompt; can also summarise a range':
    '回復程式碼、對話或兩者，也可摘要指定範圍',
  'Returns to a previous conversation': '返回先前對話',
  'Lists and opens memory files; toggles auto memory': '列出與開啟記憶檔案，切換自動記憶',
  'Generates a starting CLAUDE.md, or suggests improvements to an existing one':
    '產生 CLAUDE.md 起始內容，或建議改善現有檔案',
  'Views and edits permission rules and shows which settings file each came from':
    '查看與編輯權限規則，並顯示來源設定檔',
  'Opens the sandbox panel': '開啟沙箱面板',
  'Shows configured hooks': '顯示已設定的 hooks',
  'Adjusts the model and reasoning effort': '調整模型與推理強度',
  'Shows spend for the session': '顯示工作階段費用',
  'Availability varies': '可用性依環境而異',
  'Commands change between versions and some depend on your plan or surface. Run `/help` in your own session for the authoritative list.':
    '命令會隨版本變更，部分也取決於方案或使用介面。請在自己的工作階段執行 `/help` 確認。',
  'Common project files and directories': '常見專案檔案與目錄',
  'Where configuration lives, and what loads when.': '設定的位置，以及何時載入。',
  Path: '路徑',
  Purpose: '用途',
  Loads: '載入時機',
  'Project instructions, shared via version control': '透過版本控制分享的專案指示',
  'Every session': '每個工作階段',
  'Personal project instructions — gitignore it': '個人專案指示，應加入 gitignore',
  'Your instructions across all projects': '跨專案的個人指示',
  'Topic-specific instructions': '依主題區分的指示',
  'Every session, or when `paths:` matches': '每個工作階段，或 `paths:` 匹配時',
  'Project skills': '專案 skills',
  'When invoked or judged relevant': '明確呼叫或判定相關時',
  'Personal skills': '個人 skills',
  'Project subagents': '專案子代理',
  'When delegated to': '受委派時',
  'Project settings: permissions, hooks, sandbox': '專案設定：權限、hooks、沙箱',
  'Personal project settings — gitignore it': '個人專案設定，應加入 gitignore',
  'Project MCP servers': '專案 MCP 伺服器',
  'On connect': '連線時',
  'CLAUDE.md files are discovered from your working directory upward and concatenated. Files in subdirectories load on demand when Claude reads files there. Confirm what actually loaded with `/context`.':
    'CLAUDE.md 會從工作目錄向上尋找並合併。子目錄中的檔案在讀取該範圍時按需載入，可用 `/context` 確認。',
  'Permissions and sandboxing': '權限與沙箱',
  'Two independent questions: does it run, and what can it reach.':
    '分別回答：能否執行，以及能存取什麼。',
  'Permission modes': '權限模式',
  Mode: '模式',
  'Runs without asking': '不需詢問的動作',
  'Reads only': '僅讀取',
  'Reads, file edits, common filesystem commands': '讀取、編輯與常見檔案系統命令',
  'Reads; edits blocked until you approve a plan': '讀取；核准計畫前限制編輯',
  'Everything, with background safety checks': '搭配背景安全檢查的自動執行',
  'Only pre-approved tools': '僅事先允許的工具',
  'Everything — isolated containers and VMs only': '略過權限詢問，僅適用於適當隔離的容器或虛擬機',
  'Rules are evaluated **deny, then ask, then allow**. The first match wins and specificity does not change the order, so a broad deny cannot carry allowlist exceptions.':
    '規則依 **deny、ask、allow** 的順序評估。先匹配者生效，具體程度不會改變順序，因此較廣的拒絕規則不能用允許清單開例外。',
  'Mode availability depends on your plan and how you run Claude Code, and settings schemas change. Check the linked pages before relying on any of this in a team configuration.':
    '模式可用性取決於方案與執行方式，設定格式也可能變更。套用到團隊前，請核對連結文件。',
  'Skills, hooks, MCP, plugins, subagents': 'Skills、hooks、MCP、plugins 與子代理',
  'Which one to reach for, by what it guarantees.': '依需要的能力與保證選擇機制。',
  Mechanism: '機制',
  Guarantee: '提供的保證',
  'Use for': '適用需求',
  'None — context': '提供上下文，不強制執行',
  'Short rules that apply broadly': '普遍適用的簡短規則',
  'Every session, or on matching files': '每個工作階段或匹配檔案時',
  'Instructions scoped to part of a codebase': '限定部分程式碼的指示',
  'A repeatable multi-step procedure': '可重複的多步驟流程',
  'At a fixed lifecycle event': '指定生命週期事件發生時',
  'Runs regardless of what Claude decides': '不依賴模型是否選擇遵循',
  'Anything that must happen every time': '每次都必須觸發的動作',
  'Access, not behavior': '提供存取能力',
  'External tools and data': '外部工具與資料',
  'Separate context window': '獨立上下文視窗',
  'Bounded research; parallel work': '範圍明確的研究與平行工作',
  'When installed and enabled': '安裝並啟用時',
  'Whatever it bundles': '取決於封裝的能力',
  'Distributing a team setup': '分發團隊配置',
  'The deciding question: if Claude skipped this, would you be annoyed, or would something break? Annoyed → CLAUDE.md. Broken → hook.':
    '判斷方式：如果 Claude 漏做，會只是麻煩，還是造成錯誤？一般偏好可寫入 CLAUDE.md；必須固定執行的動作，應交給 hook 或工具鏈。',
  'Git safety checklist': 'Git 安全檢查表',
  'Before, during, and after an agentic change.': '代理修改前、進行中與完成後的檢查。',
  Before: '開始前',
  During: '進行中',
  After: '完成後',
  'Working tree clean (`git status --short`).': '工作目錄乾淨，已檢查 `git status --short`。',
  'On a branch, not the default branch.': '使用工作分支。',
  'Baseline checks run; you know what already fails.': '已跑基準檢查，知道哪些失敗原本就存在。',
  'One concern per session.': '每個工作階段聚焦一項目的。',
  'Focused tests while iterating.': '調整時執行聚焦測試。',
  'No commits before review.': '審查後再提交。',
  '`git status --short` for untracked files the diff does not show.':
    '用 `git status --short` 檢查差異未顯示的未追蹤檔案。',
  '`git diff` read in full, including deletions.': '完整閱讀 `git diff`，包含刪除內容。',
  'No test skipped, deleted, or weakened.': '沒有略過、刪除或弱化必要測試。',
  'Staged files listed and confirmed before committing.': '提交前確認暫存檔案清單。',
  'Nothing pushed or force-pushed without you asking.': '推送與強制推送都有明確授權。',
  'Troubleshooting flow': '疑難排解流程',
  'Symptom to first check.': '依症狀找到第一個檢查點。',
  Symptom: '症狀',
  'First check': '先檢查',
  'An instruction is being ignored': '指示未被遵循',
  '`/context` — did the file load? Then: is the rule specific? Is another rule contradicting it?':
    '`/context` 確認檔案已載入，再檢查規則是否具體或互相矛盾',
  'An instruction must never be skipped': '某個動作絕不能漏做',
  'It needs a hook, not better wording': '交給 hook 或工具鏈強制執行',
  'Answers are getting worse in a long session': '長對話中的回答品質下降',
  'Context is crowded. `/compact` with focus, or `/clear` and restart with what you learned':
    '用帶重點的 `/compact`，或 `/clear` 後提供精簡交接資訊',
  'Claude keeps editing the wrong file': '持續修改錯誤的檔案',
  'Name the path explicitly; consider plan mode so it must show you the target first':
    '明確指定路徑，必要時先用規劃模式確認目標',
  'Too many permission prompts': '權限詢問過多',
  'A narrow allowlist for the commands you actually run, plus the Bash sandbox':
    '為實際常用命令建立窄範圍允許清單，並搭配沙箱',
  'A hook does not fire': 'Hook 沒有觸發',
  '`/hooks` to confirm it is registered; check the matcher; run the command manually':
    '用 `/hooks` 確認註冊，檢查匹配條件，再手動測試命令',
  'A CI run hangs': 'CI 執行卡住',
  'Something is waiting for approval — check the permission mode and the allowlist':
    '檢查是否等待核准，以及權限模式與允許清單',
  'Works locally, fails in CI': '本機可用，CI 失敗',
  'Bare mode does not use your subscription login; check the API key in the CI environment':
    '精簡執行模式不使用訂閱登入，請檢查 CI 的 API 金鑰配置',
  'Three corrections and still wrong': '修正多次仍然錯誤',
  'Stop correcting. New session, prompt containing what the failures ruled out':
    '建立新工作階段，提供失敗中已排除的假設與必要證據',
};
