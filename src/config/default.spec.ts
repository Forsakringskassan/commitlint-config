import { type Options } from "conventional-commits-parser";
import lint from "@commitlint/lint";
import load from "@commitlint/load";
import messages from "../messages";
import config from "./default";

/* the config references the compiled .js files but here we want/need the original .ts files */
config.parserPreset = config.parserPreset.replace(".js", ".ts");
config.formatter = config.formatter.replace(".js", ".ts");

const errors = {
    jiraReference: {
        level: 2,
        message: messages.MISSING_JIRA_REFERENCE,
        name: "jira-reference",
        valid: false,
    },
    subjectEmpty: {
        level: 2,
        message: "subject may not be empty",
        name: "subject-empty",
        valid: false,
    },
    typeEmpty: {
        level: 2,
        message: "type may not be empty",
        name: "type-empty",
        valid: false,
    },
};

let opts: Awaited<ReturnType<typeof load>>;

beforeEach(async () => {
    opts = await load(config, { file: "empty-config.js" });
});

it.each`
    message
    ${"fix: lorem ipsum (refs SB-4982)"}
    ${"fix: lorem ipsum (fixes SB-4982)"}
    ${"feat: lorem ipsum (refs SB-4982)"}
    ${"chore(deps): lorem ipsum (refs SB-4982)"}
    ${"refactor!: lorem ipsum (refs SB-4982)"}
    ${"feat(foo)!: lorem ipsum (refs SB-4982)"}
`('"$message" should be valid', async ({ message }) => {
    const result = await lint(message, opts.rules, {
        parserOpts: opts.parserPreset?.parserOpts as Options,
        plugins: opts.plugins,
    });
    expect(result.valid).toBeTruthy();
    expect(result.errors).toEqual([]);
});

it.each`
    message                                | errors
    ${"foo"}                               | ${[errors.subjectEmpty, errors.typeEmpty, errors.jiraReference]}
    ${"fix: lorem ipsum"}                  | ${[errors.jiraReference]}
    ${"fix: lorem ipsum ()"}               | ${[errors.jiraReference]}
    ${"fix: lorem ipsum (refs)"}           | ${[errors.jiraReference]}
    ${"fix: lorem ipsum (fixes)"}          | ${[errors.jiraReference]}
    ${"fix: lorem ipsum (SB-4982)"}        | ${[errors.jiraReference]}
    ${"fix: lorem ipsum (foobar SB-4982)"} | ${[errors.jiraReference]}
    ${"fix: (refs SB-4982) lorem ipsum"}   | ${[errors.jiraReference]}
`('"$message" should be invalid', async ({ message, errors }) => {
    const result = await lint(message, opts.rules, {
        parserOpts: opts.parserPreset?.parserOpts as Options,
        plugins: opts.plugins,
    });
    expect(result.valid).toBeFalsy();
    expect(result.errors).toEqual(errors);
});
