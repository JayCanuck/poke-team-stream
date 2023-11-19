import { styled } from '@mui/material/styles';
import { useTeam } from '../hooks/use-team';
import { TeamMember } from './TeamMember';

const Outline = styled('div')`
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid black;
  padding: 10px;
`;

interface RowProps {
  spacing: number;
  stagger: number;
  children: React.ReactNode;
}
const Row = styled(({ spacing, stagger, ...rest }: RowProps) => <div {...rest} />)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  gap: ${({ spacing = 1 }) => spacing}%;

  .staggered:nth-child(odd) {
    ${({ stagger = 0 }) => (stagger < 0 ? `padding-bottom: ${stagger}%;` : `padding-top: ${stagger}%;`)}
  }
  .staggered:nth-child(even) {
    ${({ stagger = 0 }) => (stagger < 0 ? `padding-top: ${stagger * -1}%;` : `padding-bottom: ${stagger}%;`)}
  }
`;

const Cell = styled('div')`
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Maintain 1:1 aspect ratio */
`;

export const TeamRoster: React.FC = () => {
  const [{ spacing, stagger }] = useTeam();
  return (
    <Outline>
      <Row spacing={spacing} stagger={stagger}>
        {[...Array(6)].map((_, i) => (
          <div className='staggered' key={`roster-${i}`}>
            <Cell>
              <TeamMember index={i}></TeamMember>
            </Cell>
          </div>
        ))}
      </Row>
    </Outline>
  );
};
