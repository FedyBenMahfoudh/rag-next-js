import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));
*/


export const getCleanFileName = (origFileName: string) : string => {
    // remove special characters except underscore and .
    let cleanedFileName = origFileName.trim().replace(/[^\w.]/g, "");

    // replace spaces with underscore
    cleanedFileName = cleanedFileName.replace(/ /g, "_");

    return cleanedFileName;
}

