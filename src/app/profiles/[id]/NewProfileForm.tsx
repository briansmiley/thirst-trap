"use client";

import { useState, useRef, useCallback } from "react";
import { socket } from "@/socket";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from "lucide-react";

export default function NewProfileForm({ id }: { id: string }) {
  const [name, setName] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeAndConvertToBase64 = useCallback(
    (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, width, height);

            const resizedBase64 = canvas.toDataURL("image/jpeg");
            resolve(resizedBase64);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    []
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        try {
          const resizedBase64 = await resizeAndConvertToBase64(file, 800, 800);
          setImageBase64(resizedBase64);
          setImageUrl(URL.createObjectURL(file));
        } catch (error) {
          console.error("Error resizing image:", error);
        }
      } else {
        setImageBase64(undefined);
        setImageUrl(undefined);
      }
    },
    [resizeAndConvertToBase64]
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const player = { playerId: id, name, picture: imageBase64 ?? "" };
      console.log("EMIT addPlayer:", player);
      socket.emit("addPlayer", player, (response) => {
        console.log("ACK addPlayer:", response);
      });
    },
    [id, name, imageBase64]
  );

  return (
    <form className="flex flex-col gap-4 p-8" onSubmit={handleSubmit}>
      <h1 className="text-center font-semibold text-3xl">New Profile</h1>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-72 h-72 border m-auto"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            className="w-full h-full object-cover"
            alt="Profile"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Camera size={96} />
          </div>
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
      <Button type="submit" disabled={!imageBase64 || !name}>
        Save Profile
      </Button>
    </form>
  );
}
