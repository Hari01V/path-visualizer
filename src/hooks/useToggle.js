import { useState } from 'react';

export default function useToggle(intialValue = false) {
  const [state, setState] = useState(intialValue);
  const toggle = () => {
    setState(!state);
  }
  return [state, toggle];
}