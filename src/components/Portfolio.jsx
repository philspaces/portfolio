import { motion } from "framer-motion";
import {
  featuredProjects,
  focusAreas,
  proofStats,
  privateWorkSignals,
} from "../contants";
import { textVariant, fadeIn } from "../utils/motion";

const toneClasses = {
  cyan: "border-cyan-400/40 bg-cyan-500/10",
  blue: "border-blue-400/40 bg-blue-500/10",
  violet: "border-violet-400/40 bg-violet-500/10",
};

const ProjectCard = ({ name, eyebrow, description, stack, href, tone, index }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      variants={fadeIn("up", "spring", index * 0.08, 0.6)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={`block rounded-3xl border p-6 transition hover:-translate-y-1 hover:border-slate-500 hover:bg-slate-900/70 ${toneClasses[tone]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
            {eyebrow}
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">{name}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            {description}
          </p>
        </div>
        <span className="hidden text-sm font-medium uppercase tracking-[0.2em] text-slate-400 sm:block">
          Open
        </span>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.a>
  );
};

const Portfolio = () => {
  return (
    <main className="relative z-10 border-t border-slate-800 bg-[#040B13]">
      <section id="projects" className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
        <motion.div
          variants={textVariant(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-quaternary">
            Selected work
          </p>
          <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
            Better proof, less vague “builder” branding.
          </h2>
          <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
            The site should not make people guess what I do. These projects are
            the clearest public examples of the direction: automation, frontend
            systems, AI tooling, and product-minded engineering.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.name} index={index} {...project} />
          ))}
        </div>
      </section>

      <section id="proof" className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            variants={textVariant(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-quaternary">
              Proof of work
            </p>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              Public GitHub is only part of the signal.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              That matters, because a lot of the most current work is private.
              So the right read is not “judge everything by stars”. It is “look
              at the technical range, then assume there is more behind the
              curtain.”
            </p>
          </motion.div>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {proofStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={fadeIn("up", "spring", index * 0.08, 0.55)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.2 }}
                  className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
                >
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="mt-2 text-sm uppercase tracking-[0.2em] text-slate-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <ul className="space-y-4 text-sm leading-7 text-slate-300 sm:text-base">
                {privateWorkSignals.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-quaternary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="focus" className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <motion.div
            variants={textVariant(0.05)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-quaternary">
              What I care about
            </p>
            <h2 className="mt-4 text-4xl font-bold text-white sm:text-5xl">
              I like building things that are useful, controlled, and hard to fake.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              The strongest thread across my work is not one framework. It is
              practical product thinking: clear interfaces, reliable behavior,
              automation where it matters, and enough technical depth to own the
              whole stack when needed.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {focusAreas.map((area, index) => (
              <motion.div
                key={area.title}
                variants={fadeIn("up", "spring", index * 0.08, 0.55)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <h3 className="text-xl font-semibold text-white">{area.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
                  {area.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:px-10 lg:px-16">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/70 p-8 sm:p-10 lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-quaternary">
            Contact
          </p>
          <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
            If the work resonates, start with GitHub.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            The cleanest public entry point is my GitHub. That is where the real
            code, experiments, and current direction are visible.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://github.com/philspaces"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
            >
              github.com/philspaces
            </a>
            <a
              href="https://github.com/philspaces/portfolio"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
            >
              View this repo
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
