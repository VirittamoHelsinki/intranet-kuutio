import React, { useState, useEffect } from 'react';
import * as Toast from '@radix-ui/react-toast';
import '../styles/ToastAlert.scss';
import { TriangleAlert } from 'lucide-react';

const ToastAlert = () => {
  const [open, setOpen] = useState(false);
  const timerRef = React.useRef(0);

  useEffect(() => {
    setOpen(true);
    timerRef.current = setTimeout(() => {
      setOpen(false);
    }, 5000);

    return () => clearTimeout(timerRef.current);
  }, []);

  // const handleUndo = () => {
  //   setOpen(false);
  // };

  return (
    <Toast.Provider>
      <Toast.Root className="ToastRoot" open={open} onOpenChange={setOpen}>
        <div className="ToastContent">
          <div className="IconContainer">
            <TriangleAlert className="TriangleAlert"></TriangleAlert>
          </div>
          <div className="TextContainer">
            <Toast.Title className="ToastTitle">Virhe!</Toast.Title>
            <Toast.Description className="ToastDescription">
              Valitse nykyinen tai tuleva varauksen päivämäärä.
            </Toast.Description>
          </div>
        </div>
        <Toast.Action className="ToastAction" asChild altText="Goto schedule to undo">
          {/* <button className="Button small red" onClick={handleUndo}>Undo</button> */}
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="ToastViewport" />
    </Toast.Provider>
  );  
};
export default ToastAlert;
