import TripFiltersView from './view/trip-filters-view.js';

import { render } from './framework/render.js';
import PointsPresenter from './presenter/points-presenter.js';
import PointsModel from './model/point-model.js';


const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const pointsPresenter = new PointsPresenter(siteContainer, pointsModel);


render(new TripFiltersView(), siteFilterElement);

pointsPresenter.init();


