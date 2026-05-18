import TodoItem from '@/app/components/TodoItem/page';
import styles from './TodoList.module.css';
import type { Todo } from '@/lib/store';
import Image from 'next/image';

interface Props {
  title: 'TO DO' | 'DONE';
  items: Todo[];
  onToggle: (id: string) => void;
}

const TodoList = ({ title, items, onToggle }: Props) => {
  return (
    <div className={styles.column}>
      <Image
        width={80}
        height={32}
        src={title === 'TO DO' ? '/imgs/todo.png' : '/imgs/done.png'}
        alt={title}
        className={styles.badge}
      />
      <ul className={styles.list}>
        {items.map((item) => (
          <TodoItem key={item._id} todo={item} onToggle={onToggle} />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
