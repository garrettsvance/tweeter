import { AuthToken, Status } from "tweeter-shared";

export interface StatusItemView {
  addItems: (items: Status[]) => void;
  displayErrorMessage: (message: string) => void;
}

export abstract class StatusItemPresenter {
  public reset() {
    this._lastItem = null;
    this._hasMoreItems = true;
  }

  private readonly _view: StatusItemView;
  private _hasMoreItems = true;
  private _lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }
  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
