"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = formData.get("id");
    router.push(`/profile/${id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col gap-4  p-12 justify-center items-center my_box">
        <h1 className="text-4xl font-bold">Player Profiles</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-4"
        >
          <input
            type="text"
            className="border-2 border-neutral-700 rounded px-1"
            name="id"
            placeholder="Player Badge ID"
          />
          <Button type="submit">Go to Profile</Button>
        </form>
      </div>
    </div>
  );
}
