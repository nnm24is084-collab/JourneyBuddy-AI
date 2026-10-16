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

const domains = ["Any", "Data Science", "Data Analytics", "Artificial Intelligence", "Software Development"];
const locations = ["Any", "Pune", "Bengaluru", "Hyderabad", "Remote"];

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
          target_role: domain === "Any" ? "Data Science Intern" : `${domain} Intern`,
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data: RoadmapResponse = await response.json();
      setRoadmap(data);
    } catch {
      setRoadmapError("Couldn't load the roadmap. Check that the backend is running, then try again.");
    } finally {
      setRoadmapLoading(false);
    }
  }

  async function findMatches() {
    setLoading(true);
    setError("");
    setMatches([]);
    try {
      const response = await fetch("http://127.0.0.1:8000/internships/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
          preferred_domain: domain,
          preferred_location: location,
        }),
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setMatches(data.matches || []);
    } catch {
      setError("Couldn't connect to the backend. Check that FastAPI is running, then try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#202b3c]">
      <header className="border-b border-[#e5e7df] bg-[#fbfbf8]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="JourneyBuddy home">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#244b43] text-lg font-bold text-white shadow-sm">J</span>
            <span className="text-xl font-bold tracking-tight">Journey<span className="text-[#317565]">Buddy</span><span className="ml-1 text-xs font-semibold text-[#6b7280]">STUDENT EDITION</span></span>
          </a>
          <div className="hidden items-center gap-2 sm:flex">
            <a href="/" className="rounded-full bg-[#e6efe9] px-4 py-2 text-sm font-semibold text-[#244b43]">Dashboard</a>
            <a href="/internships" className="rounded-full px-4 py-2 text-sm font-medium text-[#586273] transition hover:bg-white hover:text-[#244b43]">Internships</a>
            <a href="/roadmap" className="rounded-full px-4 py-2 text-sm font-medium text-[#586273] transition hover:bg-white hover:text-[#244b43]">Roadmap</a>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <section className="grid items-stretch gap-7 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#d8e4dc] bg-white px-3.5 py-2 text-sm font-medium text-[#45645a] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#d29a43]" /> A practical place to plan your next step
            </div>
            <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight text-[#202b3c] sm:text-5xl lg:text-[3.7rem]">
              Build your skills.<br />Find your <span className="font-serif italic text-[#317565]">next opportunity.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#687282] sm:text-lg">
              Keep your internship search and learning goals in one place. Add the skills you have, explore relevant roles, and turn the gaps into a plan.
            </p>
            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e5e7df] bg-white p-4">
                <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[#e7f0e9] text-[#317565]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4M8.5 11h5"/></svg></span>
                <p className="text-sm font-semibold">Find roles</p><p className="mt-1 text-xs leading-5 text-[#7b8491]">Compare your skills with opportunities.</p>
              </div>
              <div className="rounded-2xl border border-[#e5e7df] bg-white p-4">
                <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[#f8eddc] text-[#a56c20]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M12 3 4.5 7v5c0 4.5 3.2 7.5 7.5 9 4.3-1.5 7.5-4.5 7.5-9V7L12 3Z"/><path d="m9 12 2 2 4-4"/></svg></span>
                <p className="text-sm font-semibold">Spot gaps</p><p className="mt-1 text-xs leading-5 text-[#7b8491]">See skills worth working on next.</p>
              </div>
              <div className="rounded-2xl border border-[#e5e7df] bg-white p-4">
                <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-[#e9eafa] text-[#5b62a8]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 19V5M4 19h17"/><path d="m7 15 4-4 3 2 5-6"/></svg></span>
                <p className="text-sm font-semibold">Make a plan</p><p className="mt-1 text-xs leading-5 text-[#7b8491]">Turn learning into small milestones.</p>
              </div>
            </div>
            <p className="mt-5 text-xs text-[#9299a2]">A student-built career planning project · Internship examples may be demo data</p>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#dfe7df] bg-white p-5 shadow-[0_18px_60px_-36px_rgba(35,65,55,0.32)] sm:p-8">
            <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#edf4ec] blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#317565]">Your starting point</p><h2 className="mt-2 text-2xl font-bold tracking-tight">Set your preferences</h2><p className="mt-2 text-sm leading-6 text-[#77808d]">A few details help us shape your results.</p></div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#244b43] text-white"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1m-8.6 8.6-2.1 2.1"/><circle cx="12" cy="12" r="4"/></svg></span>
              </div>
              <form onSubmit={(event) => { event.preventDefault(); void findMatches(); }} className="relative mt-7 space-y-5">
                <div>
                  <label htmlFor="skills" className="mb-2 block text-sm font-semibold text-[#374151]">Skills you know</label>
                  <input id="skills" value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Python, SQL, Excel" className="w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-4 py-3.5 text-sm text-[#202b3c] outline-none transition placeholder:text-[#a2a9b1] focus:border-[#6b9c8c] focus:ring-4 focus:ring-[#317565]/10" required />
                  <p className="mt-2 text-xs text-[#8b929c]">Use commas to separate skills.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label htmlFor="domain" className="mb-2 block text-sm font-semibold text-[#374151]">Area of interest</label><select id="domain" value={domain} onChange={(event) => setDomain(event.target.value)} className="w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-4 py-3.5 text-sm text-[#374151] outline-none focus:border-[#6b9c8c] focus:ring-4 focus:ring-[#317565]/10">{domains.map((item) => <option key={item}>{item}</option>)}</select></div>
                  <div><label htmlFor="location" className="mb-2 block text-sm font-semibold text-[#374151]">Preferred location</label><select id="location" value={location} onChange={(event) => setLocation(event.target.value)} className="w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-4 py-3.5 text-sm text-[#374151] outline-none focus:border-[#6b9c8c] focus:ring-4 focus:ring-[#317565]/10">{locations.map((item) => <option key={item}>{item}</option>)}</select></div>
                </div>
                <button type="submit" disabled={loading} className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#244b43] px-5 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#1c3d36] focus:outline-none focus:ring-4 focus:ring-[#317565]/20 disabled:cursor-wait disabled:opacity-60">
                  {loading ? "Finding suitable matches…" : "Find internship matches"}<span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
                </button>
              </form>
              {error && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
              <div className="mt-5 flex items-center gap-2 border-t border-[#edf0eb] pt-4 text-xs text-[#8a929c]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>Your preferences are used to generate matches for this session.</div>
            </div>
          </div>
        </section>

        {matches.length > 0 && <section className="mt-16" aria-labelledby="matches-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#317565]">Matching results</p><h2 id="matches-heading" className="mt-2 text-3xl font-bold tracking-tight">Roles to explore</h2><p className="mt-2 text-sm text-[#77808d]">Use these results as a starting point for your search.</p></div><span className="rounded-full border border-[#dfe7df] bg-white px-3 py-2 text-xs font-semibold text-[#5f6d66]">{matches.length} {matches.length === 1 ? "result" : "results"}</span></div>
          <p className="mb-5 rounded-xl border border-[#eadfc9] bg-[#fffaf0] px-4 py-3 text-xs leading-5 text-[#8b6b36]">Note: these are demonstration results, not verified live vacancies. Confirm details with the employer before applying.</p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{matches.map((internship) => <article key={internship.id} className="rounded-2xl border border-[#e2e7e1] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wide text-[#317565]">{internship.domain}</p><h3 className="mt-2 text-lg font-bold text-[#263448]">{internship.title}</h3><p className="mt-1 text-sm text-[#77808d]">{internship.company}</p></div><div className="shrink-0 rounded-xl bg-[#e7f0e9] px-3 py-2 text-center"><span className="block text-lg font-bold text-[#244b43]">{internship.match_score}%</span><span className="text-[10px] font-semibold uppercase tracking-wide text-[#557368]">match</span></div></div>
            <p className="mt-3 flex items-center gap-2 text-sm text-[#687282]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>{internship.location}</p>
            <div className="mt-5"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#687282]">Skills you already have</p><div className="flex flex-wrap gap-2">{internship.matched_skills.length ? internship.matched_skills.map((skill) => <span key={skill} className="rounded-full bg-[#edf5ef] px-2.5 py-1 text-xs font-medium text-[#356d53]">{skill}</span>) : <span className="text-sm text-[#9299a2]">No listed skills matched yet</span>}</div></div>
            <div className="mt-4"><p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#687282]">Skills to build</p><div className="flex flex-wrap gap-2">{internship.skill_gaps.length ? internship.skill_gaps.map((skill) => <span key={skill} className="rounded-full bg-[#fff3df] px-2.5 py-1 text-xs font-medium text-[#98641c]">{skill}</span>) : <span className="text-sm text-[#356d53]">No gaps listed</span>}</div></div>
            <p className="mt-5 border-t border-[#edf0eb] pt-4 text-sm leading-6 text-[#687282]">{internship.explanation}</p>
          </article>)}</div>
        </section>}

        <section className="mt-16" aria-labelledby="roadmap-heading">
          <div className="overflow-hidden rounded-[2rem] border border-[#dfe7df] bg-white shadow-sm">
            <div className="grid gap-8 bg-[#eaf1eb] p-6 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center">
              <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#317565]">Learning planner</p><h2 id="roadmap-heading" className="mt-2 text-3xl font-bold tracking-tight text-[#243b34]">Make your next step a clear one.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#65766d]">Create a learning plan based on your current skills, with topics to practise and projects to try.</p></div>
              <button type="button" onClick={() => void generateRoadmap()} disabled={roadmapLoading} className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#244b43] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#1c3d36] disabled:cursor-wait disabled:opacity-60">{roadmapLoading ? "Building your plan…" : "Build my roadmap"}<span aria-hidden="true">→</span></button>
            </div>
            <div className="p-6 sm:p-9">
              {roadmapError && <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{roadmapError}</p>}
              {!roadmap && !roadmapError && <div className="grid gap-4 sm:grid-cols-3">{[{n:"01",title:"Review your skills",desc:"Start with the skills you entered above."},{n:"02",title:"Choose a focus",desc:"Use your preferred area as a learning direction."},{n:"03",title:"Work through tasks",desc:"Build confidence by practising one step at a time."}].map((item) => <div key={item.n} className="flex gap-3 rounded-2xl border border-[#edf0eb] p-4"><span className="text-sm font-bold text-[#317565]">{item.n}</span><div><p className="text-sm font-semibold text-[#354254]">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#87909b]">{item.desc}</p></div></div>)}</div>}
              {roadmap && <div><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#317565]">Your learning plan</p><h3 className="mt-2 text-2xl font-bold text-[#263448]">{roadmap.target_role}</h3></div><span className="rounded-full bg-[#f4f0e6] px-3 py-2 text-sm font-semibold text-[#896b35]">{roadmap.total_steps} steps</span></div>
                {roadmap.roadmap.length === 0 ? <p className="rounded-xl bg-[#edf5ef] p-4 text-sm text-[#356d53]">You already have the skills listed in this starter roadmap. Keep practising and build a project to demonstrate them.</p> : <div className="space-y-4">{roadmap.roadmap.map((item, index) => <article key={item.step} className="relative grid gap-4 rounded-2xl border border-[#e5e9e3] p-5 sm:grid-cols-[52px_1fr] sm:gap-5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e7f0e9] text-sm font-bold text-[#244b43]">{String(item.step || index + 1).padStart(2, "0")}</div><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#f4f0e6] px-2.5 py-1 text-xs font-semibold text-[#896b35]">{item.duration}</span><span className="text-xs text-[#8b929c]">{item.status}</span></div><h4 className="mt-2 text-lg font-bold text-[#263448]">{item.skill}</h4><p className="mt-2 text-sm leading-6 text-[#687282]">{item.task}</p><div className="mt-3 rounded-xl bg-[#f7f8f5] px-4 py-3"><p className="text-[11px] font-bold uppercase tracking-wide text-[#778078]">Try building</p><p className="mt-1 text-sm text-[#354254]">{item.project}</p></div></div></article>)}</div>}
                <p className="mt-5 text-xs leading-5 text-[#8b929c]">{roadmap.notice}</p>
              </div>}
            </div>
          </div>
        </section>

        <footer className="mt-12 flex flex-col gap-3 border-t border-[#e2e7df] pt-6 text-xs text-[#8b929c] sm:flex-row sm:items-center sm:justify-between"><p>JourneyBuddy · A student project for planning skills and internship searches.</p><div className="flex gap-4"><a href="/internships" className="transition hover:text-[#317565]">Internships</a><a href="/roadmap" className="transition hover:text-[#317565]">Roadmap</a></div></footer>
      </div>
    </main>
  );
}