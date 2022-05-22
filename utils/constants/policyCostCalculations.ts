enum ICategories {
  MOTOR = 'MOTOR',
  HEALTH = 'HEATLH',
  TRAVEL = 'TRAVEL',
  PROPERTY = 'PROPERTY',
  LIFE = 'LIFE',
}

const MappingCost = {
  MOTOR: {
    CAR: {},
    BIKE: {},
    PLANE: {},
    YATCH: {},
  },
  HEALTH: {
    HEALTH: {},
  },
  TRAVEL: {
    TRAVEL: {},
  },
  PROPERTY: {
    RESIDENTIAL: {},
    PUBLIC: {},
    PRIVATE: {},
    COMMERCIAL: {},
  },
  LIFE: {
    LIFE: {},
  },
};

export const WeiPerSecondToEthPerDay = (_flowRate: string) => {
  const secondsPerDay = 86400;
  const _flowRateWeiPerSecond = Number(_flowRate);
  const _flowRateInDAIxPerSecond = _flowRateWeiPerSecond * 10 ** -18;
  const _flowRateInDAIxPerDay = _flowRateInDAIxPerSecond * secondsPerDay;
  return _flowRateInDAIxPerDay.toFixed(2);
};

const BASE_ONE_DAI_PER_DAY = 11574074074000;

const calculation = (
  _insuranceType: string,
  _subInsuranceType: string,
  coverage: any,
  merchant: any
) => {
  switch (_insuranceType) {
    case 'MOTOR':
      switch (_subInsuranceType) {
        case 'CAR':
          if (coverage == '100000') {
            return {
              baseAmount: '0.02',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '210',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
            };
          } else {
            // 1000000
            return {
              baseAmount: '310',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.5),
            };
          }

        case 'BIKE':
          if (coverage == '100000') {
            return {
              baseAmount: '50',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '60',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.2),
            };
          } else {
            // 1000000
            return {
              baseAmount: '70',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
            };
          }

        case 'PLANE':
          if (coverage == '100000') {
            return {
              baseAmount: '1100',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '1500',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2.5),
            };
          } else {
            // 1000000
            return {
              baseAmount: '2000',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 3),
            };
          }

        case 'YATCH':
          if (coverage == '100000') {
            return {
              baseAmount: '1100',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.5),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '1200',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.75),
            };
          } else {
            // 1000000
            return {
              baseAmount: '1500',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2),
            };
          }
        default:
          return {
            baseAmount: '100',
            flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
          };
      }

    case 'HEALTH':
      return {
        baseAmount: '200',
        flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
      };

    case 'TRAVEL':
      return {
        baseAmount: '50',
        flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
      };

    case 'LIFE':
      return {
        baseAmount: '220',
        flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
      };

    case 'PROPERTY':
      switch (_subInsuranceType) {
        case 'RESIDENTIAL':
          if (coverage == '100000') {
            return {
              baseAmount: '100',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '150',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.3),
            };
          } else {
            // 1000000
            return {
              baseAmount: '200',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.5),
            };
          }

        case 'PUBLIC':
          if (coverage == '100000') {
            return {
              baseAmount: '100',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '130',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.2),
            };
          } else {
            // 1000000
            return {
              baseAmount: '180',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.5),
            };
          }

        case 'PRIVATE':
          if (coverage == '100000') {
            return {
              baseAmount: '200',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.5),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '300',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 1.8),
            };
          } else {
            // 1000000
            return {
              baseAmount: '400',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2),
            };
          }

        case 'COMMERCIAL':
          if (coverage == '100000') {
            return {
              baseAmount: '600',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2),
            };
          } else if (coverage == '500000') {
            return {
              baseAmount: '800',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2.25),
            };
          } else {
            // 1000000
            return {
              baseAmount: '1200',
              flowRate: String(BASE_ONE_DAI_PER_DAY * 2.5),
            };
          }
        default:
          return {
            baseAmount: '1000',
            flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
          };
      }
    default:
      return {
        baseAmount: '1000',
        flowRate: String(BASE_ONE_DAI_PER_DAY * 1.25),
      };
  }
};

export default calculation;
