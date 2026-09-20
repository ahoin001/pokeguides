export const easeOut = [0.16, 1, 0.3, 1] as const;

export const motionTokens = {
  feedback: 0.12,
  state: 0.22,
  layout: 0.38,
  focal: 0.52,
  spring: { stiffness: 380, damping: 34 },
};

export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: motionTokens.layout, ease: easeOut },
};

/** Popover / move detail enter — scale from trigger. */
export const panelIn = {
  initial: { opacity: 0, y: -4, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.96 },
  transition: { duration: motionTokens.state, ease: easeOut },
};

/** Chip selected affordance — brief brightness settle. */
export const selectPulse = {
  initial: { filter: "brightness(1.08)" },
  animate: { filter: "brightness(1)" },
  transition: { duration: motionTokens.feedback, ease: easeOut },
};
