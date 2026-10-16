
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
        setMessage("No learning steps were returned. Please check the backend response.");
      } else if (data.saved) {
        setMessage("Your roadmap has been generated and saved successfully.");
      } else {
        setMessage("Your personalised learning roadmap is ready.");
      }
    } catch {
      setMessage("Could not connect to the backend. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#253b34] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#547568] transition hover:text-[#244b3f]"
        >
          <span>←</span> Back to Dashboard
        </a>

        <header className="mb-9 mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9b7b42]">
            JOURNEYBUDDY / YOUR NEXT CHAPTER
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
            A little progress, <span className="italic text-[#547568]">every day.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#777e76]">
            Build a learning path around the skills you have today and the career you
            want tomorrow.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-[#e5e2d8] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeece5] px-6 py-5 sm:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9b7b42]">
                YOUR PERSONAL PLAN
              </p>
              <h2 className="mt-1 text-xl font-semibold">Let's map your journey</h2>
            </div>
            <span className="rounded-full bg-[#edf2eb] px-4 py-2 text-xs font-semibold text-[#426451]">
              Made for your goals
            </span>
          </div>

          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-[#35483f]">
                Skills you already know
              </label>
              <input
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Python, SQL, Pandas"
                className="mt-2 w-full rounded-xl border border-[#dedfd5] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#253b34] outline-none transition placeholder:text-[#a5a69d] focus:border-[#547568] focus:ring-2 focus:ring-[#547568]/10"
              />
              <p className="mt-2 text-xs leading-5 text-[#888d83]">
                Separate each skill with a comma.
              </p>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#35483f]">
                Career you're aiming for
              </label>
              <select
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                className="mt-2 w-full rounded-xl border border-[#dedfd5] bg-[#fbfaf7] px-4 py-3.5 text-sm text-[#253b34] outline-none transition focus:border-[#547568] focus:ring-2 focus:ring-[#547568]/10"
              >
                <option>Data Science Intern</option>
                <option>Data Analyst Intern</option>
                <option>Machine Learning Intern</option>
                <option>AI Engineer Intern</option>
                <option>Python Developer Intern</option>
                <option>Software Developer Intern</option>
              </select>
              <p className="mt-2 text-xs leading-5 text-[#888d83]">
                Choose the role you want to prepare for.
              </p>
            </div>

            <div className="md:col-span-2">
              <button
                onClick={generateRoadmap}
                disabled={loading || !skills.trim() || !targetRole}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#294e42] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#203f35] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Building your plan..." : "Generate my roadmap"}
                {!loading && <span>↗</span>}
              </button>
            </div>
          </div>
        </section>

        {message && (
          <div
            role="status"
            className="mt-6 rounded-2xl border border-[#dce4d9] bg-[#edf2eb] px-5 py-4 text-sm leading-6 text-[#426451]"
          >
            {message}
          </div>
        )}

        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b7b42]">
                ONE STEP AT A TIME
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
                Your learning journey
              </h2>
            </div>
            {steps.length > 0 && (
              <span className="rounded-full border border-[#e3e0d5] bg-white px-4 py-2 text-sm text-[#65756a]">
                {steps.length} {steps.length === 1 ? "step" : "steps"}
              </span>
            )}
          </div>

          {steps.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#d7d8cd] bg-white/70 px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#edf2eb] text-2xl text-[#426451]">
                ↗
              </div>
              <h3 className="mt-5 text-lg font-semibold">Your next chapter starts here</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81867d]">
                Add your current skills, select your dream role, and generate a
                step-by-step plan to get moving.
              </p>
            </div>
          )}

          <div className="space-y-5">
            {steps.map((item, index) => (
              <article
                key={`${item.step ?? index}-${item.title ?? item.topic ?? "step"}`}
                className="relative rounded-3xl border border-[#e5e2d8] bg-white p-6 shadow-sm transition hover:border-[#c9d6c9] sm:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#294e42] font-serif text-lg text-white">
                    {String(item.step ?? index + 1).padStart(2, "0")}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#9b7b42]">
                        STEP {item.step ?? index + 1}
                      </span>
                      {item.duration && (
                        <span className="rounded-full bg-[#f4f0e6] px-3 py-1 text-xs font-medium text-[#8a7043]">
                          {item.duration}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 text-xl font-semibold leading-snug text-[#294338] sm:text-2xl">
                      {item.title ?? item.topic ?? `Learning task ${index + 1}`}
                    </h3>

                    {item.description && (
                      <p className="mt-3 text-sm leading-7 text-[#777e76]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {(item.task || item.project || (item.resources && item.resources.length > 0)) && (
                  <div className="mt-6 grid gap-4 border-t border-[#eeece5] pt-5 sm:grid-cols-2">
                    {item.task && (
                      <div className="rounded-2xl bg-[#f7f5ef] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9b7b42]">
                          YOUR TASK
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#59675d]">
                          {item.task}
                        </p>
                      </div>
                    )}

                    {item.project && (
                      <div className="rounded-2xl bg-[#edf2eb] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#426451]">
                          PRACTICE PROJECT
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#59675d]">
                          {item.project}
                        </p>
                      </div>
                    )}

                    {item.resources && item.resources.length > 0 && (
                      <div className="rounded-2xl border border-[#e5e2d8] p-4 sm:col-span-2">
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#426451]">
                          USEFUL RESOURCES
                        </p>
                        <ul className="mt-3 space-y-2">
                          {item.resources.map((resource, resourceIndex) => (
                            <li
                              key={`${resource}-${resourceIndex}`}
                              className="flex items-start gap-2 text-sm leading-6 text-[#68746a]"
                            >
                              <span className="mt-0.5 text-[#9b7b42]">↗</span>
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-14 border-t border-[#e4e1d7] py-6 text-sm text-[#81867d]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p>Small steps make meaningful progress.</p>
            <div className="flex gap-5">
              <a href="/" className="transition hover:text-[#294e42]">
                Dashboard
              </a>
              <a href="/internships" className="transition hover:text-[#294e42]">
                Internships
              </a>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
