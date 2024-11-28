export interface S3DAO {
  uploadPfp(
    alias: string,
    imageBuffer: Buffer,
    imageFileExtension: string,
  ): Promise<string>;
}
