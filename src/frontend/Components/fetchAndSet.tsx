import React from "react";
import { EdenTreaty } from "@elysiajs/eden/treaty";
import { SlotDatas } from "../../backend/database";
type SetFunction<ResponseType> = React.Dispatch<React.SetStateAction<ResponseType>>;

export async function fetchAndSet<ResponseType>(
    setFunction: SetFunction<ResponseType>,
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

export async function edenFetch<ResponseType>(
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
    return data as ResponseType;
}

export function checkIfSlotDataExists(slotData: SlotDatas[][0]) {
    return (
        slotData.Subject?.id ||
        slotData.Teacher?.id ||
        slotData.SlotDataClasses?.length ||
        slotData.SlotDataSubdivisions?.length
    );
}
