"use client";

import { useState, useEffect } from "react";
import { socket } from "@/socket";

type User = {
  id: number;
  name: string;
  status: string;
};

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", transport => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
    }

    function onAddUser(user: User) {
      setUsers(previous => [...previous, user]);
    }

    socket.on("connect", onConnect);
    socket.on("addUser", onAddUser);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const addUser = () => {
    socket.emit("addUser", name);
    setName("");
  };

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Transport: {transport}</p>
      <h1>Hello World</h1>
      <label>
        Character Name
        <input
          type="text"
          value={name}
          onChange={evt => setName(evt.target.value)}
        />
      </label>
      <button onClick={addUser}>Add User</button>
      {users.map(user => (
        <div key={user.id} className="flex gap-2">
          <div>{user.id}</div>
          <div>{user.name}</div>
          <div>{user.status}</div>
        </div>
      ))}
    </div>
  );
}
