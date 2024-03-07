export default {
    type: "object",
    properties: {
        workoutId: { type: "string" },
        exercise: {
            type: "object",
            properties: {
                type: { type: "string" },
                id: { type: "string" },
                _id: { type: "string" },
                label: { type: "string" },
                repetitions: { type: "string" },
                weight: { type: "number" },
                isFinished: { type: "boolean" },
                image: { type: "string" },
            },
            required: [
                "type",
                "id",
                "_id",
                "label",
                "repetitions",
                "weight",
                "isFinished",
                "image",
            ],
        },
    },
    required: ["workoutId", "exercise"],
};
//# sourceMappingURL=schema.js.map