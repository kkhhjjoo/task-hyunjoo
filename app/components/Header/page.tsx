import Image from "next/image";
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.inner}>
        <Image className={styles.logo} width={151} height={40} src="/imgs/Size=Large.png" alt="로고" />
        <Image className={styles.mobileLogo} width={71} height={40} src="/imgs/Size=Small.png" alt="로고" />  
      </div>
    </header>
  )
}

export default Header;
