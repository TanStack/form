"use server"

import {data} from "./shared-code";

export default async function someAction() {
  return "Hello " + data.testMsg;
}
