
"use client";

import { useState } from "react";

type Internship = {
  id: number;
  title: string;
  company: string;
  location: string;
  domain: string;
  skills: string[];
  match_score: number;
  matched_skills: string[];
  skill_gaps: string[];
  explanation: string;
};

type RoadmapItem = {
  skill: string;
  duration: string;
  task: string;
  project: string;
  status: string;
  step: number;
};

type RoadmapResponse = {
  target_role: string;
  known_skills: string[];
  total_steps: number;
  roadmap: RoadmapItem[];
  notice: string;
};


export default function Home() {
  const [skills, setSkills] = useState("Python, Pandas");
  const [domain, setDomain] = useState("Data Science");
  const [location, setLocation] = useState("Pune");
  const [matches, setMatches] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  async function generateRoadmap() {
    setRoadmapLoading(true);
    setRoadmapError("");
    setRoadmap(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/roadmap/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          target_role:
            domain === "Any" ? "Data Science Intern" : `${domain} Intern`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: RoadmapResponse = await response.json();
      setRoadmap(data);
    } catch {
      setRoadmapError(
        "Could not load your roadmap. Make sure the FastAPI backend is running."
      );
    } finally {
      setRoadmapLoading(false);
    }
  }


  async function findMatches() {
    setLoading(true);
    setError("");
    setMatches([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/internships/match",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
            preferred_domain: domain,
            preferred_location: location,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();
      setMatches(data.matches);
    } catch {
      setError(
        "Could not connect to the backend. Make sure your FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="#" className="text-2xl font-bold tracking-tight">
          <span className="text-cyan-400">Journey</span>Buddy AI
        </a>
        <span className="rounded-full border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300">
          Your career copilot
        </span>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
            Your next chapter starts here
          </p>

          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">
            Your skills.
            <br />
            Your journey.
            <br />
            <span className="text-cyan-400">Your future.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Discover internship opportunities that fit your skills, understand
            what you need to learn, and take your next career step with
            JourneyBuddy AI.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-white/10 px-4 py-2">
              AI-powered matching
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              Skill-gap insights
            </span>
            <span className="rounded-full bg-white/10 px-4 py-2">
              Student focused
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <p className="text-sm text-cyan-400">INTERNSHIP MATCHMAKER</p>
            <h2 className="mt-2 text-2xl font-bold">
              Find your next opportunity
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Tell us what you know and where you want to go.
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void findMatches();
            }}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="skills"
                className="mb-2 block text-sm font-medium"
              >
                Your skills
              </label>
              <input
                id="skills"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="Python, SQL, Machine Learning"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none transition focus:border-cyan-400"
                required
              />
              <p className="mt-2 text-xs text-slate-400">
                Separate each skill with a comma.
              </p>
            </div>

            <div>
              <label
                htmlFor="domain"
                className="mb-2 block text-sm font-medium"
              >
                Preferred domain
              </label>
              <select
                id="domain"
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              >
                <option>Any</option>
                <option>Data Science</option>
                <option>Data Analytics</option>
                <option>Artificial Intelligence</option>
                <option>Software Development</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium"
              >
                Preferred location
              </label>
              <select
                id="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              >
                <option>Any</option>
                <option>Pune</option>
                <option>Bengaluru</option>
                <option>Hyderabad</option>
                <option>Remote</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 px-5 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Finding your matches..." : "Find My Matches →"}
            </button>
          </form>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>
      </section>

      {matches.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="mb-7">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Your results
            </p>
            <h2 className="mt-2 text-3xl font-bold">
              Opportunities picked for you
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Demonstration data only. These are not verified live vacancies.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {matches.map((internship) => (
              <article
                key={internship.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-cyan-400">
                      {internship.domain}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      {internship.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {internship.company} · {internship.location}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-xl bg-cyan-400/10 px-3 py-2 font-bold text-cyan-300">
                    {internship.match_score}%
                  </span>
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-sm font-semibold">
                    Skills you have
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {internship.matched_skills.length > 0 ? (
                      internship.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300"
                        >
                          ✓ {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No listed skills matched yet
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold">
                    Skills to learn
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {internship.skill_gaps.length > 0 ? (
                      internship.skill_gaps.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-amber-400/10 px-3 py-1 text-xs text-amber-200"
                        >
                          + {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-emerald-300">
                        You have all listed skills!
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-6 text-slate-300">
                  {internship.explanation}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            PERSONALIZED LEARNING
          </p>

          <h2 className="mt-2 text-3xl font-bold">Your Skill Roadmap</h2>

          <p className="mt-3 text-slate-300">
            Turn your skill gaps into practical learning tasks and projects.
          </p>

          <button
            type="button"
            onClick={() => void generateRoadmap()}
            disabled={roadmapLoading}
            className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 disabled:opacity-60"
          >
            {roadmapLoading
              ? "Building your roadmap..."
              : "Generate My Roadmap →"}
          </button>

          {roadmapError && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {roadmapError}
            </p>
          )}

          {roadmap && (
            <div className="mt-8">
              <h3 className="text-xl font-bold">{roadmap.target_role}</h3>

              <p className="mt-2 text-sm text-slate-400">
                {roadmap.total_steps} learning steps based on your skills.
              </p>

              {roadmap.roadmap.length === 0 ? (
                <p className="mt-5 text-emerald-300">
                  Great! You already have all the skills in this starter roadmap.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {roadmap.roadmap.map((item) => (
                    <article
                      key={item.step}
                      className="rounded-2xl border border-white/10 bg-slate-900 p-5"
                    >
                      <p className="text-sm text-cyan-400">
                        STEP {item.step} · {item.duration}
                      </p>

                      <h4 className="mt-3 text-lg font-bold">
                        {item.skill}
                      </h4>

                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {item.task}
                      </p>

                      <p className="mt-4 text-sm text-slate-400">
                        Suggested project: {item.project}
                      </p>

                      <p className="mt-3 text-xs text-amber-300">
                        Status: {item.status}
                      </p>
                    </article>
                  ))}
                </div>
              )}

              <p className="mt-6 text-xs text-slate-500">
                {roadmap.notice}
              </p>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        JourneyBuddy AI · Learn smarter. Apply confidently. Grow continuously.
      </footer>
    </main>
  );
}
