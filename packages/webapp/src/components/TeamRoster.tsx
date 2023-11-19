import { styled } from '@mui/material/styles';
import { RosterRow } from './RosterRow';
import { TeamMember } from './TeamMember';

const Outline = styled('div')`
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid black;
  padding: 10px;
`;

const Cell = styled('div')`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Maintain 1:1 aspect ratio */
`;

export const TeamRoster: React.FC = () => (
  <Outline>
    <RosterRow>
      {[...Array(6)].map((_, i) => (
        <div className='staggered' key={`roster-${i}`}>
          <Cell>
            <TeamMember index={i}></TeamMember>
          </Cell>
        </div>
      ))}
    </RosterRow>
  </Outline>
);
