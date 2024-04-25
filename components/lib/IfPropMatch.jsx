import If from './If';

const IfMatch = ({ value, requiredValue, ...props }) => (
  <If value={value == requiredValue} {...props} />
);
export default IfMatch;
