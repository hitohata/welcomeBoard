import React from "react";
import { useGetMessageQuery } from "./graphql/generated";
import { Hearts } from "react-loader-spinner";

export const GetSample: React.FC = () => {

    const {loading, error, data} = useGetMessageQuery({variables: {
        keyword: "key"
    }});


    if (loading) {
		return <Hearts/>
	}

    return (
        <>
            <p>{data?.getMessage?.Keyword}</p>
            <p>{data?.getMessage?.Message}</p>
            <p>{data?.getMessage?.Name}</p>
            <p>{error?.message}</p>
        </>
    );
}
