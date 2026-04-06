import { useState } from "react";

const ALL_SKILLS = [
  "JavaScript","TypeScript","Python","Java","C++","C","SQL","HTML","CSS","Go","Rust",
  "React.js","Vue.js","Angular","Next.js","Redux","Tailwind CSS","CSS Grid/Flexbox","Webpack/Vite","Testing (Jest)","Storybook",
  "Node.js","Express.js","REST APIs","GraphQL","Django","Spring Boot","FastAPI",
  "MongoDB","PostgreSQL","MySQL","Redis","Firebase",
  "Git","GitHub","Docker","CI/CD","Linux","Figma","Postman","VS Code",
  "Data Structures","Algorithms","System Design","OOP","Agile/Scrum","Microservices","Responsive Design",
];

const ALIASES = {
  "react": "React.js", "reactjs": "React.js", "react.js": "React.js",
  "vue": "Vue.js", "vuejs": "Vue.js",
  "angular": "Angular", "angularjs": "Angular",
  "next": "Next.js", "nextjs": "Next.js",
  "js": "JavaScript", "javascript": "JavaScript", "es6": "JavaScript",
  "ts": "TypeScript", "typescript": "TypeScript",
  "node": "Node.js", "nodejs": "Node.js",
  "express": "Express.js",
  "tailwind": "Tailwind CSS",
  "css": "CSS", "scss": "CSS", "sass": "CSS",
  "html": "HTML", "html5": "HTML",
  "git": "Git", "github": "GitHub",
  "python": "Python", "java": "Java",
  "rest": "REST APIs", "api": "REST APIs",
  "graphql": "GraphQL",
  "mongodb": "MongoDB", "mongo": "MongoDB",
  "postgres": "PostgreSQL", "postgresql": "PostgreSQL",
  "mysql": "MySQL",
  "redis": "Redis",
  "docker": "Docker",
  "sql": "SQL",
  "dsa": "Data Structures", "data structures": "Data Structures",
  "algorithms": "Algorithms",
  "oop": "OOP", "object oriented": "OOP",
  "responsive": "Responsive Design",
  "agile": "Agile/Scrum", "scrum": "Agile/Scrum",
  "vite": "Webpack/Vite", "webpack": "Webpack/Vite",
  "redux": "Redux",
  "figma": "Figma",
  "jest": "Testing (Jest)", "testing": "Testing (Jest)",
  "firebase": "Firebase",
  "linux": "Linux",
  "postman": "Postman",
};

function extractSkillsFromJD(text) {
  const lower = text.toLowerCase();
  const found = new Set();

  // Word boundary extraction
  const words = lower.match(/[a-z0-9.#+]+/g) || [];
  words.forEach(w => {
    if (ALIASES[w]) found.add(ALIASES[w]);
  });

  // Phrase matching
  Object.keys(ALIASES).forEach(alias => {
    if (alias.includes(' ') && lower.includes(alias)) {
      found.add(ALIASES[alias]);
    }
  });

  // Direct skill name matching
  ALL_SKILLS.forEach(skill => {
    if (lower.includes(skill.toLowerCase())) found.add(skill);
  });

  return [...found];
}

function computeMatch(mySkills, jdSkills) {
  if (!jdSkills.length) return null;

  const matched = jdSkills.filter(s => mySkills[s]);
  const missing = jdSkills.filter(s => !mySkills[s]);
  const matchPct = Math.round((matched.length / jdSkills.length) * 100);

  // Weighted score: higher skill ratings boost the score
  const weightedScore = matched.reduce((acc, s) => acc + (mySkills[s] / 5), 0);
  const maxWeighted = jdSkills.length;
  const readinessScore = Math.round((weightedScore / maxWeighted) * 100);

  return { matched, missing, matchPct, readinessScore, total: jdSkills.length };
}

const SAMPLE_JD = `We are looking for a skilled Frontend Engineer with experience in React.js and modern JavaScript (ES6+). The ideal candidate should be proficient in:

- React.js with Hooks (useState, useEffect)
- TypeScript for type-safe development  
- CSS Grid and Flexbox for responsive design
- REST APIs and integration with backend services
- Git and GitHub for version control
- Agile/Scrum development process
- Testing with Jest

Bonus: Experience with Redux, Next.js, Node.js, Figma, or Docker is a plus.`;

export default function JDAnalyzer({ jdText, mySkills, dispatch, onNext, onBack }) {
  const [localJD, setLocalJD] = useState(jdText || "");
  const [extracted, setExtracted] = useState([]);
  const [analyzed, setAnalyzed] = useState(false);

  function analyze() {
    if (!localJD.trim()) return;
    const skills = extractSkillsFromJD(localJD);
    const result = computeMatch(mySkills, skills);
    setExtracted(skills);
    setAnalyzed(true);
    dispatch({ type: "SET_JD", payload: localJD });
    dispatch({ type: "SET_JD_SKILLS", payload: skills });
    dispatch({ type: "SET_RESULT", payload: result });
  }

  function useSample() {
    setLocalJD(SAMPLE_JD);
    setAnalyzed(false);
    setExtracted([]);
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Paste Job Description</h2>
        <p>We'll automatically extract required skills and compare them against your profile.</p>
      </div>

      <div className="jd-layout">
        <div className="jd-input-col">
          <div className="jd-toolbar">
            <label>Job Description Text</label>
            <button className="link-btn" onClick={useSample}>Load Sample JD</button>
          </div>
          <textarea
            className="jd-textarea"
            value={localJD}
            onChange={e => { setLocalJD(e.target.value); setAnalyzed(false); setExtracted([]); }}
            placeholder="Paste the full job description here... We'll extract required skills automatically."
            rows={14}
          />
          <div className="char-count">{localJD.length} characters</div>
        </div>

        <div className="jd-result-col">
          {!analyzed ? (
            <div className="analyze-prompt">
              <div className="analyze-icon">🔍</div>
              <p>Click Analyze to extract skills from the job description</p>
            </div>
          ) : (
            <div className="extracted-skills">
              <div className="extracted-title">
                <span>Skills Detected</span>
                <span className="skill-count-badge">{extracted.length}</span>
              </div>
              <div className="skill-chips">
                {extracted.map(s => {
                  const has = mySkills[s];
                  return (
                    <div key={s} className={`skill-chip ${has ? "has" : "missing"}`}>
                      <span>{has ? "✓" : "✗"}</span>
                      {s}
                      {has && <span className="chip-level">L{has}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="quick-summary">
                <div className="qs-item green">
                  <span className="qs-num">{extracted.filter(s => mySkills[s]).length}</span>
                  <span>Matched</span>
                </div>
                <div className="qs-item red">
                  <span className="qs-num">{extracted.filter(s => !mySkills[s]).length}</span>
                  <span>Missing</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="step-footer">
        <button className="btn-secondary" onClick={onBack}>← Back</button>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-analyze" onClick={analyze} disabled={!localJD.trim()}>
            🔍 Analyze JD
          </button>
          {analyzed && extracted.length > 0 && (
            <button className="btn-primary" onClick={onNext}>
              View Results →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
