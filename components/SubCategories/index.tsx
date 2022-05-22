/* eslint-disable @next/next/no-img-element */
import styles from './index.module.scss';
import MotorInsuranceImg from '../../public/assets/misc/car.jpeg';
import HealthInsuranceImg from '../../public/assets/misc/health.jpeg';
import TravelInsuranceImg from '../../public/assets/misc/travel.jpeg';
import PropertyInsuranceImg from '../../public/assets/misc/property.jpeg';
import LifeInsuranceImg from '../../public/assets/misc/life.jpeg';

import BikeInsuranceImg from '../../public/assets/misc/bike.jpeg';
import PlaneInsuranceImg from '../../public/assets/misc/plane.jpeg';
import TruckInsuranceImg from '../../public/assets/misc/truck.jpeg';
import YatchInsuranceImg from '../../public/assets/misc/yatch.jpeg';

import PrivateInsuranceImg from '../../public/assets/misc/private.jpeg';
import PublicInsuranceImg from '../../public/assets/misc/public.jpeg';
import CommercialInsuranceImg from '../../public/assets/misc/commercial.jpeg';
import ResidentialInsuranceImg from '../../public/assets/misc/residential.jpeg';

enum ICategories {
  MOTOR,
  HEALTH,
  TRAVEL,
  PROPERTY,
  LIFE,
}

enum IMotor {
  CAR,
  BIKE,
  PLANE,
  TRUCK,
  YATCH,
}

enum IProperty {
  PRIVATE,
  PUBLIC,
  COMMERCIAL,
  RESIDENTIAL,
}

const subCategoriesType = {
  [ICategories.MOTOR]: [
    { type: IMotor.CAR, image: MotorInsuranceImg, text: 'Car' },
    { type: IMotor.BIKE, image: BikeInsuranceImg, text: 'Bike' },
    { type: IMotor.PLANE, image: PlaneInsuranceImg, text: 'Plane' },
    { type: IMotor.TRUCK, image: TruckInsuranceImg, text: 'Truck' },
    { type: IMotor.YATCH, image: YatchInsuranceImg, text: 'Yatch' },
  ],
  [ICategories.HEALTH]: [
    { type: 'HEALTH', image: HealthInsuranceImg, text: 'Health' },
  ],
  [ICategories.TRAVEL]: [
    { type: 'TRAVEL', image: TravelInsuranceImg, text: 'Travel' },
  ],
  [ICategories.PROPERTY]: [
    {
      type: IProperty.RESIDENTIAL,
      image: ResidentialInsuranceImg,
      text: 'Residential',
    },
    { type: IProperty.PUBLIC, image: PublicInsuranceImg, text: 'Public' },
    { type: IProperty.PRIVATE, image: PrivateInsuranceImg, text: 'Private' },
    {
      type: IProperty.COMMERCIAL,
      image: CommercialInsuranceImg,
      text: 'Commercial',
    },
  ],
  [ICategories.LIFE]: [{ type: 'LIFE', image: LifeInsuranceImg, text: 'Life' }],
};

const SubCategories = ({
  type,
  selectedSubInsurance,
  handleSelect,
}: {
  type: string;
  selectedSubInsurance: any;
  handleSelect: any;
}) => {
  const convertTypeToEnumType = (type: string) => {
    const _type = type.toLowerCase();
    switch (_type) {
      case 'motor':
        return ICategories.MOTOR;
      case 'health':
        return ICategories.HEALTH;
      case 'property':
        return ICategories.PROPERTY;
      case 'life':
        return ICategories.LIFE;
      case 'travel':
        return ICategories.TRAVEL;
      default:
        return ICategories.MOTOR;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h3>Types</h3>
        <ul className={styles.content}>
          {subCategoriesType[convertTypeToEnumType(type)].map((cat) => (
            <li
              key={`SubCategories_${cat.type}`}
              onClick={() => handleSelect(cat.text)}
            >
              <img
                src={cat.image.src}
                alt={`SubCategories_${cat.type}`}
                className={`${
                  selectedSubInsurance === cat.text
                    ? styles.content_selected
                    : ''
                }`}
              />
              <p>{cat.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubCategories;
