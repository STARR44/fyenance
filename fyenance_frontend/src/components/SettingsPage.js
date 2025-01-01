import React from "react";
import MonoConnect from "@mono.co/connect.js";

export default class SettingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.monoConnect = new MonoConnect({
      key: "test_pk_cg4repr1uajbyt0ugcga", // Mono public key
      onClose: () => console.log("Widget closed"),
      onLoad: () => console.log("Widget loaded successfully"),
      onSuccess: ({ code }) => {
        console.log(`Linked successfully: ${code}`);
        // Send code to the backend to exchange for account ID
        fetch("/api/exchange-token/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
          .then((response) => response.json())
          .then((data) => console.log("Account linked:", data.account_id))
          .catch((error) => console.error("Error:", error));
      },
    });

    this.monoConnect.setup();
  }

  handleLinkAccount = () => {
    this.monoConnect.open();
  };

  render() {
    return (
      <div>
        <h1>Settings</h1>
        <button onClick={this.handleLinkAccount}>Link Account</button>
        {/* <p>Or add transactions manually below:</p>
        Add your manual transaction form or component */}
      </div>
    );
  }
}
