declare module "conventional-changelog-conventionalcommits" {
    function createPreset<T>(config: T): unknown;
    export = createPreset;
}
