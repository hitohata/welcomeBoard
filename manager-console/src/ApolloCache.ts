import { InMemoryCacheConfig } from "@apollo/client";

export const inMemoryCacheConfig: InMemoryCacheConfig = {
    typePolicies: {
        message: {
            keyFields: ["Keyword"]
        }
    }
}
