import { EngineeringDetails } from '../../components/EngineeringDetails';
import { VocabSongs } from './VocabSongs';
import type { JadeWordsProject } from './types';

export function JadeWordsDetails({ project, immersed }: { project: JadeWordsProject; immersed: boolean }) {
  return <><EngineeringDetails project={project} /><VocabSongs feature={project.songs} immersed={immersed} /></>;
}
