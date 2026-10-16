
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

const domains = [
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Web Development",
  "Software Development",
  "Internet of Things",
];

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
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
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
        setMessage(
          data.message ||
            "No matching internships found. Try different skills or preferences."
        );
      }
    } catch {
      setMessage(
        "Could not connect to the backend. Make sure your FastAPI server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#202b3c]">
      <header className="border-b border-[#e5e7df] bg-[#fbfbf8]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#244b43] text-lg font-bold text-white">
              J
            </span>
            <span className="text-xl font-bold tracking-tight">
              Journey<span className="text-[#317565]">Buddy</span>
              <span className="ml-2 text-[10px] font-semibold tracking-wide text-[#6b7280]">
                STUDENT EDITION
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium text-[#586273] transition hover:bg-[#e6efe9] hover:text-[#244b43]"
            >
              Dashboard
            </a>
            <a
              href="/internships"
              className="rounded-full bg-[#e6efe9] px-4 py-2 text-sm font-semibold text-[#244b43]"
            >
              Internships
            </a>
            <a
              href="/roadmap"
              className="rounded-full px-4 py-2 text-sm font-medium text-[#586273] transition hover:bg-[#e6efe9] hover:text-[#244b43]"
            >
              Roadmap
            </a>
          </div>
        </nav>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="py-3">
            <a
              href="/"
              className="text-sm font-medium text-[#317565] transition hover:text-[#244b43]"
            >
              ← Back to Dashboard
            </a>

            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#d8e4dc] bg-white px-3.5 py-2 text-sm text-[#45645a]">
              <span className="h-2 w-2 rounded-full bg-[#d29a43]" />
              Your next opportunity
            </div>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Find work that fits{" "}
              <span className="font-serif italic text-[#317565]">
                your skills.
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-[#687282]">
              Explore internship examples that align with your interests.
              Discover the skills you already have and what you could learn
              next.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#e5e7df] bg-white p-4">
                <span className="text-sm font-semibold text-[#244b43]">
                  01 · Match
                </span>
                <p className="mt-2 text-xs leading-5 text-[#77808d]">
                  Compare your current skills with roles.
                </p>
              </div>
              <div className="rounded-2xl border border-[#e5e7df] bg-white p-4">
                <span className="text-sm font-semibold text-[#98641c]">
                  02 · Improve
                </span>
                <p className="mt-2 text-xs leading-5 text-[#77808d]">
                  Identify useful skills to practise next.
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-[2rem] border border-[#dfe7df] bg-white p-5 shadow-[0_18px_60px_-36px_rgba(35,65,55,0.32)] sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#317565]">
              Internship matcher
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Tell us what you're looking for
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#77808d]">
              Adjust your skills and preferences to find relevant matches.
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void findMatches();
              }}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="skills"
                  className="mb-2 block text-sm font-semibold text-[#374151]"
                >
                  Skills you know
                </label>
                <input
                  id="skills"
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  placeholder="Python, SQL, Machine Learning"
                  required
                  className="w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-4 py-3.5 text-sm outline-none transition placeholder:text-[#a2a9b1] focus:border-[#6b9c8c] focus:ring-4 focus:ring-[#317565]/10"
                />
                <p className="mt-2 text-xs text-[#8b929c]">
                  Separate each skill with a comma.
                </p>
              </div>

              <div>
                <label
                  htmlFor="domain"
                  className="mb-2 block text-sm font-semibold text-[#374151]"
                >
                  Preferred domain
                </label>
                <select
                  id="domain"
                  value={domain}
                  onChange={(event) => setDomain(event.target.value)}
                  className="w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-4 py-3.5 text-sm outline-none focus:border-[#6b9c8c] focus:ring-4 focus:ring-[#317565]/10"
                >
                  {domains.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-[#374151]"
                >
                  Preferred location
                </label>
                <input
                  id="location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Bengaluru, Pune, Hyderabad"
                  className="w-full rounded-xl border border-[#dfe4df] bg-[#fbfcfa] px-4 py-3.5 text-sm outline-none focus:border-[#6b9c8c] focus:ring-4 focus:ring-[#317565]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#244b43] px-5 py-4 text-sm font-bold text-white transition hover:bg-[#1c3d36] focus:outline-none focus:ring-4 focus:ring-[#317565]/20 disabled:cursor-wait disabled:opacity-60"
              >
                {loading ? "Finding suitable matches…" : "Find internships"}
                <span className="transition group-hover:translate-x-1">
                  →
                </span>
              </button>
            </form>

            <div className="mt-5 border-t border-[#edf0eb] pt-4 text-xs leading-5 text-[#8a929c]">
              These results are examples for exploring your career options,
              not verified live vacancies.
            </div>
          </section>
        </section>

        {message && (
          <p
            role="status"
            className="mt-8 rounded-2xl border border-[#eadfc9] bg-[#fffaf0] p-4 text-sm leading-6 text-[#8b6b36]"
          >
            {message}
          </p>
        )}

        {skillGaps.length > 0 && (
          <section className="mt-10 rounded-2xl border border-[#eadfc9] bg-[#fffaf0] p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#98641c]">
              Your learning opportunities
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Skills worth developing
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {skillGaps.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-3.5 py-2 text-sm font-medium text-[#98641c] ring-1 ring-[#eadfc9]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14" aria-labelledby="results-heading">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#317565]">
                Your search
              </p>
              <h2
                id="results-heading"
                className="mt-2 text-3xl font-bold tracking-tight"
              >
                Opportunities to explore
              </h2>
              <p className="mt-2 text-sm text-[#77808d]">
                Review the role details and the skills each opportunity lists.
              </p>
            </div>
            <span className="rounded-full border border-[#dfe7df] bg-white px-3.5 py-2 text-sm font-semibold text-[#5f6d66]">
              {matches.length} {matches.length === 1 ? "result" : "results"}
            </span>
          </div>

          {matches.length === 0 && !message && (
            <div className="rounded-2xl border border-dashed border-[#cfdacf] bg-white p-10 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#e7f0e9] text-xl text-[#317565]">
                ↗
              </div>
              <h3 className="mt-4 text-lg font-semibold">
                Your next step starts here
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77808d]">
                Enter your skills above and select Find Internships to view
                matching opportunities.
              </p>
            </div>
          )}

          {matches.length > 0 && (
            <p className="mb-5 rounded-xl border border-[#eadfc9] bg-[#fffaf0] px-4 py-3 text-xs leading-5 text-[#8b6b36]">
              These are sample opportunities, not verified live vacancies.
              Confirm availability and details with the employer before
              applying.
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((internship, index) => (
              <article
                key={`${internship.title}-${internship.company}-${index}`}
                className="rounded-2xl border border-[#e2e7e1] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex rounded-full bg-[#e7f0e9] px-3 py-1.5 text-xs font-semibold text-[#317565]">
                  {internship.domain}
                </span>

                <h3 className="mt-4 text-xl font-bold leading-snug text-[#263448]">
                  {internship.title}
                </h3>
                <p className="mt-2 font-medium text-[#526071]">
                  {internship.company}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-[#77808d]">
                  <span aria-hidden="true">⌖</span>
                  {internship.location}
                </p>

                {internship.description && (
                  <p className="mt-4 text-sm leading-6 text-[#687282]">
                    {internship.description}
                  </p>
                )}

                {internship.required_skills?.length > 0 && (
                  <div className="mt-5 border-t border-[#edf0eb] pt-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#687282]">
                      Skills for this role
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {internship.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#f1f3ee] px-2.5 py-1.5 text-xs font-medium text-[#536357]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 rounded-xl bg-[#f7f8f5] px-3.5 py-3 text-xs leading-5 text-[#7b8491]">
                  Sample listing · Check the employer's official information
                  before applying.
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="mt-14 flex flex-col gap-3 border-t border-[#e2e7df] pt-6 text-xs text-[#8b929c] sm:flex-row sm:items-center sm:justify-between">
          <p>
            JourneyBuddy · A student project for skills and internship
            planning.
          </p>
          <div className="flex gap-4">
            <a href="/" className="transition hover:text-[#317565]">
              Dashboard
            </a>
            <a href="/roadmap" className="transition hover:text-[#317565]">
              Roadmap
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
