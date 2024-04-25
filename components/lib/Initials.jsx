function stringToColor(string) {
  // let hash = 0;
  // let i;

  // /* eslint-disable no-bitwise */
  // for (i = 0; i < string?.length; i += 1) {
  //   hash = string.charCodeAt(i) + ((hash << 5) - hash);
  // }

  let color = '#F79023';

  // for (i = 0; i < 3; i += 1) {
  //   const value = (hash >> (i * 8)) & 0xff;
  //   color += `00${value.toString(16)}`.slice(-2);
  // }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      fontSize: '12px',
      width: 30,
      height: 30,
      marginRight: '16px',
      fontWeight: 600,
    },
    children: name
      ? `${name.split(' ')[0][0] || ''}${
          name.split(' ')[1][0] && name.split(' ')[1][0] != '(' ? name.split(' ')[1][0] : '' || ''
        }`
      : '',
  };
}

export function avatarColor(id) {
  const index = id % 5;
  const color = ['#795548', '#3A7BFA', '#0E8140', '#F79023', '#007DBB'];
  return color[index] || '#795548';
}
