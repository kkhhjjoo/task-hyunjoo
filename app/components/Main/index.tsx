import Search from '@/app/components/Search';
import TodoList from '@/app/components/TodoList';
import type { Todo } from '@/lib/store';
import styles from './Main.module.css';

interface Props {
  todoList: Todo[];
  doneList: Todo[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
}

const Main = ({ todoList, doneList, onAdd, onToggle }: Props) => {
  return (
    <main>
      <div className={styles.inner}>
        <Search onAdd={onAdd} />
        <div className={styles.columns}>
          <TodoList title="TO DO" items={todoList} onToggle={onToggle} />
          <TodoList title="DONE" items={doneList} onToggle={onToggle} />
        </div>
      </div>
    </main>
  );
};

export default Main;
