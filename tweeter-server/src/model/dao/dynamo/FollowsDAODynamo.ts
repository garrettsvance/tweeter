import { FollowsDAO } from "../interface/FollowsDAO";
import { User, UserDto } from "tweeter-shared";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class FollowsDAODynamo implements FollowsDAO {
  private readonly tableName: string = "tweeter-follows";
  private readonly followerName: string = "followerName";
  private readonly followerAlias: string = "followerAlias";
  private readonly followerImage: string = "followerImage";
  private readonly followeeName: string = "followeeName";
  private readonly followeeAlias: string = "followeeAlias";
  private readonly followeeImage: string = "followeeImage";
  private readonly indexName: string = "follows-index";
  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  public async followAction(follower: User, followee: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        followerAlias: follower.alias,
        followeeAlias: followee.alias,
        followerName: `${follower.firstName}, ${follower.lastName}`,
        followerImage: follower.imageUrl,
        followeeName: `${followee.firstName}, ${followee.lastName}`,
        followeeImage: followee.imageUrl,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(
        `Successfully followed: ${followee.alias} by ${follower.alias}`,
      );
    } catch (error) {
      console.error("Error in followAction:", error);
      throw new Error("Error following user");
    }
  }

  public async getFollowees(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: "#follower = :alias",
      ExpressionAttributeNames: {
        "#follower": this.followerAlias,
      },
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      const followees = response.Items
        ? response.Items.map((item) => {
            const [lastName, firstName] = item[this.followeeName].split(", ");
            return new User(
              firstName,
              lastName,
              item[this.followeeAlias],
              item[this.followeeImage],
            ).dto;
          })
        : [];
      const hasMore = !!response.LastEvaluatedKey;
      console.log(`Retrieved ${followees.length} followees for ${userAlias}`);
      return [followees, hasMore];
    } catch (error) {
      console.error("Error in getFollowees:", error);
      throw new Error("Error retrieving followees");
    }
  }

  public async getFollowers(
    user: User | null,
    pageSize: number,
    userAlias: string,
  ): Promise<[followers: UserDto[], hasMore: boolean]> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "#followee = :alias",
      ExpressionAttributeNames: {
        "#followee": this.followeeAlias,
      },
      ExpressionAttributeValues: {
        ":alias": userAlias,
      },
      Limit: pageSize,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      const followers = response.Items
        ? response.Items.map((item) => {
            const [firstName, lastName] = item[this.followerName].split(", ");
            return new User(
              firstName,
              lastName,
              item[this.followerAlias],
              item[this.followerImage],
            ).dto;
          })
        : [];
      const hasMore = !!response.LastEvaluatedKey;
      console.log(`Retrieved ${followers.length} followers for ${userAlias}`);
      return [followers, hasMore];
    } catch (error) {
      console.error("Error in getFollowers:", error);
      throw new Error("Error retrieving followers");
    }
  }

  public async getFollowerAliases(userAlias: string): Promise<string[]> {
    console.log(`Getting follower aliases for user: ${userAlias}`);

    try {
      const params: QueryCommandInput = {
        TableName: this.tableName,
        IndexName: this.indexName,
        KeyConditionExpression: "#followee = :alias",
        ExpressionAttributeNames: {
          "#followee": this.followeeAlias,
        },
        ExpressionAttributeValues: {
          ":alias": userAlias,
        },
        ProjectionExpression: this.followerAlias,
      };

      const followerAliases: string[] = [];
      let lastEvaluatedKey: Record<string, any> | undefined;

      do {
        if (lastEvaluatedKey) {
          params.ExclusiveStartKey = lastEvaluatedKey;
        }

        const response = await this.client.send(new QueryCommand(params));

        if (response.Items) {
          followerAliases.push(
            ...response.Items.map((item) => item[this.followerAlias]),
          );
        }

        lastEvaluatedKey = response.LastEvaluatedKey;
      } while (lastEvaluatedKey);

      console.log(
        `Retrieved ${followerAliases.length} follower aliases for ${userAlias}`,
      );
      return followerAliases;
    } catch (error) {
      console.error("Error retrieving follower aliases", error);
      throw new Error("Failed to retrieve follower aliases");
    }
  }

  //TODO: double check the differences with index and table names, and use that when searching for your information
  // for followers and followees

  public async getIsFollower(
    alias: string,
    aliasToFollow: string,
  ): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression:
        "followerAlias = :alias AND followeeAlias = :aliasToFollow",
      ExpressionAttributeValues: {
        ":alias": alias,
        ":aliasToFollow": aliasToFollow,
      },
      Limit: 1,
    };
    try {
      const response = await this.client.send(new QueryCommand(params));
      const isFollower = !!(response.Items && response.Items.length > 0);
      console.log(`Is ${alias} following ${aliasToFollow}? ${isFollower}`);
      return isFollower;
    } catch (error) {
      console.error("Error in getIsFollower:", error);
      throw new Error("Error getting isFollower status");
    }
  }

  public async getNumFollowee(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      KeyConditionExpression: "#follower = :alias",
      ExpressionAttributeNames: {
        "#follower": this.followerAlias,
      },
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Select: "COUNT",
    };
    //try {
    const result = await this.client.send(new QueryCommand(params));
    const count = result.Count ?? 0;
    console.log(`Number of followees for ${alias}: ${count}`);
    return count;
    // } catch (error) {
    //console.error("Error in getNumFollowee:", error);
    //throw new Error("Error retrieving numFollowee");
    // return 0;
    //}
  }

  public async getNumFollower(alias: string): Promise<number> {
    const params: QueryCommandInput = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: "#followee = :alias",
      ExpressionAttributeNames: {
        "#followee": this.followeeAlias,
      },
      ExpressionAttributeValues: {
        ":alias": alias,
      },
      Select: "COUNT",
    };
    // try {
    const result = await this.client.send(new QueryCommand(params));
    const count = result.Count ?? 0;
    console.log(`Number of followers for ${alias}: ${count}`);
    return count;
    // } catch (error) {
    // console.error("Error in getNumFollower:", error);
    // throw new Error("Error retrieving numFollower");
    //  return 0;
    //}
  }

  public async unfollowAction(
    follower: string,
    followee: string,
  ): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        followerAlias: follower,
        followeeAlias: followee,
      },
    };

    try {
      await this.client.send(new DeleteCommand(params));
      console.log(`Successfully unfollowed: ${followee} by ${follower}`);
    } catch (error) {
      console.error("Error in unfollowAction:", error);
      throw new Error("Error unfollowing user");
    }
  }

  public async initializeUser(alias: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        followeeAlias: alias,
        followerAlias: "initialized",
      },
    };
    try {
      await this.client.send(new PutCommand(params));
    } catch (error) {
      console.error("Error in initializeUser:", error);
      throw new Error("Error initializing user in follows");
    }
  }
}
