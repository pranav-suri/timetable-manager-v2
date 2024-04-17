import React from "react";
import { treaty } from "@elysiajs/eden";
import { EdenTreaty } from "@elysiajs/eden/treaty";
type SetFunction = React.Dispatch<React.SetStateAction<any>>;
export async function fetchAndSet(
    setFunction: SetFunction,
    responsePromise: Promise<Omit<EdenTreaty.DetailedResponse, "headers">>,
    logDataToConsole = false,
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