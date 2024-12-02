export interface S3DAO {
  putImage(
    alias: string,
    imageBuffer: Buffer,
    imageFileExtension: string,
  ): Promise<string>;
}
