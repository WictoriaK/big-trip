import NewPointButtonView from './view/new-point-button.js';
import PointsBoardPresenter from './presenter/points-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import {render} from './framework/render.js';


const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripMain = document.querySelector('.trip-main');
const siteContainer = document.querySelector('.trip-events');


const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const pointsBoardPresenter = new PointsBoardPresenter(siteContainer, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, pointsModel);
const newPointButtonComponent = new NewPointButtonView();

const handleNewPointFormClose = () => {
  newPointButtonComponent.element.disabled = false;
};

const handeNewPointsButtonClick = () => {
  pointsBoardPresenter.createPoint(handleNewPointFormClose);
  newPointButtonComponent.element.disabled = true;
};


render(newPointButtonComponent, siteTripMain);
newPointButtonComponent.setClickHandler(handeNewPointsButtonClick);


filterPresenter.init();
pointsBoardPresenter.init();
