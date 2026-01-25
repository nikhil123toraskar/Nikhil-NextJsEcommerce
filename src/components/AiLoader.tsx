"use client";

export default function AiLoader() {
  return (
    <div className="mt-24 flex flex-col items-center gap-4">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-black" />
      <p className="text-sm text-gray-600">
        🤖 AI is thinking deeply…
      </p>
    </div>
  );
}