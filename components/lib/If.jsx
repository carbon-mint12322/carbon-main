export const If = (props) => {
  // Render the "ThenComponent" if either value property or if_fn() is
  // true. Otherwise render nothing
  if (!evalCondition(props)) {
    return null;
  }
  return <> {getchildren(props)} </>;
};

export const IfNot = (props) => {
  // Render the "ThenComponent" if either value property or if_fn() is
  // false. Otherwise render nothing
  if (evalCondition(props)) {
    return null;
  }
  return <> {getchildren(props)} </>;
};

export default If;

export const Unless = IfNot;

// Utility functions
const evalCondition = ({ if_fn, value }) =>
  typeof value !== 'undefined' ? value : typeof if_fn !== 'undefined' ? if_fn() : false;

// return ThenComponent or children
const getchildren = (props) => (props.ThenComponent ? [props.ThenComponent] : props.children || []);
