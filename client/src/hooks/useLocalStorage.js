import { useState } from "react";

function getSavedValue(key, initialValue){
    const savedValue = JSON.parse(localStorage.getItem(key))

    if(savedValue) return savedValue

    return initialValue
}

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
      const jsonValue = localStorage.getItem(key)
      if (jsonValue != null) return JSON.parse(jsonValue)
      return initialValue
    })
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])
  
    return [value, setValue]
}