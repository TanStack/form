import type { TestForm } from "./simple";
import { sampleData } from "./simple";


import { expect, $ } from "@wdio/globals";
describe("Lit Tests", () => {
  let element: TestForm;
  beforeEach(() => {
    element = document.createElement("test-form") as TestForm;
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should have initial values", async () => {
    expect(await $("test-form").shadow$("#firstName")).toHaveText(
      sampleData.firstName,
    );
    expect(await $("test-form").shadow$("#lastName")).toHaveText("");
    const form = element.form!;
    expect(form.state?.values.firstName).toHaveText(sampleData.firstName);
    expect(form.api.getFieldMeta("firstName")?.isTouched).toBeFalsy();
    expect(form.state?.values.lastName).toHaveText(sampleData.firstName);
    expect(form.api.getFieldMeta("lastName")?.isTouched).toBeFalsy();
  });
  it("should mirror user input", async () => {
    const lastName = await $("test-form").shadow$("#lastName");
    const lastNameValue = "Jobs";
    await lastName.addValue(lastNameValue);
    const form = element.form!;
    expect(form.state?.values?.lastName).toHaveText(lastNameValue);
    expect(form.api.getFieldMeta("lastName")?.isTouched).toBeTruthy();
  });
  it("Reset form to initial value", async () => {
    const firstName = await $("test-form").shadow$("#firstName");
    const lastNameValue = "Jobs";
    await firstName.addValue("-Joseph");
    expect(firstName).toHaveText("Christian-Joseph");

    const form = element.form;
    await $("test-form").shadow$("#reset").click();
    expect(form.state?.values.firstName).toHaveText(sampleData.firstName);
  });

  it("should display validation", async () => {
    const lastName = await $("test-form").shadow$("#lastName");
    const lastNameValue = "Jo";
    await lastName.addValue(lastNameValue);
    expect(await lastName.getAttribute("error-text")).toHaveText(
      "Not long enough",
    );
    await lastName.addValue(lastNameValue);
    const form = element.form;
    expect(await lastName.getAttribute("error-text")).toBeFalsy();
    expect(form.state?.values.lastName).toHaveText("JoJo");
    expect(form.api.getFieldMeta("lastName")?.isTouched).toBeTruthy();
  });
});
