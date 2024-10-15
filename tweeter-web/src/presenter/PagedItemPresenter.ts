import { Presenter, View } from "./Presenter";
import { AuthToken } from "tweeter-shared";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (items: T[]) => void;
}

export abstract class PagedItemPresenter<T, U> extends Presenter<
  PagedItemView<T>
> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private readonly _service: U;

  protected constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected abstract createService(): U;

  protected get service() {
    return this._service;
  }

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[T[], boolean]>;

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public get lastItem(): T | null {
    return this._lastItem;
  }

  public set lastItem(user: T | null) {
    this._lastItem = user;
  }

  protected abstract getItemDescription(): string;

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      if (this.hasMoreItems) {
        let [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      }
    }, this.getItemDescription());
  }
}
