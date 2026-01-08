import NewPointButtonView from './view/new-point-button.js';
import PointsBoardPresenter from './presenter/points-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import {render} from './framework/render.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic v1997k174d';
const END_POINT = 'https://17.ecmascript.htmlacademy.pro/big-trip';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteTripMain = document.querySelector('.trip-main');
const siteContainer = document.querySelector('.trip-events');


const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
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


filterPresenter.init();
pointsBoardPresenter.init();
pointsModel.init().finally(() => {
  render(newPointButtonComponent, siteTripMain);
  newPointButtonComponent.setClickHandler(handeNewPointsButtonClick);
});
