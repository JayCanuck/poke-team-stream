import { start } from './connection';
import { TeamState, renderTeam, updateTeam } from './team';
import './index.css';

interface WidgetLoadDetails {
  channel: {
    apiToken: string;
    avatar: string;
    id: string;
    providerId: string;
    username: string;
  };
  fieldData: {
    password: string;
    signalServer: string;
  };
}

type WidgetLoadEvent = CustomEvent<WidgetLoadDetails>;

window.addEventListener('onWidgetLoad', (ev: Event) => {
  renderTeam().then(async () => {
    const {
      detail: {
        channel: { username },
        fieldData: { password }
      }
    } = ev as WidgetLoadEvent;

    await start({
      key: username.toLocaleLowerCase(),
      password,
      onMessage: msg => {
        updateTeam(msg as unknown as TeamState);
      }
    });
    console.log('PokeTeamStream widget connected to signal server and awaiting connections');
  });
});
