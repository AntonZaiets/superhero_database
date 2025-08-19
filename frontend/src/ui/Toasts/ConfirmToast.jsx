import { toast } from 'react-toastify';

export const ConfirmToast = (onConfirm, message = 'Delete this superhero?') => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>{message}</p>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              closeToast();
            }}
          >
            Yes
          </button>
          <button type="button" onClick={closeToast}>
            No
          </button>
        </div>
      </div>
    ),
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
    },
  );
};
