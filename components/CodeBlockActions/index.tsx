/**
 * Code Block Actions
 *
 * Adds a "Copy" button to every code block inside rendered markdown.
 *
 * The article body is injected as HTML, so there are no React nodes to hang a
 * button off. This mounts once, walks the rendered blocks and attaches the
 * buttons itself, then cleans them up on unmount.
 *
 * For a collapsed block the button goes in the <summary> bar, so the code can
 * be copied without expanding it first. Everything else gets a button pinned
 * to the top-right of the block.
 */

"use client";

import { useEffect } from "react";
import styles from "./styles.module.css";

const RESET_DELAY_MS = 2000;

interface CodeBlockActionsProps {
  /** Selector for the element containing the rendered markdown. */
  containerSelector: string;
}

export default function CodeBlockActions({
  containerSelector,
}: CodeBlockActionsProps) {
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cleanups: (() => void)[] = [];

    container.querySelectorAll(".code-block").forEach((block) => {
      const pre = block.querySelector("pre");
      if (!pre) return;

      const collapsed = block.closest("details.code-collapse");
      const summary = collapsed?.querySelector("summary");
      // put it in the summary bar when there is one, so it works while closed
      const host = summary ?? block;
      if (host.querySelector(`.${styles.copyButton}`)) return;

      const button = document.createElement("button");
      button.type = "button";
      button.className = `${styles.copyButton} ${
        summary ? styles.inSummary : styles.inBlock
      }`;
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");

      let timer: ReturnType<typeof setTimeout> | undefined;

      const onClick = async (event: MouseEvent) => {
        // inside a <summary> a click would otherwise toggle the disclosure
        event.preventDefault();
        event.stopPropagation();

        const code = pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
          button.dataset.state = "done";
        } catch {
          button.textContent = "Press Ctrl+C";
          button.dataset.state = "error";
        }

        clearTimeout(timer);
        timer = setTimeout(() => {
          button.textContent = "Copy";
          delete button.dataset.state;
        }, RESET_DELAY_MS);
      };

      button.addEventListener("click", onClick);
      host.appendChild(button);

      cleanups.push(() => {
        clearTimeout(timer);
        button.removeEventListener("click", onClick);
        button.remove();
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [containerSelector]);

  return null;
}
