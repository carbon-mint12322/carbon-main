import { useState } from 'react';

export const useSet = (initialValue: any[] = []): any => {
  const [customSet, setSet] = useState(new Set(initialValue));
  const addToSet = (value: any) => {
    const newSet = new Set(customSet);
    newSet.add(value);
    setSet(newSet);
  };
  const toggleSet = (value: any) => {
    const newSet = new Set(customSet);
    if (customSet.has(value)) newSet.delete(value);
    else newSet.add(value);
    setSet(newSet);
  };
  const clearSet = () => {
    customSet.clear();
  };
  return [customSet, setSet, addToSet, toggleSet, clearSet];
};
