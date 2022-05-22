import styles from '../styles/Home.module.scss';
import Meta from '../components/Meta';
import Slogan from '../components/Slogan';
import Categories from '../components/Categories';
import CurrentPolicies from '../components/CurrentPolicies';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Slogan />
        <Categories />
        <CurrentPolicies />
      </main>
    </div>
  );
}
