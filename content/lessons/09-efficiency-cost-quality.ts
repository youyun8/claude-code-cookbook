import type { Lesson } from '../types';

export const lesson: Lesson = {
  slug: 'efficiency-cost-and-quality',
  moduleNumber: 9,
  title: 'Efficiency, cost, and quality',
  summary:
    'Where tokens and time actually go, which intuitions about efficiency are wrong, and what to measure instead of lines of generated code.',
  level: 'Advanced systems',
  minutes: 30,
  prerequisites: ['context-and-session-management'],
  objectives: [
    'Identify the real drivers of cost and latency in agentic work.',
    'Course-correct early rather than after several failed rounds.',
    'Choose model and effort settings by task difficulty.',
    'Measure engineering outcomes rather than output volume.',
  ],
  blocks: [
    { kind: 'h2', id: 'drivers', text: 'Where the money goes' },
    {
      kind: 'p',
      text: 'The context window is re-sent on every message in a session. That single fact explains most of what follows: anything that grows the window costs on every subsequent turn, not once.',
    },
    {
      kind: 'table',
      head: ['Driver', 'Why it compounds', 'What to do'],
      rows: [
        [
          'Unfocused sessions',
          'Every earlier turn is re-sent with the next one',
          '`/clear` between tasks',
        ],
        [
          'Broad file reads',
          'File contents persist in the window',
          'Name paths; delegate large reads',
        ],
        [
          'Full-suite runs on every loop',
          'Long output, repeatedly',
          'Focused tests while iterating',
        ],
        ['A long CLAUDE.md', 'Loaded into every session', 'Prune to under ~200 lines'],
        [
          'Many connected MCP servers',
          'Tool definitions load every session',
          'Connect what you use',
        ],
        [
          'Rework from a vague prompt',
          'The most expensive line item, and invisible',
          'Spend 60 seconds on the prompt',
        ],
      ],
    },
    {
      kind: 'p',
      text: 'Run `/context` to see the breakdown for a live session and `/cost` to see spend. Model pricing and plan limits change, so this course does not quote numbers — check the current documentation when you need them.',
    },
    {
      kind: 'sources',
      ids: ['costs', 'contextWindow', 'modelConfig'],
      note: 'Pricing, plan limits, and available models change frequently.',
    },

    { kind: 'h2', id: 'myths', text: 'Five efficiency myths' },
    {
      kind: 'definition',
      term: '"More context is always better"',
      body: 'False, in both directions. Irrelevant context costs tokens on every turn and competes for attention with the material that matters. The goal is high signal, not high volume: the four files that matter beat the forty that might.',
    },
    {
      kind: 'definition',
      term: '"Longer prompts are always better"',
      body: 'A longer prompt helps only when the extra words change what Claude does or how the result is checked. Restating the goal three ways adds nothing. One sentence naming a test command adds more than three paragraphs of background.',
    },
    {
      kind: 'definition',
      term: '"Skipping tests saves time"',
      body: 'It moves time to review, and to production. It also removes the signal the agent uses to correct itself — without a check to run, the loop from module 1 has nothing to iterate against, so you get more plausible-looking wrong answers, not fewer.',
    },
    {
      kind: 'definition',
      term: '"Maximum autonomy is always more efficient"',
      body: 'Autonomy is efficient when the task is well specified and the checks are strong. On an ambiguous task, autonomy means a long unsupervised run toward the wrong target — you pay for all of it and then start over. Autonomy multiplies the quality of your specification, in whichever direction it points.',
    },
    {
      kind: 'definition',
      term: '"Parallel agents always make a task faster"',
      body: 'Parallelism has coordination cost: setup, merging, and reconciling contradictions between agents that could not see each other’s work. It pays for independent, well-bounded tasks. Two agents on the same module produce two conflicting branches and one manual merge.',
    },

    { kind: 'h2', id: 'correct', text: 'Course-correct early' },
    {
      kind: 'p',
      text: 'The cheapest intervention is the one you make in the first thirty seconds. If the first file Claude opens is the wrong one, say so now — not after it has built an argument on top of it.',
    },
    {
      kind: 'ul',
      items: [
        'Interrupt as soon as the direction looks wrong. A half-finished wrong approach costs less than a finished one.',
        'Correct with information, not just rejection: "not that file — the caching happens in `src/cache/store.ts`" beats "no, try again".',
        'Use `/rewind` to unwind code, conversation, or both when a path turned out badly.',
        'After three failed corrections, stop correcting. Start a fresh session whose prompt contains what the failures taught you.',
      ],
    },

    { kind: 'h2', id: 'model', text: 'Model and effort' },
    {
      kind: 'p',
      text: 'Claude Code lets you choose a model with `/model` and adjust reasoning effort with `/effort`. The mapping is ordinary engineering judgement:',
    },
    {
      kind: 'table',
      head: ['Task', 'Reach for'],
      rows: [
        ['Mechanical edits, renames, formatting', 'A faster model, lower effort'],
        ['Ordinary feature and bug work', 'The default for your session'],
        ['Architecture, subtle concurrency, tricky debugging', 'A stronger model, higher effort'],
        ['Adversarial review of a risky change', 'A stronger model, in a fresh session'],
      ],
    },
    {
      kind: 'p',
      text: 'Available models, effort levels, and their availability by plan change. Check `/model` in your own session and the model configuration documentation rather than trusting a list written months ago.',
    },

    { kind: 'h2', id: 'measure', text: 'Measure outcomes, not output' },
    {
      kind: 'p',
      text: 'Lines of generated code is the worst available metric. It rewards verbosity, punishes deletion, and correlates with review burden rather than value.',
    },
    {
      kind: 'table',
      head: ['Measure', 'What it tells you'],
      rows: [
        ['Change correctness', 'How often a change lands without follow-up fixes'],
        ['Review time per change', 'Whether diffs are scoped and reviewable'],
        ['Escaped defects', 'Whether verification is catching what it should'],
        ['Test coverage of changed code', 'Whether new work arrives with its own evidence'],
        ['Cycle time, request to merge', 'Whether the whole loop got faster, not just typing'],
        ['Cost per merged change', 'Efficiency in the only unit that matters'],
      ],
    },
    {
      kind: 'callout',
      tone: 'note',
      title: 'A useful diagnostic',
      body: [
        'If review time per change is going up while cycle time goes down, you are shifting work to reviewers rather than removing it. That shows up as team friction long before it shows up in a dashboard.',
      ],
    },

    { kind: 'h2', id: 'habits', text: 'The habits that pay' },
    {
      kind: 'ol',
      items: [
        'One task per session; `/clear` between them.',
        'Sixty seconds on the prompt before starting anything non-trivial.',
        'Focused checks while iterating, broader checks once at the end.',
        'Interrupt early; restart after three failed corrections.',
        'Prune CLAUDE.md when it stops being something you would read.',
        'Turn anything you have prompted three times into a recipe or a skill.',
      ],
    },
  ],
  checklist: [
    'Sessions are scoped to one task.',
    'Command output during iteration is targeted.',
    'I interrupt early rather than correcting repeatedly.',
    'Model and effort match the difficulty of the task.',
    'I am measuring merged, correct changes — not generated volume.',
    'Repeated prompts have become recipes or skills.',
  ],
  quiz: [
    {
      id: 'q1',
      prompt: 'Why does an unfocused session cost more than the sum of its parts?',
      options: [
        { id: 'a', text: 'Each message is billed at a higher rate.' },
        {
          id: 'b',
          text: 'The context window is re-sent every turn, so earlier material is paid for repeatedly.',
        },
        { id: 'c', text: 'Long sessions use a more expensive model.' },
        { id: 'd', text: 'It does not — session length is free.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Everything in the window travels with every message. That is why irrelevant context compounds, and why `/clear` between tasks is the highest-leverage habit here.',
    },
    {
      id: 'q2',
      prompt: 'Which statement about parallel agents is accurate?',
      options: [
        { id: 'a', text: 'They always reduce wall-clock time.' },
        {
          id: 'b',
          text: 'They add coordination cost and pay off mainly for independent, bounded tasks.',
        },
        { id: 'c', text: 'They are the correct default for ordinary changes.' },
        { id: 'd', text: 'They remove the need for review.' },
      ],
      correctOptionId: 'b',
      explanation:
        'Setup, merging, and reconciling contradictions are real costs. Independence is the condition that makes parallelism worth paying them.',
    },
    {
      id: 'q3',
      prompt:
        'You have corrected Claude three times on the same task and it is still wrong. What now?',
      options: [
        { id: 'a', text: 'A fourth, more emphatic correction.' },
        { id: 'b', text: 'Switch to a larger model and continue in the same session.' },
        {
          id: 'c',
          text: 'Start a fresh session with a prompt containing what the failures ruled out.',
        },
        { id: 'd', text: 'Accept the result and fix it in review.' },
      ],
      correctOptionId: 'c',
      explanation:
        'The window is now full of failed attempts, each arguing for its own approach. Carry forward the knowledge, not the transcript.',
    },
    {
      id: 'q4',
      prompt: 'Which metric is least useful for judging whether an agentic workflow is working?',
      options: [
        { id: 'a', text: 'Escaped defects.' },
        { id: 'b', text: 'Lines of code generated.' },
        { id: 'c', text: 'Review time per change.' },
        { id: 'd', text: 'Cycle time from request to merge.' },
      ],
      correctOptionId: 'b',
      explanation:
        'It rewards verbosity, penalises deletion, and tracks review burden rather than value delivered.',
    },
  ],
  sources: ['costs', 'contextWindow', 'modelConfig', 'bestPractices'],
};
