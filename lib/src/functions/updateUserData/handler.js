import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const updateUserData = async (event) => {
    var _a;
    try {
        const data = JSON.parse(event.body);
        const dbName = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.dbName;
        const { _id, firstName, lastName, phoneNumber, cep, address, homeNumber, state, role } = data;
        const updatedUserData = {
            _id,
            firstName,
            lastName,
            phoneNumber,
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
    }
    catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao atualizar dados do usuário.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map