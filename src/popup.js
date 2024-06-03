document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const statusDiv = document.getElementById('status');
  
    if (!window.PublicKeyCredential) {
      statusDiv.textContent = "WebAuthn is not supported on this browser.";
      return;
    }
  
    loginButton.addEventListener('click', async () => {
      try {
        const publicKeyCredentialRequestOptions = {
        challenge: new TextEncoder().encode("Don't trust, verify!"),
        rp: {
            name: 'Sui WebAuthn POC',
        },
        user: {
            id: new Uint8Array(10).fill(1), // random
            name: 'this is a user',
            displayName: 'Wallet User',
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }], // -7 is ES256
        authenticatorSelection: {
            authenticatorAttachment: 'cross-platform',
            residentKey: 'required',
            requireResidentKey: true, // this may already be default
            userVerification: 'required',
        },
        };
  
        const credential = await navigator.credentials.create({ publicKey: publicKeyCredentialRequestOptions });
  
        if (credential) {
          // Process the credential
          statusDiv.textContent = "Login successful!";
          console.log(credential.response.clientDataJSON);
          const decoder = new TextDecoder('utf-8');
          const jsonObject = JSON.parse(decoder.decode(credential.response.clientDataJSON));
          console.log(jsonObject);
        } else {
          statusDiv.textContent = "Login failed.";
        }
      } catch (err) {
        statusDiv.textContent = `Error: ${err.message}`;
      }
    });
  });