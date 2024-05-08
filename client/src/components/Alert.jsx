import * as AlertDialog from '@radix-ui/react-alert-dialog';
import '../styles/Alert.scss';

const Alert = ({ onRemoveBooking }) => {
  const handleRemoveBooking = () => {
    onRemoveBooking();
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button className="Button violet">Poista varaus</button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="AlertDialogOverlay" />
        <AlertDialog.Content className="AlertDialogContent">
          <AlertDialog.Title className="AlertDialogTitle">Oletko varma?</AlertDialog.Title>
          <AlertDialog.Description className="AlertDialogDescription">
            Poistamista ei voi perua!
          </AlertDialog.Description>
          <div style={{ display: 'flex', gap: 25, justifyContent: 'flex-end' }}>
            <AlertDialog.Cancel asChild>
              <button className="Button-alert mauve">Peruuta</button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button className="Button-alert red" onClick={handleRemoveBooking}>Poista varaus</button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default Alert;
