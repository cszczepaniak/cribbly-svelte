import { browser } from "$app/environment";
import { env } from "$env/dynamic/public";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { onMount } from "svelte";

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseKey = env.PUBLIC_SUPABASE_ANON_KEY;

type SubscriptionParams = {
    eventFilter: GameUpdateEvent,
    callback: (payload: GameUpdatePayload) => void,
}

export function subscribeToGameUpdates(params?: SubscriptionParams) {
    let client = subscribeToChannel("prelim-standings")
    if (params) {
        client.on("broadcast", { event: params.eventFilter }, (event) => {
            params.callback(event.payload);
        })
    }
    return {
        notifyGameUpdate(g: GameUpdatePayload) {
            notifyGameUpdate(client, g);
        }
    }
}

type GameUpdateEvent = "score-submitted";

type GameUpdatePayload = {
    gameID: string
    winnerID: string
    loserScore: number
}

export function notifyGameUpdate(cl: RealtimeChannel, g: GameUpdatePayload) {
    let ev: GameUpdateEvent = "score-submitted";
    try {
        cl.send({
            type: "broadcast",
            event: ev,
            payload: g,
        })
    } catch (e) {
        console.error("failed to send notification", e)
    }
}

type Channel = "prelim-standings";

function subscribeToChannel(c: Channel) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const client = supabase.channel(c);

    try {
        if (browser) {
            onMount(() => {
                client.subscribe();
            })
        } else {
            client.subscribe();
        }
    } catch (e) {
        console.error("failed to subscribe", e, browser)
    }

    return client
}