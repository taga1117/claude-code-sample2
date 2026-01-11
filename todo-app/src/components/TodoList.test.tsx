import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoList from "./TodoList";

describe("TodoList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  describe("初期表示", () => {
    it("タイトルが表示される", () => {
      render(<TodoList />);
      expect(screen.getByText("Todo List")).toBeInTheDocument();
    });

    it("タスクがない場合「タスクがありません」と表示される", () => {
      render(<TodoList />);
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("入力フィールドと追加ボタンが表示される", () => {
      render(<TodoList />);
      expect(
        screen.getByPlaceholderText("新しいタスクを入力...")
      ).toBeInTheDocument();
      expect(screen.getByText("追加")).toBeInTheDocument();
    });

    it("期限入力フィールドが表示される", () => {
      render(<TodoList />);
      expect(screen.getByText("期限:")).toBeInTheDocument();
    });
  });

  describe("タスクの追加", () => {
    it("タスクを追加できる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "新しいタスク" } });
      fireEvent.click(addButton);

      expect(screen.getByText("新しいタスク")).toBeInTheDocument();
      expect(screen.queryByText("タスクがありません")).not.toBeInTheDocument();
    });

    it("Enterキーでタスクを追加できる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");

      fireEvent.change(input, { target: { value: "Enterで追加" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(screen.getByText("Enterで追加")).toBeInTheDocument();
    });

    it("空白のみのタスクは追加されない", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "   " } });
      fireEvent.click(addButton);

      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });

    it("タスク追加後に入力フィールドがクリアされる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText(
        "新しいタスクを入力..."
      ) as HTMLInputElement;
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "テストタスク" } });
      fireEvent.click(addButton);

      expect(input.value).toBe("");
    });
  });

  describe("タスクの完了/未完了切り替え", () => {
    it("チェックボックスでタスクを完了にできる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "完了テスト" } });
      fireEvent.click(addButton);

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    it("完了したタスクを未完了に戻せる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "トグルテスト" } });
      fireEvent.click(addButton);

      const checkbox = screen.getByRole("checkbox");

      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("タスクの削除", () => {
    it("削除ボタンでタスクを削除できる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "削除するタスク" } });
      fireEvent.click(addButton);

      expect(screen.getByText("削除するタスク")).toBeInTheDocument();

      const deleteButton = screen.getByText("削除");
      fireEvent.click(deleteButton);

      expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
      expect(screen.getByText("タスクがありません")).toBeInTheDocument();
    });
  });

  describe("期限設定", () => {
    it("期限付きでタスクを追加できる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "期限付きタスク" } });
      fireEvent.change(dateInput, { target: { value: "2026-12-31" } });
      fireEvent.click(addButton);

      expect(screen.getByText("期限付きタスク")).toBeInTheDocument();
      expect(screen.getByText(/2026年12月31日/)).toBeInTheDocument();
    });

    it("期限なしでタスクを追加できる", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "期限なしタスク" } });
      fireEvent.click(addButton);

      expect(screen.getByText("期限なしタスク")).toBeInTheDocument();
      const taskItem = screen.getByText("期限なしタスク").closest("li");
      expect(taskItem).not.toHaveTextContent("期限:");
    });
  });

  describe("統計表示", () => {
    it("タスクの完了数が表示される", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "タスク1" } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: "タスク2" } });
      fireEvent.click(addButton);

      expect(screen.getByText(/完了: 0 \/ 2/)).toBeInTheDocument();

      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);

      expect(screen.getByText(/完了: 1 \/ 2/)).toBeInTheDocument();
    });
  });

  describe("ローカルストレージ", () => {
    it("タスク追加時にローカルストレージに保存される", () => {
      render(<TodoList />);

      const input = screen.getByPlaceholderText("新しいタスクを入力...");
      const addButton = screen.getByText("追加");

      fireEvent.change(input, { target: { value: "保存テスト" } });
      fireEvent.click(addButton);

      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it("保存されたタスクを読み込める", () => {
      const savedTodos = [
        { id: 1, text: "保存済みタスク", completed: false, dueDate: null },
      ];
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        JSON.stringify(savedTodos)
      );

      render(<TodoList />);

      expect(screen.getByText("保存済みタスク")).toBeInTheDocument();
    });
  });
});
