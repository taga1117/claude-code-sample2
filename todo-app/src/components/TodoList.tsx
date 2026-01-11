"use client";

import { useState, useEffect } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string | null;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState("");

  // ローカルストレージから読み込み
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // ローカルストレージに保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() === "") return;
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      dueDate: dueDate || null,
    };
    setTodos([...todos, newTodo]);
    setInputValue("");
    setDueDate("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const isOverdue = (dueDate: string | null): boolean => {
    if (!dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    return due < today;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDueDateStyle = (todo: Todo): string => {
    if (todo.completed) return "text-gray-400";
    if (isOverdue(todo.dueDate)) return "text-red-500 font-medium";
    return "text-blue-500";
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Todo List
      </h1>

      {/* 入力フォーム */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            追加
          </button>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            期限:
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-sm"
          />
        </div>
      </div>

      {/* Todoリスト */}
      <ul className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            タスクがありません
          </p>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border ${
                !todo.completed && isOverdue(todo.dueDate)
                  ? "border-red-300 dark:border-red-700"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <span
                  className={`block ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  {todo.text}
                </span>
                {todo.dueDate && (
                  <span className={`text-xs ${getDueDateStyle(todo)}`}>
                    {isOverdue(todo.dueDate) && !todo.completed && "⚠ "}
                    期限: {formatDate(todo.dueDate)}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="px-3 py-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              >
                削除
              </button>
            </li>
          ))
        )}
      </ul>

      {/* 統計 */}
      {todos.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          完了: {todos.filter((t) => t.completed).length} / {todos.length}
          {todos.filter((t) => !t.completed && isOverdue(t.dueDate)).length > 0 && (
            <span className="ml-2 text-red-500">
              (期限切れ: {todos.filter((t) => !t.completed && isOverdue(t.dueDate)).length})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
