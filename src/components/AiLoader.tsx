"use client";

export default function AiLoader({ fullScreen = false }: { fullScreen?: boolean }) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin h-10 w-10 rounded-full border-4 border-gray-300 border-t-black" />
      <p className="text-sm text-gray-600">
        🤖 AI is thinking deeply…
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90">
        {content}
      </div>
    );
  }

  return (
    <div className="mt-24 flex flex-col items-center gap-4">
      {content}
    </div>
  );
}