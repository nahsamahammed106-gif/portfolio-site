// The whole roadmap. To ship a project: set shipped: true, add repo and summary.
// track: "dev" | "sec" | "hw" | "cross"   kind: "ai" | "ml" | "both"| "sec" | "hw" | "cross"
window.ROADMAP = {
  stages: [
    { id: "beginner", name: "Beginner", weeks: "weeks 1–6" },
    { id: "builder", name: "Builder", weeks: "weeks 7–17" },
    { id: "advanced", name: "Advanced", weeks: "weeks 18–31" },
    { id: "expert", name: "Expert", weeks: "weeks 32–46" },
  ],
  tracks: {
    dev: "Developer tools",
    sec: "Cybersecurity",
    hw: "Hardware and edge",
    cross: "Across domains",
  },
  // The "What I work on" section. TODO: rewrite the descriptions in your own words.
  disciplines: [
    { id: "ai", name: "Applied AI engineering", label: "applied AI", text: "LLM apps, agents, retrieval and evals, shipped as tools people actually use." },
    { id: "ml", name: "ML engineering", label: "ML", text: "Training, fine-tuning and serving models, plus the data and monitoring around them." },
  ],
  domains: [
    { id: "sec", name: "Cybersecurity", label: "cybersecurity", text: "Phishing, leaked secrets, vulnerable code, intrusion detection, and securing AI systems themselves." },
    { id: "dev", name: "Developer tools", label: "developer tools", text: "Agents and tools that review, test, explain and upgrade code." },
    { id: "hw", name: "Hardware and edge", label: "hardware and edge", text: "Models running offline on a Raspberry Pi, an ESP32 and local machines." },
    { id: "cross", name: "Across domains", label: "cross-domain", text: "Projects that tie the tracks together, like a cost-aware model router." },
  ],
  projects: [
    { n: 1, stage: "beginner", track: "dev", kind: "ai", title: "Portfolio site and project template", shipped: true,
      repo: "https://github.com/nahsamahammed106-gif/portfolio-site",
      summary: "This site, deployed by GitHub Actions on every push, plus a uv and pytest template that every later project starts from." },
    { n: 2, stage: "beginner", track: "dev", kind: "ai", title: "Commit message and PR description writer" },
    { n: 3, stage: "beginner", track: "sec", kind: "ai", title: "Phishing email explainer" },
    { n: 4, stage: "beginner", track: "dev", kind: "ai", title: "Docs Q&A, built by hand" },
    { n: 5, stage: "beginner", track: "sec", kind: "ai", title: "Repo secret-leak scanner" },
    { n: 6, stage: "beginner", track: "hw", kind: "ai", title: "Local model chat with quantization comparison" },
    { n: 7, stage: "beginner", track: "sec", kind: "ml", title: "Phishing URL classifier with classic ML" },

    { n: 8, stage: "builder", track: "dev", kind: "ai", title: "Fix-the-failing-test agent" },
    { n: 9, stage: "builder", track: "dev", kind: "ai", title: "Eval harness across three providers" },
    { n: 10, stage: "builder", track: "dev", kind: "ai", title: "LLM observability and tracing" },
    { n: 11, stage: "builder", track: "sec", kind: "ai", title: "CVE digest for your own dependencies" },
    { n: 12, stage: "builder", track: "hw", kind: "ai", title: "MCP server for serial devices and sensors" },
    { n: 13, stage: "builder", track: "hw", kind: "ai", title: "Component datasheet extractor" },
    { n: 14, stage: "builder", track: "dev", kind: "ai", title: "Codebase onboarding Q&A" },
    { n: 15, stage: "builder", track: "sec", kind: "ai", title: "Log triage CLI on a local model" },
    { n: 16, stage: "builder", track: "sec", kind: "ai", title: "Vulnerable LLM app and guardrail layer" },
    { n: 17, stage: "builder", track: "hw", kind: "ml", title: "Predictive maintenance on an ESP32" },
    { n: 18, stage: "builder", track: "cross", kind: "ai", title: "Cost-aware model router" },

    { n: 19, stage: "advanced", track: "dev", kind: "ai", title: "PR review agent", flagship: true },
    { n: 20, stage: "advanced", track: "sec", kind: "ml", title: "Small transformer trained from scratch on logs" },
    { n: 21, stage: "advanced", track: "sec", kind: "ml", title: "Fine-tuned vulnerable-code classifier" },
    { n: 22, stage: "advanced", track: "dev", kind: "ml", title: "Model serving under load" },
    { n: 23, stage: "advanced", track: "cross", kind: "ai", title: "Offline pre-commit security reviewer" },
    { n: 24, stage: "advanced", track: "sec", kind: "ai", title: "MCP server auditor" },
    { n: 25, stage: "advanced", track: "hw", kind: "ai", title: "Offline voice assistant on a Raspberry Pi" },
    { n: 26, stage: "advanced", track: "sec", kind: "ai", title: "Real-time voice agent for a home security check-up" },
    { n: 27, stage: "advanced", track: "dev", kind: "ai", title: "Dependency-upgrade agent" },
    { n: 28, stage: "advanced", track: "sec", kind: "ai", title: "Agent sandbox" },
    { n: 29, stage: "advanced", track: "sec", kind: "ai", title: "Multi-agent incident investigator" },

    { n: 30, stage: "expert", track: "dev", kind: "ml", title: "Open-source issue recommender" },
    { n: 31, stage: "expert", track: "sec", kind: "ai", title: "Open-source LLM app security scanner", flagship: true },
    { n: 32, stage: "expert", track: "hw", kind: "ml", title: "Small-model leaderboard across Mac and Pi" },
    { n: 33, stage: "expert", track: "hw", kind: "ml", title: "Offline camera detector", flagship: true },
    { n: 34, stage: "expert", track: "sec", kind: "ml", title: "Network intrusion detection, full lifecycle", flagship: true },
    { n: 35, stage: "expert", track: "cross", kind: "both", title: "Home network guardian" },
  ],
};
