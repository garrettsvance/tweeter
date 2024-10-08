import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface RegisterView {
  displayErrorMessage: (message: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (user: User, authToken: AuthToken) => void;
  navigate: (to: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (fileExtension: string) => void;
  setImageUrl: (imageUrl: string) => void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private userService: UserService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
  ) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension,
      );

      this.view.updateUserInfo(user, authToken);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`,
      );
    } finally {
      this.view.setIsLoading(false);
    }
  }

  public async handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
