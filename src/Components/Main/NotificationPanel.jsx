import React from 'react';
import { Toast } from 'devextreme-react/toast';

  function NotificationPanel(props) {
    return (
        <Toast
          visible={props.isVisible}
          message={props.message}
          type={props.type}
          onHiding={props.onHiding}
          displayTime={2000}
          position = {{
            my: 'center top',
            at: 'center top',
          }}
        />
    );
  }

export default NotificationPanel;
