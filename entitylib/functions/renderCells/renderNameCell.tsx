import ListCellTitleSubTitle from '~/components/common/ListCellTitleSubTitle';
import cropImg from '../../../public/assets/images/crop.svg';

const styles = {
  listCellTitleSubTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    padding: '8px 0px',
  },
  listCellTitleSubTitleSTSx: { color: 'text.disabled', wordWrap: 'break-word' },
};

const renderNameCell = (title: any, subTitle: any) => {
  return (
    <ListCellTitleSubTitle
      title={title}
      subTitle={subTitle}
      image={cropImg}
      sx={styles.listCellTitleSubTitle}
      subTitleSx={styles.listCellTitleSubTitleSTSx}
    />
  );
};

export default renderNameCell;
