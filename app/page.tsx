'use client';

import { useCallback, useEffect, useState } from 'react';
import Header from '@/app/components/Header/page';
import Main from '@/app/components/Main/page';
import type { Todo } from '@/lib/store';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch('/api/todos');
      if (!res.ok) throw new Error('목록을 불러오지 못했습니다.');
      const data: Todo[] = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (text: string) => {
    if (!text.trim()) return;

    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text }),
      });
      if (!res.ok) throw new Error('추가 실패');
      const newTodo: Todo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      console.error(err);
      alert('할 일 추가에 실패했습니다.');
    }
  };

  const toggleTodo = async (id: string) => {
    const target = todos.find((t) => t._id === id);
    if (!target) return;

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: !target.isCompleted }),
      });
      if (!res.ok) throw new Error('상태 변경 실패');
      const updated: Todo = await res.json();
      setTodos((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      console.error(err);
      alert('상태 변경에 실패했습니다.');
    }
  };

  const todoList = todos.filter((t) => !t.isCompleted);
  const doneList = todos.filter((t) => t.isCompleted);

  if (loading) return null;

  return (
    <div>
      <Header />
      <Main
        todoList={todoList}
        doneList={doneList}
        onAdd={addTodo}
        onToggle={toggleTodo}
      />
    </div>
  );
}
