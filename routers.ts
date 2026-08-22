import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const dialogueInput = z.object({
  station: z.string().min(1).max(40),
  action: z.string().min(1).max(120),
  ingredients: z.array(z.string().max(60)).max(12),
  metrics: z.object({ grams: z.number().min(0).max(2000), seconds: z.number().min(0).max(300), angle: z.number().min(-180).max(180) }),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  barista: router({
    dialogue: publicProcedure.input(dialogueInput).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "أنت نورة، باريستا خليجية خفيفة الدم داخل محاكاة Kora. اكتب بلهجة خليجية بيضاء مفهومة للجميع، بجملة قصيرة ودودة وذكية بدون إهانة أو مبالغة. استخدم كلمات مثل: يا سلام، أبشر، على هونك، مضبوط، لا تشيل هم. علّق على الفعل والجرامات والزمن والزاوية، وكن مشجعة حتى عند الخطأ. ارجع JSON فقط." },
          { role: "user", content: JSON.stringify(input) },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "barista_dialogue",
            strict: true,
            schema: {
              type: "object",
              properties: {
                drinkName: { type: "string" },
                line: { type: "string" },
                coach: { type: "string" },
                scoreHint: { type: "string" },
              },
              required: ["drinkName", "line", "coach", "scoreHint"],
              additionalProperties: false,
            },
          },
        },
      });
      const content = response.choices[0]?.message?.content;
      const text = typeof content === "string" ? content : `{"drinkName":"خلطة كورا","line":"يا سلام عليك، أبشر بالخلطة المضبوطة.","coach":"على هونك وخلك قريب من الميزان.","scoreHint":"مستقر"}`;
      try {
        return JSON.parse(text) as { drinkName: string; line: string; coach: string; scoreHint: string };
      } catch {
        return { drinkName: "خلطة كورا", line: text.slice(0, 140), coach: "على هونك وخلك قريب من الميزان.", scoreHint: "مستقر" };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
