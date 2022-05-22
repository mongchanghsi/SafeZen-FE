import styles from '../styles/Layout.module.scss';
import Navigation from './Navigation';

const Layout = ({ children }: { children: any }) => {
  return (
    <div className={styles.container}>
      <Navigation />
      {children}
    </div>
  );
};

export default Layout;
