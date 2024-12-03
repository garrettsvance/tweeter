import {
  DynamoDBClient,
  CreateTableCommand,
  KeyType,
  ScalarAttributeType,
} from "@aws-sdk/client-dynamodb";

/** Table Command **/
// aws dynamodb describe-table --table-name tweeter-status --output json

const createStatusTable = async () => {
  const client = new DynamoDBClient({});

  const params = {
    TableName: "tweeter-status",
    KeySchema: [
      { AttributeName: "alias", KeyType: KeyType.HASH }, // Partition key
      { AttributeName: "timestamp", KeyType: KeyType.RANGE }, // Sort key for ordering statuses
    ],
    AttributeDefinitions: [
      { AttributeName: "alias", AttributeType: ScalarAttributeType.S },
      { AttributeName: "timestamp", AttributeType: ScalarAttributeType.N },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 3,
      WriteCapacityUnits: 3,
    },
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log("Table created successfully:", data);
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createStatusTable();
