export interface View {
  displayErrorMessage: (message: string) => void;
}

export class Presenter<V extends View> {
  private readonly _view: V;

  public constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }
}
