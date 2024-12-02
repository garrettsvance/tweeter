import { S3DAO } from "../interface/S3DAO";
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3,
  S3Client,
} from "@aws-sdk/client-s3";

export class S3DAODynamo implements S3DAO {
  private readonly bucket = "";
  private readonly region = "";

  public async putImage(
    alias: string,
    buffer: Buffer,
    imageType: string,
  ): Promise<string> {
    const params = {
      Bucket: this.bucket,
      Key: "image/" + alias,
      Body: buffer,
      ContentType: imageType,
      ACL: ObjectCannedACL.public_read,
    };
    const command = new PutObjectCommand(params);
    const client = new S3Client({ region: this.region });
    try {
      await client.send(command);
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/image/${alias}`;
    } catch (error) {
      throw new Error("Error uploading pfp");
    }
  }
}
