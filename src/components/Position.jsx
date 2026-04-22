const roles = [
  "Product-driven builder",
  "Full-stack developer",
  "Automation and AI tinkerer",
];

const Position = () => {
  return (
    <div className="flex flex-wrap gap-3 text-sm font-medium uppercase tracking-[0.22em] text-slate-300 sm:text-base">
      {roles.map((role) => (
        <span
          key={role}
          className="rounded-full border border-slate-700/80 bg-slate-900/40 px-4 py-2 backdrop-blur-sm"
        >
          {role}
        </span>
      ))}
    </div>
  );
};

export default Position;
