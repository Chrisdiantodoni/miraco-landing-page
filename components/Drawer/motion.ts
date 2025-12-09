import { typeDrawerProps } from "@rc-component/drawer";
import "../../styles/motion.less";

export const maskMotion: typeDrawerProps["maskMotion"] = {
  motionAppear: true,
  motionName: "mask-motion",
  onAppearEnd: console.warn,
};

export const motion: typeDrawerProps["motion"] = (placement) => ({
  motionAppear: true,
  motionName: `panel-motion-${placement}`,
});

const motionProps: Partial<typeDrawerProps> = {
  maskMotion,
  motion,
};

export default motionProps;
