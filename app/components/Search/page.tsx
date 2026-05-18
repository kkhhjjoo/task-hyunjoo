'use client'
import { useState } from 'react';
import styles from './Search.module.css';
import Image from 'next/image';

interface Props { 
  onAdd: (text: string) => void;
}

const Search = ({ onAdd }: Props) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => { 
    if (!value.trim()) return;
    onAdd(value);
    setValue('');
  }

  const handleKeyDown = (e:React.KeyboardEvent)=> { 
    if (e.key === 'Enter') handleSubmit();
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.inputWrapper}>
        <Image src="/imgs/search.png" alt="검색바" fill className={styles.bgImage} />
          <input type="text" className={styles.input} placeholder='할 일을 입력해주세요' value={value} onChange={e => setValue(e.target.value)} onKeyDown={handleKeyDown} />
      </div>
      <button className={styles.button} onClick={handleSubmit} aria-label='추가하기'>
        <Image className={styles.btn} width={168} height={56} src="/imgs/Type=Add, Size=Large, State=Default.png" alt="추가하기" />
        <Image className={styles.mobileBtn} width={56} height={56} src="/imgs/Type=Add, Size=Small, State=Default.png" alt="추가하기" />
      </button>
    </div>
  )
}

export default Search;
