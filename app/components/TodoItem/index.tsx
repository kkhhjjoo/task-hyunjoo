'use client';

import { useRouter } from 'next/navigation';
import type { Todo } from '@/lib/store';
import styles from './TodoItem.module.css';
import Image from 'next/image';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
}

const TodoItem = ({ todo, onToggle }: Props) => {
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(todo._id);
  };

  const handleItemClick = () => {
    router.push(`/detail/${todo._id}`);
  };

  return (
    <li
      className={`${styles.item} ${todo.isCompleted ? styles.done : ''}`}
      onClick={handleItemClick}
    >
      <button
        type="button"
        className={`${styles.circle} ${todo.isCompleted ? styles.checked : ''}`}
        onClick={handleToggle}
        aria-label={todo.isCompleted ? '완료 취소' : '완료'}
      >
        <Image
          src={
            todo.isCompleted
              ? '/icons/Property 1=Frame 2610233.svg'
              : '/icons/Property 1=Default.svg'
          }
          alt={todo.isCompleted ? '완료' : '미완료'}
          width={24}
          height={24}
        />
      </button>
      <span className={styles.text}>{todo.title}</span>
    </li>
  );
};

export default TodoItem;
