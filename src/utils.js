import dayjs from 'dayjs';

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const SortTypes= {
  DAY: 'default',
  PRICE: 'price',
  TIME: 'time',
};

const HOURS_PER_DAY = 24;
const MIN_IN_AN_HOUR = 60;

const getRandomPositiveInteger = (a = 0, b = 1) => {
  if (a === undefined) {
    throw new Error('Первый параметр должен быть число');
  }

  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const humanizePointDateFrom = (date, format) => dayjs(date).format(`${format}`);
const humanizePointTimeFrom = (date, format) => dayjs(date).format(`${format}`);

const isPointExpired = (dateFrom) => dateFrom && dayjs().isAfter(dateFrom, 'D');
const isPointFuture = (dateTo) => dateTo && dayjs().isBefore(dateTo, 'D');

const filter = {
  [FilterTypes.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterTypes.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateTo)),
  [FilterTypes.PAST]: (points) => points.filter((point) => isPointExpired(point.dateFrom)),
};

const getRandomArrayElement = (array) => array[getRandomPositiveInteger(0, array.length - 1)];

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const getSortUp = (pointA, pointB) => pointA - pointB;

const sortTimeUp = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return getSortUp(timeB, timeA);
};

const sortPriceUp = (pointA, pointB) => getSortUp(pointB.basePrice, pointA.basePrice);

const sortDayUp = (pointA, pointB) => getSortUp(dayjs(pointA.dateFrom), dayjs(pointB.dateFrom));


const differentDate = (from, to) => {
  const date1 = dayjs(from);
  const date2 = dayjs(to);

  const dayResult = date2.diff(date1, 'day');
  const hourResult = date2.diff(date1, 'hour');
  const minuteResult = date2.diff(date1, 'minute');
  if(dayResult){
    return (
      `${dayResult}D ${Math.round(hourResult / HOURS_PER_DAY)}H ${Math.round(minuteResult / (HOURS_PER_DAY * MIN_IN_AN_HOUR))}M`
    );

  }
  if(hourResult){
    return(
      `${hourResult}H ${Math.round(minuteResult / HOURS_PER_DAY)}M`
    );
  }
  return(
    `${minuteResult}M`
  );

};

export {getRandomPositiveInteger, humanizePointDateFrom, humanizePointTimeFrom, getRandomArrayElement, FilterTypes, filter, updateItem, SortTypes, sortPriceUp, sortTimeUp, differentDate, sortDayUp};


