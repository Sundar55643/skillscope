import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from "recharts";

const RESOURCES = {
  "React.js": { url: "https://react.dev/learn", label: "Official React Docs" },
  "TypeScript": { url: "https://www.typescriptlang.org/docs/", label: "TypeScript Handbook" },
  "Next.js": { url: "https://nextjs.org/learn", label: "Next.js Learn" },
  "Node.js": { url: "https://nodejs.org/en/learn", label: "Node.js Docs" },
  "Redux": { url: "https://redux-toolkit.js.org/introduction/getting-started", label: "Redux Toolkit Docs" },
  "Testing (Jest)": { url: "https://jestjs.io/docs/getting-started", label: "Jest Docs" },
  "GraphQL": { url: "https://graphql.org/learn/", label: "GraphQL Learn" },
  "Docker": { url: "https://docs.docker.com/get-started/", label: "Docker Get Started" },
  "PostgreSQL": { url: "https://www.postgresql.org/docs/", label: "PostgreSQL Docs" },
  "MongoDB": { url: "https://www.mongodb.com/docs/manual/", label: "MongoDB Manual" },
  "Data Structures": { url: "https://neetcode.io/", label: "NeetCode (DSA)" },
  "Algorithms": { url: "https://leetcode.com/explore/", label: "LeetCode Explore" },
  "System Design": { url: "https://github.com/donnemartin/system-design-primer", label: "System Design Primer" },
  "Tailwind CSS": { url: "https://tailwindcss.com/docs", label: "Tailwind Docs" },
  "Figma": { url: "https://www.figma.com/resources/learn-design/", label: "Figma Learn" },
};

function getDefaultResource(skill) {
  return { url: `https://www.google.com/search?q=${encodeURIComponent(skill + " tutorial for beginners")}`, label: "Search Tutorials" };
}

function getScoreColor(score) {
  if (score >= 75) return "#43d9ad";
  if (score >= 50) return "#f5c518";
  if (score >= 30) return "#ff8c42";
  return "#ff4d6d";
}

function getScoreLabel(score) {
  if (score >= 80) return { label: "Interview Ready", emoji: "🚀" };
  if (score >= 65) return { label: "Strong Candidate", emoji: "💪" };
  if (score >= 45) return { label: "Developing Match", emoji: "📈" };
  if (score >= 25) return { label: "Skill Gap Present", emoji: "📚" };
  return { label: "Needs Preparation", emoji: "🌱" };
}

