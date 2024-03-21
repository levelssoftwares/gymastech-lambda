import { handlerPath } from "@libs/handler-resolver";
export default {
    handler: `${handlerPath(__dirname)}/handler.insertCompanyDataHandler`,
    events: [
        {
            http: {
                method: "post",
                path: "create-company",
                cors: true,
            },
        },
    ],
};
//# sourceMappingURL=index.js.map