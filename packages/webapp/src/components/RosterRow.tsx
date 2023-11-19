import { styled } from '@mui/material/styles';
import { useTeam } from '../hooks/use-team';

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

export interface RosterRowProps {
  children?: React.ReactNode;
}

export const RosterRow: React.FC<RosterRowProps> = ({ children }) => {
  const [{ spacing, stagger }] = useTeam();

  return (
    <Row spacing={spacing} stagger={stagger}>
      {children}
    </Row>
  );
};
