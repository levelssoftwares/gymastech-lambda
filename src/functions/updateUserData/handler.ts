import { APIGatewayProxyHandler } from "aws-lambda";
import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";

interface UpdateUserData {
  _id: string;
  firstName: string;
  lastName: string;
  cep: string;
  address: string;
  homeNumber: string;
  state: string;
  role: string;
}

export const updateUserData: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const dbName = event.queryStringParameters?.dbName;

    const { _id, firstName, lastName, cep, address, homeNumber, state, role } =
      data;

    const updatedUserData: UpdateUserData = {
      _id,
      firstName,
      lastName,
      cep,
      address,
      homeNumber,
      state,
      role,
    };

    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const response = await client
      .db(dbName)
      .collection("Users")
      .updateOne({ _id: _id }, { $set: updatedUserData });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Dados do usuário atualizados com sucesso.",
        updatedUser: response,
      }),
      headers,
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message || "Falha ao atualizar dados do usuário.",
      }),
      headers,
    };
  }
};
