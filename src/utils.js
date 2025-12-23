import dayjs from 'dayjs';
import {FilterTypes, HOURS_PER_DAY, MIN_IN_AN_HOUR} from './const.js';


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

const getSortUp = (pointA, pointB) => pointA - pointB;

const sortTimeUp = (pointA, pointB) => {
  const timeA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const timeB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));

  return getSortUp(timeB, timeA);
};

const getSortDown = (pointA, pointB) => pointB - pointA;

const sortPriceUp = (pointA, pointB) => getSortDown(pointA.basePrice, pointB.basePrice);

const differentDate = (from, to) => {
  const date1 = dayjs(from);
  const date2 = dayjs(to);

  const dayResult = date2.diff(date1, 'day');
  const hourResult = date2.diff(date1, 'hour');
  const minuteResult = date2.diff(date1, 'minute');
  if(dayResult) {
    return (
      `${dayResult}D ${Math.round(hourResult / HOURS_PER_DAY)}H ${Math.round(minuteResult / (HOURS_PER_DAY * MIN_IN_AN_HOUR))}M`
    );
  }

  if(hourResult) {
    return(
      `${hourResult}H ${Math.round(minuteResult / HOURS_PER_DAY)}M`
    );
  }

  return(`${minuteResult}M`);
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export {getRandomPositiveInteger, humanizePointDateFrom, humanizePointTimeFrom, getRandomArrayElement, filter,  sortPriceUp, sortTimeUp, differentDate, isDatesEqual};


