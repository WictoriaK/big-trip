import TripPointsListView from '../view/trip-points-list-view.js';
import TripListItemView from '../view/point-item-list-view.js';
import PointEditView from '../view/point-edit-view.js';

import { render } from '../render.js';

export default class PointsPresenter {
  pointsBoard = new TripPointsListView();

  init = (pointsContainer) => {
    this.pointsContainer = pointsContainer;

    render(this.pointsBoard, this.pointsContainer);
    render(new PointEditView(), this.pointsContainer.querySelector('.trip-sort'), 'afterend' );

    for(let i = 0; i < 3; i++) {
      render(new TripListItemView(), this.pointsBoard.getElement());
    }



  };

}
