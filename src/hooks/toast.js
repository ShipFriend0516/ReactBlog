import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'

const useToast = () => {

  // Toast Tab
  // const [toasts, setToasts] = useState([])
  const toasts = useRef([]); // 변경되어도 리렌더링 되지 않지만 바로 변경이 가능함.
  const [toastRerender, setToastRerender] = useState(false);


  const deleteToast = (id) => {
    const filteredToasts = toasts.current.filter(toast=> {
      return toast.id !== id;
    })

    toasts.current = filteredToasts
    setToastRerender(prev => !prev)
  }



  const addToast = (toast) => {
    const toastWithId = {
      ...toast, id: uuidv4()
    }

    toasts.current = [...toasts.current, toastWithId]
    setTimeout(() => {deleteToast(toastWithId.id, toasts.current, setToastRerender)}, 5000);
    setToastRerender(prev => !prev)
  }

  return [toasts.current, addToast, deleteToast]
}


export default useToast