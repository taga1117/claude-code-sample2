import TodoList from "@/components/TodoList";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <main className="flex flex-col items-center">
        <TodoList />
      </main>
    </div>
  );
}
