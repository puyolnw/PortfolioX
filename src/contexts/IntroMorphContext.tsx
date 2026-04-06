import { createContext, useContext, type ReactNode, type RefObject } from 'react';

export type IntroMorphContextValue = {
  heroNameTargetRef: RefObject<HTMLDivElement | null>;
  morphStarted: boolean;
  morphComplete: boolean;
};

const IntroMorphContext = createContext<IntroMorphContextValue | null>(null);

export function IntroMorphProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: IntroMorphContextValue;
}) {
  return <IntroMorphContext.Provider value={value}>{children}</IntroMorphContext.Provider>;
}

export function useIntroMorph() {
  return useContext(IntroMorphContext);
}
