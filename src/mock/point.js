import {getRandomPositiveInteger, getRandomArrayElement} from '../utils.js';
import {offersById} from './offers.js';
import { destinationsArray} from './destinations.js';

const offerTypes = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const generateOfferType = () => getRandomArrayElement(offerTypes);
const generateDestination = () => getRandomArrayElement(destinationsArray);

const linkOffersToPoint = (pointItem, offers) => {
  const linkedOffers= pointItem.offers.map((offerId) => offers.get(offerId));

  return {
    ...pointItem,
    offers: linkedOffers,
  };
};


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
    offers: [1,3],
    type
  };
};


const points = Array.from({ length: 3 }, () => {
  const point = generatePoint();
  return linkOffersToPoint(point, offersById);
});

// console.log(points)

export {points};

