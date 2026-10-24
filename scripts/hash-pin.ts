// Prints the argon2id hash of a PIN for `PIN_HASH`: as is for Vercel, and as a line for
// `.env.local`, where Next expands `$` unless it is escaped.
// The PIN is typed twice, never echoed, and never leaves this process.
//
//   pnpm hash-pin

import { hash } from "@node-rs/argon2";
import { Option, Schema } from "effect";

// A relative path with its extension: Node runs this file as is, without the `@/` alias.
import { Pin } from "../src/contract/schemas/Auth.ts";

const control = { enter: ["\r", "\n"], interrupt: "\u0003", backspace: "\u007f" } as const;

const readHidden = (prompt: string) =>
  new Promise<string>((resolve) => {
    const { stdin, stdout } = process;
    const typed: Array<string> = [];
    stdout.write(prompt);
    stdin.setRawMode(true);
    stdin.setEncoding("utf8");
    stdin.resume();

    const finish = () => {
      stdin.off("data", onInput);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write("\n");
      resolve(typed.join(""));
    };

    // One chunk per keystroke when typed, the whole PIN at once when pasted.
    const onInput = (chunk: string) => {
      for (const key of chunk) {
        if (key === control.interrupt) process.exit(130);
        if (control.enter.some((enter) => enter === key)) return finish();
        if (key === control.backspace) typed.pop();
        else typed.push(key);
      }
    };
    stdin.on("data", onInput);
  });

const pin = await readHidden("PIN (4 to 12 digits): ");
if (Option.isNone(Schema.decodeUnknownOption(Pin)(pin))) {
  console.error("A PIN is 4 to 12 digits.");
  process.exit(1);
}
if ((await readHidden("Same PIN again: ")) !== pin) {
  console.error("The two PINs differ.");
  process.exit(1);
}

const pinHash = await hash(pin);
console.log(`\nVercel (Settings → Environment Variables), value of PIN_HASH:\n${pinHash}`);
console.log(`\n.env.local:\nPIN_HASH=${pinHash.replaceAll("$", "\\$")}`);
