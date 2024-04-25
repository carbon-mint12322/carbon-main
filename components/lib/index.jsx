import If_ from './If';
import IfThenElse_ from './IfThenElse';
import Loop_ from './Loop';
import LeftMenuItem_ from './LeftMenuItem';
import Link_ from './Link';
import ReactJsonSchemaForm_ from '@rjsf/mui';
import DataGrid_ from './DataGrid';

// A set of simple supporting components to help
// render conditionals and looped components
//
// See the test code in __tests__ folder for examples

export const LoopableExample = (props) => <div>{props.value} </div>;

export const If = If_;
export const IfThenElse = IfThenElse_;
export const Loop = Loop_;
export const LeftMenuItem = LeftMenuItem_;
export const Link = Link_;
export const ReactJsonSchemaForm = ReactJsonSchemaForm_;
export const DataGrid = DataGrid_;

export const IfPropMatch = (props) => {
  const { value, requiredValue, ThenComponent } = props;
  const if_fn = () => requiredValue === value;
  return <If if_fn={if_fn} ThenComponent={() => <ThenComponent {...props} />} />;
};

export const IfPropMatchElse = (props) => {
  const { value, requiredValue, ThenComponent, ElseComponent } = props;
  const if_fn = () => requiredValue === value;
  return (
    <IfThenElse_
      if_fn={if_fn}
      ThenComponent={() => <ThenComponent {...props} />}
      ElseComponent={() => <ElseComponent {...props} />}
    />
  );
};
