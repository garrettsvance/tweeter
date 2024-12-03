import {
  DynamoDBClient,
  CreateTableCommand,
  KeyType,
  ScalarAttributeType,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

/** Table Command **/
// aws dynamodb describe-table --table-name tweeter-sessions --output json

const createSessionsTable = async () => {
  const params = {
    TableName: "tweeter-sessions",
    KeySchema: [
      {
        AttributeName: "token",
        KeyType: KeyType.HASH, // Partition Key
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "token",
        AttributeType: ScalarAttributeType.S,
      },
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

createSessionsTable();
