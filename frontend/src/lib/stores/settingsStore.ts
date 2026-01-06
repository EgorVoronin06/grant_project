import type { SettingsDto } from "@ddsgt_mono/lib";
import { writable, type Writable } from "svelte/store";

export const settings: Writable<SettingsDto> = writable()