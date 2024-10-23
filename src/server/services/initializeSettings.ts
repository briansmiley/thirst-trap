// run with: tsx src/server/services/initializeSettings.ts

import settingService from "./setting";

const settings = [
  { name: "maxDeathTimer", value: 45 },
  { name: "killTimeCredit", value: 30 },
  { name: "recruitTimeCredit", value: 15 }
];

async function initializeSettings() {
  for (const setting of settings) {
    try {
      const result = await settingService.upsert(setting);
      console.log(result);
    } catch (error) {
      console.error(`Error upserting setting ${setting.name}:`, error);
    }
  }
}

initializeSettings().catch(error => {
  console.error("Failed to initialize settings:", error);
});
