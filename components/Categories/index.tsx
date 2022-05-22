/* eslint-disable @next/next/no-img-element */
import styles from './index.module.scss';
import MotorInsuranceImg from '../../public/assets/misc/car.jpeg';
import HealthInsuranceImg from '../../public/assets/misc/health.jpeg';
import TravelInsuranceImg from '../../public/assets/misc/travel.jpeg';
import PropertyInsuranceImg from '../../public/assets/misc/property.jpeg';
import LifeInsuranceImg from '../../public/assets/misc/life.jpeg';
import Link from 'next/link';

enum ICategories {
  MOTOR,
  HEALTH,
  TRAVEL,
  PROPERTY,
  LIFE,
}

const categoriesType = [
  { type: ICategories.MOTOR, image: MotorInsuranceImg, text: 'Motor' },
  { type: ICategories.HEALTH, image: HealthInsuranceImg, text: 'Health' },
  { type: ICategories.TRAVEL, image: TravelInsuranceImg, text: 'Travel' },
  { type: ICategories.PROPERTY, image: PropertyInsuranceImg, text: 'Property' },
  { type: ICategories.LIFE, image: LifeInsuranceImg, text: 'Life' },
];

const Categories = () => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Browse Categories</h3>
        <ul className={styles.content}>
          {categoriesType.map((cat) => (
            <Link
              href={`/purchase/${cat.text.toLowerCase()}`}
              key={`Categories_${cat.type}`}
            >
              <li>
                <img src={cat.image.src} alt={`Categories_${cat.type}`} />
                <p>{cat.text}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
