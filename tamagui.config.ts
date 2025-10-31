import { createTamagui } from 'tamagui'
import { config } from '@tamagui/config/v3'

// you usually export this from a new file and import it here
const appConfig = createTamagui(config)

export type AppConfig = typeof appConfig

declare module 'tamagui' {
  // or '@tamagui/core'
  // overrides TamaguiCustomConfig so your custom types
  // work everywhere you import `tamagui`
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig
      