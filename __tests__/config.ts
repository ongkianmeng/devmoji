import { Config } from "../src/config"
import { ConfigOptions } from "../src/config-options"

test("load config", async () => {
  const config = await Config.load("__tests__/ignore.devmoji.config.js")
  expect(config.pack.get("feat")?.emoji).toBe("poop")
  expect(config.pack.get("fuckup")?.emoji).toBe("poop")
})

test("missing prop code", () => {
  expect(() => {
    const config = ({ devmoji: [{ foo: 1 }] } as unknown) as ConfigOptions
    new Config(config)
  }).toThrow(/code is missing/)
})

test("missing prop emoji", () => {
  expect(() => {
    const config = ({
      devmoji: [{ code: "foo" }],
    } as unknown) as ConfigOptions
    new Config(config)
  }).toThrow(/Missing.*emoji.*/)
})

test("missing config file", () => {
  expect.assertions(1)
  return Config.load("missing-config-file").catch((error) =>
    expect(error).toMatch(/missing.*/)
  )
})

test("config without devmoji", () => {
  const config = ({ types: [] } as unknown) as ConfigOptions
  expect(() => {
    new Config(config)
  }).not.toThrow()
})

test("invalid gitmoji", () => {
  const config = ({
    devmoji: [{ code: "test", gitmoji: "foobar" }],
  } as unknown) as ConfigOptions
  expect(() => {
    new Config(config)
  }).toThrow(/Gitmoji .* not found/)
})

test("default config file", async () => {
  try {
    await Config.load()
  } catch (error) {
    // eslint-disable-next-line jest/no-try-expect, jest/no-conditional-expect
    expect(error).toMatch(/missing.*/)
  }
})

test("no default config file", async () => {
  try {
    await Config.load(undefined, "/")
  } catch (error) {
    // eslint-disable-next-line jest/no-try-expect, jest/no-conditional-expect
    expect(error).toMatch(/missing.*/)
  }
})
