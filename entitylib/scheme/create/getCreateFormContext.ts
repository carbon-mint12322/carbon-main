export default function getFormContext(props: any) {
  const cbFilter = {};

  return {
    getFilter: (key: any) => {
      switch (key) {
        case 'certificationbody':
          return cbFilter;
        default:
          break;
      }
      throw new Error(`Unknown filter key in ui:options ${key}`);
    },
  };
}
