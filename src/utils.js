
import dayjs from 'dayjs';

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


const getRandomArrayElement = (array) => array[getRandomPositiveInteger(0, array.length - 1)];

export {getRandomPositiveInteger, humanizePointDateFrom, humanizePointTimeFrom, getRandomArrayElement};


// 'MMM D'
// 'HH:mm'
//'DD/MM/YYYY'
