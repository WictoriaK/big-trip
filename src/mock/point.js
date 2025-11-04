import {getRandomPositiveInteger, getRandomArrayElement} from '../utils.js';
import { destinationsArray} from './destinations.js';

const offerTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const generateOfferType = () => getRandomArrayElement(offerTypes);
const generateDestination = () => getRandomArrayElement(destinationsArray);

const generatePoint = () => {
  const type = generateOfferType();
  const randomDestination = generateDestination();

  return {
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    id: 0,
    destination: randomDestination,
    isFavorite: Boolean(getRandomPositiveInteger(0, 1)),
    offers: [1, 2],
    type
  };
};


export {generatePoint};

