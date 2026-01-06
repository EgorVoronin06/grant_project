import type { User } from "@ddsgt_mono/lib";
import { writable, type Writable } from "svelte/store";

export const user: Writable<User | undefined> = writable(undefined)