
"use client";

import { useState } from "react";

type Internship = {
  title: string;
  company: string;
  location: string;
  domain: string;
  required_skills: string[];
  description?: string;
};

type MatchResponse = {
  matches?: Internship[];
  skill_gaps?: string[];
  message?: string;
};

export default function InternshipsPage() {
  const [skills, setSkills] = useState("Python, Pandas, SQL");
  const [domain, setDomain] = useState("Data Science");
  const [location, setLocation] = useState("Bengaluru");
  const [matches, setMatches] = useState<Internship[]>([]);
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function findMatches() {
    setLoading(true);
    setMessage("");
    setMatches([]);
    setSkillGaps([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/internships/match",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
            preferred_domain: domain,
            preferred_location: location,
          }),
        }
      );

      const data: MatchResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to find internships.");
      }

      setMatches(data.matches || []);
      setSkillGaps(data.skill_gaps || []);

      if (!data.matches?.length) {
        setMessage(data.message || "No matching internships found. Try different skills or preferences.");
      }
    } catch {
      setMessage("Could not connect to the backend. Make sure your FastAPI server is running.");
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
          <h1 className="mt-3 text-4xl font-bold">
            Find Your Next Internship
          </h1>
          <p className="mt-3 text-slate-400">
            Match your skills with internship opportunities and discover skills to improve.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Your preferences</h2>

          <label className="mt-5 block text-sm text-slate-300">
            Skills (separate with commas)
          </label>
          <input
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            placeholder="Python, SQL, Machine Learning"
            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-cyan-400"
          />

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm text-slate-300">Preferred domain</label>
              <select
                value={domain}
                onChange={(event) => setDomain(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
              >
                <option>Data Science</option>
                <option>Machine Learning</option>
                <option>Artificial Intelligence</option>
                <option>Web Development</option>
                <option>Software Development</option>
                <option>Internet of Things</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-slate-300">Preferred location</label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Bengaluru, Pune, Hyderabad"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 p-3"
              />
            </div>
          </div>

          <button
            onClick={findMatches}
            disabled={loading}
            className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Finding matches..." : "Find Internships"}
          </button>
        </section>

        {message && (
          <p className="mt-6 rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-amber-200">
            {message}
          </p>
        )}

        {skillGaps.length > 0 && (
          <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">Skills to improve</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillGaps.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-amber-400/10 px-3 py-2 text-sm text-amber-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">
            Matching opportunities ({matches.length})
          </h2>

          {matches.length === 0 && !message && (
            <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">
              Enter your preferences and select Find Internships to see matches.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {matches.map((internship, index) => (
              <article
                key={`${internship.title}-${internship.company}-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <p className="text-sm text-cyan-400">{internship.domain}</p>
                <h3 className="mt-2 text-xl font-semibold">{internship.title}</h3>
                <p className="mt-2 text-slate-300">{internship.company}</p>
                <p className="mt-1 text-sm text-slate-400">{internship.location}</p>

                {internship.description && (
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    {internship.description}
                  </p>
                )}

                {internship.required_skills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {internship.required_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-4 text-xs text-amber-300">
                  Sample opportunity — verify details before applying.
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
