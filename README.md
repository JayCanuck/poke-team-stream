# PokeTeamStream

Webapp and StreamElements widget for displaying and remotely updating Pokemon team roster via WebRTC.

## Building locally

Due to the nature of WebRTC communications, this project requires a deployment of a websocket signal server to pair peers. Specfically, this project has been made using [webrtc-ws-server](https://github.com/JayCanuck/webrtc-ws-server). Ensure such a server is deployed and can be accessed.

Once a signal server is live, with the appropriate environment variable `VITE_SIGNAL_SERVER=wss://signalserver` set, run the following commands:

```sh
npm install
npm run build
```

The built webapp is within `./packages/webapp/build`.
The built widget is within `./packages/widget/build`.

Generally I've deployed the website to a webhost at root level, with widget at `/widget/`, but it can be deployed to any location as desired.


## Using with StreamElements

1. Within StreamElements, add a `Custom widget`  (found within the `Static / Custom` section).
2. With the empty custom widget selection, select `OPEN EDITOR` from the left side menu.
3. Under `HTML`, highlight and delete any default content, then copy&paste the following:

```html
<script type="module" src="https://poketeam.stream/widget/poke-team-stream-widget.js"></script>
<link rel="stylesheet" href="https://poketeam.stream/widget/style.css">
```

4. Under `CSS` and `JS`, highlight and delete any default content. These should be empty.
5. Under `Fields`, highlight and delete any default content, then copy&paste the following:

```json
  {
    "password": {
      "label": "Set a password for website access",
      "type": "password",
      "value": ""
    }
  }
```

5. Under `FIELDS`, highlight and delete any default content, then copy&paste the following:

```json
  {}
```

6. Save the customizations by hitting the `DONE` button. Congratulations, the difficult part is done! 
7. On the left side menu, there will now a field you can fill out:
 * `Set a password for website access` - This can be anything. It's your personal password you can then use on the website. It will be tied to your Twitch channel name. This password will be stored within StreamElements storage and not sent to any third parties.

 **Note: substitute https://poketeam.stream for the deployed webapp/widget server URL as needed**
