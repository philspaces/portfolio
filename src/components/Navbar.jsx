import { useEffect, useState } from "react";
import { menu, close } from "../assets";
import { navLinks } from "../contants";

const Navbar = () => {
  const [active, setActive] = useState("hero");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sectionIds = navLinks.map((nav) => nav.id);

    const handleScroll = () => {
      setScrolled(window.scrollY > 24);

      const current = sectionIds.findLast((id) => {
        const element = document.getElementById(id);
        if (!element) return false;
        return window.scrollY >= element.offsetTop - 140;
      });

      if (current) {
        setActive(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id) => {
    setActive(id);
    setToggle(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800/80 bg-slate-950/80 backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
        <button
          type="button"
          onClick={() => handleNavClick("hero")}
          className="text-left text-xl font-bold tracking-[0.18em] text-white"
        >
          PL
        </button>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((nav) => (
            <li key={nav.id}>
              <button
                type="button"
                onClick={() => handleNavClick(nav.id)}
                className={`text-sm font-semibold uppercase tracking-[0.22em] transition ${
                  active === nav.id
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {nav.title}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="md:hidden"
          onClick={() => setToggle((value) => !value)}
          aria-label="Toggle menu"
        >
          <img
            src={toggle ? close : menu}
            alt=""
            className="h-7 w-7 object-contain"
          />
        </button>
      </div>

      {toggle && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4">
            {navLinks.map((nav) => (
              <li key={nav.id}>
                <button
                  type="button"
                  onClick={() => handleNavClick(nav.id)}
                  className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                    active === nav.id ? "text-white" : "text-slate-300"
                  }`}
                >
                  {nav.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
