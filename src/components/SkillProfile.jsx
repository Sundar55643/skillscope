import { useState } from "react";

const SKILL_CATEGORIES = {
  "Languages": ["JavaScript", "TypeScript", "Python", "Java", "C++", "C", "SQL", "HTML", "CSS", "Go", "Rust"],
  "Frontend": ["React.js", "Vue.js", "Angular", "Next.js", "Redux", "Tailwind CSS", "CSS Grid/Flexbox", "Webpack/Vite", "Testing (Jest)", "Storybook"],
  "Backend": ["Node.js", "Express.js", "REST APIs", "GraphQL", "Django", "Spring Boot", "FastAPI"],
  "Databases": ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"],
  "Tools & DevOps": ["Git", "GitHub", "Docker", "CI/CD", "Linux", "Figma", "Postman", "VS Code"],
  "Concepts": ["Data Structures", "Algorithms", "System Design", "OOP", "Agile/Scrum", "Microservices", "Responsive Design"],
};

const LEVEL_LABELS = ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
const LEVEL_COLORS = ["", "#555", "#6c63ff", "#f5c518", "#43d9ad", "#ff6584"];

export default function SkillProfile({ mySkills, dispatch, onNext }) {
  const [activeCategory, setActiveCategory] = useState("Languages");
  const totalRated = Object.keys(mySkills).length;

  function setSkill(skill, level) {
    const updated = { ...mySkills };
    if (level === 0) delete updated[skill];
    else updated[skill] = level;
    dispatch({ type: "SET_SKILLS", payload: updated });
  }

  function clearAll() {
    dispatch({ type: "SET_SKILLS", payload: {} });
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Build Your Skill Profile</h2>
        <p>Rate your proficiency in each skill. Be honest — this helps generate accurate gap analysis.</p>
      </div>

      <div className="skill-layout">
        <div className="category-nav">
          {Object.keys(SKILL_CATEGORIES).map((cat) => {
            const rated = SKILL_CATEGORIES[cat].filter((s) => mySkills[s]).length;
            return (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                {rated > 0 && <span className="cat-badge">{rated}</span>}
              </button>
            );
          })}
        </div>

        <div className="skill-grid-wrap">
          <div className="skill-grid">
            {SKILL_CATEGORIES[activeCategory].map((skill) => {
              const level = mySkills[skill] || 0;
              return (
                <div key={skill} className={`skill-card ${level > 0 ? "rated" : ""}`}>
                  <div className="skill-name">{skill}</div>
                  <div className="level-label" style={{ color: LEVEL_COLORS[level] || "#555" }}>
                    {LEVEL_LABELS[level] || "Not rated"}
                  </div>
                  <div className="level-buttons">
                    {[1, 2, 3, 4, 5].map((l) => (
                      <button
                        key={l}
                        className={`level-dot ${level >= l ? "filled" : ""}`}
                        style={{ "--dot-color": LEVEL_COLORS[l] }}
                        onClick={() => setSkill(skill, level === l ? 0 : l)}
                        title={LEVEL_LABELS[l]}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="step-footer">
        <div className="footer-info">
          <span className="rated-count">{totalRated} skills rated</span>
          {totalRated > 0 && (
            <button className="link-btn" onClick={clearAll}>Clear all</button>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={totalRated < 3}
        >
          {totalRated < 3 ? `Rate at least 3 skills (${totalRated}/3)` : "Analyze Job Description →"}
        </button>
      </div>
    </div>
  );
}
