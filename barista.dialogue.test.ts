import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

describe("barista.dialogue", () => {
  it("rejects invalid station metrics before calling the model", async () => {
    const caller = appRouter.createCaller({
      user: undefined,
      req: {} as never,
      res: {} as never,
    });

    await expect(caller.barista.dialogue({
      station: "",
      action: "وصل",
      ingredients: [],
      metrics: { grams: -1, seconds: 0, angle: 0 },
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
