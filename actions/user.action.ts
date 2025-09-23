"use server";
import { createClient } from "@/lib/server";

export const getSession = async () => {
    const { data, error } = await (await createClient()).auth.getSession();
    if (error || !data) {
        console.error(error);
    }
    return data.session;
};

export const getUser = async () => {
    const { data, error } = await (await createClient()).auth.getUser();
    if (!data.user || error) {
        return null;
    }
    return data.user;
};

