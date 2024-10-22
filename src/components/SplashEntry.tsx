"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Lock } from "lucide-react";
import { checkPassword } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function SplashEntry() {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    const result = await checkPassword(enteredPassword);
    if (result) {
      router.push("/dashboard"); // Redirect to main app page
    } else {
      setError("Incorrect password");
    }
  };
  return (
    <div className="h-24 flex flex-col items-center justify-center">
      {showPasswordInput ? (
        <div>
          <form onSubmit={handleSubmit} className="relative">
            <Lock className="absolute text-gray-500 top-1/2 -translate-y-1/2 right-1" />
            <Input
              type="password"
              className="w-48 h-12 text-2xl"
              placeholder="Password"
              onChange={e => {
                setError("");
                setEnteredPassword(e.target.value);
              }}
              autoFocus
            />
          </form>
          {error && (
            <p className="text-red-500 text-md bg-black  text-center bg-opacity-50 rounded-b pt-1 font-serif">
              {error}
            </p>
          )}
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
