import { MongoClient } from "mongodb";
import { MONGO_URI, headers } from "src/utils/mongoConfig";
export const insertCompanyDataHandler = async (event) => {
    const company = JSON.parse(event.body);
    const { name, email, cnpj, phoneNumber, address } = company;
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const existingCompany = await client
            .db("TTP-GYM")
            .collection("Companies")
            .findOne({ email });
        if (existingCompany) {
            await client.close();
            throw new Error("existe no main-db");
        }
        const responseCompanyMain = await client
            .db("TTP-GYM")
            .collection("Companies")
            .insertOne({ name, email, cnpj, phoneNumber, address });
        await client.close();
        return {
            statusCode: 200,
            body: JSON.stringify(responseCompanyMain),
            headers,
        };
    }
    catch (error) {
        console.log("error1", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error.message || "Falha ao inserir dados da empresa.",
            }),
            headers,
        };
    }
};
//# sourceMappingURL=handler.js.map