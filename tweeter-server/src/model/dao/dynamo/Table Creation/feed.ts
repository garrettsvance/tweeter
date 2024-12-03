import {
  DynamoDBClient,
  CreateTableCommand,
  KeyType,
  ScalarAttributeType,
  ProjectionType,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

/** Table Command **/
const createFeedTable = async () => {
  const params = {
    TableName: "tweeter-feed",
    KeySchema: [
      { AttributeName: "alias", KeyType: KeyType.HASH }, // Partition Key (alias)
      { AttributeName: "timestamp", KeyType: KeyType.RANGE }, // Sort Key (timestamp)
    ],
    AttributeDefinitions: [
      { AttributeName: "alias", AttributeType: ScalarAttributeType.S }, // String type for alias
      { AttributeName: "timestamp", AttributeType: ScalarAttributeType.N }, // Number type for timestamp
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
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

createFeedTable();
