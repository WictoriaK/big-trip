import TripPointsListView from '../view/trip-points-list-view.js';
import TripListItemView from '../view/point-item-list-view.js';
import PointEditView from '../view/point-edit-view.js';

import { render } from '../render.js';

export default class PointsPresenter {
  pointsBoard = new TripPointsListView();

  init = (pointsContainer, pointsModel) => {
    this.pointsContainer = pointsContainer;
    this.pointsModel = pointsModel;
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(this.pointsBoard, this.pointsContainer);
    render(new PointEditView(this.boardPoints[0]), this.pointsContainer.querySelector('.trip-sort'), 'afterend' );

    for(let i = 0; i < this.boardPoints.length; i++) {
      render(new TripListItemView(this.boardPoints[i]), this.pointsBoard.getElement());
    }
  };
}
