import {
  DynamoDBClient,
  CreateTableCommand,
  ScalarAttributeType,
  KeyType,
} from "@aws-sdk/client-dynamodb";

/** Table Command **/
// aws dynamodb describe-table --table-name tweeter-users --output json

const createTable = async () => {
  const client = new DynamoDBClient({});

  const params = {
    TableName: "tweeter-users",
    KeySchema: [
      { AttributeName: "alias", KeyType: KeyType.HASH }, // Use KeyType enum
    ],
    AttributeDefinitions: [
      { AttributeName: "alias", AttributeType: ScalarAttributeType.S }, // Use ScalarAttributeType enum
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 3,
      WriteCapacityUnits: 3,
    },
  };

  try {
    const data = await client.send(new CreateTableCommand(params));
    console.log(
      "Table created successfully:",
      data.TableDescription?.TableName,
    );
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

createTable();
