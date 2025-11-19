import { AnimatePresence, motion } from "motion/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "./NavLink";
import { NavLinks } from "./NavLinks";
import { NavUser } from "./NavUser";
import { NavUserLinks } from "./NavUserLinks";
import clsx from "clsx";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={clsx(
        "top-0",
        "z-50",
        "sticky",
        "bg-black/90",
        "shadow-lg",
        "backdrop-blur-sm"
      )}
    >
      <nav className="flex justify-between items-center mx-auto px-6 py-4 container">
        <div className="flex gap-2">
          <img src="favicon-32x32.png" alt="logo" />

          <NavLink className="font-bold text-white text-2xl" to="/">
            Comando OGT
          </NavLink>
        </div>

        <div className="hidden md:flex space-x-8 text-lg">
          <NavLinks />

          <NavUser />
        </div>

        <button className="md:hidden" onClick={() => setIsMenuOpen((s) => !s)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden space-y-2 px-6 pt-2 pb-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            layout
          >
            <NavLinks className="block" />

            <NavUserLinks className="block" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
