"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewProfileForm({ id }: { id: string }) {
  const [name, setName] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageBase64(String(reader.result));
      };
      setImageUrl(URL.createObjectURL(file));
    } else {
      setImageBase64(undefined);
      setImageUrl(undefined);
    }
  };

  return (
    <form className="flex flex-col gap-4 p-8">
      <h1 className="text-center font-semibold text-3xl">New Profile</h1>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-72 h-72 border m-auto"
      >
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full"></div>
        )}
      </div>
      <input
        className="hidden"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
      <div>
        <Label htmlFor="id">Player Id</Label>
        <Input id="id" value={id} disabled />
      </div>
      <div>
        <Label htmlFor="name">Character Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
        />
      </div>
      <Button>Save Profile</Button>
    </form>
  );
}
