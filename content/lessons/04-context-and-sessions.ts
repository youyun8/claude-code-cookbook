import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'context-and-session-management',
  moduleNumber: 4,
  title: 'Context and session management',
  summary:
    'Why a long session degrades, what actually consumes the context window, and the commands that give you space back without losing the thread.',
  level: 'Daily workflow',
  minutes: 30,
  prerequisites: ['explore-plan-implement-verify'],
  objectives: [
    'Explain what fills the context window and why irrelevant context has a cost.',
    'Choose between /clear, /compact, rewind-and-summarize, and a fresh session.',
    'Keep noisy investigation out of your main session with a subagent.',
    'Recognise the signs of a polluted session and restart deliberately.',
  ],
  blocks: [
    { kind: 'h2', id: 'what-fills', text: 'What fills the window' },
    {
      kind: 'p',
      text: 'Every session has a finite context window. Everything Claude can currently see occupies part of it: the system prompt, your `CLAUDE.md` and rules, auto memory, tool definitions, the files it read, the output of every command it ran, and the whole conversation so far.',
    },
    {
      kind: 'p',
      text: 'Two consequences follow. The obvious one is cost: everything in the window is re-sent on every message. The less obvious one matters more — the relevant material is competing for attention with everything else in there. A session that has read forty files and printed three full test logs is genuinely worse at the task in front of it than a fresh one that has read the right four files.',
    },
    {
      kind: 'lab',
      lab: 'context-budget',
      title: 'Context budget simulator',
      description:
        'Add files, logs, and conversation and watch the budget fill. An educational model, not a token meter.',
    },
    {
      kind: 'p',
      text: 'Run `/context` in a real session to see the actual breakdown by category, including which memory files loaded and which tools are consuming space. It also flags optimisation opportunities.',
    },

    { kind: 'h2', id: 'focus', text: 'One session, one task' },
    {
      kind: 'p',
      text: 'The cheapest context management technique is not a command. It is refusing to do unrelated work in the same thread.',
    },
    {
      kind: 'ul',
      items: [
        'Fix the auth bug. Then `/clear`. Then start the dashboard feature.',
        'Do not "while you are in there" a session. The tangent’s files and output stay in the window for everything that follows.',
        'If a task splits into two genuinely independent halves, that is two sessions, not one long one.',
      ],
    },

    { kind: 'h2', id: 'tools', text: 'The tools, and when each one fits' },
    {
      kind: 'table',
      head: ['Situation', 'Use', 'What happens'],
      rows: [
        [
          'Switching to unrelated work',
          '`/clear`',
          'Starts a new conversation with empty context; project memory still loads',
        ],
        [
          'Same task, window filling up',
          '`/compact`',
          'Summarizes the conversation so far, freeing space and keeping the thread',
        ],
        [
          'Same task, you know what matters',
          '`/compact focus on the token refresh path`',
          'Summarizes with your priorities instead of a guess',
        ],
        [
          'One noisy stretch to condense',
          '`/rewind` → Summarize',
          'Compresses a chosen range and leaves the rest intact',
        ],
        [
          'Claude went down a wrong path',
          '`/rewind` → Restore',
          'Rewinds code, conversation, or both, to a chosen prompt',
        ],
        [
          'Coming back to earlier work',
          '`/resume`',
          'Returns to a previous conversation with its context',
        ],
        [
          'Repeated failed corrections',
          'New session with a better prompt',
          'Removes the failed attempts from the window',
        ],
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'Compaction is automatic too',
      body: [
        'Claude Code compacts on its own as you approach the limit, so a full window does not end your session. Running `/compact` yourself, with focus instructions, produces a better summary than the automatic pass, because you know what matters and it is guessing.',
        'Project-root CLAUDE.md, unscoped rules, and auto memory are re-injected from disk after compaction. Instructions you only said in conversation are not — they get summarized away with everything else.',
      ],
    },
    { kind: 'sources', ids: ['contextWindow', 'checkpointing', 'commands'] },

    { kind: 'h2', id: 'hygiene', text: 'Keep the intake clean' },
    {
      kind: 'p',
      text: 'Compaction is recovery. Not filling the window in the first place is cheaper.',
    },
    {
      kind: 'ol',
      items: [
        '**Ask for targeted reads.** "Read `src/auth/session.ts` and its test" beats "look at the auth code".',
        '**Keep command output small.** `npm test -- auth` instead of the whole suite. `git log --oneline -10` instead of full history. `head -50` on a log instead of the file.',
        '**Do not paste whole files you can reference.** A path is a few tokens; the file might be thousands, and Claude can read it if it needs to.',
        '**Trim your CLAUDE.md.** It loads into every session. Module 5 is about exactly this.',
        '**Delegate big reads.** Send research to a subagent so the raw material lands in its window, not yours.',
      ],
    },

    { kind: 'h2', id: 'subagents', text: 'Subagents as a context firewall' },
    {
      kind: 'p',
      text: 'A subagent runs with its own separate context window and returns only its result. That property is useful long before you care about parallelism: it is how you ask an expensive question without paying for the answer’s raw material forever.',
    },
    {
      kind: 'compare',
      title: 'Same question, different cost to your session',
      sides: [
        {
          label: 'In the main session',
          tone: 'weak',
          code: `Search the codebase for every place we construct a database
connection and tell me which ones bypass the pool.`,
          notes: [
            'Every file read lands in your window and stays there.',
            'The implementation work that follows shares space with dozens of files you no longer need.',
          ],
        },
        {
          label: 'Delegated',
          tone: 'strong',
          code: `Use a subagent to find every place we construct a database connection
and report which ones bypass the pool. I want the list of file paths and
a one-line note each — not the file contents.`,
          notes: [
            'The search happens in the subagent’s context window.',
            'Your session receives a short list, which is all you needed.',
            'Asking for the shape of the answer keeps the return small too.',
          ],
        },
      ],
    },
    {
      kind: 'callout',
      tone: 'warning',
      title: 'Subagents are not free',
      body: [
        'A subagent starts without your conversation, so it needs enough instruction to be useful — and it can return a confidently wrong summary of code you never saw. Use them for bounded research questions with checkable answers (paths, names, counts), not for judgement calls you would want to make yourself.',
      ],
    },
    { kind: 'sources', ids: ['subAgents', 'contextWindow'] },

    { kind: 'h2', id: 'restart', text: 'Know when to restart' },
    {
      kind: 'p',
      text: 'There is a failure mode where you correct Claude, it apologises, tries again, and gets it wrong differently. Three rounds of that and the window is full of failed attempts, each one context arguing for its own approach.',
    },
    {
      kind: 'p',
      text: 'The move is not a fourth correction. It is to stop, write down what you learned from the failures, and start a new session whose first prompt contains that knowledge.',
    },
    {
      kind: 'code',
      lang: 'text',
      label: 'The restart prompt',
      code: `In src/sync/reconcile.ts, reconcile() drops updates when two clients
write within the same tick.

Things already ruled out:
- It is not the debounce in useSync(); removing it does not change behavior.
- It is not clock skew; the timestamps are monotonic.
- A naive lock around the whole function deadlocks the retry path.

Read reconcile() and its test file first and tell me what you find before
changing anything.`,
    },
    {
      kind: 'p',
      text: 'The failed attempts became context in the only form that helps: a short list of ruled-out hypotheses, in a clean window.',
    },
  ],
  checklist: [
    'This session is working on one task.',
    'I have run `/context` at least once to see what is actually in the window.',
    'Command output during iteration is scoped, not full-suite.',
    'Large research went to a subagent, or I accepted the cost deliberately.',
    'I used `/clear` when switching tasks rather than continuing the thread.',
    'After three failed corrections, I restarted with what I learned instead of correcting again.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt:
        'You have finished a bug fix and want to start an unrelated feature. What is the right move?',
      options: [
        { id: 'a', text: '`/compact`, then continue in the same session.' },
        { id: 'b', text: '`/clear`, then start the feature.' },
        { id: 'c', text: 'Keep going; more context helps.' },
        { id: 'd', text: 'Restart the terminal.' },
      ],
      correctOptionId: 'b',
      explanation:
        '`/clear` starts a new conversation with empty context while project memory still loads. `/compact` is for freeing space while continuing the same task.',
    },
    {
      id: 'q2',
      prompt: 'What is the main reason to delegate a broad code search to a subagent?',
      options: [
        { id: 'a', text: 'Subagents are more accurate than the main session.' },
        { id: 'b', text: 'The files it reads land in its context window instead of yours.' },
        { id: 'c', text: 'It is always faster.' },
        { id: 'd', text: 'Subagents can access files the main session cannot.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Separate context is the point. You get the conclusion without carrying the raw material through the rest of your session.',
    },
    {
      id: 'q3',
      prompt:
        'You told Claude "always use the repository’s logger" in conversation, then `/compact` ran. Is the instruction still reliably in effect?',
      options: [
        { id: 'a', text: 'Yes — conversation instructions are re-injected after compaction.' },
        {
          id: 'b',
          text: 'No — only things loaded from disk, such as project CLAUDE.md and rules, are re-injected.',
        },
        { id: 'c', text: 'Yes, compaction never removes instructions.' },
        { id: 'd', text: 'Only if you say "always".' },
      ],
      correctOptionId: 'b',
      explanation:
        'Conversation-only instructions get summarized with everything else. If a rule must survive, it belongs in CLAUDE.md — or, if it must be enforced rather than followed, in a hook.',
    },
  ],
  sources: ['contextWindow', 'checkpointing', 'commands', 'subAgents', 'sessions'],
};
