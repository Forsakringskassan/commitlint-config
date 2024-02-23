const { default: lint } = require("@commitlint/lint");
const { default: load } = require("@commitlint/load");
const messages = require("../messages");

const errors = {
    jiraReference: {
        level: 2,
        message: messages.MISSING_JIRA_REFERENCE,
        name: "jira-reference",
        valid: null,
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

let opts;

beforeEach(async () => {
    opts = await load({
        extends: [require.resolve("./default")],
    });
});

describe("jira-reference", () => {
    it.each`
        message
        ${"fix: lorem ipsum (refs SB-4982)"}
        ${"fix: lorem ipsum (fixes SB-4982)"}
    `('"$message" should be valid', async ({ message }) => {
        const result = await lint(message, opts.rules, opts);
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
        const result = await lint(message, opts.rules, opts);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toEqual(errors);
    });
});
