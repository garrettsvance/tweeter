import { Buffer } from "buffer";
import {
  AuthenticatePresenter,
  AuthenticationView,
} from "./AuthenticatePresenter";

export class RegisterPresenter extends AuthenticatePresenter {
  public constructor(view: AuthenticationView) {
    super(view);
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
  ) {
    await this.doAuthentication(
      () =>
        this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension,
        ),
      "register user",
    );
  }

  public handleImageFile(
    file: File | undefined,
    setImageUrl: (url: string) => void,
    setImageBytes: (bytes: Uint8Array) => void,
    setImageFileExtension: (ext: string) => void,
  ) {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

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

        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
    }
  }

  private getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
