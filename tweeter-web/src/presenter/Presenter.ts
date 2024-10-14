export interface View {
  displayErrorMessage: (message: string) => void;
}

export class Presenter {
  private _view: View;

  public constructor(view: View) {
    this._view = view;
  }

  protected get view(): View {
    return this._view;
  }
}
