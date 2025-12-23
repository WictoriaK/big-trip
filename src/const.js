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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export { FilterTypes, SortTypes, HOURS_PER_DAY, MIN_IN_AN_HOUR, UserAction, UpdateType };
