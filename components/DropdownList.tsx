"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

const DropdownList = ({
  options,
  selectedOption,
  onOptionSelect,
  triggerElement,
}: DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {triggerElement}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {options.map((option) => (
              <li
                key={option}
                className={cn("list-item transition-colors duration-150", {
                  "bg-pink-100 text-white": selectedOption === option,
                })}
                onClick={() => handleOptionClick(option)}
              >
                {option}
                {selectedOption === option && (
                  <Image
                    src="/assets/icons/check.svg"
                    alt="check"
                    width={16}
                    height={16}
                  />
                )}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownList;
