import {
  DynamoDBClient,
  CreateTableCommand,
  KeyType,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

/** Table Command **/
// aws dynamodb describe-table --table-name tweeter-follows --output json

const createFollowsTable = async () => {
  const params = {
    TableName: "tweeter-follows",
    KeySchema: [
      { AttributeName: "followerAlias", KeyType: KeyType.HASH }, // Partition Key
      { AttributeName: "followeeAlias", KeyType: KeyType.RANGE }, // Sort Key
    ],
    AttributeDefinitions: [
      { AttributeName: "followerAlias", AttributeType: "S" }, // Primary Key Partition
      { AttributeName: "followeeAlias", AttributeType: "S" }, // Primary Key Sort Key
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1, // Adjust based on Free Tier limits
      WriteCapacityUnits: 1, // Adjust based on Free Tier limits
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "follows-index",
        KeySchema: [
          { AttributeName: "followeeAlias", KeyType: "HASH" }, // GSI Partition Key
          { AttributeName: "followerAlias", KeyType: "RANGE" }, // GSI Sort Key
        ],
        Projection: {
          ProjectionType: "ALL", // Include all attributes in the index
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
  };

  try {
    const command = new CreateTableCommand(params);
    const response = await client.send(command);
    console.log(
      "Table created successfully:",
      response.TableDescription?.TableName,
    );
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createFollowsTable();
