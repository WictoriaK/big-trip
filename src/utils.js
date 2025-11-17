import dayjs from 'dayjs';

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

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

export {getRandomPositiveInteger, humanizePointDateFrom, humanizePointTimeFrom, getRandomArrayElement, FilterTypes, filter, updateItem};


