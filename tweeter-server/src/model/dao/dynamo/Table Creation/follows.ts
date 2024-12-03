import {
  DynamoDBClient,
  CreateTableCommand,
  KeyType,
  ScalarAttributeType,
  ProjectionType,
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
      { AttributeName: "followerAlias", AttributeType: ScalarAttributeType.S },
      { AttributeName: "followeeAlias", AttributeType: ScalarAttributeType.S },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "follows-index",
        KeySchema: [
          { AttributeName: "followeeAlias", KeyType: KeyType.HASH }, // GSI Partition Key
          { AttributeName: "followerAlias", KeyType: KeyType.RANGE }, // GSI Sort Key
        ],
        Projection: {
          ProjectionType: ProjectionType.ALL, // Include all attributes in the index
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
