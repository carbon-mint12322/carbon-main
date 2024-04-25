import CustomChip from '~/components/common/Chip';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { useOperator } from '~/contexts/OperatorContext';

const styles = {
  cropChip: {
    background: '#F1F1F1',
    color: 'textPrimary',
  },
  cropChipIcon: {
    color: 'iconColor.default',
  },
};

const RenderRecentEvent = (data, modelName) => {
  const { changeRoute } = useOperator();
  const recentEvent = data?.row?.recentEvent;
  if (!recentEvent) {
    return null;
  }
  const id = recentEvent?.id;
  return (
    <CustomChip
      params={[
        {
          name:
            recentEvent?.category == 'Submission'
              ? recentEvent?.name
              : recentEvent?.details?.name,
          id: data?.row?.id,
        },
      ]}
      handleChipClick={(e) => {
        e.stopPropagation();
        recentEvent?.category == 'Submission'
          ? changeRoute(`/submission/${id}`)
          : changeRoute(`/${modelName}/${data?.row?.id}/event/${id}`);
      }}
      Icon={StickyNote2OutlinedIcon}
      sx={styles.cropChip}
      iconSx={styles.cropChipIcon}
    />
  );
};

export default RenderRecentEvent;
