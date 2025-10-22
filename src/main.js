import TripFiltersView from './view/trip-filters-view.js';
import TripSortView from './view/trip-sort-view.js';
import { render } from './render.js';
import PointsPresenter from './presenter/points-presenter.js';


const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteSortElement = document.querySelector('.trip-events');
const pointsPresenter = new PointsPresenter();

render(new TripFiltersView(), siteFilterElement);
render(new TripSortView(), siteSortElement);

pointsPresenter.init(siteSortElement);


