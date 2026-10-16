
"use client";

import { useState } from "react";

type RoadmapStep = {
  step?: number;
  title?: string;
  topic?: string;
  description?: string;
  task?: string;
  project?: string;
  duration?: string;
  resources?: string[];
};

type RoadmapResponse = {
  roadmap?: RoadmapStep[];
  steps?: RoadmapStep[];
  target_role?: string;
  saved?: boolean;
  message?: string;
};

export default function RoadmapPage() {
  const [skills, setSkills] = useState("Python, Pandas");
  const [targetRole, setTargetRole] = useState("Data Science Intern");
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateRoadmap() {
    setLoading(true);
    setMessage("");
    setSteps([]);

    try {
      const response = await fetch("http://127.0.0.1:8000/roadmap/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
          target_role: targetRole,
        }),
      });

      const data: RoadmapResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not generate roadmap.");
      }

      const roadmapSteps = data.roadmap || data.steps || [];
      setSteps(roadmapSteps);

      if (roadmapSteps.length === 0) {
        setMessage("The backend responded, but the roadmap format needs checking.");
      } else if (data.saved) {
        setMessage("Your roadmap has been generated and saved successfully.");
      }
    } catch {
      setMessage("Could not connect to the backend. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm text-cyan-400 hover:text-cyan-300">
          ← Back to Dashboard
        </a>

        <header className="mb-8 mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            JourneyBuddy AI
          </p>
          <h1 className="mt-3 text-4xl font-bold">Your Skill Roadmap</h1>
          <p className="mt-3 text-slate-400">
            Turn your current skills into a practical learning plan for your target career.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Build your learning plan</h2>

          <label className="mt-5 block text-sm text-slate-300">
            Skills you already know
          </label>
          <input
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="Python, SQL, Pandas"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-cyan-400"
          />

          <label className="mt-5 block text-sm text-slate-300">
            Target role
          </label>
          <select
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
          >
            <option>Data Science Intern</option>
            <option>Data Analyst Intern</option>
            <option>Machine Learning Intern</option>
            <option>AI Engineer Intern</option>
            <option>Python Developer Intern</option>
            <option>Software Developer Intern</option>
          </select>

          <button
            onClick={generateRoadmap}
            disabled={loading}
            className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate My Roadmap →"}
          </button>
        </section>

        {message && (
          <p className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-300">
            {message}
          </p>
        )}

        <section className="mt-8">
          <h2 className="mb-5 text-2xl font-bold">Your learning steps</h2>

          {steps.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              Choose your skills and target role, then generate your roadmap.
            </div>
          )}

          <div className="space-y-4">
            {steps.map((item, index) => (
              <article
                key={`${item.step ?? index}-${item.title ?? item.topic ?? "step"}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm font-semibold text-cyan-400">
                  STEP {item.step ?? index + 1}
                  {item.duration ? ` · ${item.duration}` : ""}
                </p>

                <h3 className="mt-2 text-xl font-semibold">
                  {item.title ?? item.topic ?? `Learning task ${index + 1}`}
                </h3>

                {item.description && (
                  <p className="mt-3 leading-6 text-slate-300">{item.description}</p>
                )}

                {item.task && (
                  <p className="mt-3 text-sm text-slate-300">
                    <strong>Task:</strong> {item.task}
                  </p>
                )}

                {item.project && (
                  <p className="mt-3 text-sm text-slate-300">
                    <strong>Practice project:</strong> {item.project}
                  </p>
                )}

                {item.resources && item.resources.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-200">Resources</p>
                    <ul className="mt-2 list-inside list-disc text-sm text-slate-400">
                      {item.resources.map((resource) => (
                        <li key={resource}>{resource}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
