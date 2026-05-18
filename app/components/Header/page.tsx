import Image from "next/image";
import styles from './Header.module.css'
import Link from 'next/link';

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <Link href="/">
          <Image className={styles.logo} width={151} height={40} src="/imgs/Size=Large.png" alt="로고" />
        </Link>
        <Link href="/">
          <Image className={styles.mobileLogo} width={71} height={40} src="/imgs/Size=Small.png" alt="로고" />  
        </Link>
      </div>
    </header>
  )
}

export default Header;
