import prisma from "@/app/client";
import { Prisma } from "@prisma/client";

const selects = {
  name: true,
  value: true
};

const settingService = {
  upsert: async (newSetting: Prisma.SettingCreateInput) => {
    const setting = await prisma.setting.upsert({
      where: { name: newSetting.name },
      update: newSetting,
      create: newSetting,
      select: selects
    });
    return setting;
  },
  update: async (name: string, value: number) => {
    const updatedSetting = await prisma.setting.update({
      where: { name },
      data: { value },
      select: selects
    });
    return updatedSetting;
  },
  get: async (name: string) => {
    const settingValue = await prisma.setting.findUnique({
      where: { name },
      select: { value: true }
    });
    return settingValue;
  }
};

export default settingService;
