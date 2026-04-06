import { useState, useEffect, useReducer } from "react";
import JDAnalyzer from "./components/JDAnalyzer";
import SkillProfile from "./components/SkillProfile";
import ResultsPanel from "./components/ResultsPanel";
import "./App.css";

const STEPS = ["Profile", "Analyze JD", "Results"];

const initialState = {
  step: 0,
  mySkills: JSON.parse(localStorage.getItem("ss_skills") || "{}"),
  jdText: "",
  jdSkills: [],
  matchResult: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SKILLS":
      return { ...state, mySkills: action.payload };
    case "SET_JD":
      return { ...state, jdText: action.payload };
    case "SET_JD_SKILLS":
      return { ...state, jdSkills: action.payload };
    case "SET_RESULT":
      return { ...state, matchResult: action.payload };
    case "SET_STEP":
      return { ...state, step: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("ss_skills", JSON.stringify(state.mySkills));
  }, [state.mySkills]);

  return (
    <div className="app-shell">
      <div className="bg-grid" />

      <header className="app-header">
        <div className="logo-wrap">
          <div className="logo-icon">◈</div>
          <div>
            <h1>SkillScope</h1>
            <p>Developer Skills Gap Analyzer</p>
          </div>
        </div>
        <div className="step-indicators">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`step-pill ${state.step === i ? "active" : ""} ${state.step > i ? "done" : ""}`}
              onClick={() => dispatch({ type: "SET_STEP", payload: i })}
            >
              <span className="step-num">{state.step > i ? "✓" : i + 1}</span>
              <span className="step-label">{s}</span>
            </div>
          ))}
        </div>
      </header>

      <main className="app-main">
        {state.step === 0 && (
          <SkillProfile
            mySkills={state.mySkills}
            dispatch={dispatch}
            onNext={() => dispatch({ type: "SET_STEP", payload: 1 })}
          />
        )}
        {state.step === 1 && (
          <JDAnalyzer
            jdText={state.jdText}
            mySkills={state.mySkills}
            dispatch={dispatch}
            onNext={() => dispatch({ type: "SET_STEP", payload: 2 })}
            onBack={() => dispatch({ type: "SET_STEP", payload: 0 })}
          />
        )}
        {state.step === 2 && (
          <ResultsPanel
            result={state.matchResult}
            mySkills={state.mySkills}
            jdSkills={state.jdSkills}
            onBack={() => dispatch({ type: "SET_STEP", payload: 1 })}
            onReset={() => dispatch({ type: "SET_STEP", payload: 0 })}
          />
        )}
      </main>
    </div>
  );
}
