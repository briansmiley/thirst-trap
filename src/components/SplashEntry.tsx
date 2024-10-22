"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SplashEntry() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  return (
    <div className="h-24 flex flex-col items-center justify-center">
      {showPasswordInput ? (
        <div>
          <Input
            type="password"
            className="w-48 h-12 text-2xl"
            placeholder="Password"
            autoFocus
          />
        </div>
      ) : (
        <Button
          className="font-serif w-48 h-24 text-4xl"
          onClick={() => setShowPasswordInput(true)}
        >
          Enter
        </Button>
      )}
    </div>
  );
}
