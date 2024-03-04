import { useContext } from "react";
// mobx store
import { StoreContext } from "contexts/store-context";
// types
import { IModuleStore } from "oldStore/module.store";

export const useModule = (): IModuleStore => {
  const context = useContext(StoreContext);
  if (context === undefined) throw new Error("useModule must be used within StoreProvider");
  return context.module;
};
