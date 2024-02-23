import { promises as fs, existsSync, writeFileSync } from "fs";

var config: any;

export async function initConfig() {
  if (!existsSync("./config.json")) {
    writeFileSync("./config.json", "{}");
  }
  config = JSON.parse((await fs.readFile("./config.json")).toString());
  return config;
}

export function getConfig() {
  return config;
}

export async function setConfig(path: string, val: string) {
  await initConfig();

  console.log("Before: \n", JSON.stringify(config));
  const splitPath = path.split(".").reverse();

  var ref = config;
  while (splitPath.length > 1) {
    let key = splitPath.pop();
    if (key) {
      if (!ref[key]) ref[key] = {};
      ref = ref[key];
    } else {
      return;
    }
  }

  let key = splitPath.pop();
  if (key) ref[key] = val;

  await updateConfig();
}

export async function updateConfig() {
  console.log("After: \n", JSON.stringify(config));
  return fs.writeFile("./config.json", JSON.stringify(config, null, 2));
}

export async function readValue(path: string): Promise<string | null> {
  await initConfig();

  const splitPath = path.split(".");

  var ref = config;
  while (splitPath.length > 0) {
    var key = splitPath.shift();
    if (key && ref[key]) {
      ref = ref[key];
    } else {
      return null;
    }
  }
  return ref;
}
