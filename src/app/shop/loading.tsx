export default function Loading() {
  const messages = [
    "Understanding your request…",
    "Analyzing product intent…",
    "Searching the catalog…",
    "Ranking best matches…",
  ];

  return (
    <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-600">
        <div className="text-3xl animate-pulse">🤖</div>
        <div className="text-lg font-medium">
          AI is working on it…
        </div>
        <div className="text-sm text-gray-400 animate-pulse">
          {messages[Math.floor(Math.random() * messages.length)]}
        </div>
      </div>
    </div>
  );
}
