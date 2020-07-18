import { getSetting, setSetting } from "Core/settings";
import { waitForElement } from "Core/helpers/waitFor";
import mixerApi from "./mixerApi";
import Log from "Core/utils/log";
import PackageConfig from "PackageConfig";

export const mixeraVersion = PackageConfig.version;

export const isLatestVersion = getSetting("version") === mixeraVersion