export default function ResultsPanel({ result, mySkills, jdSkills, onBack, onReset }) {
  if (!result) return null;

  const { matched, missing, matchPct, readinessScore, total } = result;
  const scoreColor = getScoreColor(readinessScore);
  const { label: scoreLabel, emoji: scoreEmoji } = getScoreLabel(readinessScore);

  // Radar chart data - show top 7 JD skills
  const radarData = jdSkills.slice(0, 7).map(skill => ({
    skill: skill.length > 10 ? skill.slice(0, 10) + "…" : skill,
    You: ((mySkills[skill] || 0) / 5) * 100,
    Required: 80,
  }));

  // Priority missing skills (those most common in tech)
  const PRIORITY_ORDER = ["React.js","JavaScript","TypeScript","Node.js","CSS","HTML","Git","REST APIs","Python","Data Structures","Algorithms"];
  const priorityMissing = [
    ...missing.filter(s => PRIORITY_ORDER.includes(s)),
    ...missing.filter(s => !PRIORITY_ORDER.includes(s)),
  ];

  function exportProfile() {
    const data = { date: new Date().toISOString(), matchPct, readinessScore, matched, missing, total, mySkills };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "skillscope_profile.json";
    a.click();
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Your Interview Readiness Report</h2>
        <p>Based on your skill profile vs the extracted job requirements.</p>
      </div>

      {/* SCORE HERO */}
      <div className="score-hero">
        <div className="score-ring-wrap">
          <svg viewBox="0 0 120 120" width="160" height="160">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1c1f35" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke={scoreColor} strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - readinessScore / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
            <text x="60" y="55" textAnchor="middle" fill={scoreColor} fontSize="22" fontWeight="700" fontFamily="JetBrains Mono">{readinessScore}%</text>
            <text x="60" y="72" textAnchor="middle" fill="#6b7199" fontSize="9" fontFamily="Sora">Readiness</text>
          </svg>
        </div>
        <div className="score-details">
          <div className="score-badge" style={{ background: scoreColor + "22", color: scoreColor }}>
            {scoreEmoji} {scoreLabel}
          </div>
          <div className="score-stats">
            <div className="ss-item">
              <div className="ss-num" style={{ color: "#43d9ad" }}>{matched.length}</div>
              <div className="ss-label">Skills Matched</div>
            </div>
            <div className="ss-item">
              <div className="ss-num" style={{ color: "#ff4d6d" }}>{missing.length}</div>
              <div className="ss-label">Skills Missing</div>
            </div>
            <div className="ss-item">
              <div className="ss-num" style={{ color: "#f5c518" }}>{total}</div>
              <div className="ss-label">Total Required</div>
            </div>
          </div>
          <div className="score-bar-wrap">
            <div className="score-bar-label">
              <span>Match Rate</span>
              <span style={{ color: scoreColor }}>{matchPct}%</span>
            </div>
            <div className="score-bar-track">
              <div className="score-bar-fill" style={{ width: matchPct + "%", background: scoreColor }} />
            </div>
          </div>
        </div>
      </div>

      <div className="results-grid">

        {/* RADAR CHART */}
        <div className="results-panel">
          <div className="panel-title">Skills Comparison</div>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#252840" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: "#6b7199", fontSize: 11, fontFamily: "Sora" }} />
              <Tooltip
                contentStyle={{ background: "#141624", border: "1px solid #252840", borderRadius: 8, fontFamily: "Sora" }}
                labelStyle={{ color: "#e8eaf6" }}
              />
              <Radar name="You" dataKey="You" stroke="#6c63ff" fill="#6c63ff" fillOpacity={0.25} strokeWidth={2} />
              <Radar name="Required" dataKey="Required" stroke="#ff6584" fill="#ff6584" fillOpacity={0.1} strokeDasharray="4 2" strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="legend">
            <span className="legend-item"><span style={{ background: "#6c63ff" }} />You</span>
            <span className="legend-item"><span style={{ background: "#ff6584" }} />Required</span>
          </div>
        </div>

        {/* SKILL GAPS */}
        <div className="results-panel">
          <div className="panel-title">Priority Learning Path</div>
          {priorityMissing.length === 0 ? (
            <div className="all-matched">
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎉</div>
              <p>You match all required skills! Focus on depth and portfolio projects.</p>
            </div>
          ) : (
            <div className="gap-list">
              {priorityMissing.map((skill, i) => {
                const res = RESOURCES[skill] || getDefaultResource(skill);
                return (
                  <div key={skill} className="gap-item">
                    <div className="gap-rank">#{i + 1}</div>
                    <div className="gap-info">
                      <div className="gap-skill">{skill}</div>
                      <a href={res.url} target="_blank" rel="noreferrer" className="gap-resource">
                        📖 {res.label} →
                      </a>
                    </div>
                    <div className="gap-priority" style={{
                      color: i < 3 ? "#ff4d6d" : i < 6 ? "#f5c518" : "#6b7199",
                      fontSize: "0.7rem"
                    }}>
                      {i < 3 ? "HIGH" : i < 6 ? "MED" : "LOW"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MATCHED SKILLS */}
        <div className="results-panel">
          <div className="panel-title">Your Matched Skills ✓</div>
          <div className="matched-chips">
            {matched.map(skill => (
              <div key={skill} className="matched-chip">
                <span>✓</span> {skill}
                <span className="chip-level-sm">L{mySkills[skill]}</span>
              </div>
            ))}
            {matched.length === 0 && <p style={{ color: "#6b7199", fontSize: "0.85rem" }}>No matched skills yet. Go back and update your profile.</p>}
          </div>
        </div>

        {/* TIPS */}
        <div className="results-panel">
          <div className="panel-title">Action Plan</div>
          <div className="tips-list">
            {readinessScore < 40 && <div className="tip tip-red">🎯 Focus on the top 3 priority skills first — mastering core requirements will dramatically improve your match.</div>}
            {readinessScore >= 40 && readinessScore < 70 && <div className="tip tip-yellow">📈 You have a solid base. Build 1-2 portfolio projects that showcase your matched skills.</div>}
            {readinessScore >= 70 && <div className="tip tip-green">🚀 Great match! Strengthen depth in your Level 1-2 skills and prepare system design questions.</div>}
            <div className="tip tip-blue">💼 Tailor your resume to include the matched skills: <strong>{matched.slice(0,4).join(", ")}</strong>.</div>
            <div className="tip tip-blue">🔗 Add GitHub projects demonstrating: <strong>{missing.slice(0,3).join(", ") || matched.slice(0,3).join(", ")}</strong>.</div>
            {missing.length > 0 && <div className="tip tip-purple">⏰ Estimated learning time for top gaps: <strong>{missing.slice(0,3).length * 2}–{missing.slice(0,3).length * 4} weeks</strong> of focused practice.</div>}
          </div>
        </div>

      </div>

      <div className="step-footer">
        <button className="btn-secondary" onClick={onBack}>← Re-analyze</button>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn-export-r" onClick={exportProfile}>⬇ Export JSON</button>
          <button className="btn-primary" onClick={onReset}>🔄 New Analysis</button>
        </div>
      </div>
    </div>
  );
}
