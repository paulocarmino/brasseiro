const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
}

// Replace import.meta.env references for web compatibility
// Zustand uses import.meta.env.MODE which fails when loaded as a regular script
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
}

module.exports = config
