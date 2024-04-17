import React from "react";
import { treaty } from "@elysiajs/eden";
import { EdenTreaty } from "@elysiajs/eden/treaty";
type SetFunction<ResponseType> = React.Dispatch<React.SetStateAction<ResponseType>>;
export async function fetchAndSet<ResponseType>(
    setFunction: SetFunction<ResponseType>,
    responsePromise: Promise<Omit<EdenTreaty.DetailedResponse, "headers">>,
    logDataToConsole = true,
) {
    const response = await Promise.resolve(responsePromise);
    const { data, error } = response;
    if (logDataToConsole) console.log(data);
    if (error)
        switch (error.status) {
            // Switch case added for better handling in future. No handling done as of now
            case 400:
                throw error;
            case 500:
                throw error;
            default:
                throw error;
        }
    setFunction(data);
}