"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-3 px-4 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1">
        Made with <Heart className="h-3 w-3 fill-current text-red-500" /> by{" "}
        <a
          href="https://yeshc.me"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors underline-offset-4 hover:underline"
        >
          Yesh
        </a>
      </p>
    </footer>
  );
}