import { useEffect } from 'react'
import { getAll, Collections } from './firebase/firestoreService.ts';
import './App.css'
import MinecraftItemPicker from '@/components/item_selector/MinecraftItemPicker'

function App() {
    useEffect(() => {
        getAll(Collections.ITEMS).then(console.log);
    }, []);
  return (
    <>
      <MinecraftItemPicker />
    </>
  )
}

export default App